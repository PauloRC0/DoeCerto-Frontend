import { api } from "@/services/api";

export interface Ong {
  id: number;
  name: string;
}

export async function getVerifiedOngs(): Promise<Ong[]> {
  const res = await api<Array<{ data: unknown[] }>>("/catalog");

  const all = res.data.flatMap((s) => s.data) as Array<Record<string, unknown>>;
  return Array.from(new Map(all.map((o) => [o.userId, { id: o.userId as number, name: o.name as string }])).values());
}