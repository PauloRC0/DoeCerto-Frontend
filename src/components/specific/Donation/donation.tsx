"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";


export interface DonationData {
  tipoItem: string;
  quantidade: number;
  descricao: string; 
}

export interface DonationProps {
  ongName?: string;
  onSubmit?: (data: DonationData) => Promise<void> | void;
  onCancel?: () => void;
}

export default function Donation({
  ongName = "ONG Selecionada",
  onSubmit,
  onCancel,
}: DonationProps) {
  const [tipoItem, setTipoItem] = useState("");
  const [quantidade, setQuantidade] = useState<number | "">("");
  const [descricao, setDescricao] = useState(""); // Estado renomeado
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    
    if (!tipoItem || !quantidade || !descricao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const payload: DonationData = {
      tipoItem,
      quantidade: Number(quantidade),
      descricao, // Payload atualizado
    };

    try {
      setLoading(true);
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        console.log("Doação enviada ao backend:", payload);
        alert("Doação registrada com sucesso!");
      }
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao enviar a doação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 bg-white/90 p-2 rounded-full z-30 shadow-md text-gray-900 hover:bg-white transition-colors"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="mb-6 mt-12">
        <h1 className="text-2xl font-black text-[#4a1d7a]">{`Doar Itens — ${ongName}`}</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Descreva os itens que você deseja doar para a ONG.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[24px] shadow-xl border border-gray-100 p-6 flex flex-col gap-5"
      >
        {/* Tipo do item */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-sm text-gray-700 ml-1">O que você vai doar?</label>
          <select
            value={tipoItem}
            onChange={(e) => setTipoItem(e.target.value)}
            required
            className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 focus:border-[#4a1d7a] focus:ring-4 focus:ring-purple-50 outline-none transition-all appearance-none"
          >
            <option value="">Selecione o tipo</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Roupas">Roupas</option>
            <option value="Brinquedos">Brinquedos</option>
            <option value="Produtos de Higiene">Produtos de Higiene</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        {/* Quantidade */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-sm text-gray-700 ml-1">Quantidade</label>
          <input
            type="number"
            min={1}
            value={quantidade}
            onChange={(e) => {
              const v = e.target.value;
              setQuantidade(v === "" ? "" : Number(v));
            }}
            required
            placeholder="Ex: 5"
            className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 focus:border-[#4a1d7a] focus:ring-4 focus:ring-purple-50 outline-none transition-all"
          />
        </div>

        {/* Descrição - Mudado para TEXTAREA para melhor UX */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-sm text-gray-700 ml-1">Descrição dos Itens</label>
          <textarea
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            placeholder="Conte-nos mais sobre os itens (ex: estado de conservação, tamanhos, validade...)"
            className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 focus:border-[#4a1d7a] focus:ring-4 focus:ring-purple-50 outline-none transition-all resize-none"
          />
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-3 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#4a1d7a] hover:bg-[#3a1661] text-white font-black py-4 rounded-2xl shadow-lg shadow-purple-100 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Processando..." : "Confirmar Doação"}
          </button>

          <button
            type="button"
            onClick={onCancel || (() => router.back())}
            className="bg-white border border-gray-200 text-gray-500 font-bold py-3 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}