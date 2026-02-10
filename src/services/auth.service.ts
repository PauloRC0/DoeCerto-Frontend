// Serviço para autenticação e recuperação de senha

/**
 * Solicita recuperação de senha para o e-mail fornecido.
 * @param email E-mail do usuário.
 */
export async function forgotPassword(email: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim() }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Erro ao solicitar recuperação");
  }
}

/**
 * Redefine a senha do usuário com base no token e nova senha fornecidos.
 * @param token Token de redefinição de senha.
 * @param newPassword Nova senha do usuário.
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Erro ao redefinir senha");
  }
}