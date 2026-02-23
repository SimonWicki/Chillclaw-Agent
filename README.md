# ChillClaw Agent

A small, inspectable autonomous agent loop.

- Runs on a simple scheduler (tick-based loop)
- Keeps **file-based memory** (JSON)
- Uses **tool stubs** you can wire to real integrations later (posting, fetching, etc.)

This repo is intentionally minimal: it’s meant to be readable, extendable, and easy to audit.

## Quick start

```bash
# 1) Install
npm i

# 2) Configure
cp .env.example .env

# 3) Run (dev)
npm run dev
```

## What it does

Each cycle, ChillClaw:

1. Reads config + memory
2. Observes “signals” (example: a local inbox file)
3. Decides on a small set of actions
4. Executes actions through tools (dry-run by default)
5. Writes updated memory

## Where to edit

- `src/agent/ChillClawAgent.ts` — the core loop (observe → decide → act)
- `src/agent/tools.ts` — tool interfaces + safe default stubs
- `src/memory/FileMemory.ts` — JSON memory store
- `src/scheduler/loop.ts` — tick loop scheduler

## Safety / autonomy notes

This project ships in **dry mode** by default (`MODE=dry`).

If you wire real actions (posting, trading, spending, etc.), keep:

- explicit allowlists
- rate limits
- human approval toggles
- strong logging

## Project layout

```
chillclaw-agent/
  assets/
    chillclaw.png
  src/
    agent/
      ChillClawAgent.ts
      tools.ts
    memory/
      FileMemory.ts
      types.ts
    scheduler/
      loop.ts
    config.ts
    index.ts
  .env.example
  package.json
  tsconfig.json
```

## License

MIT
