import { api } from "@/services/api";

export interface Ong {
  id: number;
  name: string;
}

export async function getOngs(): Promise<Ong[]> {
  const res = await api<Ong[]>("/ongs");

  return res.data;
}
