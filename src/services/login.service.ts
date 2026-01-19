import { api } from "@/services/api";

export function loginDonor(data: {
  email: string;
  password: string;
}) {
  return api("/auth/login", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
  });
}
