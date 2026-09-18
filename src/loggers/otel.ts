import { createRequire } from "node:module";
import type { DecisionLogger } from "../logger.js";
import type { DecisionResult, Questions } from "../types.js";
import { decisionLogPayload } from "./serialize.js";

/** Minimal structural surface of `@opentelemetry/api` used by this sink. */
interface OtelSpan {
  setAttribute(key: string, value: string | number | boolean): void;
  end(): void;
}

interface OtelTracer {
  startActiveSpan(name: string, fn: (span: OtelSpan) => void): void;
}

interface OtelApiLike {
  trace: {
    getTracer(name: string, version?: string): OtelTracer;
  };
}

export interface OtelDecisionLoggerOptions {
  /** Tracer name. Default `jev-harness`. */
  tracerName?: string;
  /** Span name. Default `jev.decision`. */
  spanName?: string;
}

/**
 * Emits an OpenTelemetry span per decision.
 * Soft-loads `@opentelemetry/api` — if the optional peer is missing, logs are no-ops
 * (one console.warn on first use).
 */
export class OtelDecisionLogger implements DecisionLogger {
  private readonly tracerName: string;
  private readonly spanName: string;
  private api: OtelApiLike | null | undefined = undefined;
  private warned = false;

  constructor(options: OtelDecisionLoggerOptions = {}) {
    this.tracerName = options.tracerName ?? "jev-harness";
    this.spanName = options.spanName ?? "jev.decision";
  }

  logDecision<Q extends Questions>(result: DecisionResult<Q>): void {
    const api = this.loadApi();
    if (!api) return;

    const payload = decisionLogPayload(result);
    try {
      const tracer = api.trace.getTracer(this.tracerName);
      tracer.startActiveSpan(this.spanName, (span) => {
        if (payload.id != null) span.setAttribute("jev.decision.id", String(payload.id));
        span.setAttribute("jev.decision.mode", payload.mode);
        span.setAttribute("jev.decision.model", payload.model);
        span.setAttribute("jev.decision.confidence", payload.confidence);
        span.setAttribute("jev.decision.intended_action", String(payload.intendedAction));
        span.setAttribute("jev.decision.action", String(payload.action));
        span.setAttribute("jev.decision.reason", payload.reason);
        span.setAttribute("jev.decision.input_tokens", payload.usage.input_tokens);
        span.setAttribute("jev.decision.output_tokens", payload.usage.output_tokens);
        span.end();
      });
    } catch (err) {
      if (!this.warned) {
        this.warned = true;
        console.warn("[OtelDecisionLogger] emit failed:", err);
      }
    }
  }

  private loadApi(): OtelApiLike | null {
    if (this.api !== undefined) return this.api;
    try {
      const require = createRequire(import.meta.url);
      this.api = require("@opentelemetry/api") as OtelApiLike;
    } catch {
      this.api = null;
      if (!this.warned) {
        this.warned = true;
        console.warn(
          "[OtelDecisionLogger] @opentelemetry/api not installed; decision spans disabled",
        );
      }
    }
    return this.api;
  }
}
