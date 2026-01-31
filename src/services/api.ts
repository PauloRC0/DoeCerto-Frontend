const API_URL = "__NEXT_PUBLIC_API_URL__";

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T }> {
  const headers = new Headers(options.headers);

  // 1. ADICIONANDO O TOKEN
 
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  if (token) {
   
    headers.set("Authorization", `Bearer ${token}`);
  }

  // 2. RESOLVENDO O ERRO 400 (FormData vs JSON)
  if (options.body instanceof FormData) {
   
    headers.delete("Content-Type");
  } else if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", 
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || "Erro na requisição");
  }

  return {
    data: text ? JSON.parse(text) : null,
  };
}