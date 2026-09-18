import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import type { DecisionLogger } from "../logger.js";
import type { DecisionResult, Questions } from "../types.js";
import { decisionLogPayload } from "./serialize.js";

export interface FileDecisionLoggerOptions {
  /** Path to a JSONL file (created on first write). */
  path: string;
}

/**
 * Appends one JSON line per decision to a local file.
 * Writes are fire-and-forget; errors are swallowed after a single console.warn.
 */
export class FileDecisionLogger implements DecisionLogger {
  private readonly path: string;
  private dirReady: Promise<void> | null = null;
  private warned = false;

  constructor(options: FileDecisionLoggerOptions | string) {
    this.path = typeof options === "string" ? options : options.path;
  }

  logDecision<Q extends Questions>(result: DecisionResult<Q>): void {
    const line = `${JSON.stringify(decisionLogPayload(result))}\n`;
    void this.append(line);
  }

  private async append(line: string): Promise<void> {
    try {
      if (!this.dirReady) {
        this.dirReady = mkdir(dirname(this.path), { recursive: true }).then(() => undefined);
      }
      await this.dirReady;
      await appendFile(this.path, line, "utf8");
    } catch (err) {
      if (!this.warned) {
        this.warned = true;
        console.warn("[FileDecisionLogger] write failed:", err);
      }
    }
  }
}
