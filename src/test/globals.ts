// Global test configuration
import { vi } from 'vitest';

// Mock global objects that might be needed by components
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'mock-uuid-' + Math.random().toString(36).substr(2, 9)),
    getRandomValues: vi.fn((array: any) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }),
    subtle: {} as any
  },
  writable: true
});

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue('mock clipboard text')
    },
    userAgent: 'test'
  },
  writable: true
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn((key: string) => null),
    setItem: vi.fn((key: string, value: string) => {}),
    removeItem: vi.fn((key: string) => {}),
    clear: vi.fn(() => {}),
    length: 0,
    key: vi.fn((index: number) => null)
  },
  writable: true
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn((key: string) => null),
    setItem: vi.fn((key: string, value: string) => {}),
    removeItem: vi.fn((key: string) => {}),
    clear: vi.fn(() => {}),
    length: 0,
    key: vi.fn((index: number) => null)
  },
  writable: true
});

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = vi.fn();

// Mock performance.now
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now())
  },
  writable: true
});

export {};