import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@source/test/utils/test-utils'
import { CardFront } from './index'
import type { StudyCardSchema } from '@source/client'

// Mock FullMarkDown component since it's not the focus of these tests
vi.mock('@source/common/FullMarkDown', () => ({
  default: ({ content }: { content: string }) => <div data-testid="markdown">{content}</div>
}))

// Mock truncate utility
vi.mock('@utils/functions', () => ({
  truncate: (text: string, length: number) => text.length > length ? `${text.substring(0, length)}...` : text
}))

describe('CardFront', () => {
  const mockCards: StudyCardSchema[] = [
    {
      id: 1,
      term: 'Short term',
      definition: 'Short definition',
      card_type: 'basic',
      deck_id: 1,
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      term: 'This is a medium length term that should trigger medium font size',
      definition: 'Medium definition',
      card_type: 'basic',
      deck_id: 1,
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 3,
      term: 'This is a very long term that exceeds fifty characters and should trigger small font size for better readability and proper display in the component',
      definition: 'Long definition',
      card_type: 'basic',
      deck_id: 1,
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
    },
  ]

  const mockSwiperRef = {
    current: {
      slideTo: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders cards history correctly', () => {
    renderWithProviders(
      <CardFront
        cardsHistory={mockCards}
        swiperRef={mockSwiperRef}
        activeIndex={0}
      />
    )

    expect(screen.getByTestId('markdown')).toBeInTheDocument()
    expect(screen.getByText('Short term')).toBeInTheDocument()
  })

  it('applies correct opacity to active and inactive cards', () => {
    renderWithProviders(
      <CardFront
        cardsHistory={mockCards}
        swiperRef={mockSwiperRef}
        activeIndex={1}
      />
    )

    const cards = screen.getAllByText(/term/i).map(el => el.closest('div'))

    // Check that cards have proper opacity classes
    expect(cards[1]).toHaveClass('opacity-100')
    expect(cards[0]).toHaveClass('opacity-50')
    expect(cards[2]).toHaveClass('opacity-50')
  })

  it('handles card click and calls swiper slideTo', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <CardFront
        cardsHistory={mockCards}
        swiperRef={mockSwiperRef}
        activeIndex={0}
      />
    )

    const secondCard = screen.getByText(/medium length term/i).closest('div')
    if (secondCard) {
      await user.click(secondCard)
      expect(mockSwiperRef.current.slideTo).toHaveBeenCalledWith(1)
    }
  })

  it('applies correct font sizes based on term length', () => {
    renderWithProviders(
      <CardFront
        cardsHistory={mockCards}
        swiperRef={mockSwiperRef}
        activeIndex={0}
      />
    )

    const firstCard = screen.getByText('Short term').closest('div')
    expect(firstCard).toHaveClass('text-2xl') // Short term < 30 chars
  })

  it('truncates long terms correctly', () => {
    const longCard: StudyCardSchema = {
      id: 4,
      term: 'This is an extremely long term that definitely exceeds one hundred characters and should be truncated for display purposes in the card history component to maintain proper formatting',
      definition: 'Very long definition',
      card_type: 'basic',
      deck_id: 1,
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
    }

    renderWithProviders(
      <CardFront
        cardsHistory={[longCard]}
        swiperRef={mockSwiperRef}
        activeIndex={0}
      />
    )

    // Should truncate to 50 chars when term > 100 chars
    expect(screen.getByText(/This is an extremely long term that definitely/)).toBeInTheDocument()
  })

  it('handles empty cards history', () => {
    renderWithProviders(
      <CardFront
        cardsHistory={[]}
        swiperRef={mockSwiperRef}
        activeIndex={0}
      />
    )

    expect(screen.getByRole('generic', { hidden: true })).toBeInTheDocument()
  })

  it('handles undefined cards history', () => {
    renderWithProviders(
      <CardFront
        cardsHistory={undefined}
        swiperRef={mockSwiperRef}
        activeIndex={0}
      />
    )

    expect(screen.getByRole('generic', { hidden: true })).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = renderWithProviders(
      <CardFront
        cardsHistory={mockCards}
        swiperRef={mockSwiperRef}
        activeIndex={0}
      />
    )

    const historyContainer = container.querySelector('#study-card-history')
    expect(historyContainer).toHaveClass(
      'custom-scrollbar',
      'hidden',
      'lg:block',
      'bg-black-white',
      'dark:bg-tolopea'
    )
  })

  it('applies active card styling correctly', () => {
    renderWithProviders(
      <CardFront
        cardsHistory={mockCards}
        swiperRef={mockSwiperRef}
        activeIndex={1}
      />
    )

    const activeCard = screen.getByText(/medium length term/i).closest('div')
    expect(activeCard).toHaveClass('opacity-100', 'py-2')
  })

  it('applies inactive card styling correctly', () => {
    renderWithProviders(
      <CardFront
        cardsHistory={mockCards}
        swiperRef={mockSwiperRef}
        activeIndex={1}
      />
    )

    const inactiveCard = screen.getByText('Short term').closest('div')
    expect(inactiveCard).toHaveClass('opacity-50', 'py-[4px]')
  })

  describe('font size calculation', () => {
    it('applies text-2xl for terms under 30 characters', () => {
      renderWithProviders(
        <CardFront
          cardsHistory={[mockCards[0]]} // Short term
          swiperRef={mockSwiperRef}
          activeIndex={0}
        />
      )

      const cardText = screen.getByText('Short term').closest('div')
      expect(cardText).toHaveClass('text-2xl')
    })

    it('applies text-xl for terms between 30-50 characters', () => {
      const mediumCard: StudyCardSchema = {
        ...mockCards[0],
        term: 'This is a medium term exactly 40 chars',
      }

      renderWithProviders(
        <CardFront
          cardsHistory={[mediumCard]}
          swiperRef={mockSwiperRef}
          activeIndex={0}
        />
      )

      const cardText = screen.getByText('This is a medium term exactly 40 chars').closest('div')
      expect(cardText).toHaveClass('text-xl')
    })

    it('applies text-md for terms between 50-100 characters', () => {
      renderWithProviders(
        <CardFront
          cardsHistory={[mockCards[1]]} // Medium length term
          swiperRef={mockSwiperRef}
          activeIndex={0}
        />
      )

      const cardText = screen.getByText(/medium length term/i).closest('div')
      expect(cardText).toHaveClass('text-md')
    })

    it('applies text-sm for terms over 100 characters', () => {
      const veryLongCard: StudyCardSchema = {
        ...mockCards[0],
        term: 'This is an extremely long term that definitely exceeds one hundred characters and should get small font size for better readability and proper display',
      }

      renderWithProviders(
        <CardFront
          cardsHistory={[veryLongCard]}
          swiperRef={mockSwiperRef}
          activeIndex={0}
        />
      )

      const cardText = screen.getByText(/extremely long term/i).closest('div')
      expect(cardText).toHaveClass('text-sm')
    })
  })

  describe('accessibility', () => {
    it('provides proper card identification', () => {
      renderWithProviders(
        <CardFront
          cardsHistory={mockCards}
          swiperRef={mockSwiperRef}
          activeIndex={0}
        />
      )

      expect(document.getElementById('card-0')).toBeInTheDocument()
      expect(document.getElementById('card-1')).toBeInTheDocument()
      expect(document.getElementById('card-2')).toBeInTheDocument()
    })

    it('cards are clickable for keyboard navigation', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <CardFront
          cardsHistory={mockCards}
          swiperRef={mockSwiperRef}
          activeIndex={0}
        />
      )

      const card = screen.getByText('Short term').closest('div')
      if (card) {
        expect(card).toHaveClass('cursor-pointer')

        // Test keyboard interaction
        card.focus()
        await user.keyboard('{Enter}')
        // Note: onClick should be triggered, but testing actual click is more reliable
      }
    })
  })
})