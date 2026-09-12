# Testing Guide for Cephadex Frontend

This guide provides comprehensive documentation for testing patterns and best practices in the Cephadex React frontend.

## Table of Contents

1. [Setup and Configuration](#setup-and-configuration)
2. [Testing Philosophy](#testing-philosophy)
3. [Testing Patterns](#testing-patterns)
4. [Component Testing](#component-testing)
5. [Redux Testing](#redux-testing)
6. [API Mocking](#api-mocking)
7. [Test Organization](#test-organization)
8. [Best Practices](#best-practices)
9. [Common Patterns](#common-patterns)
10. [Troubleshooting](#troubleshooting)

## Setup and Configuration

### Tech Stack
- **Vitest**: Fast test runner with native Vite integration
- **React Testing Library**: Component testing with user-centric approach
- **MSW (Mock Service Worker)**: API mocking for realistic testing
- **@testing-library/user-event**: Realistic user interaction simulation

### Running Tests

```bash
# Run tests in watch mode (development)
npm run test

# Run tests once (CI)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Testing Philosophy

Our testing approach follows these principles:

1. **User-Centric Testing**: Test behavior users actually experience
2. **Testing Trophy**: Focus on integration tests, with unit tests for complex logic
3. **Confidence Over Coverage**: Quality tests that catch real bugs
4. **Maintainable Tests**: Tests that are easy to read and update

## Testing Patterns

### File Naming Convention
- Component tests: `ComponentName.test.tsx`
- Hook tests: `useHookName.test.ts`
- Utility tests: `utilityName.test.ts`
- Redux tests: `sliceName.test.ts`

### Test Structure
Follow the **Arrange-Act-Assert** pattern:

```typescript
describe('ComponentName', () => {
  it('should perform expected behavior', () => {
    // Arrange: Set up test data and conditions
    const mockProps = { label: 'Click me' }

    // Act: Perform the action being tested
    renderWithProviders(<Component {...mockProps} />)

    // Assert: Verify the expected outcome
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

## Component Testing

### Basic Component Test

```typescript
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@source/test/utils/test-utils'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders with correct props', () => {
    renderWithProviders(<MyComponent title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('handles user interactions', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    renderWithProviders(<MyComponent onClick={handleClick} />)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Testing with Redux State

```typescript
import { createMockUser } from '@source/test/utils/test-utils'

it('displays user information', () => {
  const mockUser = createMockUser({ name: 'John Doe' })
  const preloadedState = {
    user: { user: mockUser, status: 'succeeded', error: '' }
  }

  renderWithProviders(<UserProfile />, { preloadedState })
  expect(screen.getByText('John Doe')).toBeInTheDocument()
})
```

### Testing Form Components

```typescript
it('validates form input', async () => {
  const user = userEvent.setup()
  renderWithProviders(<LoginForm />)

  const emailInput = screen.getByLabelText(/email/i)
  const submitButton = screen.getByRole('button', { name: /submit/i })

  await user.type(emailInput, 'invalid-email')
  await user.click(submitButton)

  expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
})
```

## Redux Testing

### Testing Reducers

```typescript
import { describe, it, expect } from 'vitest'
import reducer, { actions } from './slice'

describe('userSlice', () => {
  const initialState = {
    user: null,
    status: 'idle',
    error: ''
  }

  it('should handle setUser action', () => {
    const user = { id: 1, name: 'John' }
    const action = actions.setUser(user)
    const result = reducer(initialState, action)

    expect(result.user).toEqual(user)
  })

  it('should handle async action states', () => {
    const action = { type: 'user/fetchUser/pending' }
    const result = reducer(initialState, action)

    expect(result.status).toBe('loading')
  })
})
```

### Testing with Mock Store

```typescript
import { setupStore } from '@source/test/utils/test-utils'

it('dispatches actions correctly', () => {
  const store = setupStore()
  store.dispatch(fetchUser(1))

  const state = store.getState()
  expect(state.user.status).toBe('loading')
})
```

## API Mocking

### Using MSW for API Mocking

MSW handlers are defined in `src/test/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'John Doe',
      email: 'john@example.com'
    })
  }),

  http.post('/api/users', async ({ request }) => {
    const userData = await request.json()
    return HttpResponse.json({ ...userData, id: 123 })
  })
]
```

### Overriding Handlers in Tests

```typescript
import { server } from '@source/test/mocks/server'
import { http, HttpResponse } from 'msw'

it('handles API errors', async () => {
  server.use(
    http.get('/api/users/1', () => {
      return new HttpResponse(null, { status: 500 })
    })
  )

  renderWithProviders(<UserProfile userId={1} />)
  expect(await screen.findByText(/error/i)).toBeInTheDocument()
})
```

## Test Organization

### Directory Structure
```
src/
├── test/
│   ├── setup.ts                 # Global test setup
│   ├── utils/
│   │   └── test-utils.tsx       # Custom render functions
│   └── mocks/
│       ├── handlers.ts          # MSW request handlers
│       └── server.ts            # MSW server setup
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx      # Component tests
└── lib/
    └── store/
        ├── user/
        │   ├── userSlice.ts
        │   └── userSlice.test.ts # Redux tests
```

### Test Categories

1. **Unit Tests**: Individual functions and components
2. **Integration Tests**: Component interactions with Redux/API
3. **User Journey Tests**: Complete user workflows

## Best Practices

### DO ✅

- **Test behavior, not implementation**: Focus on what users see and do
- **Use semantic queries**: `getByRole`, `getByLabelText`, `getByText`
- **Test accessibility**: Ensure components are accessible
- **Mock external dependencies**: Use MSW for API calls
- **Use descriptive test names**: Clearly describe what's being tested
- **Group related tests**: Use `describe` blocks for organization

### DON'T ❌

- **Test implementation details**: Avoid testing internal state or methods
- **Use snapshot tests for everything**: They're brittle and hard to maintain
- **Mock React Testing Library**: It should work as intended
- **Test third-party libraries**: Trust they work correctly
- **Write overly complex tests**: Keep tests simple and focused

### Example Best Practices

```typescript
// ✅ Good: Tests user behavior
it('shows error when required field is empty', async () => {
  const user = userEvent.setup()
  renderWithProviders(<CreateDeckForm />)

  await user.click(screen.getByRole('button', { name: /create/i }))
  expect(screen.getByText(/name is required/i)).toBeInTheDocument()
})

// ❌ Bad: Tests implementation details
it('calls setState when button is clicked', () => {
  const spy = vi.spyOn(React, 'useState')
  // This test is brittle and doesn't test user experience
})
```

## Common Patterns

### Testing Educational Components

```typescript
// Testing study session component
it('advances to next card when answer is correct', async () => {
  const user = userEvent.setup()
  const mockCards = [
    createMockCard({ front: 'Question 1', back: 'Answer 1' }),
    createMockCard({ front: 'Question 2', back: 'Answer 2' })
  ]

  renderWithProviders(<StudySession cards={mockCards} />)

  // Answer the question
  await user.type(screen.getByRole('textbox'), 'Answer 1')
  await user.click(screen.getByRole('button', { name: /submit/i }))

  // Should advance to next card
  expect(screen.getByText('Question 2')).toBeInTheDocument()
})
```

### Testing Form Validation

```typescript
it('validates deck creation form', async () => {
  const user = userEvent.setup()
  renderWithProviders(<CreateDeckForm />)

  const nameInput = screen.getByLabelText(/deck name/i)
  const submitButton = screen.getByRole('button', { name: /create/i })

  // Test empty name
  await user.click(submitButton)
  expect(screen.getByText(/name is required/i)).toBeInTheDocument()

  // Test name too short
  await user.type(nameInput, 'ab')
  await user.click(submitButton)
  expect(screen.getByText(/name must be at least 3 characters/i)).toBeInTheDocument()
})
```

### Testing Async Operations

```typescript
it('loads deck data on mount', async () => {
  renderWithProviders(<DeckView deckId={1} />)

  // Should show loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument()

  // Should show deck data when loaded
  expect(await screen.findByText('Test Deck')).toBeInTheDocument()
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
})
```

## Troubleshooting

### Common Issues

1. **Path Alias Issues**: Ensure Vitest config matches your tsconfig paths
2. **MSW Not Working**: Check if handlers are properly set up in setup.ts
3. **Redux State Issues**: Use `renderWithProviders` instead of plain `render`
4. **Async Test Failures**: Use `findBy*` queries for async operations

### Debugging Tests

```typescript
// Add screen.debug() to see current DOM
it('debugs component state', () => {
  renderWithProviders(<MyComponent />)
  screen.debug() // Prints current DOM to console
})

// Use logRoles to see available roles
import { logRoles } from '@testing-library/react'

it('shows available roles', () => {
  const { container } = renderWithProviders(<MyComponent />)
  logRoles(container)
})
```

### Performance Tips

1. **Use `describe.skip()` or `it.skip()`** to temporarily disable tests
2. **Group slow tests** in separate files
3. **Use `beforeEach` cleanup** sparingly
4. **Mock heavy operations** like file uploads

## Continuous Integration

Tests run automatically in CI with:
- `npm run test:run` for one-time execution
- `npm run test:coverage` for coverage reports
- Coverage thresholds can be configured in `vitest.config.ts`

---

For more information, refer to:
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)