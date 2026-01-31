import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Register from '@/components/specific/Register/register'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
  Toaster: () => null,
}))

describe('Register Component', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    localStorage.clear()
  })

  it('deve renderizar o formulário de registro', () => {
    render(<Register />)
    
    expect(screen.getByPlaceholderText(/nome/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
  })

  it('deve exibir erro quando campos estão vazios', async () => {
    const { default: toast } = await import('react-hot-toast')
    
    render(<Register />)
    
    const submitButton = screen.getByRole('button', { name: /criar conta|cadastrar/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Preencha todos os campos')
    })
  })

  it('deve exibir erro quando senhas não coincidem', async () => {
    const { default: toast } = await import('react-hot-toast')
    
    render(<Register />)
    
    const nomeInput = screen.getByPlaceholderText(/nome/i) as HTMLInputElement
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement
    const senhaInputs = screen.getAllByPlaceholderText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /criar conta|cadastrar/i })
    
    fireEvent.change(nomeInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@test.com' } })
    fireEvent.change(senhaInputs[0], { target: { value: 'password123' } })
    fireEvent.change(senhaInputs[1], { target: { value: 'password456' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('As senhas não coincidem')
    })
  })

  it('deve registrar usuário com sucesso com dados válidos', async () => {
    const { default: toast } = await import('react-hot-toast')
    
    render(<Register />)
    
    const nomeInput = screen.getByPlaceholderText(/nome/i) as HTMLInputElement
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement
    const senhaInputs = screen.getAllByPlaceholderText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /criar conta|cadastrar/i })
    
    fireEvent.change(nomeInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@test.com' } })
    fireEvent.change(senhaInputs[0], { target: { value: 'password123' } })
    fireEvent.change(senhaInputs[1], { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Cadastro realizado com sucesso!')
    })
  })
})
