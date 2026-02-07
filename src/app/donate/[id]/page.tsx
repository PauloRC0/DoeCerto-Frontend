import { ongs } from "@/data/ongs";
import DonateClient from "./DonateClient";

// Esta função resolve o erro do build e cria as rotas para o APK
export async function generateStaticParams() {
  return ongs.map((ong) => ({
    id: ong.id.toString(),
  }));
}

export default function DonatePage({
  params,
}: {
  params: { id: string };
}) {
  return <DonateClient id={params.id} />;
}