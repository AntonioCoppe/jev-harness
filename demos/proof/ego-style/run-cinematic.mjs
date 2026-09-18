#!/usr/bin/env node
/** Alias: row-filter ego-style clip (Claude 48.9s BEFORE + multi/out AFTER). */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const dir = dirname(fileURLToPath(import.meta.url));
const child = spawn(process.execPath, [join(dir, "run-cinematic-case.mjs"), "row"], {
  stdio: "inherit",
  env: process.env,
});
child.on("exit", (code) => process.exit(code ?? 1));
