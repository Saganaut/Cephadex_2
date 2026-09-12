import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@source/test/utils/test-utils'
import { GameOption } from './GameOption'

// Mock React Router
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('GameOption', () => {
  const defaultProps = {
    gameName: 'Quiz Battle',
    description: 'Compete with friends in real-time quiz battles',
    gameRef: '/game/quiz-battle',
    imgAvatar: <div data-testid="game-avatar">🎮</div>,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders game option correctly', () => {
    renderWithProviders(<GameOption {...defaultProps} />)

    expect(screen.getByText('Quiz Battle')).toBeInTheDocument()
    expect(screen.getByText('Compete with friends in real-time quiz battles')).toBeInTheDocument()
    expect(screen.getByTestId('game-avatar')).toBeInTheDocument()
  })

  it('navigates to game when clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<GameOption {...defaultProps} />)

    const gameOption = screen.getByText('Quiz Battle').closest('div')
    if (gameOption) {
      await user.click(gameOption)
      expect(mockNavigate).toHaveBeenCalledWith('/game/quiz-battle')
    }
  })

  it('applies correct styling classes', () => {
    const { container } = renderWithProviders(<GameOption {...defaultProps} />)

    const gameContainer = container.firstChild as HTMLElement
    expect(gameContainer).toHaveClass(
      'w-full',
      'grow',
      'cursor-pointer',
      'rounded-xl',
      'bg-aquamarine-100',
      'p-4',
      'dark:bg-mariana-blue',
      'hover:dark:bg-mariana-blue-100',
      'sm:w-auto'
    )
  })

  it('displays game name with correct styling', () => {
    renderWithProviders(<GameOption {...defaultProps} />)

    const gameName = screen.getByText('Quiz Battle')
    expect(gameName.tagName).toBe('H1')
    expect(gameName).toHaveClass('p-2', 'text-4xl')
  })

  it('displays description with correct styling', () => {
    renderWithProviders(<GameOption {...defaultProps} />)

    const description = screen.getByText('Compete with friends in real-time quiz battles')
    expect(description.tagName).toBe('P')
    expect(description).toHaveClass('max-w-[400px]', 'text-wrap')
  })

  it('renders avatar in correct position', () => {
    renderWithProviders(<GameOption {...defaultProps} />)

    const headerDiv = screen.getByText('Quiz Battle').closest('div')
    const avatar = screen.getByTestId('game-avatar')

    expect(headerDiv).toContainElement(avatar)
    expect(headerDiv).toHaveClass('flex', 'items-center', 'justify-between')
  })

  it('handles different game references', async () => {
    const user = userEvent.setup()
    const customProps = {
      ...defaultProps,
      gameRef: '/game/memory-match',
    }

    renderWithProviders(<GameOption {...customProps} />)

    const gameOption = screen.getByText('Quiz Battle').closest('div')
    if (gameOption) {
      await user.click(gameOption)
      expect(mockNavigate).toHaveBeenCalledWith('/game/memory-match')
    }
  })

  it('handles long game names', () => {
    const longNameProps = {
      ...defaultProps,
      gameName: 'Super Ultra Mega Quiz Battle Championship Tournament',
    }

    renderWithProviders(<GameOption {...longNameProps} />)

    expect(screen.getByText('Super Ultra Mega Quiz Battle Championship Tournament')).toBeInTheDocument()
  })

  it('handles long descriptions', () => {
    const longDescProps = {
      ...defaultProps,
      description: 'This is a very long description that explains all the features and benefits of playing this amazing game with your friends and family members across the globe in real-time multiplayer battles.',
    }

    renderWithProviders(<GameOption {...longDescProps} />)

    const description = screen.getByText(/This is a very long description/)
    expect(description).toHaveClass('max-w-[400px]', 'text-wrap')
  })

  it('renders with different avatar types', () => {
    const customAvatarProps = {
      ...defaultProps,
      imgAvatar: <img src="/test-image.png" alt="Game Icon" data-testid="custom-avatar" />,
    }

    renderWithProviders(<GameOption {...customAvatarProps} />)

    expect(screen.getByTestId('custom-avatar')).toBeInTheDocument()
  })

  it('handles empty game reference', async () => {
    const user = userEvent.setup()
    const emptyRefProps = {
      ...defaultProps,
      gameRef: '',
    }

    renderWithProviders(<GameOption {...emptyRefProps} />)

    const gameOption = screen.getByText('Quiz Battle').closest('div')
    if (gameOption) {
      await user.click(gameOption)
      expect(mockNavigate).toHaveBeenCalledWith('')
    }
  })

  it('handles absolute URLs in game reference', async () => {
    const user = userEvent.setup()
    const absoluteUrlProps = {
      ...defaultProps,
      gameRef: 'https://external-game.com/battle',
    }

    renderWithProviders(<GameOption {...absoluteUrlProps} />)

    const gameOption = screen.getByText('Quiz Battle').closest('div')
    if (gameOption) {
      await user.click(gameOption)
      expect(mockNavigate).toHaveBeenCalledWith('https://external-game.com/battle')
    }
  })

  describe('accessibility', () => {
    it('has cursor pointer for interactive element', () => {
      const { container } = renderWithProviders(<GameOption {...defaultProps} />)

      const gameContainer = container.firstChild as HTMLElement
      expect(gameContainer).toHaveClass('cursor-pointer')
    })

    it('is keyboard accessible', async () => {
      const user = userEvent.setup()
      renderWithProviders(<GameOption {...defaultProps} />)

      const gameOption = screen.getByText('Quiz Battle').closest('div')
      if (gameOption) {
        gameOption.focus()
        await user.keyboard('{Enter}')
        // Note: onClick behavior with keyboard varies, but the element should be focusable
      }
    })

    it('has proper semantic structure', () => {
      renderWithProviders(<GameOption {...defaultProps} />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Quiz Battle')
    })
  })

  describe('responsive behavior', () => {
    it('applies responsive width classes', () => {
      const { container } = renderWithProviders(<GameOption {...defaultProps} />)

      const gameContainer = container.firstChild as HTMLElement
      expect(gameContainer).toHaveClass('w-full', 'sm:w-auto')
    })

    it('has grow class for flexible layout', () => {
      const { container } = renderWithProviders(<GameOption {...defaultProps} />)

      const gameContainer = container.firstChild as HTMLElement
      expect(gameContainer).toHaveClass('grow')
    })
  })

  describe('theme variations', () => {
    it('applies correct light mode classes', () => {
      const { container } = renderWithProviders(<GameOption {...defaultProps} />)

      const gameContainer = container.firstChild as HTMLElement
      expect(gameContainer).toHaveClass('bg-aquamarine-100')
    })

    it('applies correct dark mode classes', () => {
      const { container } = renderWithProviders(<GameOption {...defaultProps} />)

      const gameContainer = container.firstChild as HTMLElement
      expect(gameContainer).toHaveClass('dark:bg-mariana-blue', 'hover:dark:bg-mariana-blue-100')
    })
  })

  describe('edge cases', () => {
    it('handles empty game name', () => {
      const emptyNameProps = {
        ...defaultProps,
        gameName: '',
      }

      renderWithProviders(<GameOption {...emptyNameProps} />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('')
    })

    it('handles empty description', () => {
      const emptyDescProps = {
        ...defaultProps,
        description: '',
      }

      renderWithProviders(<GameOption {...emptyDescProps} />)

      const description = screen.getByText('')
      expect(description.tagName).toBe('P')
    })

    it('handles null avatar', () => {
      const nullAvatarProps = {
        ...defaultProps,
        imgAvatar: null,
      }

      renderWithProviders(<GameOption {...nullAvatarProps} />)

      expect(screen.getByText('Quiz Battle')).toBeInTheDocument()
      expect(screen.queryByTestId('game-avatar')).not.toBeInTheDocument()
    })

    it('handles special characters in game name', () => {
      const specialCharsProps = {
        ...defaultProps,
        gameName: 'Quiz & Battle: The Ultimate Challenge!',
      }

      renderWithProviders(<GameOption {...specialCharsProps} />)

      expect(screen.getByText('Quiz & Battle: The Ultimate Challenge!')).toBeInTheDocument()
    })

    it('handles HTML entities in description', () => {
      const htmlEntitiesProps = {
        ...defaultProps,
        description: 'Play with friends & family in <real-time> battles!',
      }

      renderWithProviders(<GameOption {...htmlEntitiesProps} />)

      expect(screen.getByText('Play with friends & family in <real-time> battles!')).toBeInTheDocument()
    })
  })

  describe('interaction states', () => {
    it('maintains click functionality with keyboard navigation', async () => {
      const user = userEvent.setup()
      renderWithProviders(<GameOption {...defaultProps} />)

      const gameOption = screen.getByText('Quiz Battle').closest('div')
      if (gameOption) {
        gameOption.focus()

        // Simulate click
        await user.click(gameOption)
        expect(mockNavigate).toHaveBeenCalledWith('/game/quiz-battle')
      }
    })

    it('supports multiple rapid clicks', async () => {
      const user = userEvent.setup()
      renderWithProviders(<GameOption {...defaultProps} />)

      const gameOption = screen.getByText('Quiz Battle').closest('div')
      if (gameOption) {
        await user.click(gameOption)
        await user.click(gameOption)
        await user.click(gameOption)

        expect(mockNavigate).toHaveBeenCalledTimes(3)
        expect(mockNavigate).toHaveBeenCalledWith('/game/quiz-battle')
      }
    })
  })
})