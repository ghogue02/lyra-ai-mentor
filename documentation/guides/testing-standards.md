# Testing Standards Guide

## Overview
This guide defines testing standards for the AI Learning Hub platform. All code must adhere to these standards before merging.

## Test Categories

### 1. Unit Tests
- Test individual functions and components in isolation
- Use Jest and React Testing Library
- Minimum 80% code coverage
- Location: `__tests__` folders adjacent to source files

### 2. Integration Tests
- Test component interactions and data flow
- Verify API integrations work correctly
- Test database operations
- Location: `/tests/integration/`

### 3. E2E Tests
- Test complete user workflows
- Verify chapter progression and completion
- Test AI interactions
- Use Playwright or Cypress

## TDD/BDD Workflow

### Test-Driven Development (TDD)
1. Write failing test first
2. Write minimal code to pass
3. Refactor while keeping tests green
4. Update documentation

### Behavior-Driven Development (BDD)
1. Define user stories with acceptance criteria
2. Write feature files (`.feature`)
3. Implement step definitions
4. Run scenarios

## Testing Checklist

Before committing code:
- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Test coverage >= 80%
- [ ] No console errors in tests
- [ ] Integration tests for API calls
- [ ] E2E tests for critical paths

## Test File Naming
- Unit tests: `ComponentName.test.tsx`
- Integration tests: `feature.integration.test.ts`
- E2E tests: `workflow.e2e.test.ts`
- BDD features: `feature.feature`

## Mock Data Standards
- Use factories for consistent test data
- Store in `/tests/fixtures/`
- Keep mocks close to reality
- Update when schema changes

## Performance Testing
- Components render < 100ms
- API responses < 500ms
- Page loads < 3s
- Test with throttled network

## AI Testing Guidelines
- Mock OpenAI responses for unit tests
- Use real API for integration tests (with limits)
- Test streaming responses
- Verify error handling
- Check token usage

## Continuous Integration
All PRs must:
1. Pass all automated tests
2. Maintain code coverage
3. Pass linting and type checks
4. Include test documentation
5. Update test fixtures if needed

## Common Testing Patterns

### Component Testing
```typescript
describe('ComponentName', () => {
  it('should render without errors', () => {
    render(<Component />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<Component />);
    await user.click(screen.getByRole('button'));
    expect(mockFunction).toHaveBeenCalled();
  });
});
```

### API Testing
```typescript
describe('API Endpoint', () => {
  it('should return expected data', async () => {
    const response = await api.get('/endpoint');
    expect(response.status).toBe(200);
    expect(response.data).toMatchSnapshot();
  });
});
```

## Update Protocol
This guide is part of the recursive update system. When testing standards change:
1. Update this file
2. Run compliance checker
3. Update all test files to match
4. Document changes in session log