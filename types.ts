export type MemoryState = {
  createdAt: string;
  updatedAt: string;
  notes: string[];
  counters: Record<string, number>;
  lastSeenInboxHash?: string;
};

export const DEFAULT_MEMORY: MemoryState = {
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  notes: [],
  counters: {
    cycles: 0,
    signalsProcessed: 0,
  },
};
