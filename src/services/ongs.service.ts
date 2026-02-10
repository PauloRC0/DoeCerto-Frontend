import { api } from "@/services/api";

export interface Ong {
  id: number;
  name: string;
}

export async function getVerifiedOngs(): Promise<Ong[]> {
  const res = await api<any[]>("/catalog");

  const all = res.data.flatMap(s => s.data);
  return Array.from(new Map(all.map((o: any) => [o.userId, { id: o.userId, name: o.name }])).values());
}

// Serviço para operações relacionadas a ONGs

/**
 * Busca informações de uma ONG pelo ID.
 * @param id ID da ONG.
 * @returns Dados da ONG.
 */
export async function getOngById(id: string): Promise<any> {
  const response = await fetch(`http://localhost:3001/ongs/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar informações da ONG");
  }

  return response.json();
}