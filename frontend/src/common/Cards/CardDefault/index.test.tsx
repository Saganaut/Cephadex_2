import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@source/test/utils/test-utils'
import { CardDefault } from './index'
import type { DeckSchema, QuizSchema, GroupSchema } from '@source/client'

// Mock the child components
vi.mock('./Body', () => ({
  Body: ({ data, style }: any) => (
    <div data-testid="card-body">
      Body - {data.name} - {style}
    </div>
  ),
}))

vi.mock('./Footer', () => ({
  Footer: ({ data, style }: any) => (
    <div data-testid="card-footer">
      Footer - {data.name} - {style}
    </div>
  ),
}))

vi.mock('./Header', () => ({
  Header: ({ data, style }: any) => (
    <div data-testid="card-header">
      Header - {data.name} - {style}
    </div>
  ),
}))

describe('CardDefault', () => {
  const mockDeck: DeckSchema = {
    id: 1,
    name: 'Test Deck',
    description: 'A test deck',
    is_public: false,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    user_id: 1,
    cards_count: 5,
  }

  const mockQuiz: QuizSchema = {
    id: 1,
    name: 'Test Quiz',
    description: 'A test quiz',
    is_public: false,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    user_id: 1,
  }

  const mockGroup: GroupSchema = {
    id: 1,
    name: 'Test Group',
    description: 'A test group',
    is_public: false,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    user_id: 1,
  }

  it('renders with deck data', () => {
    renderWithProviders(<CardDefault data={mockDeck} />)

    expect(screen.getByTestId('card-header')).toBeInTheDocument()
    expect(screen.getByTestId('card-body')).toBeInTheDocument()
    expect(screen.getByTestId('card-footer')).toBeInTheDocument()

    expect(screen.getByText('Header - Test Deck - undefined')).toBeInTheDocument()
    expect(screen.getByText('Body - Test Deck - undefined')).toBeInTheDocument()
    expect(screen.getByText('Footer - Test Deck - undefined')).toBeInTheDocument()
  })

  it('renders with quiz data', () => {
    renderWithProviders(<CardDefault data={mockQuiz} />)

    expect(screen.getByText('Header - Test Quiz - undefined')).toBeInTheDocument()
    expect(screen.getByText('Body - Test Quiz - undefined')).toBeInTheDocument()
    expect(screen.getByText('Footer - Test Quiz - undefined')).toBeInTheDocument()
  })

  it('renders with group data', () => {
    renderWithProviders(<CardDefault data={mockGroup} />)

    expect(screen.getByText('Header - Test Group - undefined')).toBeInTheDocument()
    expect(screen.getByText('Body - Test Group - undefined')).toBeInTheDocument()
    expect(screen.getByText('Footer - Test Group - undefined')).toBeInTheDocument()
  })

  it('applies default styling when no style prop provided', () => {
    const { container } = renderWithProviders(<CardDefault data={mockDeck} />)

    const cardContainer = container.firstChild as HTMLElement
    expect(cardContainer).toHaveClass(
      'dark:bg-mariana-blue',
      'bg-electric-violet-700',
      'dark:text-white',
      'text-tolopea'
    )
  })

  it('applies group styling when style is "group"', () => {
    const { container } = renderWithProviders(
      <CardDefault data={mockGroup} style="group" />
    )

    const cardContainer = container.firstChild as HTMLElement
    expect(cardContainer).toHaveClass(
      'bg-mariana-blue-100',
      'text-white',
      'hover:bg-mariana-blue'
    )
  })

  it('passes style prop to child components', () => {
    renderWithProviders(<CardDefault data={mockDeck} style="custom" />)

    expect(screen.getByText('Header - Test Deck - custom')).toBeInTheDocument()
    expect(screen.getByText('Body - Test Deck - custom')).toBeInTheDocument()
    expect(screen.getByText('Footer - Test Deck - custom')).toBeInTheDocument()
  })

  it('applies correct layout classes', () => {
    const { container } = renderWithProviders(<CardDefault data={mockDeck} />)

    const cardContainer = container.firstChild as HTMLElement
    expect(cardContainer).toHaveClass(
      'flex',
      'flex-col',
      'justify-between',
      'h-full',
      'cursor-pointer',
      'w-full',
      'rounded-3xl',
      'px-[28px]',
      'py-[20px]'
    )
  })

  it('has grow class on content area', () => {
    const { container } = renderWithProviders(<CardDefault data={mockDeck} />)

    const growDiv = container.querySelector('.grow')
    expect(growDiv).toBeInTheDocument()
    expect(growDiv).toContainElement(screen.getByTestId('card-header'))
    expect(growDiv).toContainElement(screen.getByTestId('card-body'))
  })

  it('places footer outside grow area', () => {
    const { container } = renderWithProviders(<CardDefault data={mockDeck} />)

    const growDiv = container.querySelector('.grow')
    const footer = screen.getByTestId('card-footer')

    expect(growDiv).not.toContainElement(footer)
  })

  it('applies hover styling for default style', () => {
    const { container } = renderWithProviders(<CardDefault data={mockDeck} />)

    const cardContainer = container.firstChild as HTMLElement
    expect(cardContainer).toHaveClass(
      'dark:hover:bg-electric-violet',
      'hover:bg-aquamarine-900'
    )
  })

  it('applies hover styling for group style', () => {
    const { container } = renderWithProviders(
      <CardDefault data={mockGroup} style="group" />
    )

    const cardContainer = container.firstChild as HTMLElement
    expect(cardContainer).toHaveClass('hover:bg-mariana-blue')
  })

  describe('accessibility', () => {
    it('has cursor pointer for interactive element', () => {
      const { container } = renderWithProviders(<CardDefault data={mockDeck} />)

      const cardContainer = container.firstChild as HTMLElement
      expect(cardContainer).toHaveClass('cursor-pointer')
    })

    it('maintains focus behavior through styling', () => {
      const { container } = renderWithProviders(<CardDefault data={mockDeck} />)

      const cardContainer = container.firstChild as HTMLElement
      expect(cardContainer.tagName).toBe('DIV')
    })
  })

  describe('responsive behavior', () => {
    it('applies consistent padding across screen sizes', () => {
      const { container } = renderWithProviders(<CardDefault data={mockDeck} />)

      const cardContainer = container.firstChild as HTMLElement
      expect(cardContainer).toHaveClass('px-[28px]', 'py-[20px]')
    })

    it('maintains full width and height', () => {
      const { container } = renderWithProviders(<CardDefault data={mockDeck} />)

      const cardContainer = container.firstChild as HTMLElement
      expect(cardContainer).toHaveClass('w-full', 'h-full')
    })
  })

  describe('theme variations', () => {
    it('applies correct dark mode classes for default style', () => {
      const { container } = renderWithProviders(<CardDefault data={mockDeck} />)

      const cardContainer = container.firstChild as HTMLElement
      expect(cardContainer).toHaveClass(
        'dark:bg-mariana-blue',
        'dark:text-white',
        'dark:hover:bg-electric-violet'
      )
    })

    it('applies correct light mode classes for default style', () => {
      const { container } = renderWithProviders(<CardDefault data={mockDeck} />)

      const cardContainer = container.firstChild as HTMLElement
      expect(cardContainer).toHaveClass(
        'bg-electric-violet-700',
        'text-tolopea',
        'hover:bg-aquamarine-900'
      )
    })

    it('applies consistent styling for group regardless of theme', () => {
      const { container } = renderWithProviders(
        <CardDefault data={mockGroup} style="group" />
      )

      const cardContainer = container.firstChild as HTMLElement
      expect(cardContainer).toHaveClass(
        'bg-mariana-blue-100',
        'text-white'
      )
    })
  })

  describe('component composition', () => {
    it('renders all required child components in correct order', () => {
      const { container } = renderWithProviders(<CardDefault data={mockDeck} />)

      const children = Array.from(container.firstChild?.children || [])

      // First child should be the grow div containing header and body
      expect(children[0]).toHaveClass('grow')

      // Second child should be the footer
      expect(children[1]).toContainElement(screen.getByTestId('card-footer'))
    })

    it('passes data prop to all child components', () => {
      renderWithProviders(<CardDefault data={mockDeck} />)

      expect(screen.getByText(/Test Deck/)).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles undefined style gracefully', () => {
      renderWithProviders(<CardDefault data={mockDeck} style={undefined} />)

      expect(screen.getByText('Header - Test Deck - undefined')).toBeInTheDocument()
    })

    it('handles empty string style', () => {
      renderWithProviders(<CardDefault data={mockDeck} style="" />)

      expect(screen.getByText('Header - Test Deck - ')).toBeInTheDocument()
    })

    it('handles different data types correctly', () => {
      const { rerender } = renderWithProviders(<CardDefault data={mockDeck} />)
      expect(screen.getByText(/Test Deck/)).toBeInTheDocument()

      rerender(<CardDefault data={mockQuiz} />)
      expect(screen.getByText(/Test Quiz/)).toBeInTheDocument()

      rerender(<CardDefault data={mockGroup} />)
      expect(screen.getByText(/Test Group/)).toBeInTheDocument()
    })
  })
})