export type ToolMode = "dry" | "live";

export type Tools = {
  log: (msg: string, meta?: Record<string, unknown>) => Promise<void>;
  post: (text: string) => Promise<{ id: string }>; // stub for X/Discord/etc.
};

export function createTools(opts: { mode: ToolMode }): Tools {
  const log: Tools["log"] = async (msg, meta) => {
    if (meta) console.log(`[tool:log] ${msg}`, meta);
    else console.log(`[tool:log] ${msg}`);
  };

  const post: Tools["post"] = async (text) => {
    // Default: no side effects.
    // If you switch to live mode, wire this to a real integration.
    if (opts.mode === "dry") {
      console.log(`[tool:post] (dry)`, text);
      return { id: `dry_${Date.now()}` };
    }

    // Live mode placeholder.
    // Intentionally throws so you don’t “accidentally” go live without wiring credentials.
    throw new Error("Live posting is not configured. Wire an integration in src/agent/tools.ts");
  };

  return { log, post };
}
