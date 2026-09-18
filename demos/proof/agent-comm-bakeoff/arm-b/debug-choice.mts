import { choice, noul, score, TypeSafeClient } from "@typesafe-ai/sdk";

const options: Record<string, string> = {
  none: "No agent should speak; wait or idle",
  user: "Human turn required before any agent continues",
  researcher: "Hand control to agent researcher",
  critic: "Hand control to agent critic",
  synthesizer: "Hand control to agent synthesizer",
};
const questions = {
  next_speaker: choice("Who should speak or act next?", options),
  progress: score("How is the group progressing toward the goal?", [
    "Stuck / thrashing",
    "Slow",
    "On track",
    "Near done",
  ]),
  needs_handoff: noul("Should control leave the current speaker?"),
};
console.log("choice shape", JSON.stringify(questions.next_speaker, null, 2).slice(0, 1200));
const client = new TypeSafeClient({
  apiKey: process.env.TYPESAFE_API_KEY,
  defaultModel: "jev-latest",
});
const t0 = performance.now();
const raw = await client.systemOne({
  state: {
    goal: "Design Polymarket BTC 15m arb pipeline: roles, gates, kill criteria. Keep concrete.",
    agents: [
      { id: "researcher", role: "facts / microstructure" },
      { id: "critic", role: "risk / false-arb attack" },
      { id: "synthesizer", role: "merge roles/gates/kills" },
    ],
    transcript_tail: [
      "coordinator: Round 1. Task just started. Prefer researcher first to ground facts.",
    ],
    open_questions: [
      "What are the three agent roles?",
      "What decision gates precede a small arb?",
      "What are kill criteria?",
    ],
    round: 1,
    who_spoke_last: null,
  },
  questions,
});
console.log("wall_ms", Math.round(performance.now() - t0));
console.log(JSON.stringify(raw.answers, null, 2));
