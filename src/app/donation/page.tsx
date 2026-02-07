import { Suspense } from "react";
import DonationClient from "./DonationClient";

export default function DonationPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DonationClient />
    </Suspense>
  );
}
