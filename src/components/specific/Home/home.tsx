"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import DonateModal from "@/components/specific/DonateModal";
import { PaginatedResponse } from "@/types/paginated-response";
import { api } from "@/services/api";

type Ong = {
  id: number;
  name: string;
  img: string;
  distance: string;
  category: string; // Categoria da ONG
};

type OngApi = {
  userId: number;
  user: {
    name: string;
  };
};

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&w=600",
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&w=600",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1503457574462-bd27054394c1?auto=format&w=600",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60",
];

// Categorias mockadas para cada ONG
const MOCK_CATEGORIES = [
  "Proteção Animal",
  "Educação",
  "Combate à Fome",
  "Educação",
  "Meio Ambiente",
  "Idosos",
  "Saúde",
  "Proteção Animal"
];

const TAKE = 8;

export default function HomePage() {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const chipsRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOng, setSelectedOng] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>("https://placehold.co/80x80/ddd/aaa.png");

  const [ongs, setOngs] = useState<Ong[]>([]);
  const [page, setPage] = useState(0);

  // Carrega avatar do localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }
  }, []);

  // Fecha o menu quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // ---------------- ONG DO BANCO (COM PAGINAÇÃO) ----------------

  useEffect(() => {
    async function loadOngs() {
      try {
        const res = await api<any>(`/catalog?offset=${page * TAKE}&limit=${TAKE}`);

        const sections = res.data;
        if (!sections || sections.length === 0) return;
        const allOngsFromApi = sections.flatMap((section: any) => section.data);
        const mapped: Ong[] = allOngsFromApi.map((ong: any, index: number) => ({
          id: ong.userId,
          name: ong.name,
          img: PLACEHOLDER_IMAGES[(page * TAKE + index) % PLACEHOLDER_IMAGES.length],
          distance: "7.2 km",
          category: MOCK_CATEGORIES[(page * TAKE + index) % MOCK_CATEGORIES.length], // Adiciona categoria mockada
        }));

        setOngs((prev) => {

          const combined = [...prev, ...mapped];
          const uniqueMap = new Map();

          combined.forEach(ong => {
            uniqueMap.set(ong.id, ong);
          });

          return Array.from(uniqueMap.values());
        });
      } catch (err) {
        console.error("Erro ao buscar ONGs:", err);
      }
    }

    loadOngs();
  }, [page]);

  const categories = [
    "Proteção Animal",
    "Saúde",
    "Combate à Fome",
    "Educação",
    "Meio Ambiente",
    "Idosos",
  ];

  // ============ FILTROS ============

  // Filtra ONGs baseado na pesquisa e categoria selecionada
  const filteredOngs = ongs.filter((ong) => {
    // Filtro de pesquisa por nome
    const matchesSearch = query === "" ||
      ong.name.toLowerCase().includes(query.toLowerCase());

    // Filtro de categoria
    const matchesCategory = selectedCategory === null ||
      ong.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  function openDonateModal(ongId: number) {
    setSelectedOng(ongId);
    setIsModalOpen(true);
  }

  function goToDonateItems() {
    if (!selectedOng) return;

    const ong = filteredOngs.find((o) => o.id === selectedOng);
    if (!ong) return;

    router.push(
      `/donation?ongId=${selectedOng}&ong=${encodeURIComponent(ong.name)}`
    );
  }

  function goToDonateMoney() {
    if (!selectedOng) return;
    setIsModalOpen(false);
    router.push(`/pix?id=${selectedOng}`);
  }

  async function handleLogout() {
    try {
      await api("/auth/logout", {
        method: "POST",
      });

      // Limpa o cookie manualmente também
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, redireciona
      router.push("/login");
    }
  }

  function goToProfile() {
    router.push("/dashboard");
    setIsMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <Image src="/logo_roxa.svg" alt="DoeCerto" width={120} height={120} priority />

        <div className="flex items-center gap-3 relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 active:scale-95 transition"
          >
            <FiMenu size={20} />
          </button>

          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition"
          >
            <img
              src={userAvatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
              <button
                onClick={goToProfile}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
              >
                <FiUser size={18} className="text-purple-600" />
                <span className="font-medium text-gray-700">Meu Perfil</span>
              </button>

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-left"
              >
                <FiLogOut size={18} className="text-red-600" />
                <span className="font-medium text-red-600">Sair</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Search */}
      <div className="px-5">
        <div className="flex items-center gap-3 bg-white shadow-sm rounded-xl px-3 py-2">
          <FiSearch className="text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquise uma ONG, cidade ou causa"
            className="w-full outline-none text-base"
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="mt-4 px-5">
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
          {categories.map((c, i) => {
            const isSelected = selectedCategory === c;
            return (
              <button
                key={i}
                onClick={() => setSelectedCategory(isSelected ? null : c)}
                className={`whitespace-nowrap px-4 py-2 rounded-full border text-base shadow-sm active:scale-95 transition ${isSelected
                  ? "border-purple-700 bg-purple-100 text-purple-800"
                  : "border-gray-200 bg-white text-gray-700"
                  }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contador de resultados */}
      {(query || selectedCategory) && (
        <div className="px-5 mt-3">
          <p className="text-sm text-gray-600">
            {filteredOngs.length} {filteredOngs.length === 1 ? 'ONG encontrada' : 'ONGs encontradas'}
            {query && ` para "${query}"`}
            {selectedCategory && ` em ${selectedCategory}`}
          </p>
        </div>
      )}

      {/* Carrossel */}
      <section className="mt-5 px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            ONGs recomendadas
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar">
          {filteredOngs.length === 0 ? (
            <div className="w-full text-center py-8 text-gray-500">
              Nenhuma ONG encontrada
            </div>
          ) : (
            filteredOngs.map((ong) => (
              <div
                key={`carousel-${ong.id}`}
                onClick={() => router.push(`/ong-public-profile?id=${ong.id}`)}
                className="min-w-[220px] bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer"
              >
                <div className="w-full h-[170px] bg-gray-200">
                  <img src={ong.img} alt={ong.name} className="w-full h-full object-cover" />
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-semibold">{ong.name}</h3>

                  {/* Badge de categoria */}
                  <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {ong.category}
                  </span>

                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <FaMapMarkerAlt size={12} />
                    <span>{ong.distance}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDonateModal(ong.id);
                    }}
                    className="mt-3 w-full bg-[#6B21A8] text-white py-1.5 rounded-lg text-sm font-semibold"
                  >
                    Doar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Lista */}
      <section className="mt-6 px-5 mb-10 space-y-4">

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Mais próximas de você
        </h2>

        <div className="space-y-4"></div>

        {filteredOngs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-gray-600 text-lg">Nenhuma ONG encontrada</p>
            <p className="text-gray-500 text-sm mt-2">
              Tente ajustar sua pesquisa ou filtros
            </p>
          </div>
        ) : (
          filteredOngs.map((ong) => (
            <div
              key={`list-${ong.id}`}
              onClick={() => router.push(`/ong-public-profile?id=${ong.id}`)}
              className="flex items-center gap-4 bg-white rounded-2xl shadow-md p-4 cursor-pointer"
            >
              <div className="w-28 h-28 rounded-xl overflow-hidden">
                <img src={ong.img} alt={ong.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{ong.name}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {ong.category}
                </span>
                <p className="text-sm text-gray-500 mt-1">{ong.distance}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDonateModal(ong.id);
                }}
                className="bg-[#6B21A8] text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Doar
              </button>
            </div>
          ))
        )}
      </section>

      {/* LOAD MAIS (paginação invisível de layout) */}
      <div className="px-5 pb-10">
        <button
          onClick={() => setPage((p) => p + 1)}
          className="w-full bg-white border rounded-xl py-3 shadow-sm text-purple-700 font-semibold"
        >
          Carregar mais ONGs
        </button>
      </div>

      {isModalOpen && (
        <DonateModal
          onClose={() => setIsModalOpen(false)}
          onDonateMoney={goToDonateMoney}
          onDonateItems={goToDonateItems}
        />
      )}
    </div>
  );
}