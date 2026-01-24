// services/ongs.service.ts
import { api } from "@/services/api";

export async function getOngs() {
  const response = await api("/ongs");

  // garante que sempre seja um array
  return Array.isArray(response?.data) ? response.data : [];
}
