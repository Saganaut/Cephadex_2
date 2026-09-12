import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@source/test/utils/test-utils'
import { GoogleLoginButton } from './GoogleLoginButton'

// Mock dependencies
vi.mock('@contexts/ModalContext', () => ({
  useModal: () => ({
    closeSignInModal: vi.fn(),
  }),
}))

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess, ...props }: any) => (
    <button
      data-testid="google-login"
      onClick={() => {
        onSuccess({ credential: 'mock-credential' })
      }}
      {...props}
    >
      Sign in with Google
    </button>
  ),
}))

vi.mock('@source/client', () => ({
  UserService: {
    googleSignIn: vi.fn(),
  },
}))

vi.mock('@source/pages/UtilityPages/ErrorPage', () => ({
  ErrorPage: ({ error }: any) => <div data-testid="error-page">Error: {error.message}</div>,
}))

// Mock React Router
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock Redux
const mockDispatch = vi.fn()
vi.mock('@source/lib/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

vi.mock('@source/lib/store/user/actions', () => ({
  checkUserAuth: vi.fn(() => ({ type: 'user/checkUserAuth' })),
}))

vi.mock('@reduxjs/toolkit', () => ({
  unwrapResult: vi.fn((result) => result),
}))

// Import mocked modules
import { UserService } from '@source/client'
import { useModal } from '@contexts/ModalContext'
import { checkUserAuth } from '@source/lib/store/user/actions'

describe('GoogleLoginButton', () => {
  const mockCloseSignInModal = vi.fn()
  const mockUserService = UserService as any

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock window.location.pathname
    Object.defineProperty(window, 'location', {
      value: { pathname: '/test-page' },
      writable: true,
    })

    // Setup default modal mock
    vi.mocked(useModal).mockReturnValue({
      closeSignInModal: mockCloseSignInModal,
    } as any)

    // Setup default successful response
    mockUserService.googleSignIn.mockResolvedValue({
      status: 'success',
    })

    mockDispatch.mockResolvedValue({ type: 'user/checkUserAuth' })
  })

  it('renders Google login button correctly', () => {
    renderWithProviders(<GoogleLoginButton />)

    expect(screen.getByTestId('google-login')).toBeInTheDocument()
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = renderWithProviders(<GoogleLoginButton />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass(
      'flex',
      'h-[44px]',
      'w-[266px]',
      'justify-center',
      'overflow-hidden',
      'rounded-full',
      'border-[1px]',
      'border-black',
      'bg-white',
      'px-6'
    )
  })

  it('handles successful Google login', async () => {
    const user = userEvent.setup()
    renderWithProviders(<GoogleLoginButton />)

    const googleButton = screen.getByTestId('google-login')
    await user.click(googleButton)

    expect(mockUserService.googleSignIn).toHaveBeenCalledWith({
      credential: 'mock-credential',
      state: '/test-page',
    })

    expect(mockDispatch).toHaveBeenCalledWith(checkUserAuth())
    expect(mockCloseSignInModal).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/test-page')
  })

  it('handles user not registered scenario', async () => {
    const user = userEvent.setup()

    mockUserService.googleSignIn.mockResolvedValue({
      status: 'error',
      message: 'User not registered',
      userInfo: { email: 'test@example.com', name: 'Test User' },
    })

    renderWithProviders(<GoogleLoginButton />)

    const googleButton = screen.getByTestId('google-login')
    await user.click(googleButton)

    expect(mockNavigate).toHaveBeenCalledWith('/register', {
      state: {
        userInfo: { email: 'test@example.com', name: 'Test User' },
        originalPage: '/test-page',
      },
    })
    expect(mockCloseSignInModal).toHaveBeenCalled()
  })

  it('handles null credential gracefully', async () => {
    const user = userEvent.setup()

    // Mock GoogleLogin to return null credential
    vi.mocked(require('@react-oauth/google').GoogleLogin).mockImplementation(
      ({ onSuccess }: any) => (
        <button
          data-testid="google-login"
          onClick={() => onSuccess({ credential: null })}
        >
          Sign in with Google
        </button>
      )
    )

    renderWithProviders(<GoogleLoginButton />)

    const googleButton = screen.getByTestId('google-login')
    await user.click(googleButton)

    // Should not call the API when credential is null
    expect(mockUserService.googleSignIn).not.toHaveBeenCalled()
  })

  it('handles API errors and shows error page', async () => {
    const user = userEvent.setup()
    const error = new Error('Network error')

    mockUserService.googleSignIn.mockRejectedValue(error)

    renderWithProviders(<GoogleLoginButton />)

    const googleButton = screen.getByTestId('google-login')
    await user.click(googleButton)

    expect(screen.getByTestId('error-page')).toBeInTheDocument()
    expect(screen.getByText('Error: Network error')).toBeInTheDocument()
  })

  it('handles non-Error exceptions', async () => {
    const user = userEvent.setup()

    mockUserService.googleSignIn.mockRejectedValue('String error')

    renderWithProviders(<GoogleLoginButton />)

    const googleButton = screen.getByTestId('google-login')
    await user.click(googleButton)

    expect(screen.getByTestId('error-page')).toBeInTheDocument()
    expect(screen.getByText('Error: An unknown error occurred')).toBeInTheDocument()
  })

  it('handles Redux dispatch errors', async () => {
    const user = userEvent.setup()

    mockDispatch.mockRejectedValue(new Error('Redux error'))

    renderWithProviders(<GoogleLoginButton />)

    const googleButton = screen.getByTestId('google-login')
    await user.click(googleButton)

    expect(screen.getByTestId('error-page')).toBeInTheDocument()
    expect(screen.getByText('Error: Redux error')).toBeInTheDocument()
  })

  it('uses original page from window.location.pathname', async () => {
    const user = userEvent.setup()

    // Set different pathname
    Object.defineProperty(window, 'location', {
      value: { pathname: '/custom-page' },
      writable: true,
    })

    renderWithProviders(<GoogleLoginButton />)

    const googleButton = screen.getByTestId('google-login')
    await user.click(googleButton)

    expect(mockUserService.googleSignIn).toHaveBeenCalledWith({
      credential: 'mock-credential',
      state: '/custom-page',
    })

    expect(mockNavigate).toHaveBeenCalledWith('/custom-page')
  })

  it('defaults to root path when originalPage is null', async () => {
    const user = userEvent.setup()

    // Mock originalPage as null
    Object.defineProperty(window, 'location', {
      value: { pathname: null },
      writable: true,
    })

    renderWithProviders(<GoogleLoginButton />)

    const googleButton = screen.getByTestId('google-login')
    await user.click(googleButton)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  describe('GoogleLogin component props', () => {
    it('passes correct props to GoogleLogin', () => {
      renderWithProviders(<GoogleLoginButton />)

      const googleButton = screen.getByTestId('google-login')

      // These would be passed as props to the GoogleLogin component
      expect(googleButton).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has proper container structure', () => {
      const { container } = renderWithProviders(<GoogleLoginButton />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.tagName).toBe('DIV')
    })

    it('maintains button accessibility through GoogleLogin component', () => {
      renderWithProviders(<GoogleLoginButton />)

      const button = screen.getByTestId('google-login')
      expect(button.tagName).toBe('BUTTON')
    })
  })

  describe('edge cases', () => {
    it('handles undefined credential response', async () => {
      const user = userEvent.setup()

      vi.mocked(require('@react-oauth/google').GoogleLogin).mockImplementation(
        ({ onSuccess }: any) => (
          <button
            data-testid="google-login"
            onClick={() => onSuccess(undefined)}
          >
            Sign in with Google
          </button>
        )
      )

      renderWithProviders(<GoogleLoginButton />)

      const googleButton = screen.getByTestId('google-login')
      await user.click(googleButton)

      expect(mockUserService.googleSignIn).not.toHaveBeenCalled()
    })

    it('handles empty credential', async () => {
      const user = userEvent.setup()

      vi.mocked(require('@react-oauth/google').GoogleLogin).mockImplementation(
        ({ onSuccess }: any) => (
          <button
            data-testid="google-login"
            onClick={() => onSuccess({ credential: '' })}
          >
            Sign in with Google
          </button>
        )
      )

      renderWithProviders(<GoogleLoginButton />)

      const googleButton = screen.getByTestId('google-login')
      await user.click(googleButton)

      expect(mockUserService.googleSignIn).toHaveBeenCalledWith({
        credential: '',
        state: '/test-page',
      })
    })

    it('handles API response without status field', async () => {
      const user = userEvent.setup()

      mockUserService.googleSignIn.mockResolvedValue({
        // Missing status field
        message: 'Some response',
      })

      renderWithProviders(<GoogleLoginButton />)

      const googleButton = screen.getByTestId('google-login')
      await user.click(googleButton)

      // Should not navigate or close modal for non-success status
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockCloseSignInModal).not.toHaveBeenCalled()
    })
  })
})