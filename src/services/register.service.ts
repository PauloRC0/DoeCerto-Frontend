// src/services/auth/register.ts
import { api } from "@/services/api";

export function registerDonor(data: {
  name: string;
  email: string;
  password: string;
  cpf: string;
}) {
  return api("/auth/register/donor", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
