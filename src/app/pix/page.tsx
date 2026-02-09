"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FaCopy,
  FaKey,
  FaBuilding,
  FaIdCard,
  FaDollarSign,
  FaCheckCircle,
} from "react-icons/fa";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState, Suspense, useEffect } from "react";
import { OngsProfileService } from "@/services/ongs-profile.service";
import { api } from "@/services/api";

function PixPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ongId = searchParams.get("id");

  const [ongData, setOngData] = useState<any>(null);
  const [bankData, setBankData] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [valor, setValor] = useState("20");
  const valoresRapidos = ["5", "10", "20", "50", "100"];

  useEffect(() => {
    async function fetchData() {
      if (!ongId) return;
      try {
        setInitialLoading(true);
        const idNum = Number(ongId);

        // 1. Busca perfil da ONG
        const profile = await OngsProfileService.getPublicProfile(idNum).catch(() => null);
        if (profile) setOngData(profile);

        try {
          const response = await api(`/ongs/bank-account/${idNum}`);
          const data = response.data;

          setBankData(Array.isArray(data) ? data[0] : data);
        } catch (e: any) {
          console.error("Erro ao buscar banco:", e);

          if (e.response?.status === 401) {
            alert("Sua sessão expirou. Por favor, faça login novamente.");
            router.push("/login");
          }
        }
      } finally {
        setInitialLoading(false);
      }
    }
    fetchData();
  }, [ongId, router]);

  const copyKey = () => {
    const textToCopy = bankData?.pixKey || "";
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleConfirmarDoacao = async () => {
    if (!file || !ongId) {
      alert("Por favor, anexe o comprovante.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("ongId", ongId);
      formData.append("donationType", "monetary");
      formData.append("monetaryAmount", valor);
      formData.append("monetaryCurrency", "BRL");
      formData.append("proofFile", file);


      await api("/donations", {
        method: "POST",
        body: formData,
      });

      setShowPopup(true);
    } catch (error: any) {
      console.error("Erro ao doar:", error);
      const msg = error.message || "Erro ao processar doação.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  const pixKeyVisual = bankData?.pixKey || "Chave não configurada";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixKeyVisual)}`;

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#3b1a66] pb-12 font-sans relative">
      <div className="pt-6 px-4 lg:absolute lg:top-8 lg:left-12 z-10">
        <button onClick={() => router.back()} className="bg-white/90 p-2 rounded-full shadow-md text-gray-900 hover:bg-white transition-colors">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="w-full flex flex-col items-center pt-4 mb-6 lg:mb-10 lg:pt-8">
        <h1 className="text-lg lg:text-xl font-black text-[#4A1D96] uppercase tracking-widest">Doação em dinheiro</h1>
        <div className="h-1 w-8 bg-purple-600 rounded-full mt-2"></div>
      </div>

      <main className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-5 lg:p-8 shadow-xl shadow-purple-100/50 border border-purple-50">
              <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
                <div className="bg-purple-600 p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-lg shadow-purple-200">
                  <FaBuilding className="text-white text-xl lg:text-2xl" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg lg:text-2xl font-black text-[#3b1a66] leading-tight truncate">{ongData?.name || "Carregando..."}</h2>
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] lg:text-sm mt-1">
                    <FaIdCard className="flex-shrink-0" />
                    <span className="truncate">
                      {ongData?.cnpj || bankData?.cnpj || bankData?.ong?.cnpj || "CNPJ não informado"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 lg:gap-y-6 gap-x-4 border-t border-gray-100 pt-6 lg:pt-8">
                {[
                  { label: "Instituição", value: bankData?.bankName },
                  { label: "Agência", value: bankData?.agencyNumber },
                  { label: "Conta", value: bankData?.accountNumber },
                  { label: "Tipo", value: bankData?.accountType }
                ].map((item, idx) => (
                  <div key={idx} className="min-w-0">
                    <p className="text-gray-400 uppercase text-[9px] lg:text-[10px] font-black tracking-widest mb-1 truncate">{item.label}</p>
                    <p className="font-bold text-xs lg:text-sm truncate text-[#3b1a66]">{item.value || "---"}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 shadow-xl shadow-purple-100/50 border border-purple-50 flex flex-col items-center justify-center">
              <p className="font-black text-[#3b1a66] mb-4 uppercase text-[10px] lg:text-xs tracking-widest">Escaneie o QR Code</p>
              <div className="bg-purple-50 p-4 lg:p-6 rounded-2xl lg:rounded-3xl border-2 border-purple-100 mb-6">
                <Image src={qrCodeUrl} alt="QR Code PIX" width={150} height={150} className="rounded-xl lg:w-[180px]" unoptimized />
              </div>

              <div className="w-full">
                <div className={`flex items-center justify-between bg-gray-50 p-3 lg:p-4 rounded-xl lg:rounded-2xl border-2 transition-all duration-300 ${copied ? 'border-green-500 bg-green-50' : 'border-transparent'}`}>
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                    <FaKey className={`flex-shrink-0 ${copied ? "text-green-600" : "text-purple-600"}`} />
                    <span className="text-[11px] lg:text-sm font-bold truncate tracking-tight">{pixKeyVisual}</span>
                  </div>
                  <button onClick={copyKey} className="flex-shrink-0 ml-2 bg-white shadow-md p-2 lg:p-3 rounded-lg lg:rounded-xl hover:scale-110 active:scale-95 transition-all text-purple-600">
                    {copied ? <FaCheckCircle className="text-green-600" /> : <FaCopy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:h-full">
            <section className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 shadow-xl shadow-purple-100/50 border border-purple-50 flex flex-col h-full lg:min-h-[620px]">
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <div className="bg-green-100 p-2 rounded-lg"><FaDollarSign className="text-green-600" /></div>
                <h3 className="font-black text-base lg:text-lg text-[#3b1a66] uppercase tracking-tighter">Valor da Doação</h3>
              </div>

              <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-6 lg:mb-8">
                {valoresRapidos.map((v) => (
                  <button key={v} onClick={() => setValor(v)} className={`py-3 lg:py-5 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm transition-all border-2 ${valor === v ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200" : "bg-gray-50 border-transparent text-gray-500 hover:bg-purple-50"}`}>R$ {v}</button>
                ))}
                <div className="col-span-full relative mt-2">
                  <input type="number" placeholder="Outro" value={valor} onChange={(e) => setValor(e.target.value)} className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-200 rounded-xl lg:rounded-2xl py-4 lg:py-6 px-10 lg:px-14 font-black text-lg lg:text-xl focus:bg-white transition-all outline-none" />
                  <span className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 font-black text-purple-300 text-base lg:text-lg">R$</span>
                </div>
              </div>

              <div className="hidden lg:block lg:flex-grow"></div>

              <div className="space-y-4 lg:space-y-6 pt-6 lg:pt-8 border-t border-gray-100 mt-4 lg:mt-0">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 lg:mb-4">📎 Comprovante do Pix</label>
                <div className={`relative border-2 border-dashed rounded-xl lg:rounded-[1.5rem] p-6 lg:p-10 transition-all text-center ${file ? 'border-green-400 bg-green-50' : 'border-purple-100 bg-purple-50/30 hover:bg-purple-50'}`}>
                  {!file ? (
                    <>
                      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <p className="text-[11px] lg:text-sm font-bold text-purple-400">Clique para anexar</p>
                    </>
                  ) : (
                    <div className="flex items-center justify-between text-green-700 font-bold text-xs lg:text-sm">
                      <span className="truncate flex items-center gap-2"><FaCheckCircle className="flex-shrink-0" /> Arquivo anexado</span>
                      <button onClick={() => setFile(null)} className="text-red-500 p-1 ml-2">✕</button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleConfirmarDoacao}
                  disabled={!file || loading}
                  className={`w-full py-4 lg:py-6 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm uppercase tracking-[0.2em] transition-all ${!file || loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#00C897] text-white hover:bg-[#00B085] shadow-lg shadow-green-100 active:scale-95"}`}
                >
                  {loading ? "Enviando..." : "Confirmar Doação"}
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-[#3b1a66]/40 backdrop-blur-md px-4">
          <div className="bg-white rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-10 w-full max-w-[380px] text-center shadow-2xl">
            <div className="inline-flex items-center justify-center bg-green-500 rounded-full p-4 lg:p-5 mb-6 shadow-xl shadow-green-200">
              <FaCheckCircle className="text-white text-3xl lg:text-4xl" />
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-[#3b1a66] mb-3">Tudo certo!</h2>
            <p className="text-gray-500 text-xs lg:text-sm mb-8 leading-relaxed">
              Sua doação para <span className="font-bold text-purple-600">{ongData?.name || "a ONG"}</span> foi informada com sucesso. 💜
            </p>
            <button onClick={() => router.push("/home")} className="w-full bg-purple-600 text-white py-4 rounded-xl lg:rounded-2xl font-black uppercase tracking-widest hover:bg-purple-700 transition-all text-xs lg:text-sm">
              Concluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PixPage() {
  return (
    <Suspense fallback={null}>
      <PixPageContent />
    </Suspense>
  );
}