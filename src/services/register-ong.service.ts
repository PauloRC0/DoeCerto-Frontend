// services/register-ong.service.ts
import { api } from "@/services/api";

export function registerOng(data: {
  name: string;
  email: string;
  password: string;
  cnpj: string;
}) {
  return api("/auth/register/ong", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
