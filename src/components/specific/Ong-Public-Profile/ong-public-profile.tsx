"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Heart,
  Award,
  Instagram,
  Phone,
  Home,
  Star,
  ArrowLeft,
  Image as ImageIcon,
  MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";
import DonateModal from "@/components/specific/DonateModal";
import { api } from "@/services/api";

interface OngProfileData {
  id: number;
  name: string;
  banner: string;
  logo: string;
  description: string;
  phone: string;
  instagram: string;
  address: string;
  distance: string;
  years: number;
  numberOfRatings: number; 
  rating: number;         
  donations: number; // Campo adicionado para controle local
}

type Props = {
  ongId: number;
};

export default function OngPublicProfile({ ongId }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ong, setOng] = useState<OngProfileData | null>(null);
  
  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadOng() {
      if (!ongId) return;
      
      try {
        const res = await api<any>(`/ongs/${ongId}/profile`);
        const data = res.data;

        if (!data || !data.ong) {
          throw new Error("Resposta inválida da API");
        }

        if (isMounted) {
          setOng({
            id: data.ong.userId,
            name: data.ong.user?.name || "ONG sem nome",
            banner: data.avatarUrl || "", 
            logo: data.avatarUrl || "",
            description: data.bio || "ONG verificada na plataforma.",
            phone: data.contactNumber || "Não informado",
            instagram: data.websiteUrl || "Não informado",
            address: data.address || "Endereço não informado",
            distance: "—",
            years: data.since ? new Date().getFullYear() - Number(data.since) : 0,
            numberOfRatings: data.ong.numberOfRatings || 0,
            rating: data.ong.averageRating || 0,
            donations: 0, 
          });
        }
      } catch (err) {
        console.error("❌ Erro ao buscar ONG:", err);
        if (isMounted) setOng(null);
      }
    }

    loadOng();
    return () => { isMounted = false; };
  }, [ongId]);

  if (!ong) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-2">
           <div className="w-8 h-8 border-4 border-[#4a1d7a] border-t-transparent rounded-full animate-spin"></div>
           <span className="text-gray-500 font-medium">Carregando perfil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-28">
      {/* Banner */}
      <div className="relative w-full h-[220px] xs:h-[260px] sm:h-[340px] bg-gray-200">
        {ong.banner && !bannerError ? (
          <motion.img
            src={ong.banner}
            className="absolute inset-0 w-full h-full object-cover object-top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onError={() => setBannerError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <ImageIcon size={40} className="text-gray-400" />
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full z-30 shadow-md text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>

        <motion.div className="absolute -bottom-8 left-4 xs:left-6 z-50 w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center">
          {ong.logo && !logoError ? (
            <img 
              src={ong.logo} 
              className="w-full h-full object-cover" 
              alt="Logo" 
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-2xl sm:text-4xl font-black text-[#4a1d7a]">
              {ong.name.charAt(0).toUpperCase()}
            </span>
          )}
        </motion.div>
      </div>

      <div className="px-4 xs:px-6 mt-12 xs:mt-14 sm:mt-20">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
          {ong.name}
        </h1>

        <div className="text-gray-500 mt-1 xs:mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm sm:text-lg font-medium">
          <span className="flex items-center gap-1">
            <MapPin size={16} /> {ong.distance}
          </span>
          <span className="flex items-center gap-1">
            <Award size={16} /> {ong.years} anos
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 xs:gap-4">
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

          <div className="p-4 sm:p-6 rounded-2xl bg-white shadow-md border border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-[#4a1d7a] mb-3">Estatísticas</h3>
            <div className="grid grid-cols-3 gap-2 xs:gap-3">
              <div className="p-2 xs:p-3 rounded-xl bg-gray-50 text-center border border-gray-100">
                <MessageSquare size={18} className="mx-auto text-blue-500 mb-1" />
                <p className="text-lg xs:text-xl font-black text-gray-900">{ong.numberOfRatings}</p>
                <p className="text-[9px] xs:text-[10px] text-gray-500 font-bold uppercase tracking-tight">Comentários</p>
              </div>

              <div className="p-2 xs:p-3 rounded-xl bg-gray-50 text-center border border-gray-100">
                <Heart size={18} className="mx-auto text-pink-500 mb-1" fill="currentColor" />
                <p className="text-lg xs:text-xl font-black text-gray-900">{ong.donations}</p>
                <p className="text-[9px] xs:text-[10px] text-gray-500 font-bold uppercase tracking-tight">Doações</p>
              </div>

              <div className="p-2 xs:p-3 rounded-xl bg-yellow-50 text-center border border-yellow-100">
                <div className="flex justify-center gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={10}
                      fill={s <= Math.round(ong.rating) ? "#facc15" : "transparent"}
                      className={s <= Math.round(ong.rating) ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-lg xs:text-xl font-black text-gray-900">{ong.rating.toFixed(1)}</p>
                <p className="text-[9px] xs:text-[10px] text-yellow-700 font-bold uppercase tracking-tight">Nota</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          onDonateItems={() =>
            router.push(`/donation?ongId=${ong.id}&ong=${encodeURIComponent(ong.name)}`)
          }
        />
      )}
    </div>
  );
}