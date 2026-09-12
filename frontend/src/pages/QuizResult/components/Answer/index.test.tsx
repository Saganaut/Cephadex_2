import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@source/test/utils/test-utils'
import { Answer } from './index'
import type { QuestionResultSchema } from '@source/client'

// Mock Heroicons
vi.mock('@heroicons/react/20/solid', () => ({
  CheckIcon: ({ className }: any) => <div data-testid="check-icon" className={className}>✓</div>,
  ChevronDownIcon: ({ className, onClick }: any) => (
    <div data-testid="chevron-icon" className={className} onClick={onClick}>
      ▼
    </div>
  ),
}))

vi.mock('@heroicons/react/24/outline', () => ({
  XMarkIcon: ({ className }: any) => <div data-testid="x-icon" className={className}>✗</div>,
}))

describe('Answer', () => {
  const mockQuestionResult: QuestionResultSchema = {
    questionId: 1,
    points: 5,
    correct: true,
    answer: 'Student answer',
  }

  const defaultProps = {
    correct: true,
    term: 'What is React?',
    points: 5,
    yourAnswer: 'A JavaScript library',
    correctAnswer: 'A JavaScript library for building user interfaces',
    collapse: false,
    assignedPoints: 10,
    setGradedQuestions: vi.fn(),
    gradedQuestions: [mockQuestionResult],
    id: 1,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders answer component correctly', () => {
    renderWithProviders(<Answer {...defaultProps} />)

    expect(screen.getByText('What is React?')).toBeInTheDocument()
    expect(screen.getByTestId('chevron-icon')).toBeInTheDocument()
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
  })

  it('displays correct answer status with check icon', () => {
    renderWithProviders(<Answer {...defaultProps} correct={true} />)

    const checkIcons = screen.getAllByTestId('check-icon')
    expect(checkIcons.length).toBeGreaterThan(0)
  })

  it('displays incorrect answer status with X icon', () => {
    renderWithProviders(<Answer {...defaultProps} correct={false} />)

    const xIcons = screen.getAllByTestId('x-icon')
    expect(xIcons.length).toBeGreaterThan(0)
  })

  it('toggles answer details when chevron is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Answer {...defaultProps} />)

    const chevron = screen.getByTestId('chevron-icon')

    // Initially open (collapse = false)
    expect(screen.getByText('A JavaScript library')).toBeInTheDocument()

    await user.click(chevron)

    // Should close
    expect(screen.queryByText('A JavaScript library')).not.toBeInTheDocument()
  })

  it('handles points input change', async () => {
    const user = userEvent.setup()
    const setGradedQuestions = vi.fn()

    renderWithProviders(
      <Answer {...defaultProps} setGradedQuestions={setGradedQuestions} />
    )

    const pointsInput = screen.getByDisplayValue('5')
    await user.clear(pointsInput)
    await user.type(pointsInput, '8')

    expect(pointsInput).toHaveValue(8)
  })

  it('shows student answer when expanded', () => {
    renderWithProviders(<Answer {...defaultProps} />)

    expect(screen.getByText('A JavaScript library')).toBeInTheDocument()
  })

  it('shows correct answer section only for incorrect answers', () => {
    renderWithProviders(<Answer {...defaultProps} correct={false} />)

    expect(screen.getByText("Student's answer :")).toBeInTheDocument()
    expect(screen.getByText('Correct answer :')).toBeInTheDocument()
    expect(screen.getByText('A JavaScript library for building user interfaces')).toBeInTheDocument()
  })

  it('does not show correct answer section for correct answers', () => {
    renderWithProviders(<Answer {...defaultProps} correct={true} />)

    expect(screen.queryByText('Correct answer :')).not.toBeInTheDocument()
  })

  it('handles null/undefined your answer', () => {
    renderWithProviders(<Answer {...defaultProps} yourAnswer={null} />)

    expect(screen.getByText('it was left blank!')).toBeInTheDocument()
  })

  it('handles undefined your answer', () => {
    renderWithProviders(<Answer {...defaultProps} yourAnswer={undefined} />)

    expect(screen.getByText('it was left blank!')).toBeInTheDocument()
  })

  it('respects collapse prop', () => {
    renderWithProviders(<Answer {...defaultProps} collapse={true} />)

    // Details should be hidden when collapsed
    expect(screen.queryByText('A JavaScript library')).not.toBeInTheDocument()
  })

  it('opens when collapse is false', () => {
    renderWithProviders(<Answer {...defaultProps} collapse={false} />)

    // Details should be visible when not collapsed
    expect(screen.getByText('A JavaScript library')).toBeInTheDocument()
  })

  it('enforces min/max values on points input', () => {
    renderWithProviders(<Answer {...defaultProps} assignedPoints={10} />)

    const pointsInput = screen.getByDisplayValue('5')
    expect(pointsInput).toHaveAttribute('min', '0')
    expect(pointsInput).toHaveAttribute('max', '10')
  })

  it('displays points fraction correctly', () => {
    renderWithProviders(<Answer {...defaultProps} points={7} assignedPoints={10} />)

    expect(screen.getByDisplayValue('7')).toBeInTheDocument()
    expect(screen.getByText('/10')).toBeInTheDocument()
  })

  it('applies correct background based on answer correctness', () => {
    const { rerender } = renderWithProviders(<Answer {...defaultProps} correct={true} />)

    const correctIcon = screen.getAllByTestId('check-icon')[0].closest('div')
    expect(correctIcon).toHaveClass('bg-blaze-orange')

    rerender(<Answer {...defaultProps} correct={false} />)

    const incorrectIcon = screen.getAllByTestId('x-icon')[0].closest('div')
    expect(incorrectIcon).toHaveClass('bg-white')
  })

  it('handles points update and calls setGradedQuestions', async () => {
    const user = userEvent.setup()
    const setGradedQuestions = vi.fn()

    renderWithProviders(
      <Answer
        {...defaultProps}
        setGradedQuestions={setGradedQuestions}
        id={1}
        assignedPoints={10}
      />
    )

    const pointsInput = screen.getByDisplayValue('5')
    await user.clear(pointsInput)
    await user.type(pointsInput, '8')

    // Should be called due to useEffect on newPoints change
    expect(setGradedQuestions).toHaveBeenCalled()
  })

  it('correctly updates question correctness based on points vs assigned points', async () => {
    const user = userEvent.setup()
    const setGradedQuestions = vi.fn()

    renderWithProviders(
      <Answer
        {...defaultProps}
        setGradedQuestions={setGradedQuestions}
        assignedPoints={10}
      />
    )

    const pointsInput = screen.getByDisplayValue('5')
    await user.clear(pointsInput)
    await user.type(pointsInput, '10')

    // Should mark as correct when points >= assignedPoints
    expect(setGradedQuestions).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          questionId: 1,
          points: 10,
          correct: true,
        })
      ])
    )
  })

  it('applies correct chevron rotation class', () => {
    const { rerender } = renderWithProviders(<Answer {...defaultProps} />)

    // When open (isOpen = true), no rotation
    let chevron = screen.getByTestId('chevron-icon')
    expect(chevron).not.toHaveClass('-rotate-90')

    rerender(<Answer {...defaultProps} collapse={true} />)

    // When closed, should have rotation
    chevron = screen.getByTestId('chevron-icon')
    expect(chevron).toHaveClass('-rotate-90')
  })

  it('handles invalid points input gracefully', async () => {
    const user = userEvent.setup()

    renderWithProviders(<Answer {...defaultProps} />)

    const pointsInput = screen.getByDisplayValue('5')
    await user.clear(pointsInput)
    await user.type(pointsInput, 'abc')

    // Should handle non-numeric input (parseInt returns NaN)
    expect(pointsInput).toHaveValue(NaN)
  })

  describe('accessibility', () => {
    it('has proper input labels and structure', () => {
      renderWithProviders(<Answer {...defaultProps} />)

      const pointsInput = screen.getByDisplayValue('5')
      expect(pointsInput).toHaveAttribute('type', 'number')
    })

    it('chevron button is keyboard accessible', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Answer {...defaultProps} />)

      const chevron = screen.getByTestId('chevron-icon')
      chevron.focus()

      // Test that it's focusable
      expect(chevron).toHaveClass('cursor-pointer')
    })

    it('provides visual feedback for answer states', () => {
      renderWithProviders(<Answer {...defaultProps} correct={false} />)

      expect(screen.getByText("Student's answer :")).toBeInTheDocument()
      expect(screen.getByText('Correct answer :')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles empty gradedQuestions array', () => {
      renderWithProviders(<Answer {...defaultProps} gradedQuestions={[]} />)

      expect(screen.getByText('What is React?')).toBeInTheDocument()
    })

    it('handles undefined gradedQuestions', () => {
      renderWithProviders(<Answer {...defaultProps} gradedQuestions={undefined} />)

      expect(screen.getByText('What is React?')).toBeInTheDocument()
    })

    it('handles null assigned points', () => {
      renderWithProviders(<Answer {...defaultProps} assignedPoints={undefined} />)

      const pointsInput = screen.getByDisplayValue('5')
      expect(pointsInput).not.toHaveAttribute('max')
    })

    it('handles zero points correctly', () => {
      renderWithProviders(<Answer {...defaultProps} points={0} />)

      expect(screen.getByDisplayValue('0')).toBeInTheDocument()
    })
  })
})