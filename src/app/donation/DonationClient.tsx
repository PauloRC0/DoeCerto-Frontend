"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Donation, { DonationData } from "../../components/specific/Donation/donation";
import { createDonation } from "@/services/donation.service";

export default function DonationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ong = searchParams?.get("ong") || "ONG Selecionada";
  const ongIdParam = searchParams?.get("ongId");
  const ongId = ongIdParam ? Number(ongIdParam) : null;

  const [showPopup, setShowPopup] = useState(false);


  const handleSubmit = async (data: DonationData) => {
    if (!ongId) {
      router.push("/home");
      return;
    }

    try {
      const payload = {
        ongId: ongId,
        donationType: "material",
        materialDescription: `${data.tipoItem} - ${data.descricao}`,
        materialQuantity: data.quantidade,
      };

      await createDonation(payload);
      setShowPopup(true);
    } catch (error: any) {
      console.error("Erro na Doação:", error.message);
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
        <div className="fixed inset-0 flex items-center justify-center z-[100] backdrop-blur-sm bg-black/40 px-4">
          <div className="bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-[420px] text-center border border-gray-100">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Doação enviada!
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
              A ONG <span className="font-bold text-[#4a1d7a]">{ong}</span> recebeu sua doação e entrará em contato para combinar os detalhes.
            </p>

            <button
              onClick={() => router.push("/home")}
              className="w-full bg-[#4a1d7a] text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-100 hover:bg-[#3a1661] transition-all"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}