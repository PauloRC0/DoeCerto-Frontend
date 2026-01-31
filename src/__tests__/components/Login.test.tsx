import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '@/components/specific/Login/login'
import { useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock login service
jest.mock('@/services/login.service', () => ({
  login: jest.fn(),
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
  Toaster: () => null,
}))

describe('LoginPage Component', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    localStorage.clear()
  })

  it('deve renderizar o formulário de login', () => {
    render(<LoginPage />)
    
    expect(screen.getByAltText(/doecerto/i)).toBeInTheDocument()
    expect(screen.getByText(/faça seu login/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument()
  })

  it('deve exibir erro quando não houver usuário cadastrado', async () => {
    const { default: toast } = await import('react-hot-toast')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const loginService = require('@/services/login.service')
    
    // Mock login to reject
    loginService.login.mockRejectedValueOnce(new Error('User not found'))
    
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(/senha/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email ou senha inválidos')
    })
  })

  it('deve fazer login com sucesso com credenciais corretas', async () => {
    const { default: toast } = await import('react-hot-toast')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const loginService = require('@/services/login.service')
    
    // Mock successful login
    loginService.login.mockResolvedValueOnce(undefined)
    
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(/senha/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Login realizado com sucesso!')
    })
  })
})
