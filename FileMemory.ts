import fs from "node:fs";
import crypto from "node:crypto";
import { DEFAULT_MEMORY, type MemoryState } from "./types.js";

export class FileMemory {
  constructor(private readonly path: string) {}

  load(): MemoryState {
    if (!fs.existsSync(this.path)) return { ...DEFAULT_MEMORY };
    const raw = fs.readFileSync(this.path, "utf8");
    const data = JSON.parse(raw) as MemoryState;
    return data;
  }

  save(next: MemoryState): void {
    next.updatedAt = new Date().toISOString();
    fs.writeFileSync(this.path, JSON.stringify(next, null, 2), "utf8");
  }

  hash(content: string): string {
    return crypto.createHash("sha256").update(content).digest("hex");
  }
}
