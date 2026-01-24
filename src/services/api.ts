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
  console.log("Erro API:", {
    url: `${API_URL}${endpoint}`,
    status: res.status,
    statusText: res.statusText,
  });

  const text = await res.text();
  console.log("Resposta do backend:", text);

  throw new Error("Erro na requisição");
}

  return res.json();
}
