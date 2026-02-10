"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { WishlistService } from "@/services/wishlist.service";

export interface DonationData {
  tipoItem: string;
  quantidade: number;
  descricao: string;
}

export interface DonationProps {
  ongId: number;
  ongName?: string;
  onSubmit?: (data: DonationData) => Promise<void> | void;
  onCancel?: () => void;
}

export default function Donation({
  ongId,
  ongName = "ONG Selecionada",
  onSubmit,
  onCancel,
}: DonationProps) {
  const [itemsCadastrados, setItemsCadastrados] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantidade, setQuantidade] = useState<number | "">("");
  const [descricaoAdicional, setDescricaoAdicional] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingItems, setFetchingItems] = useState(true);
  
  const router = useRouter();

  // Carrega os itens que a ONG cadastrou
  useEffect(() => {
    async function loadWishlist() {
      try {
        setFetchingItems(true);
        // Usando getItems conforme definido no seu service
        const data = await WishlistService.getItems(ongId);
        setItemsCadastrados(data || []);
      } catch (err) {
        console.error("Erro ao carregar itens da ONG:", err);
      } finally {
        setFetchingItems(false);
      }
    }
    if (ongId) loadWishlist();
  }, [ongId]);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (!selectedItemId || !quantidade || !descricaoAdicional) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Busca o item selecionado para pegar a descrição dele
    const itemDaLista = itemsCadastrados.find(i => i.id.toString() === selectedItemId);
    
    // Formata a descrição combinando o nome do item + observação do usuário
    // Ex: "Alimentos - Arroz e Feijão dentro da validade"
    const descricaoFinal = itemDaLista 
      ? `${itemDaLista.description} - ${descricaoAdicional}`
      : descricaoAdicional;

    const payload: DonationData = {
      tipoItem: "material", // Fixo conforme seu banco de dados
      quantidade: Number(quantidade),
      descricao: descricaoFinal,
    };

    try {
      setLoading(true);
      if (onSubmit) {
        await onSubmit(payload);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <button
        type="button"
        onClick={onCancel || (() => router.back())}
        className="fixed top-4 left-4 bg-white/90 p-2 rounded-full z-30 shadow-md text-gray-900 hover:bg-white transition-colors"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="mb-6 mt-12">
        <h1 className="text-2xl font-black text-[#4a1d7a]">{`Doar Itens — ${ongName}`}</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Selecione uma necessidade da ONG e descreva sua doação.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[24px] shadow-xl border border-gray-100 p-6 flex flex-col gap-5"
      >
        {/* O que você vai doar? (Agora com itens da Wishlist) */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-sm text-gray-700 ml-1">O que você vai doar?</label>
          <div className="relative">
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              required
              disabled={fetchingItems}
              className="w-full p-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 focus:border-[#4a1d7a] focus:ring-4 focus:ring-purple-50 outline-none transition-all appearance-none disabled:opacity-50"
            >
              <option value="">Selecione o item</option>
              {itemsCadastrados.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.description}
                </option>
              ))}
              <option value="Outros">Outros (Item não listado)</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quantidade */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-sm text-gray-700 ml-1">Quantidade</label>
          <input
            type="number"
            min={1}
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value === "" ? "" : Number(e.target.value))}
            required
            placeholder="Ex: 10"
            className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 focus:border-[#4a1d7a] focus:ring-4 focus:ring-purple-50 outline-none transition-all"
          />
        </div>

        {/* Descrição dos Itens */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-sm text-gray-700 ml-1">Descrição dos Itens</label>
          <textarea
            rows={4}
            value={descricaoAdicional}
            onChange={(e) => setDescricaoAdicional(e.target.value)}
            required
            placeholder="Conte-nos mais (ex: estado de conservação, validade...)"
            className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 focus:border-[#4a1d7a] focus:ring-4 focus:ring-purple-50 outline-none transition-all resize-none"
          />
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-3 mt-2">
          <button
            type="submit"
            disabled={loading || fetchingItems}
            className="bg-[#4a1d7a] hover:bg-[#3a1661] text-white font-black py-4 rounded-2xl shadow-lg shadow-purple-100 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
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