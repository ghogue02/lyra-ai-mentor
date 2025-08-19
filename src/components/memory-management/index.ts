// Memory Management Components Export
export { AutoCleanupProvider, useAutoCleanup, withAutoCleanup } from './AutoCleanupProvider';
export { MemoryMonitoringDashboard } from './MemoryMonitoringDashboard';

// Re-export hooks for convenience
export * from '../hooks/memory-management';

// Component types
export type { AutoCleanupContextType } from './AutoCleanupProvider';