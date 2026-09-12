import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@source/test/utils/test-utils'
import { StyledButton } from './StyledButton'

describe('StyledButton', () => {
  it('renders with correct label', () => {
    renderWithProviders(<StyledButton label="Click Me" />)
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    renderWithProviders(<StyledButton label="Click Me" onClick={handleClick} />)

    const button = screen.getByRole('button', { name: 'Click Me' })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    renderWithProviders(<StyledButton label="Click Me" disabled={true} />)

    const button = screen.getByRole('button', { name: 'Click Me' })
    expect(button).toBeDisabled()
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    renderWithProviders(
      <StyledButton label="Click Me" onClick={handleClick} disabled={true} />
    )

    const button = screen.getByRole('button', { name: 'Click Me' })
    await user.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies correct type attribute', () => {
    renderWithProviders(<StyledButton label="Submit" type="submit" />)

    const button = screen.getByRole('button', { name: 'Submit' })
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('applies correct id attribute', () => {
    renderWithProviders(<StyledButton label="Click Me" id="test-button" />)

    const button = screen.getByRole('button', { name: 'Click Me' })
    expect(button).toHaveAttribute('id', 'test-button')
  })

  describe('style variations', () => {
    it('applies depths style correctly', () => {
      renderWithProviders(<StyledButton label="Click Me" style="depths" />)

      const button = screen.getByRole('button', { name: 'Click Me' })
      expect(button).toHaveClass('bg-electric-violet')
    })

    it('applies vivid style correctly', () => {
      renderWithProviders(<StyledButton label="Click Me" style="vivid" />)

      const button = screen.getByRole('button', { name: 'Click Me' })
      expect(button).toHaveClass('bg-aquamarine')
    })

    it('applies shallows style correctly', () => {
      renderWithProviders(<StyledButton label="Click Me" style="shallows" />)

      const button = screen.getByRole('button', { name: 'Click Me' })
      expect(button).toHaveClass('bg-mariana-blue-100')
    })

    it('applies outline style correctly', () => {
      renderWithProviders(<StyledButton label="Click Me" style="outline" />)

      const button = screen.getByRole('button', { name: 'Click Me' })
      expect(button).toHaveClass('bg-transparent', 'border-2')
    })

    it('applies default style when no style specified', () => {
      renderWithProviders(<StyledButton label="Click Me" />)

      const button = screen.getByRole('button', { name: 'Click Me' })
      expect(button).toHaveClass('bg-blaze-orange')
    })
  })

  describe('size variations', () => {
    it('applies small size correctly', () => {
      renderWithProviders(<StyledButton label="Click Me" size="small" />)

      const button = screen.getByRole('button', { name: 'Click Me' })
      expect(button).toHaveClass('text-[14px]')
    })

    it('applies medium size correctly (default)', () => {
      renderWithProviders(<StyledButton label="Click Me" />)

      const button = screen.getByRole('button', { name: 'Click Me' })
      expect(button).toHaveClass('text-[18px]')
    })

    it('applies large size correctly', () => {
      renderWithProviders(<StyledButton label="Click Me" size="large" />)

      const button = screen.getByRole('button', { name: 'Click Me' })
      expect(button).toHaveClass('text-[24px]')
    })
  })

  describe('disabled state styling', () => {
    it('applies disabled styling when disabled', () => {
      renderWithProviders(<StyledButton label="Click Me" disabled={true} />)

      const button = screen.getByRole('button', { name: 'Click Me' })
      expect(button).toHaveClass('cursor-not-allowed', 'border-slate-400', 'bg-slate-300')
    })

    it('applies enabled styling when not disabled', () => {
      renderWithProviders(<StyledButton label="Click Me" disabled={false} />)

      const button = screen.getByRole('button', { name: 'Click Me' })
      expect(button).toHaveClass('cursor-pointer')
      expect(button).not.toHaveClass('cursor-not-allowed')
    })
  })

  describe('accessibility', () => {
    it('has proper button role', () => {
      renderWithProviders(<StyledButton label="Click Me" />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('is keyboard accessible', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      renderWithProviders(<StyledButton label="Click Me" onClick={handleClick} />)

      const button = screen.getByRole('button', { name: 'Click Me' })
      button.focus()
      await user.keyboard('{Enter}')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('supports space key activation', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      renderWithProviders(<StyledButton label="Click Me" onClick={handleClick} />)

      const button = screen.getByRole('button', { name: 'Click Me' })
      button.focus()
      await user.keyboard(' ')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
})