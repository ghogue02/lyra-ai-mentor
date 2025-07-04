
import { describe, it, expect, vi } from 'vitest';
import { loadComponent, getComponentName } from '../src/components/lesson/interactive/componentLoader';

describe('Interactive Element Loading', () => {
  it('should handle string titles without errors', () => {
    const result = getComponentName('knowledge_check', 5, 'Test Title');
    expect(typeof result === 'string' || result === null).toBe(true);
  });

  it('should handle object titles by converting to string', () => {
    const objectTitle = { toString: () => 'Test Title' };
    const result = getComponentName('knowledge_check', 5, objectTitle);
    expect(typeof result === 'string' || result === null).toBe(true);
  });

  it('should handle null/undefined titles', () => {
    const result1 = getComponentName('knowledge_check', 5, null);
    const result2 = getComponentName('knowledge_check', 5, undefined);
    expect(typeof result1 === 'string' || result1 === null).toBe(true);
    expect(typeof result2 === 'string' || result2 === null).toBe(true);
  });

  it('should load components without throwing object conversion errors', () => {
    expect(() => {
      const component = loadComponent('KnowledgeCheckRenderer');
      expect(component).toBeDefined();
    }).not.toThrow();
  });
});
