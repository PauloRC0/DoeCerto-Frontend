"use client";

import { use, useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface OngData {
  pixKey?: string;
  user?: {
    name?: string;
  };
  [key: string]: unknown;
}

export default function DonateContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [ong, setOng] = useState<OngData | null>(null);
  const [option, setOption] = useState<"items" | "money" | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/ongs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("ONG RECEBIDA:", data);
        setOng(data);
      })
      .catch((err) => console.error("Erro ao buscar ONG:", err));
  }, [id]);

  if (!ong) return <p className="text-center mt-10">Carregando...</p>;

  const PIX_KEY = ong.pixKey || "123e4567-e89b-12d3-a456-426614174000";

  return (
    <div className="min-h-screen bg-[#6B39A7] text-white p-6">
      <h1 className="text-3xl font-bold text-center">
        Doar para {ong.user?.name}
      </h1>

      {/* Escolher opção */}
      {option === null && (
        <div className="mt-10 flex flex-col items-center gap-6">
          <button
            onClick={() => setOption("items")}
            className="bg-white text-[#6B39A7] font-bold px-6 py-3 rounded-lg text-2xl w-64 active:scale-95"
          >
            Doar Itens
          </button>

          <button
            onClick={() => setOption("money")}
            className="bg-white text-[#6B39A7] font-bold px-6 py-3 rounded-lg text-2xl w-64 active:scale-95"
          >
            Doar Dinheiro
          </button>
        </div>
      )}

      {/* Doação de itens */}
      {option === "items" && (
        <div className="mt-10 flex flex-col gap-4 text-center">
          <p className="text-xl">Ainda vamos construir a doação de itens 😊</p>

          <button
            onClick={() => setOption(null)}
            className="mt-6 bg-white text-[#6B39A7] px-4 py-2 rounded-lg font-bold active:scale-95"
          >
            Voltar
          </button>
        </div>
      )}

      {/* Doação em dinheiro */}
      {option === "money" && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-xl font-bold text-center">Escaneie o QR Code abaixo:</p>

          <div className="bg-white p-4 rounded-xl">
            <QRCodeCanvas value={PIX_KEY} size={200} />
          </div>

          <p className="text- mt-2 opacity-90">Chave PIX:</p>
          <p className="text-white font-bold text-xl">{PIX_KEY}</p>

          <button
            onClick={() => setOption(null)}
            className="mt-6 bg-white text-[#6B39A7] px-4 py-2 rounded-lg font-bold active:scale-95"
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  );
}
