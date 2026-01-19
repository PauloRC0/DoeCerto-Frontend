const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function api(
  endpoint: string,
  options?: RequestInit
) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error("Erro na requisição");
  }

  return res.json();
}
