"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Donation from "../../components/specific/Donation/donation";
import { createDonation } from "@/services/donation.service";


export default function DonationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ong = searchParams?.get("ong") || "ONG Selecionada";
  const ongIdParam = searchParams?.get("ongId");
  const ongId = ongIdParam ? Number(ongIdParam) : null;

  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (data: { tipoItem: string; quantidade: number; endereco: string; }) => {
    if (!ongId) {
      alert("Erro: ONG não identificada.");
      return;
    }

    try {
      const payload = {
        ongId: ongId, 
        donationType: "material", 
        materialDescription: `${data.tipoItem} - Endereço: ${data.endereco}`,
        materialQuantity: data.quantidade,
      };

      await createDonation(payload);
      setShowPopup(true);
    } catch (error: unknown) {
     
      console.error("Erro na Doação:", error instanceof Error ? error.message : String(error));
      alert("Não foi possível enviar a doação. Verifique sua conexão ou login.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center justify-center">
      <Donation
        ongName={ong}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-[90%] max-w-[420px] text-center">
            <h2 className="text-2xl font-bold text-purple-700 mb-2">
              Doação enviada!
            </h2>

            <p className="text-gray-700 mb-6">
              A ONG{" "}
              <span className="font-semibold text-purple-700">{ong}</span>{" "}
              entrará em contato para combinar a entrega.
            </p>

            <button
              onClick={() => router.push("/home")}
              className="bg-purple-600 text-white py-2 px-8 rounded-full font-semibold hover:bg-purple-700"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}