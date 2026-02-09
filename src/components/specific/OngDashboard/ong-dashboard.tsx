"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Heart,
  Award,
  X,
  Instagram,
  Phone,
  Home,
  Star,
  Pencil,
  History,
  Package,
  CheckCircle2,
  Clock,
  FileText,
  ArrowLeft,
  Loader2,
  Camera,
  AlertCircle,
  ArrowRight,
  Tag,
  MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";
import { OngMaterialDonationCard } from "@/components/ui/OngMaterialDonationCard";
import { OngsProfileService } from "@/services/ongs-profile.service";
import { api } from "@/services/api";

interface DonationHistory {
  id: string;
  type: "money" | "items";
  value?: string;
  items?: { name: string; qty: string }[];
  date: string;
  status: "pending" | "confirmed";
  receiptUrl?: string;
}

interface OngDashboardProps {
  ong?: any;
}

export default function OngDashboard({ ong: initialOng }: OngDashboardProps) {
  const router = useRouter();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ong, setOng] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const profileData = await OngsProfileService.getMyProfile();

        if (isMounted) {
          setOng(profileData);

          if (profileData.id) {
            const reviewsRes = await api(`/ongs/${profileData.id}/ratings`);
            setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, []);

  // Dados fictícios para o histórico (exemplo)
  const historyData: DonationHistory[] = [
    {
      id: "1",
      type: "money",
      value: "R$ 50,00",
      date: "25/01/2026",
      status: "pending",
      receiptUrl: "#",
    },
    {
      id: "2",
      type: "items",
      items: [
        { name: "Ração Gato", qty: "10kg" },
        { name: "Areia Sanitária", qty: "2 sacos" }
      ],
      date: "20/01/2026",
      status: "confirmed",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#4a1d7a]" size={40} />
      </div>
    );
  }

  if (!ong || !ong.about) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-[#4a1d7a]" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Complete seu Perfil</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sua ONG ainda não possui as informações configuradas. Complete seu perfil para começar a receber doações.
          </p>
          <button
            onClick={() => router.push('/ong-profilesetup')}
            className="w-full bg-[#4a1d7a] text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2"
          >
            Configurar agora <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-32">
      {/* Header / Banner */}
      <div className="relative w-full h-[240px] sm:h-[340px] bg-gray-200 flex items-center justify-center">
        {ong.bannerUrl ? (
          <motion.img
            src={ong.bannerUrl}
            className="absolute inset-0 w-full h-full object-cover object-top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            alt="Banner da ONG"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Camera size={48} strokeWidth={1.5} />
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full z-30 shadow-md text-gray-900 hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <motion.button
          onClick={() => router.push(`/ong-profilesetup`)}
          className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white border-2 border-[#4a1d7a] px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-[#4a1d7a] shadow-sm hover:bg-purple-50 transition-colors text-xs sm:text-base"
        >
          <Pencil size={16} /> <span>Editar Perfil</span>
        </motion.button>

        <motion.div className="absolute -bottom-10 left-6 z-50 w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white flex items-center justify-center">
          {ong.avatarUrl ? (
            <img src={ong.avatarUrl} className="w-full h-full object-cover" alt={ong.name} />
          ) : (
            <div className="w-full h-full bg-[#4a1d7a] flex items-center justify-center">
              <span className="text-white text-4xl sm:text-5xl font-black">{ong.name?.charAt(0) || 'O'}</span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="px-4 sm:px-6 mt-16 sm:mt-20">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900">{ong.name || "Minha ONG"}</h1>
        
        {/* --- LOCALIZAÇÃO E ANOS --- */}
        <div className="text-gray-500 mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm sm:text-lg font-medium">
          <span className="flex items-center gap-1.5">
            <MapPin size={18} className="text-red-400" /> {ong.address?.city || "Localização não definida"}
          </span>
          <span className="flex items-center gap-1.5">
            <Award size={18} className="text-blue-400" /> {ong.displayYears || "Tempo não informado"}
          </span>
        </div>

        {/* --- CATEGORIAS ADICIONADAS AQUI ABAIXO DO NOME --- */}
        {ong.categories && ong.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {ong.categories.map((cat: any, idx: number) => (
              <span key={cat.id || idx} className="px-3 py-1 bg-purple-50 text-[#4a1d7a] border border-purple-100 text-[11px] sm:text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm">
                <Tag size={12} className="text-purple-400" />
                {cat.name || cat}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-white shadow-md border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-[#4a1d7a]">Sobre</h2>
            <p className="mt-3 text-gray-700 text-sm sm:text-lg leading-relaxed">
              {ong.about || "Nenhuma descrição informada ainda."}
            </p>

            <div className="mt-5 pt-5 border-t border-gray-50 space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-[#4a1d7a]" />
                <span className="text-sm sm:text-base font-bold">{ong.contactNumber || "Não informado"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Instagram size={18} className="text-pink-600" />
                <span className="text-sm sm:text-base font-bold text-gray-900 break-all">
                  {ong.websiteUrl || "Não informado"}
                </span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <Home size={18} className="text-blue-600 mt-0.5" />
                <span className="text-sm sm:text-base font-bold">
                  {ong.address ? `${ong.address.city} - ${ong.address.state}` : "Endereço não informado"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-white shadow-md border border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-[#4a1d7a] mb-4">Gestão e Estatísticas</h3>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="flex-1 min-w-[100px] p-3 sm:p-4 rounded-lg bg-gray-50 text-center border border-gray-200">
                <Heart size={20} className="mx-auto text-pink-500" fill="currentColor" />
                <p className="mt-1 text-xl sm:text-2xl font-black text-gray-900">{ong.stats?.donations || 0}</p>
                <p className="text-[10px] sm:text-sm text-gray-500 font-bold uppercase tracking-tight">Doações</p>
              </div>

              <button
                onClick={() => setIsReviewsOpen(true)}
                className="flex-1 min-w-[100px] p-3 sm:p-4 rounded-lg bg-yellow-50 text-center border border-yellow-100 hover:bg-yellow-100 transition-all cursor-pointer"
              >
                <div className="flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      fill={s <= Math.floor(ong.stats?.ratingAverage || 0) ? "#facc15" : "transparent"}
                      className={s <= Math.floor(ong.stats?.ratingAverage || 0) ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xl sm:text-2xl font-black text-gray-900">{(ong.stats?.ratingAverage || 0).toFixed(1)}</p>
                <p className="text-[10px] sm:text-sm text-yellow-700 font-bold uppercase tracking-tight underline">Avaliações</p>
              </button>

              <button
                onClick={() => setIsHistoryOpen(true)}
                className="w-full md:w-auto md:flex-1 p-3 sm:p-4 rounded-lg bg-purple-50 text-center border border-purple-100 hover:bg-purple-100 transition-all"
              >
                <History size={20} className="mx-auto text-[#4a1d7a]" />
                <p className="mt-1 text-base sm:text-xl font-bold text-[#4a1d7a]">Histórico</p>
                <p className="text-[10px] sm:text-sm text-purple-600 font-bold uppercase tracking-tight">Ver Doações</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAIS DE HISTÓRICO E AVALIAÇÕES --- */}
      <AnimatePresence>
        {isHistoryOpen && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full max-w-lg rounded-t-[24px] md:rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold">Doações Recebidas</h3>
                <button onClick={() => setIsHistoryOpen(false)} className="p-2 bg-white rounded-full shadow-sm"><X size={18} /></button>
              </div>
              <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {historyData.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {item.type === "money" ? <Heart size={18} className="text-green-500" fill="currentColor" /> : <Package size={18} className="text-blue-500" />}
                        <div>
                          <p className="font-bold text-gray-900">{item.type === "money" ? `Doação ${item.value}` : "Doação de Itens"}</p>
                          <p className="text-xs text-gray-400">{item.date}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${item.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.status === 'confirmed' ? 'Recebido' : 'Pendente'}
                      </span>
                    </div>
                    {item.type === "items" && item.items && <OngMaterialDonationCard items={item.items} />}
                    <div className="mt-4 pt-3 border-t border-gray-50 flex gap-2">
                      <button className="flex-1 py-2 bg-purple-50 text-[#4a1d7a] text-xs font-bold rounded-lg">Comprovante</button>
                      {item.status === "pending" && <button className="flex-1 py-2 bg-[#4a1d7a] text-white text-xs font-bold rounded-lg">Confirmar</button>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReviewsOpen && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm text-gray-900">
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full max-w-lg rounded-t-[24px] md:rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-yellow-50">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Star className="text-yellow-500" fill="currentColor" size={20} /> O que dizem sobre nós
                </h3>
                <button onClick={() => setIsReviewsOpen(false)} className="p-2 bg-white rounded-full shadow-sm text-gray-900"><X size={18} /></button>
              </div>
              <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {reviews.length > 0 ? reviews.map((r, index) => (
                  <div key={r.id || index} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-[#4a1d7a]">{r.donor?.user?.name || "Doador"}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} fill={i < (r.score || 0) ? "#facc15" : "transparent"} className={i < (r.score || 0) ? "text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">"{r.comment || "Sem comentário."}"</p>
                  </div>
                )) : (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Sua ONG ainda não recebeu avaliações.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}