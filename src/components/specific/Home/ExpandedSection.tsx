"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiGlobe, FiMapPin, FiStar, FiGift, FiCalendar } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getCatalog } from "@/services/categories.service";
import { OngsProfileService } from "@/services/ongs-profile.service";
import DonateModal from "@/components/specific/DonateModal";

type Ong = {
  id: number;
  name: string;
  img: string;
  distance: string | number;
  categories: string[];
  donationCount?: number;
  averageRating?: number;
  numberOfRatings?: number;
  formattedDate?: string;
};

interface ExpandedSectionProps {
  type: string;
  title: string;
  onBack: () => void;
}

function OngLogo({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className={`${className} bg-gray-200 flex flex-col items-center justify-center text-gray-400 gap-1`}>
        <FiGlobe size={24} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">ONG</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={`${className} object-cover`} onError={() => setError(true)} />;
}

export default function ExpandedSection({ type, title, onBack }: ExpandedSectionProps) {
  const router = useRouter();

  const [ongs, setOngs] = useState<Ong[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOng, setSelectedOng] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const TAKE = 12;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCatalog({ limit: TAKE, offset: page * TAKE });
      if (Array.isArray(data)) {
        const targetSection = data.find((s: any) => s.type === type);
        if (targetSection && targetSection.items) {
          const mapped = targetSection.items.map((ong: any) => ({
            id: ong.userId || ong.id,
            name: ong.name || (ong.user && ong.user.name) || "ONG",
            img: OngsProfileService._formatImageUrl(ong.avatarUrl || ong.profile?.avatarUrl || ong.user?.avatarUrl),
            distance: ong.distance,
            categories: ong.categories?.map((c: any) => c.name) || [],
            donationCount: ong.donationCount,
            averageRating: ong.averageRating,
            numberOfRatings: ong.numberOfRatings,
            formattedDate: ong.formattedDate,
          }));
          setOngs(mapped);
        } else {
          setOngs([]);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar secção expandida:", err);
    } finally {
      setLoading(false);
    }
  }, [type, page]);

  useEffect(() => {
    if (type) {
      loadData();
    }
  }, [type, loadData, page]);

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gray-50 overflow-y-auto">
      {/* HEADER FIXO */}
      <header className="bg-white shadow-sm px-5 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Voltar"
        >
          <FiArrowLeft size={22} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">{title}</h1>
      </header>

      {/* CONTEÚDO EM GRELHA */}
      <main className="px-5 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
            <p className="text-sm text-gray-500 font-medium">A carregar ONGs...</p>
          </div>
        ) : ongs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>Nenhuma ONG encontrada nesta categoria.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 justify-center">
              {ongs.map((ong) => (
                <div
                  key={ong.id}
                  onClick={() => router.push(`/ong-public-profile?id=${ong.id}`)}
                  className="min-w-[220px] max-w-[320px] bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer flex flex-col"
                >
                  <OngLogo src={ong.img} alt={ong.name} className="w-full h-[170px]" />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h3 className="text-sm font-semibold truncate">{ong.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ong.categories.slice(0, 1).map((cat, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-100 text-[10px] font-bold rounded-full truncate max-w-[120px]">
                          {cat}
                        </span>
                      ))}
                      {ong.categories.length > 1 && (
                        <span className="text-[10px] text-gray-400 font-medium self-center">+{ong.categories.length - 1}</span>
                      )}
                    </div>
                    {/* Campo personalizado por tipo de seção */}
                    <div className="flex items-center gap-2 text-gray-500 mt-2">
                      {type === "nearby" && (
                        <>
                          <FiMapPin size={14} />
                          <span className="text-xs">
                            {(() => {
                              const dist = ong.distance;
                              if (typeof dist === "number") {
                                return `${dist.toFixed(2)} km`;
                              }
                              if (typeof dist === "string") {
                                const parsed = Number(dist);
                                if (!isNaN(parsed)) {
                                  return `${parsed.toFixed(2)} km`;
                                }
                                return dist;
                              }
                              return dist ?? "";
                            })()}
                          </span>
                        </>
                      )}
                      {type === "topRated" && (
                        <>
                          <FiStar size={14} className="text-yellow-500" />
                          <span className="text-xs font-semibold">{ong.averageRating ?? 0} ({ong.numberOfRatings ?? 0} avaliações)</span>
                        </>
                      )}
                      {type === "newest" || type === "oldest" ? (
                        <>
                          <FiCalendar size={14} />
                          <span className="text-xs">{ong.formattedDate ?? ""}</span>
                        </>
                      ) : null}
                      {type === "mostDonated" && (
                        <>
                          <FiGift size={14} />
                          <span className="text-xs">{ong.donationCount ?? 0} doações recebidas</span>
                        </>
                      )}
                      {type === "leastDonated" && (
                        <>
                          <FiGift size={14} />
                          <span className="text-xs">{ong.donationCount ?? 0} doações recebidas</span>
                        </>
                      )}
                      {/* Fallback para outros tipos */}
                      {!["nearby","topRated","newest","oldest","mostDonated","leastDonated"].includes(type) && (
                        <>
                          <FaMapMarkerAlt size={12} />
                          <span className="text-xs">{ong.distance}</span>
                        </>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOng(ong.id);
                        setIsModalOpen(true);
                      }}
                      className="mt-3 w-full bg-[#6B21A8] text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-purple-800 transition"
                    >
                      Doar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Botões de paginação */}
            <div className="flex gap-3 justify-center mt-8">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className={`px-5 py-3 rounded-xl border shadow-sm font-semibold transition ${page === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-purple-700 border-purple-100 hover:bg-purple-50'}`}
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-5 py-3 rounded-xl border border-purple-100 shadow-sm bg-white text-purple-700 font-semibold hover:bg-purple-50 transition"
                disabled={ongs.length < TAKE}
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </main>

      {/* MODAL DE DOAÇÃO */}
      {isModalOpen && (
        <DonateModal
          onClose={() => setIsModalOpen(false)}
          onDonateMoney={() => router.push(`/pix?id=${selectedOng}`)}
          onDonateItems={() => router.push(`/donation?ongId=${selectedOng}&ong=Doação`)}
        />
      )}
    </div>
  );
}