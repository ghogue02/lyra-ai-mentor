// Memory Management Hooks Export
export { useCleanup, useTimerCleanup, useEventListenerCleanup } from './useCleanup';
export { useMemoryManager, useWeakDataStructures } from './useMemoryManager';
export { useMemoryLeakDetector, useComponentLeakDetector } from './useMemoryLeakDetector';
export { useStateGarbageCollector, useInteractionStateCleanup } from './useStateGarbageCollector';

// Re-export types
export type { CleanupFunction } from './useCleanup';
export type { MemoryMetrics, MemoryManagerOptions } from './useMemoryManager';
export type { MemoryLeakReport, MemoryLeakDetectorOptions } from './useMemoryLeakDetector';
export type { StateEntry, GarbageCollectorOptions } from './useStateGarbageCollector';