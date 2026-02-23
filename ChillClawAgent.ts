import fs from "node:fs";
import type { FileMemory } from "../memory/FileMemory.js";
import type { MemoryState } from "../memory/types.js";
import type { Tools } from "./tools.js";

export type AgentAction =
  | { type: "note"; text: string }
  | { type: "post"; text: string }
  | { type: "noop"; reason: string };

export class ChillClawAgent {
  constructor(
    private readonly deps: {
      name: string;
      inboxPath: string;
      memory: FileMemory;
      tools: Tools;
    }
  ) {}

  async cycle(ctx: { tick: number; now: Date }): Promise<{ actions: AgentAction[]; memory: MemoryState }> {
    const mem = this.deps.memory.load();
    mem.counters.cycles = (mem.counters.cycles ?? 0) + 1;

    const inbox = this.readInbox();
    const inboxHash = this.deps.memory.hash(inbox);

    const newSignals = inboxHash !== mem.lastSeenInboxHash;
    const actions: AgentAction[] = [];

    if (newSignals) {
      mem.lastSeenInboxHash = inboxHash;
      const signals = this.parseSignals(inbox);
      mem.counters.signalsProcessed = (mem.counters.signalsProcessed ?? 0) + signals.length;

      // Decide: create 0–1 small actions per cycle to keep it “chill”.
      const next = this.decide(signals);
      actions.push(...next);
    } else {
      actions.push({ type: "noop", reason: "no new signals" });
    }

    // Act
    for (const action of actions) {
      if (action.type === "note") {
        mem.notes.push(action.text);
        await this.deps.tools.log(`${this.deps.name} noted: ${action.text}`);
      }
      if (action.type === "post") {
        const res = await this.deps.tools.post(action.text);
        await this.deps.tools.log(`${this.deps.name} posted`, { id: res.id });
      }
      if (action.type === "noop") {
        // quiet
      }
    }

    this.deps.memory.save(mem);
    return { actions, memory: mem };
  }

  private readInbox(): string {
    try {
      return fs.readFileSync(this.deps.inboxPath, "utf8");
    } catch {
      return "";
    }
  }

  private parseSignals(raw: string): string[] {
    return raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !s.startsWith("#"));
  }

  private decide(signals: string[]): AgentAction[] {
    if (signals.length === 0) return [{ type: "noop", reason: "empty inbox" }];

    const top = signals[0];

    // Very simple autonomy rules:
    // - If the line starts with "POST:", it becomes a post.
    // - Otherwise it becomes a memory note.
    if (top.toUpperCase().startsWith("POST:")) {
      const text = top.slice(5).trim();
      if (!text) return [{ type: "noop", reason: "POST signal had no text" }];
      return [{ type: "post", text }];
    }

    return [{ type: "note", text: top }];
  }
}
