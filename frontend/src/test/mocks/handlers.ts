import { http, HttpResponse } from 'msw'

// Define request handlers for your API endpoints
export const handlers = [
  // Auth endpoints
  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      is_premium: false,
      credits: 100,
    })
  }),

  // Decks endpoints
  http.get('/api/decks', () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'Test Deck',
        description: 'A test deck',
        is_public: false,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        user_id: 1,
        cards_count: 5,
      },
    ])
  }),

  http.get('/api/decks/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      id: Number(id),
      name: 'Test Deck',
      description: 'A test deck',
      is_public: false,
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
      user_id: 1,
      cards_count: 5,
    })
  }),

  // Cards endpoints
  http.get('/api/decks/:deckId/cards', ({ params }) => {
    const { deckId } = params
    return HttpResponse.json([
      {
        id: 1,
        front: 'What is React?',
        back: 'A JavaScript library for building user interfaces',
        deck_id: Number(deckId),
        card_type: 'basic',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      },
    ])
  }),

  // Quizzes endpoints
  http.get('/api/quizzes', () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'Test Quiz',
        description: 'A test quiz',
        is_public: false,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        user_id: 1,
      },
    ])
  }),

  // Study endpoints
  http.post('/api/study/session', () => {
    return HttpResponse.json({
      id: 1,
      deck_id: 1,
      cards_reviewed: 0,
      cards_remaining: 5,
      created_at: '2023-01-01T00:00:00.000Z',
    })
  }),

  // Default fallback for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`)
    return new HttpResponse(null, { status: 404 })
  }),
]