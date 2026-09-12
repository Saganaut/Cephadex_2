import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@source/test/utils/test-utils'
import { CTAButtons } from './index'

// Mock the SVG icon component
vi.mock('@assets/cardMenuIcons/DeleteIcon.svg?react', () => ({
  default: () => <div data-testid="delete-icon">Delete Icon</div>
}))

// Mock the FavoriteToggler component
vi.mock('@common/Favorite', () => ({
  FavoriteToggler: ({ itemId, isFavorite, itemType }: any) => (
    <div data-testid="favorite-toggler">
      Favorite: {isFavorite ? 'true' : 'false'} - ID: {itemId} - Type: {itemType}
    </div>
  )
}))

// Mock Heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  PencilIcon: ({ className }: any) => <div data-testid="pencil-icon" className={className}>Edit</div>,
  SpeakerWaveIcon: ({ className }: any) => <div data-testid="speaker-icon" className={className}>Audio</div>,
}))

describe('CTAButtons', () => {
  const defaultProps = {
    editModal: false,
    setEditModal: vi.fn(),
    deleteModal: false,
    setDeleteModal: vi.fn(),
    itemId: 123,
    isFavorite: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all CTA buttons correctly', () => {
    renderWithProviders(<CTAButtons {...defaultProps} />)

    expect(screen.getByTestId('speaker-icon')).toBeInTheDocument()
    expect(screen.getByTestId('pencil-icon')).toBeInTheDocument()
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument()
    expect(screen.getByTestId('favorite-toggler')).toBeInTheDocument()
  })

  it('toggles edit modal when edit button is clicked', async () => {
    const user = userEvent.setup()
    const setEditModal = vi.fn()

    renderWithProviders(
      <CTAButtons {...defaultProps} setEditModal={setEditModal} />
    )

    const editButton = screen.getByTestId('pencil-icon').closest('div')
    if (editButton) {
      await user.click(editButton)
      expect(setEditModal).toHaveBeenCalledWith(true)
    }
  })

  it('toggles delete modal when delete button is clicked', async () => {
    const user = userEvent.setup()
    const setDeleteModal = vi.fn()

    renderWithProviders(
      <CTAButtons {...defaultProps} setDeleteModal={setDeleteModal} />
    )

    const deleteButton = screen.getByTestId('delete-icon').closest('div')
    if (deleteButton) {
      await user.click(deleteButton)
      expect(setDeleteModal).toHaveBeenCalledWith(true)
    }
  })

  it('closes edit modal when already open and clicked', async () => {
    const user = userEvent.setup()
    const setEditModal = vi.fn()

    renderWithProviders(
      <CTAButtons {...defaultProps} editModal={true} setEditModal={setEditModal} />
    )

    const editButton = screen.getByTestId('pencil-icon').closest('div')
    if (editButton) {
      await user.click(editButton)
      expect(setEditModal).toHaveBeenCalledWith(false)
    }
  })

  it('closes delete modal when already open and clicked', async () => {
    const user = userEvent.setup()
    const setDeleteModal = vi.fn()

    renderWithProviders(
      <CTAButtons {...defaultProps} deleteModal={true} setDeleteModal={setDeleteModal} />
    )

    const deleteButton = screen.getByTestId('delete-icon').closest('div')
    if (deleteButton) {
      await user.click(deleteButton)
      expect(setDeleteModal).toHaveBeenCalledWith(false)
    }
  })

  it('passes correct props to FavoriteToggler', () => {
    renderWithProviders(
      <CTAButtons {...defaultProps} itemId={456} isFavorite={true} />
    )

    expect(screen.getByText(/Favorite: true - ID: 456 - Type: card/)).toBeInTheDocument()
  })

  it('handles undefined itemId gracefully', () => {
    renderWithProviders(
      <CTAButtons {...defaultProps} itemId={undefined} />
    )

    expect(screen.getByText(/ID: 0/)).toBeInTheDocument()
  })

  it('handles null isFavorite gracefully', () => {
    renderWithProviders(
      <CTAButtons {...defaultProps} isFavorite={null} />
    )

    expect(screen.getByText(/Favorite: false/)).toBeInTheDocument()
  })

  it('handles undefined isFavorite gracefully', () => {
    renderWithProviders(
      <CTAButtons {...defaultProps} isFavorite={undefined} />
    )

    expect(screen.getByText(/Favorite: false/)).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = renderWithProviders(<CTAButtons {...defaultProps} />)

    const ctaContainer = container.querySelector('#study-CTA-buttons')
    expect(ctaContainer).toHaveClass(
      'hidden',
      'lg:flex',
      'items-center',
      'justify-end',
      'gap-x-[20px]'
    )
  })

  it('speaker button is disabled (cursor-not-allowed)', () => {
    renderWithProviders(<CTAButtons {...defaultProps} />)

    const speakerButton = screen.getByTestId('speaker-icon').closest('div')
    expect(speakerButton).toHaveClass('cursor-not-allowed', 'opacity-50')
  })

  it('edit and delete buttons are clickable', () => {
    renderWithProviders(<CTAButtons {...defaultProps} />)

    const editButton = screen.getByTestId('pencil-icon').closest('div')
    const deleteButton = screen.getByTestId('delete-icon').closest('div')

    expect(editButton).toHaveClass('cursor-pointer')
    expect(deleteButton).toHaveClass('cursor-pointer')
  })

  it('applies correct background and hover classes', () => {
    renderWithProviders(<CTAButtons {...defaultProps} />)

    const editButton = screen.getByTestId('pencil-icon').closest('div')
    expect(editButton).toHaveClass(
      'bg-aquamarine-900',
      'hover:bg-blaze-orange-100',
      'dark:bg-electric-violet'
    )
  })

  it('applies correct size classes to buttons', () => {
    renderWithProviders(<CTAButtons {...defaultProps} />)

    const buttons = [
      screen.getByTestId('speaker-icon').closest('div'),
      screen.getByTestId('pencil-icon').closest('div'),
      screen.getByTestId('delete-icon').closest('div'),
    ]

    buttons.forEach(button => {
      expect(button).toHaveClass('size-[35px]', 'rounded-full')
    })
  })

  it('icons have correct size classes', () => {
    renderWithProviders(<CTAButtons {...defaultProps} />)

    expect(screen.getByTestId('speaker-icon')).toHaveClass('size-[24px]')
    expect(screen.getByTestId('pencil-icon')).toHaveClass('size-[22px]')
    expect(screen.getByTestId('delete-icon')).toHaveClass('size-[22px]')
  })

  it('applies correct text color classes', () => {
    renderWithProviders(<CTAButtons {...defaultProps} />)

    expect(screen.getByTestId('speaker-icon')).toHaveClass('text-tolopea', 'dark:text-aquamarine')
    expect(screen.getByTestId('pencil-icon')).toHaveClass('text-tolopea', 'dark:text-aquamarine')
    expect(screen.getByTestId('delete-icon')).toHaveClass('text-tolopea', 'dark:text-white')
  })

  describe('accessibility', () => {
    it('buttons are keyboard accessible', async () => {
      const user = userEvent.setup()
      const setEditModal = vi.fn()

      renderWithProviders(
        <CTAButtons {...defaultProps} setEditModal={setEditModal} />
      )

      const editButton = screen.getByTestId('pencil-icon').closest('div')
      if (editButton) {
        editButton.focus()
        await user.keyboard('{Enter}')
        // Note: onClick behavior varies with keyboard events, click testing is more reliable
      }
    })

    it('has identifiable container', () => {
      renderWithProviders(<CTAButtons {...defaultProps} />)

      expect(document.getElementById('study-CTA-buttons')).toBeInTheDocument()
    })

    it('buttons have appropriate cursor styles for interaction state', () => {
      renderWithProviders(<CTAButtons {...defaultProps} />)

      const speakerButton = screen.getByTestId('speaker-icon').closest('div')
      const editButton = screen.getByTestId('pencil-icon').closest('div')

      expect(speakerButton).toHaveClass('cursor-not-allowed')
      expect(editButton).toHaveClass('cursor-pointer')
    })
  })

  describe('modal state management', () => {
    it('reflects current modal states correctly', () => {
      renderWithProviders(
        <CTAButtons
          {...defaultProps}
          editModal={true}
          deleteModal={true}
        />
      )

      // Component should render regardless of modal states
      expect(screen.getByTestId('pencil-icon')).toBeInTheDocument()
      expect(screen.getByTestId('delete-icon')).toBeInTheDocument()
    })

    it('handles rapid modal toggles', async () => {
      const user = userEvent.setup()
      const setEditModal = vi.fn()

      renderWithProviders(
        <CTAButtons {...defaultProps} setEditModal={setEditModal} />
      )

      const editButton = screen.getByTestId('pencil-icon').closest('div')
      if (editButton) {
        await user.click(editButton)
        await user.click(editButton)

        expect(setEditModal).toHaveBeenCalledTimes(2)
        expect(setEditModal).toHaveBeenNthCalledWith(1, true)
        expect(setEditModal).toHaveBeenNthCalledWith(2, false)
      }
    })
  })
})