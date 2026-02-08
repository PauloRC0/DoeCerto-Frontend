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
  Tag
} from "lucide-react";
import { useRouter } from "next/navigation";
import { OngProfileService } from "@/services/ongs-profile.service";

interface DonationHistory {
  id: string;
  type: "money" | "items";
  value?: string;
  items?: { name: string; qty: string }[];
  date: string;
  status: "pending" | "confirmed";
  receiptUrl?: string;
}

// Interface para aceitar a prop vinda do page.tsx e resolver o erro de build
interface OngDashboardProps {
  ong?: any;
}

export default function OngDashboard({ ong: initialOng }: OngDashboardProps) {
  const router = useRouter();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(!initialOng);
  const [ong, setOng] = useState<any>(initialOng || null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (initialOng && initialOng.about && isMounted) {
        setOng(initialOng);
        setLoading(false);
        return;
      }

      try {
        const data = await OngProfileService.getMyProfile();
        if (isMounted) setOng(data);
      } catch (error) {
        console.error("Erro no APK:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProfile();
    return () => { isMounted = false; };
  }, [initialOng]);

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
            Sua ONG ainda não possui as informações configuradas. Complete seu perfil para começar a receber doações e ganhar visibilidade.
          </p>
          <button
            onClick={() => router.push('/ong-profilesetup')}
            className="w-full bg-[#4a1d7a] text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 hover:bg-[#3d1864] transition-all flex items-center justify-center gap-2"
          >
            Configurar agora <ArrowRight size={20} />
          </button>
          <button
            onClick={() => router.back()}
            className="mt-4 text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors"
          >
            Voltar depois
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
            <img
              src={ong.avatarUrl}
              className="w-full h-full object-cover"
              alt={ong.name}
            />
          ) : (
            <div className="w-full h-full bg-[#4a1d7a] flex items-center justify-center">
              <span className="text-white text-4xl sm:text-5xl font-black">{ong.initial || 'O'}</span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="px-4 sm:px-6 mt-16 sm:mt-20">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900">{ong.name || "Minha ONG"}</h1>
        <div className="text-gray-600 mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm sm:text-lg font-medium">
          <span className="flex items-center gap-1.5">
            <MapPin size={18} /> {ong.address?.city || "Localização não definida"}
          </span>
          <span className="flex items-center gap-1.5">
            <Award size={18} /> {ong.displayYears || "Tempo não informado"}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-white shadow-md border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-[#4a1d7a]">Sobre</h2>
            <p className="mt-3 text-gray-700 text-sm sm:text-lg leading-relaxed">
              {ong.about || "Nenhuma descrição informada ainda."}
            </p>

            {ong.categories && ong.categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {ong.categories.map((cat: any) => (
                  <span
                    key={cat.id}
                    className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-[#4a1d7a] text-xs sm:text-sm font-bold rounded-full border border-purple-100"
                  >
                    <Tag size={12} />
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

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

              <div className="flex-1 min-w-[100px] p-3 sm:p-4 rounded-lg bg-yellow-50 text-center border border-yellow-100">
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
                <p className="text-[10px] sm:text-sm text-yellow-700 font-bold uppercase tracking-tight">Avaliação</p>
              </div>

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

      <AnimatePresence>
        {isHistoryOpen && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm text-gray-900">
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full max-w-lg rounded-t-[24px] md:rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Doações Recebidas</h3>
                <button onClick={() => setIsHistoryOpen(false)} className="p-2 bg-white rounded-full shadow-sm text-gray-900"><X size={18} /></button>
              </div>

              <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {historyData.map((item) => (
                  <div key={item.id} className="p-3 sm:p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {item.type === "money" ? (
                          <div className="p-2 bg-green-50 rounded-lg text-green-600"><Heart size={18} fill="currentColor" /></div>
                        ) : (
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Package size={18} /></div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-sm sm:text-lg">{item.type === "money" ? `Doação ${item.value}` : "Doação de Itens"}</p>
                          <p className="text-[10px] sm:text-sm text-gray-400 font-medium">{item.date}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${item.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {item.status === 'confirmed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {item.status === 'confirmed' ? 'Recebido' : 'Pendente'}
                      </div>
                    </div>

                    {item.type === "items" && (
                      <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                        {item.items?.map((prod, idx) => (
                          <div key={idx} className="flex justify-between text-sm sm:text-base text-gray-900">
                            <span className="text-gray-600">{prod.name}</span>
                            <span className="font-bold">{prod.qty}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold text-[#4a1d7a] py-2 bg-purple-50 rounded-lg">
                        <FileText size={14} /> Comprovante
                      </button>
                      {item.status === "pending" && (
                        <button className="flex-1 text-[10px] sm:text-xs font-bold text-white py-2 bg-[#4a1d7a] rounded-lg shadow-sm">
                          Confirmar
                        </button>
                      )}
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