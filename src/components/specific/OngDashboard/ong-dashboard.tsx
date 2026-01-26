"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Heart, Award, Star, Instagram, Phone, Home, CheckCircle2, Pencil, History, X, FileText, Package, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Ong } from "@/data/ongs";

type Props = {
  ong: Ong;
};

interface DonationHistory {
  id: string;
  type: "money" | "items";
  value?: string;
  items?: { name: string; qty: string }[];
  date: string;
  status: "pending" | "confirmed";
  receiptUrl?: string;
}

export default function OngDashboard({ ong }: Props) {
  const router = useRouter();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const rating = 4; 
  const historyData: DonationHistory[] = [
    { id: "1", type: "money", value: "R$ 50,00", date: "25/01/2026", status: "pending", receiptUrl: "#" },
    { id: "3", type: "items", items: [{ name: "Cobertores", qty: "5 unidades" }], date: "22/01/2026", status: "pending" },
    { id: "2", type: "items", items: [{ name: "Ração Gato", qty: "10kg" }], date: "20/01/2026", status: "confirmed" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      {/* Banner e Header */}
      <div className="relative w-full h-[340px]">
        <motion.img
          src={ong.banner}
          className="absolute inset-0 w-full h-full object-cover object-top"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        />
        <button onClick={() => router.back()} className="absolute top-4 left-4 bg-white/90 p-2 rounded-full z-50 shadow-md text-gray-900 font-bold"> ← </button>

        <motion.button 
          onClick={() => router.push(`/admin/edit/${ong.id}`)}
          className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white border-2 border-[#4a1d7a] px-4 py-2 rounded-xl font-bold text-[#4a1d7a] shadow-sm hover:bg-purple-50 transition-colors"
        >
          <Pencil size={18} /> Editar Perfil
        </motion.button>

        <motion.div className="absolute -bottom-12 left-6 z-50 w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white">
          <img src={ong.logo} className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Conteúdo Principal */}
      <div className="px-6 mt-20 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{ong.name}</h1>
          
          {/* Selo de Verificado - Estilo Instagram  */}
          <div className="relative flex items-center justify-center">
            <CheckCircle2 size={26} className="text-blue-500 fill-blue-500" strokeWidth={1.5} />
            <div className="absolute w-2 h-2 bg-white rounded-full z-[-1]" /> 
          </div>
        </div>

        <div className="text-gray-600 mt-2 flex gap-4 text-base md:text-lg">
          <span className="flex items-center gap-1"><MapPin size={18}/> {ong.distance}</span>
          <span className="flex items-center gap-1"><Award size={18}/> {ong.years} anos</span>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6">
          <div className="p-6 rounded-2xl bg-white shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold text-[#4a1d7a] mb-3">Sobre</h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">{ong.description}</p>
            
            <div className="mt-6 pt-6 border-t border-gray-50 space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={20} className="text-[#4a1d7a]" />
                <span className="text-base font-medium md:text-lg">{ong.phone}</span>
              </div>

              {/* Ícone Instagram */}
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-0.5 rounded-md bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                   <Instagram size={18} className="text-white" />
                </div>
                <span className="text-base font-medium md:text-lg">{ong.instagram}</span>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <Home size={20} className="text-blue-600 mt-1" />
                <span className="text-base font-medium md:text-lg leading-snug">{ong.address}</span>
              </div>
            </div>
          </div>

          {/* Seção de Gestão e Estatísticas */}
          <div className="p-6 rounded-2xl bg-white shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-[#4a1d7a] mb-4">Gestão e Estatísticas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl bg-gray-50 text-center border border-gray-200 flex flex-col items-center justify-center min-h-[110px]">
                <Heart size={22} className="text-pink-500 mb-1" fill="currentColor" />
                <p className="text-xl font-bold text-gray-900">{ong.donations}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Doações</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 text-center border border-gray-200 flex flex-col items-center justify-center min-h-[110px]">
                <div className="flex justify-center gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill={s <= rating ? "#facc15" : "transparent"} className={s <= rating ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-xl font-bold text-gray-900">{rating}.0</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Avaliação Geral</p>
              </div>

              <button 
                onClick={() => setIsHistoryOpen(true)}
                className="p-4 rounded-xl bg-purple-50 text-center border border-purple-100 hover:bg-purple-100 transition-all flex flex-col items-center justify-center min-h-[110px]"
              >
                <History size={22} className="text-[#4a1d7a] mb-1" />
                <p className="text-lg font-bold text-[#4a1d7a]">Histórico</p>
                <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Ver Doações</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Histórico */}
      <AnimatePresence>
        {isHistoryOpen && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm text-gray-900">
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full max-w-lg rounded-t-[32px] md:rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900">Doações Recebidas</h3>
                <button onClick={() => setIsHistoryOpen(false)} className="p-2 bg-white rounded-full shadow-sm text-gray-900"><X size={20}/></button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {historyData.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {item.type === "money" ? (
                          <div className="p-2.5 bg-green-50 rounded-lg text-green-600"><Heart size={20} fill="currentColor"/></div>
                        ) : (
                          <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600"><Package size={20}/></div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{item.type === "money" ? `Doação ${item.value}` : "Doação de Itens"}</p>
                          <p className="text-sm text-gray-400 font-medium">{item.date}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.status === 'confirmed' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                        {item.status === 'confirmed' ? 'Recebido' : 'Pendente'}
                      </div>
                    </div>
                    {item.type === "items" && (
                      <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                        {item.items?.map((prod, idx) => (
                          <div key={idx} className="flex justify-between text-base">
                            <span className="text-gray-600">{prod.name}</span>
                            <span className="font-bold text-gray-900">{prod.qty}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex gap-2">
                      {item.type === "money" && <button className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-[#4a1d7a] py-2 bg-purple-50 rounded-lg"><FileText size={14}/> Comprovante</button>}
                      {item.status === "pending" && <button className="flex-1 text-xs font-bold text-white py-2 bg-[#4a1d7a] rounded-lg shadow-sm">Confirmar Recebimento</button>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}