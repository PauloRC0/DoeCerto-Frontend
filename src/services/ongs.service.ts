import { api } from "@/services/api";

export interface Ong {
  id: number;
  name: string;
}

export async function getVerifiedOngs(): Promise<Ong[]> {
  const res = await api<unknown[]>("/catalog");

  const all = res.data.flatMap((s: { data: unknown[] }) => s.data);
  return Array.from(new Map(all.map((o: Record<string, unknown>) => [o.userId, { id: o.userId as number, name: o.name as string }])).values());
}