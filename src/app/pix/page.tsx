"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FaCopy,
  FaUniversity,
  FaKey,
  FaBuilding,
  FaIdCard,
} from "react-icons/fa";
import { useState } from "react";

// LISTA DAS ONGs
const ONGS = [
  {
    id: 1,
    name: "SOS Gatinhos",
    cnpj: "23.456.789/0001-55",
    bank: "Caixa Econômica",
    agencia: "1444",
    conta: "000112-9",
    tipoConta: "Conta Corrente",
    pixKey: "pix@sosgatinhos.org",
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=pix@sosgatinhos.org",
  },
  {
    id: 2,
    name: "Patinhas Felizes",
    cnpj: "12.345.678/0001-90",
    bank: "Banco do Brasil",
    agencia: "1234-5",
    conta: "98765-4",
    tipoConta: "Conta Corrente",
    pixKey: "pixinstitucional@patinhasfelizes.org",
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=pixinstitucional@patinhasfelizes.org",
  },
  {
    id: 3,
    name: "Crianças Primeiro",
    cnpj: "01.987.654/0001-33",
    bank: "Bradesco",
    agencia: "5555",
    conta: "222233-1",
    tipoConta: "Poupança",
    pixKey: "doe@criancasprimeiro.org",
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=doe@criancasprimeiro.org",
  },
];

export default function PixPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = Number(searchParams.get("id"));
  const ONG = ONGS.find((o) => o.id === id) || ONGS[0];

  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(ONG.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  }

  function removeFile() {
    setFile(null);
  }

  function handleSubmit() {
    if (!file) return;

    setLoading(true);

    // simula envio para backend
    setTimeout(() => {
      setLoading(false);
      setShowPopup(true);
    }, 1500);
  }

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center px-6 py-10 text-[#3b1a66]">

      <h1 className="text-3xl font-bold mb-1 text-[#4A1D96]">
        Doação via PIX
      </h1>
      <p className="text-gray-500 mb-8 text-center">
        Faça sua contribuição de forma rápida e segura 💜
      </p>

      <div className="bg-purple-50 w-full max-w-md rounded-3xl p-7 shadow-md">

        {/* NOME DA ONG */}
        <div className="flex items-center gap-3 mb-4">
          <FaBuilding className="text-purple-700 text-2xl" />
          <h2 className="text-xl font-semibold">{ONG.name}</h2>
        </div>

        {/* CNPJ */}
        <div className="flex items-center gap-3 text-base mb-4">
          <FaIdCard className="text-purple-700" />
          <p className="text-gray-800">
            <span className="font-semibold">CNPJ:</span> {ONG.cnpj}
          </p>
        </div>

        {/* Dados bancários */}
        <div className="flex items-center gap-3 text-base mb-1">
          <FaUniversity className="text-purple-700" />
          <p className="text-gray-800">
            <span className="font-semibold">Banco:</span> {ONG.bank}
          </p>
        </div>

        <div className="ml-9 text-gray-800 text-base mb-4">
          <p><span className="font-semibold">Agência:</span> {ONG.agencia}</p>
          <p><span className="font-semibold">Conta:</span> {ONG.conta}</p>
          <p><span className="font-semibold">Tipo:</span> {ONG.tipoConta}</p>
        </div>

        {/* PIX */}
        <div className="flex items-center justify-between bg-white py-4 px-5 rounded-xl shadow-sm mb-5">
          <div className="flex items-center gap-2 max-w-[80%]">
            <FaKey className="text-purple-700 text-lg" />
            <p className="text-base font-medium break-all">{ONG.pixKey}</p>
          </div>

          <button onClick={copyKey} className="active:scale-95 transition">
            <FaCopy className="text-purple-700 text-xl" />
          </button>
        </div>

        {copied && (
          <p className="text-center text-base text-green-600 font-medium mb-2">
            ✔ Chave copiada!
          </p>
        )}

        {/* QR CODE */}
        <div className="w-full flex justify-center mt-4 mb-3">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <Image
              src={ONG.qrCode}
              alt="QR Code PIX"
              width={260}
              height={260}
              className="rounded-lg"
            />
          </div>
        </div>

        <p className="text-center text-base text-gray-600 mt-2">
          Escaneie o QR Code para doar 💜
        </p>

        {/* UPLOAD */}
        <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            📎 Anexar comprovante de Pix
          </label>

          {!file ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-100 file:text-purple-700
              hover:file:bg-purple-200
              border border-gray-300 rounded-lg p-2"
            />
          ) : (
            <div className="flex items-center justify-between bg-gray-100 border px-4 py-2 rounded-full text-sm font-medium">
              <span className="truncate">Comprovante anexado</span>
              <button
                onClick={removeFile}
                className="ml-3 text-gray-500 hover:text-red-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* BOTÃO CONFIRMAR */}
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className={`w-full mt-6 py-3 rounded-2xl font-semibold text-white transition
            ${!file || loading
              ? "bg-gray-400 cursor-not-allowed opacity-60"
              : "bg-purple-700 hover:bg-purple-800"}
          `}
        >
          {loading ? "Enviando..." : "Confirmar Doação"}
        </button>
      </div>

      {/* MODAL */}
      {showPopup && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
    <div className="bg-white rounded-3xl p-8 w-[90%] max-w-[420px] text-center shadow-2xl">

      {/* ÍCONE */}
      <div className="inline-flex items-center justify-center bg-purple-600 rounded-full p-3 mb-4 shadow-lg shadow-purple-400/40 animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* TÍTULO */}
      <h2 className="text-2xl font-bold text-purple-700 mb-3">
        Doação enviada!
      </h2>

      <p className="text-gray-700 mb-6">
        A ONG <span className="font-semibold">{ONG.name}</span> entrará
        em contato com você 💜
      </p>

      <button
        onClick={() => router.push("/home")}
        className="bg-purple-600 text-white py-2 px-8 rounded-full font-semibold hover:bg-purple-700"
      >
        Ok
      </button>
    </div>
  </div>
)}

      <button
        onClick={() => history.back()}
        className="mt-8 text-purple-700 text-lg font-semibold"
      >
        Voltar
      </button>
    </div>
  );
}
