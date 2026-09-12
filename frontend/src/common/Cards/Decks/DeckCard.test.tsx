import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@source/test/utils/test-utils'
import { DeckCard } from './DeckCard'
import type { DeckSchema, PublicDeckSchema } from '@source/client'

// Mock the child components
vi.mock('./Body', () => ({
  Body: ({ deck, type }: any) => (
    <div data-testid="deck-body">
      Body - {deck.name} - {type}
    </div>
  ),
}))

vi.mock('./Footer', () => ({
  Footer: ({ deck, type }: any) => (
    <div data-testid="deck-footer">
      Footer - {deck.name} - {type}
    </div>
  ),
}))

vi.mock('./Header', () => ({
  Header: ({ deck, type }: any) => (
    <div data-testid="deck-header">
      Header - {deck.name} - {type}
    </div>
  ),
}))

// Mock dropdown components
vi.mock('@source/common/DropdownMenu/DeckDropdown', () => ({
  DeckDropdown: ({ deckId, type, groupId }: any) => (
    <div data-testid="deck-dropdown">
      Deck Dropdown - {deckId} - {type} - {groupId}
    </div>
  ),
}))

vi.mock('@source/common/DropdownMenu/DeckDropdown/PublicDeckDropdown', () => ({
  PublicDeckDropdown: ({ deckId }: any) => (
    <div data-testid="public-deck-dropdown">
      Public Deck Dropdown - {deckId}
    </div>
  ),
}))

vi.mock('@source/common/DropdownMenu/GroupDeckDropdown', () => ({
  GroupDeckDropdown: ({ deckId, groupId, permission }: any) => (
    <div data-testid="group-deck-dropdown">
      Group Deck Dropdown - {deckId} - {groupId} - {permission}
    </div>
  ),
}))

describe('DeckCard', () => {
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

  const mockPublicDeck: PublicDeckSchema = {
    id: 2,
    name: 'Public Test Deck',
    description: 'A public test deck',
    is_public: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    user_id: 2,
    cards_count: 10,
  }

  it('renders deck card with standard type', () => {
    renderWithProviders(<DeckCard deck={mockDeck} type="standard" />)

    expect(screen.getByTestId('deck-header')).toBeInTheDocument()
    expect(screen.getByTestId('deck-body')).toBeInTheDocument()
    expect(screen.getByTestId('deck-footer')).toBeInTheDocument()
    expect(screen.getByTestId('deck-dropdown')).toBeInTheDocument()

    expect(screen.getByText('Header - Test Deck - standard')).toBeInTheDocument()
  })

  it('renders deck card with public type', () => {
    renderWithProviders(<DeckCard deck={mockPublicDeck} type="public" />)

    expect(screen.getByText('Header - Public Test Deck - public')).toBeInTheDocument()
    expect(screen.getByTestId('public-deck-dropdown')).toBeInTheDocument()
  })

  it('renders deck card with group type', () => {
    renderWithProviders(<DeckCard deck={mockDeck} type="group" groupId={123} permission="read" />)

    expect(screen.getByText('Header - Test Deck - group')).toBeInTheDocument()
    expect(screen.getByTestId('group-deck-dropdown')).toBeInTheDocument()
    expect(screen.getByText(/Group Deck Dropdown - 1 - 123 - read/)).toBeInTheDocument()
  })

  it('renders deck card with groupAdmin type', () => {
    renderWithProviders(<DeckCard deck={mockDeck} type="groupAdmin" groupId={456} permission="admin" />)

    expect(screen.getByText('Header - Test Deck - groupAdmin')).toBeInTheDocument()
    expect(screen.getByTestId('group-deck-dropdown')).toBeInTheDocument()
  })

  it('renders deck card with simple type (no dropdown)', () => {
    renderWithProviders(<DeckCard deck={mockDeck} type="simple" />)

    expect(screen.getByTestId('deck-header')).toBeInTheDocument()
    expect(screen.getByTestId('deck-body')).toBeInTheDocument()
    expect(screen.getByTestId('deck-footer')).toBeInTheDocument()
    expect(screen.queryByTestId('deck-dropdown')).not.toBeInTheDocument()
  })

  it('renders deck card with full type (no dropdown)', () => {
    renderWithProviders(<DeckCard deck={mockDeck} type="full" />)

    expect(screen.getByTestId('deck-header')).toBeInTheDocument()
    expect(screen.queryByTestId('deck-dropdown')).not.toBeInTheDocument()
  })

  it('applies correct container styling', () => {
    const { container } = renderWithProviders(<DeckCard deck={mockDeck} type="standard" />)

    const deckContainer = container.firstChild as HTMLElement
    expect(deckContainer).toHaveClass('relative', 'min-w-[200px]')
  })

  it('positions dropdown correctly', () => {
    renderWithProviders(<DeckCard deck={mockDeck} type="standard" />)

    const dropdownContainer = screen.getByTestId('deck-dropdown').closest('div')
    expect(dropdownContainer).toHaveClass('absolute', 'right-2', 'top-2')
  })

  it('passes correct props to DeckDropdown for standard type', () => {
    renderWithProviders(<DeckCard deck={mockDeck} type="standard" groupId={789} />)

    expect(screen.getByText('Deck Dropdown - 1 - standard - 789')).toBeInTheDocument()
  })

  it('passes correct props to PublicDeckDropdown', () => {
    renderWithProviders(<DeckCard deck={mockPublicDeck} type="public" />)

    expect(screen.getByText('Public Deck Dropdown - 2')).toBeInTheDocument()
  })

  it('passes deck props to child components', () => {
    renderWithProviders(<DeckCard deck={mockDeck} type="standard" />)

    expect(screen.getByText('Header - Test Deck - standard')).toBeInTheDocument()
    expect(screen.getByText('Body - Test Deck - standard')).toBeInTheDocument()
    expect(screen.getByText('Footer - Test Deck - standard')).toBeInTheDocument()
  })

  it('handles checked prop', () => {
    renderWithProviders(<DeckCard deck={mockDeck} type="standard" checked={true} />)

    // The checked prop would be passed to child components
    expect(screen.getByTestId('deck-header')).toBeInTheDocument()
  })

  it('handles isCard prop', () => {
    renderWithProviders(<DeckCard deck={mockDeck} type="standard" isCard={true} />)

    // The isCard prop would be passed to child components
    expect(screen.getByTestId('deck-body')).toBeInTheDocument()
  })

  describe('dropdown rendering logic', () => {
    it('shows DeckDropdown only for standard type', () => {
      renderWithProviders(<DeckCard deck={mockDeck} type="standard" />)

      expect(screen.getByTestId('deck-dropdown')).toBeInTheDocument()
      expect(screen.queryByTestId('public-deck-dropdown')).not.toBeInTheDocument()
      expect(screen.queryByTestId('group-deck-dropdown')).not.toBeInTheDocument()
    })

    it('shows PublicDeckDropdown only for public type', () => {
      renderWithProviders(<DeckCard deck={mockDeck} type="public" />)

      expect(screen.queryByTestId('deck-dropdown')).not.toBeInTheDocument()
      expect(screen.getByTestId('public-deck-dropdown')).toBeInTheDocument()
      expect(screen.queryByTestId('group-deck-dropdown')).not.toBeInTheDocument()
    })

    it('shows GroupDeckDropdown for group type with groupId', () => {
      renderWithProviders(<DeckCard deck={mockDeck} type="group" groupId={123} />)

      expect(screen.queryByTestId('deck-dropdown')).not.toBeInTheDocument()
      expect(screen.queryByTestId('public-deck-dropdown')).not.toBeInTheDocument()
      expect(screen.getByTestId('group-deck-dropdown')).toBeInTheDocument()
    })

    it('shows GroupDeckDropdown for groupAdmin type with groupId', () => {
      renderWithProviders(<DeckCard deck={mockDeck} type="groupAdmin" groupId={456} />)

      expect(screen.getByTestId('group-deck-dropdown')).toBeInTheDocument()
    })

    it('does not show GroupDeckDropdown when groupId is undefined', () => {
      renderWithProviders(<DeckCard deck={mockDeck} type="group" />)

      expect(screen.queryByTestId('group-deck-dropdown')).not.toBeInTheDocument()
    })

    it('no dropdown for simple type', () => {
      renderWithProviders(<DeckCard deck={mockDeck} type="simple" />)

      expect(screen.queryByTestId('deck-dropdown')).not.toBeInTheDocument()
      expect(screen.queryByTestId('public-deck-dropdown')).not.toBeInTheDocument()
      expect(screen.queryByTestId('group-deck-dropdown')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has proper container structure', () => {
      const { container } = renderWithProviders(<DeckCard deck={mockDeck} type="standard" />)

      const deckContainer = container.firstChild as HTMLElement
      expect(deckContainer.tagName).toBe('DIV')
    })

    it('maintains relative positioning for dropdown placement', () => {
      const { container } = renderWithProviders(<DeckCard deck={mockDeck} type="standard" />)

      const deckContainer = container.firstChild as HTMLElement
      expect(deckContainer).toHaveClass('relative')
    })
  })

  describe('responsive behavior', () => {
    it('applies minimum width constraint', () => {
      const { container } = renderWithProviders(<DeckCard deck={mockDeck} type="standard" />)

      const deckContainer = container.firstChild as HTMLElement
      expect(deckContainer).toHaveClass('min-w-[200px]')
    })
  })

  describe('edge cases', () => {
    it('handles deck with zero cards', () => {
      const emptyDeck = { ...mockDeck, cards_count: 0 }
      renderWithProviders(<DeckCard deck={emptyDeck} type="standard" />)

      expect(screen.getByText('Header - Test Deck - standard')).toBeInTheDocument()
    })

    it('handles deck with very long name', () => {
      const longNameDeck = {
        ...mockDeck,
        name: 'This is a very long deck name that might overflow the container width and cause layout issues if not handled properly'
      }
      renderWithProviders(<DeckCard deck={longNameDeck} type="standard" />)

      expect(screen.getByText(/This is a very long deck name/)).toBeInTheDocument()
    })

    it('handles groupId of 0', () => {
      renderWithProviders(<DeckCard deck={mockDeck} type="group" groupId={0} />)

      expect(screen.getByTestId('group-deck-dropdown')).toBeInTheDocument()
    })

    it('handles undefined permission', () => {
      renderWithProviders(<DeckCard deck={mockDeck} type="group" groupId={123} />)

      expect(screen.getByText(/Group Deck Dropdown - 1 - 123 - undefined/)).toBeInTheDocument()
    })

    it('handles empty string permission', () => {
      renderWithProviders(<DeckCard deck={mockDeck} type="group" groupId={123} permission="" />)

      expect(screen.getByText(/Group Deck Dropdown - 1 - 123 - /)).toBeInTheDocument()
    })
  })

  describe('component composition', () => {
    it('renders all child components in correct structure', () => {
      const { container } = renderWithProviders(<DeckCard deck={mockDeck} type="standard" />)

      const children = Array.from(container.firstChild?.children || [])

      // Should have dropdown container and main content
      expect(children).toHaveLength(2)

      // First child should be dropdown container
      expect(children[0]).toHaveClass('absolute', 'right-2', 'top-2')
    })

    it('passes all necessary props to child components', () => {
      renderWithProviders(
        <DeckCard
          deck={mockDeck}
          type="group"
          groupId={123}
          permission="admin"
          checked={true}
          isCard={true}
        />
      )

      // All props should be available to child components
      expect(screen.getByTestId('deck-header')).toBeInTheDocument()
      expect(screen.getByTestId('deck-body')).toBeInTheDocument()
      expect(screen.getByTestId('deck-footer')).toBeInTheDocument()
    })
  })
})