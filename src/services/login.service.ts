import { api } from "@/services/api";

interface LoginDTO {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export async function login(data: LoginDTO): Promise<LoginResponse> {
  const response = await api<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  // Salvar o token no cookie
  if (response.data.access_token) {
    document.cookie = `access_token=${response.data.access_token}; path=/; max-age=86400; secure; samesite=strict`;
  }

  return response.data;
}
