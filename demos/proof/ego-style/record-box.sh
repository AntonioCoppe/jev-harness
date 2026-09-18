#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
CASE="${1:-row}"
OUT_DIR="$ROOT/demos/proof/ego-style/out"
mkdir -p "$OUT_DIR"
DISPLAY_NUM="${DISPLAY:-:19}"
MP4="$OUT_DIR/proof-ego-style-${CASE}.mp4"
WRAP="$OUT_DIR/_run-${CASE}.sh"

case "$CASE" in
  row|shell|keystroke|alert|router) ;;
  *) echo "usage: record-box.sh <row|shell|keystroke|alert|router>"; exit 1 ;;
esac

cat > "$WRAP" <<EOS
#!/usr/bin/env bash
cd "$ROOT"
export BEFORE_COMPRESS_S="\${BEFORE_COMPRESS_S:-10}"
export JEV_PROOF_MODE="\${JEV_PROOF_MODE:-replay}"
if [[ -f .env ]]; then set -a; source .env; set +a; fi
node demos/proof/ego-style/run-cinematic-case.mjs "$CASE"
sleep 2
EOS
chmod +x "$WRAP"

command -v ffmpeg >/dev/null || { echo "ffmpeg missing"; exit 2; }
command -v xfce4-terminal >/dev/null || { echo "xfce4-terminal missing"; exit 3; }

# this box screen is 1280x800
W=1280; H=800
echo "recording $CASE → $MP4 on DISPLAY=$DISPLAY_NUM (${W}x${H})"

xfce4-terminal --display "$DISPLAY_NUM" --geometry=150x38+0+0 \
  --title="jev-harness proof $CASE" \
  -e "$WRAP" &
TERM_PID=$!
sleep 1.5

DUR=34
if [[ "$CASE" == "row" ]]; then DUR=38; fi

if ffmpeg -y -video_size ${W}x${H} -framerate 30 -f x11grab -i "${DISPLAY_NUM}.0+0,0" \
  -t "$DUR" -c:v libx264 -pix_fmt yuv420p -preset veryfast -crf 23 \
  "$MP4" 2>"$OUT_DIR/record-${CASE}.ffmpeg.log"; then
  ls -lah "$MP4"
  ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$MP4" || true
  echo "OK $MP4"
  STATUS=0
else
  echo "x11grab failed — see $OUT_DIR/record-${CASE}.ffmpeg.log"
  echo "Use Mac QuickTime steps in README.md"
  STATUS=4
fi

kill "$TERM_PID" 2>/dev/null || true
wait "$TERM_PID" 2>/dev/null || true
exit "$STATUS"
