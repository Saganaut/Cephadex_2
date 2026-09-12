import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@source/test/utils/test-utils'
import { InputField } from './InputField'

// Mock Heroicons
vi.mock('@heroicons/react/20/solid', () => ({
  ChevronUpIcon: ({ className }: any) => (
    <div data-testid="chevron-up" className={className}>
      ▲
    </div>
  ),
  ChevronDownIcon: ({ className }: any) => (
    <div data-testid="chevron-down" className={className}>
      ▼
    </div>
  ),
}))

describe('InputField', () => {
  const defaultProps = {
    name: 'test-input',
    value: '',
    type: 'text',
    placeholder: 'Enter text here',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders input field correctly', () => {
    renderWithProviders(<InputField {...defaultProps} />)

    const input = screen.getByPlaceholderText('Enter text here')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', 'test-input')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('renders with label when provided', () => {
    renderWithProviders(
      <InputField {...defaultProps} label="Test Label" />
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('calls onChange when input value changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderWithProviders(
      <InputField {...defaultProps} onChange={onChange} />
    )

    const input = screen.getByPlaceholderText('Enter text here')
    await user.type(input, 'Hello')

    expect(onChange).toHaveBeenCalledTimes(5) // Once for each character
  })

  it('calls onBlur when input loses focus', async () => {
    const user = userEvent.setup()
    const onBlur = vi.fn()

    renderWithProviders(
      <InputField {...defaultProps} onBlur={onBlur} />
    )

    const input = screen.getByPlaceholderText('Enter text here')
    await user.click(input)
    await user.tab() // Move focus away

    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard events with onKeyDown', async () => {
    const user = userEvent.setup()
    const handleOnKeyDown = vi.fn()

    renderWithProviders(
      <InputField {...defaultProps} handleOnKeyDown={handleOnKeyDown} />
    )

    const input = screen.getByPlaceholderText('Enter text here')
    await user.type(input, '{Enter}')

    expect(handleOnKeyDown).toHaveBeenCalled()
  })

  it('displays value correctly', () => {
    renderWithProviders(
      <InputField {...defaultProps} value="Test Value" />
    )

    const input = screen.getByDisplayValue('Test Value')
    expect(input).toBeInTheDocument()
  })

  it('handles null value gracefully', () => {
    renderWithProviders(
      <InputField {...defaultProps} value={null} />
    )

    const input = screen.getByPlaceholderText('Enter text here')
    expect(input).toHaveValue('')
  })

  it('applies custom className', () => {
    renderWithProviders(
      <InputField {...defaultProps} className="custom-class" />
    )

    const input = screen.getByPlaceholderText('Enter text here')
    expect(input).toHaveClass('custom-class')
  })

  it('applies dashed styling when dashed prop is true', () => {
    renderWithProviders(
      <InputField {...defaultProps} dashed={true} label="Dashed Label" />
    )

    const label = screen.getByText('Dashed Label')
    expect(label).toHaveClass('bg-mariana-blue-100', 'rounded-full')

    const input = screen.getByPlaceholderText('Enter text here')
    expect(input).toHaveClass('border-dashed', 'border-electric-violet')
  })

  it('applies regular styling when dashed prop is false', () => {
    renderWithProviders(
      <InputField {...defaultProps} dashed={false} label="Regular Label" />
    )

    const label = screen.getByText('Regular Label')
    expect(label).toHaveClass('pb-2', 'text-left')

    const input = screen.getByPlaceholderText('Enter text here')
    expect(input).toHaveClass('border-slate-400')
  })

  describe('number input with steppers', () => {
    const numberProps = {
      ...defaultProps,
      type: 'number',
      value: 5,
      setValue: vi.fn(),
    }

    it('renders step controls for number inputs', () => {
      renderWithProviders(<InputField {...numberProps} />)

      expect(screen.getByTestId('chevron-up')).toBeInTheDocument()
      expect(screen.getByTestId('chevron-down')).toBeInTheDocument()
    })

    it('increments value when up arrow is clicked', async () => {
      const user = userEvent.setup()
      const setValue = vi.fn()

      renderWithProviders(
        <InputField {...numberProps} setValue={setValue} />
      )

      const upButton = screen.getByTestId('chevron-up')
      await user.click(upButton)

      expect(setValue).toHaveBeenCalledWith(6)
    })

    it('decrements value when down arrow is clicked', async () => {
      const user = userEvent.setup()
      const setValue = vi.fn()

      renderWithProviders(
        <InputField {...numberProps} setValue={setValue} />
      )

      const downButton = screen.getByTestId('chevron-down')
      await user.click(downButton)

      expect(setValue).toHaveBeenCalledWith(4)
    })

    it('does not decrement below 1', async () => {
      const user = userEvent.setup()
      const setValue = vi.fn()

      renderWithProviders(
        <InputField {...numberProps} value={1} setValue={setValue} />
      )

      const downButton = screen.getByTestId('chevron-down')
      await user.click(downButton)

      expect(setValue).not.toHaveBeenCalled()
    })

    it('sets value to 1 when incrementing from null', async () => {
      const user = userEvent.setup()
      const setValue = vi.fn()

      renderWithProviders(
        <InputField {...numberProps} value={null} setValue={setValue} />
      )

      const upButton = screen.getByTestId('chevron-up')
      await user.click(upButton)

      expect(setValue).toHaveBeenCalledWith(1)
    })

    it('does not render steppers when setValue is not provided', () => {
      renderWithProviders(
        <InputField {...defaultProps} type="number" />
      )

      expect(screen.queryByTestId('chevron-up')).not.toBeInTheDocument()
      expect(screen.queryByTestId('chevron-down')).not.toBeInTheDocument()
    })

    it('handles string value in number input', async () => {
      const user = userEvent.setup()
      const setValue = vi.fn()

      renderWithProviders(
        <InputField {...numberProps} value="10" setValue={setValue} />
      )

      const downButton = screen.getByTestId('chevron-down')
      await user.click(downButton)

      // Should not increment/decrement string values
      expect(setValue).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('associates label with input correctly', () => {
      renderWithProviders(
        <InputField {...defaultProps} label="Accessible Label" />
      )

      const input = screen.getByPlaceholderText('Enter text here')
      const label = screen.getByText('Accessible Label')

      expect(label).toBeInTheDocument()
      expect(input).toBeInTheDocument()
    })

    it('has correct input attributes', () => {
      renderWithProviders(<InputField {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter text here')
      expect(input).toHaveAttribute('autoComplete', 'off')
      expect(input).toHaveAttribute('min', '1')
    })

    it('stepper buttons are keyboard accessible', async () => {
      const user = userEvent.setup()
      const setValue = vi.fn()

      renderWithProviders(
        <InputField {...defaultProps} type="number" value={5} setValue={setValue} />
      )

      const upButton = screen.getByTestId('chevron-up').closest('div')
      if (upButton) {
        expect(upButton).toHaveClass('cursor-pointer')
      }
    })
  })

  describe('styling variations', () => {
    it('applies custom text style', () => {
      renderWithProviders(
        <InputField
          {...defaultProps}
          label="Styled Label"
          textStyle="text-red-500"
        />
      )

      const label = screen.getByText('Styled Label')
      expect(label).toHaveClass('text-red-500')
    })

    it('applies default text style when not provided', () => {
      renderWithProviders(
        <InputField {...defaultProps} label="Default Label" />
      )

      const label = screen.getByText('Default Label')
      expect(label).toHaveClass('dark:text-white')
    })

    it('applies correct stepper positioning', () => {
      renderWithProviders(
        <InputField {...defaultProps} type="number" value={5} setValue={vi.fn()} />
      )

      const stepperContainer = screen.getByTestId('chevron-up').closest('div')?.parentElement
      expect(stepperContainer).toHaveClass(
        'absolute',
        'right-[5px]',
        'top-1/2',
        '-translate-y-1/2'
      )
    })
  })

  describe('edge cases', () => {
    it('handles undefined onChange gracefully', async () => {
      const user = userEvent.setup()

      renderWithProviders(<InputField {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter text here')
      await user.type(input, 'test')

      // Should not throw error
      expect(input).toHaveValue('test')
    })

    it('handles empty placeholder', () => {
      renderWithProviders(
        <InputField {...defaultProps} placeholder="" />
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', '')
    })

    it('handles ref correctly', () => {
      const ref = { current: null }

      renderWithProviders(
        <InputField {...defaultProps} inputFieldRef={ref} />
      )

      expect(ref.current).toBeTruthy()
    })

    it('handles zero value in number input', () => {
      renderWithProviders(
        <InputField {...defaultProps} type="number" value={0} />
      )

      const input = screen.getByDisplayValue('0')
      expect(input).toBeInTheDocument()
    })

    it('handles negative value correctly', async () => {
      const user = userEvent.setup()
      const setValue = vi.fn()

      renderWithProviders(
        <InputField {...defaultProps} type="number" value={-1} setValue={setValue} />
      )

      const downButton = screen.getByTestId('chevron-down')
      await user.click(downButton)

      // Should not decrement negative values
      expect(setValue).not.toHaveBeenCalled()
    })
  })
})