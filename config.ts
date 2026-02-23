import dotenv from "dotenv";
import fs from "node:fs";

dotenv.config();

export type RunMode = "dry" | "live";

export type AppConfig = {
  agentName: string;
  mode: RunMode;
  tickMs: number;
  memoryPath: string;
  inboxPath: string;
};

function readEnv(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function readInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`Invalid ${name}: ${raw}`);
  return n;
}

export function loadConfig(): AppConfig {
  const agentName = readEnv("AGENT_NAME", "ChillClaw");
  const mode = (process.env.MODE ?? "dry") as RunMode;
  if (mode !== "dry" && mode !== "live") throw new Error(`MODE must be "dry" or "live"`);

  const tickMs = readInt("TICK_MS", 6000);
  const memoryPath = readEnv("MEMORY_PATH", ".memory/chillclaw.json");

  // A simple local inbox file to simulate “signals” without APIs.
  const inboxPath = readEnv("INBOX_PATH", "examples/inbox.txt");

  // Ensure memory folder exists.
  const dir = memoryPath.split("/").slice(0, -1).join("/") || ".";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return { agentName, mode, tickMs, memoryPath, inboxPath };
}
