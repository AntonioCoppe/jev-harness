import type { DecisionLogger } from "../logger.js";
import type { DecisionResult, Questions } from "../types.js";
import { decisionLogPayload } from "./serialize.js";

export interface PostHogDecisionLoggerOptions {
  /** Defaults to `process.env.POSTHOG_API_KEY`. If unset, logger is a no-op. */
  apiKey?: string;
  /** Defaults to `process.env.POSTHOG_HOST` or `https://us.i.posthog.com`. */
  host?: string;
  /** Event name. Default `jev_decision`. */
  event?: string;
  /** Fallback distinct_id when result.id is missing. Default `anonymous`. */
  distinctId?: string;
}

/**
 * Sends each decision as a PostHog capture event via HTTP (no `posthog-node` dependency).
 * Soft: missing `POSTHOG_API_KEY` → silent no-op.
 */
export class PostHogDecisionLogger implements DecisionLogger {
  private readonly apiKey: string;
  private readonly host: string;
  private readonly event: string;
  private readonly distinctId: string;
  private warned = false;

  constructor(options: PostHogDecisionLoggerOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.POSTHOG_API_KEY ?? "";
    this.host = (options.host ?? process.env.POSTHOG_HOST ?? "https://us.i.posthog.com").replace(
      /\/$/,
      "",
    );
    this.event = options.event ?? "jev_decision";
    this.distinctId = options.distinctId ?? "anonymous";
  }

  logDecision<Q extends Questions>(result: DecisionResult<Q>): void {
    if (!this.apiKey) return;

    const payload = decisionLogPayload(result);
    const body = {
      api_key: this.apiKey,
      event: this.event,
      distinct_id: payload.id != null ? String(payload.id) : this.distinctId,
      properties: {
        ...payload,
        $lib: "jev-harness",
      },
    };

    void fetch(`${this.host}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch((err) => {
      if (!this.warned) {
        this.warned = true;
        console.warn("[PostHogDecisionLogger] capture failed:", err);
      }
    });
  }
}
