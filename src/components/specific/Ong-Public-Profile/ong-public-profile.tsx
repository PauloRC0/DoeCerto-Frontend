"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Heart, 
  Award, 
  Instagram,
  Phone,
  Home,
  Star,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Ong } from "@/data/ongs";
import DonateModal from "@/components/specific/DonateModal";

type Props = {
  ong: Ong;
};

export default function OngPublicProfile({ ong }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rating = 4.8;

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-28">
      {/* Banner: Altura reduzida em telas pequenas (220px -> 340px) */}
      <div className="relative w-full h-[220px] xs:h-[260px] sm:h-[340px]">
        <motion.img
          src={ong.banner}
          className="absolute inset-0 w-full h-full object-cover object-top"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        />
        {/* Botão Voltar */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full z-30 shadow-md text-gray-900 hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        
        {/* Logo: Redimensionada para não ocupar metade da tela (w-24 -> w-36) */}
        <motion.div className="absolute -bottom-8 left-4 xs:left-6 z-50 w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white">
          <img src={ong.logo} className="w-full h-full object-cover" alt="Logo" />
        </motion.div>
      </div>

      {/* Conteúdo: Margens e paddings reduzidos em telas pequenas */}
      <div className="px-4 xs:px-6 mt-12 xs:mt-14 sm:mt-20">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
          {ong.name}
        </h1>
        
        <div className="text-gray-500 mt-1 xs:mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm sm:text-lg font-medium">
          <span className="flex items-center gap-1"><MapPin size={16} /> {ong.distance}</span>
          <span className="flex items-center gap-1"><Award size={16} /> {ong.years} anos</span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 xs:gap-4">
          {/* Card Sobre: Padding menor (p-4) em mobile */}
          <div className="p-4 sm:p-6 rounded-2xl bg-white shadow-md border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-[#4a1d7a]">Sobre</h2>
            <p className="mt-2 text-gray-700 text-sm xs:text-base sm:text-lg leading-relaxed">
              {ong.description}
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-50 space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={16} className="text-[#4a1d7a] shrink-0" />
                <span className="text-xs xs:text-sm sm:text-base font-bold">{ong.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Instagram size={16} className="text-pink-600 shrink-0" />
                <span className="text-xs xs:text-sm sm:text-base font-bold">{ong.instagram}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <Home size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <span className="text-xs xs:text-sm sm:text-base font-bold leading-tight">{ong.address}</span>
              </div>
            </div>
          </div>

          {/* Estatísticas: Ajuste de colunas e fonte interna */}
          <div className="p-4 sm:p-6 rounded-2xl bg-white shadow-md border border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-[#4a1d7a] mb-3">Estatísticas</h3>
            <div className="flex gap-3">
              <div className="flex-1 p-3 rounded-xl bg-gray-50 text-center border border-gray-100">
                <Heart size={20} className="mx-auto text-pink-500 mb-1" fill="currentColor" />
                <p className="text-xl sm:text-2xl font-black text-gray-900">{ong.donations}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-tight">Doações</p>
              </div>

              <div className="flex-1 p-3 rounded-xl bg-yellow-50 text-center border border-yellow-100">
                <div className="flex justify-center gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} fill={s <= Math.round(rating) ? "#facc15" : "transparent"} className={s <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                </div>
                <p className="text-xl sm:text-2xl font-black text-gray-900">{rating.toFixed(1)}</p>
                <p className="text-[10px] sm:text-xs text-yellow-700 font-bold uppercase tracking-tight">Avaliação</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Fixo: Altura e fonte reduzidas para não "comer" a tela */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white to-transparent z-[60]">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full py-3.5 xs:py-4 rounded-xl text-base xs:text-lg font-black text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg active:scale-95 transition-transform"
        >
          Doar para esta ONG
        </button>
      </div>

      {isModalOpen && (
        <DonateModal
          onClose={() => setIsModalOpen(false)}
          onDonateMoney={() => router.push(`/pix?id=${ong.id}`)}
          onDonateItems={() => router.push(`/donation?ongId=${ong.id}&ong=${encodeURIComponent(ong.name)}`)}
        />
      )}
    </div>
  );
}