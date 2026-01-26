"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Heart, Award, Star, Instagram, Phone, Home, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Ong } from "@/data/ongs";
import DonateModal from "@/components/specific/DonateModal";

type Props = {
  ong: Ong;
};

export default function OngPublicProfile({ ong }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulação da nota 
  const rating = 4; 

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-32">
      {/* Banner e Header */}
      <div className="relative w-full h-[340px]">
        <motion.img
          src={ong.banner}
          className="absolute inset-0 w-full h-full object-cover object-top"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        />
        <button onClick={() => router.back()} className="absolute top-4 left-4 bg-white/90 p-2 rounded-full z-50 shadow-md text-gray-900 font-bold"> ← </button>

        <motion.div className="absolute -bottom-12 left-6 z-50 w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white">
          <img src={ong.logo} className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Conteúdo Principal */}
      <div className="px-6 mt-20 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{ong.name}</h1>
          {/* Selo de Verificado - Estilo Instagram */}
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
          {/* Card Sobre */}
          <div className="p-6 rounded-2xl bg-white shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold text-[#4a1d7a] mb-3">Sobre</h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">{ong.description}</p>
            
            <div className="mt-6 pt-6 border-t border-gray-50 space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={20} className="text-[#4a1d7a]" />
                <span className="text-base font-medium md:text-lg">{ong.phone}</span>
              </div>
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

          {/* Estatísticas e Avaliação  */}
          <div className="p-6 rounded-2xl bg-white shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-[#4a1d7a] mb-4">Confiança da Comunidade</h3>
            <div className="flex gap-4">
              {/* Card Doações */}
              <div className="flex-1 p-4 rounded-lg bg-gray-50 text-center border border-gray-200">
                <Heart size={22} className="mx-auto text-pink-500" fill="currentColor" />
                <p className="mt-2 text-xl font-bold">{ong.donations}</p>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Doações</p>
              </div>

              {/* Card de Avaliação */}
              <div className="flex-1 p-4 rounded-lg bg-gray-50 text-center border border-gray-200">
                <div className="flex justify-center gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      size={14} 
                      fill={s <= rating ? "#facc15" : "transparent"} 
                      className={s <= rating ? "text-yellow-400" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <p className="text-xl font-bold text-gray-900">{rating}.0</p>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Avaliação Geral</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Doar */}
      <div className="fixed bottom-4 left-0 right-0 px-6 z-[60]">
        <button onClick={() => setIsModalOpen(true)} className="w-full py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-xl active:scale-95 transition-transform">
          Doar para esta ONG
        </button>
      </div>

      {/* Modal de Doar */}
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