"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export interface DonationData {
  tipoItem: string;
  quantidade: number;
  endereco: string;
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
  const [endereco, setEndereco] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    // validação simples
    if (!tipoItem || !quantidade || !endereco) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const payload: DonationData = {
      tipoItem,
      quantidade: Number(quantidade),
      endereco,
    };

    try {
      setLoading(true);
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        // comportamento padrão: log e alerta
        // substitua por fetch para o backend quando integrar
        console.log("Doação (padrão):", payload);
        alert("Doação registrada localmente. Integre com o backend para salvar.");
      }
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao enviar a doação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
       <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full z-30 shadow-md text-gray-900 hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-700 mt-4">{`Doar Itens — ${ongName}`}</h1>
        <p className="text-sm text-gray-600 mt-1">
          Obrigado por ajudar! Preencha os dados abaixo.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4"
      >
        {/* Tipo do item */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-700">Tipo do Item</label>
          <select
            value={tipoItem}
            onChange={(e) => setTipoItem(e.target.value)}
            required
            className="p-3 rounded-xl border border-gray-300 text-gray-700 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
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
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-700">Quantidade</label>
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
            className="p-3 rounded-xl border border-gray-300 text-gray-700 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
          />
        </div>

        {/* Endereço */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-700">Descrição</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
            placeholder="Ex: Esse item está em bom estado, usado apenas 2 vezes."
            className="p-3 rounded-xl border border-gray-300 text-gray-700 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
          />
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-3 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-2xl shadow-md transition disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Confirmar Doação"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-transparent border border-gray-300 text-gray-700 py-2 rounded-xl"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}