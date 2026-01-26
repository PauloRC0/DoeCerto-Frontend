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