import { loadConfig } from "./config.js";
import { FileMemory } from "./memory/FileMemory.js";
import { runLoop } from "./scheduler/loop.js";
import { ChillClawAgent } from "./agent/ChillClawAgent.js";
import { createTools } from "./agent/tools.js";

async function main() {
  const config = loadConfig();
  const memory = new FileMemory(config.memoryPath);
  const tools = createTools({ mode: config.mode });

  const agent = new ChillClawAgent({
    name: config.agentName,
    inboxPath: config.inboxPath,
    memory,
    tools,
  });

  console.log(`[${config.agentName}] starting — mode=${config.mode}, tick=${config.tickMs}ms`);

  await runLoop({
    tickMs: config.tickMs,
    onTick: async ({ tick }) => {
      const result = await agent.cycle({ tick, now: new Date() });
      if (result.actions.length) {
        console.log(`[${config.agentName}] actions:`, result.actions.map(a => a.type));
      }
    },
  });
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
