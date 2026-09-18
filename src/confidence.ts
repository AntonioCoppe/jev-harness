import type { Questions } from "@typesafe-ai/sdk";
import {
  isChoiceAnswer,
  isNoulAnswer,
  isScoreAnswer,
  type AnswersOf,
  type AnyAnswer,
} from "./types.js";

/** Confidence for a single answer. Noul uses distance from 0.5 as a stand-in. */
export function answerConfidence(answer: AnyAnswer): number {
  if (isChoiceAnswer(answer) || isScoreAnswer(answer)) {
    return clamp01(answer.confidence);
  }
  if (isNoulAnswer(answer)) {
    return clamp01(Math.abs(answer.noul - 0.5) * 2);
  }
  return 0;
}

/** Mean confidence across all answers. */
export function aggregateConfidence<Q extends Questions>(answers: AnswersOf<Q>): number {
  const values = Object.values(answers as Record<string, AnyAnswer>).map(answerConfidence);
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}
