export type LoopContext = { tick: number };

export async function runLoop(opts: {
  tickMs: number;
  onTick: (ctx: LoopContext) => Promise<void>;
}): Promise<never> {
  let tick = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    tick += 1;
    try {
      await opts.onTick({ tick });
    } catch (e) {
      console.error(`[loop] tick ${tick} error:`, e);
    }
    await new Promise((r) => setTimeout(r, opts.tickMs));
  }
}
