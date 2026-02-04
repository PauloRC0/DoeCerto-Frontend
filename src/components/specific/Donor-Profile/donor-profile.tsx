"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  ArrowLeft,
  Heart,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  History,
  Edit2
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface DonationHistory {
  id: number;
  type: "monetary" | "material";
  ongName: string;
  amount?: string;
  items?: string;
  date: string;
  status: "pending" | "completed" | "canceled";
}

export default function DonorProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "history">("info");
  const [profileImage, setProfileImage] = useState<string>("/api/placeholder/200/200");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Carrega foto do localStorage quando o componente monta
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setProfileImage(savedAvatar);
    }
  }, []);

  // Dados mockados - depois você vai buscar da API
  const [donorData, setDonorData] = useState({
    name: "João Silva",
    email: "joao.silva@email.com",
    cpf: "123.456.789-00",
    phone: "(81) 99999-9999",
    address: {
      street: "Rua das Flores",
      number: "123",
      neighborhood: "Boa Viagem",
      city: "Recife",
      state: "PE",
      zipCode: "51020-000"
    }
  });

  // Histórico mockado - depois buscar da API
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([
    {
      id: 1,
      type: "monetary",
      ongName: "Instituto Viver Bem",
      amount: "R$ 50,00",
      date: "25/01/2026",
      status: "completed"
    },
    {
      id: 2,
      type: "material",
      ongName: "Rede Solidária",
      items: "Ração 10kg, Cobertores (5 unidades)",
      date: "20/01/2026",
      status: "pending"
    },
    {
      id: 3,
      type: "monetary",
      ongName: "Criança Feliz",
      amount: "R$ 100,00",
      date: "15/01/2026",
      status: "completed"
    }
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        // Salva no localStorage para usar na home
        localStorage.setItem('userAvatar', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluída";
      case "pending":
        return "Pendente";
      case "canceled":
        return "Cancelada";
      default:
        return status;
    }
  };

  const totalDonations = donationHistory.length;
  const totalAmount = donationHistory
    .filter(d => d.type === "monetary" && d.status === "completed")
    .reduce((sum, d) => {
      const value = parseFloat(d.amount?.replace("R$", "").replace(",", ".") || "0");
      return sum + value;
    }, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header com Banner */}
      <div className="relative w-full h-48 bg-gradient-to-r from-purple-600 to-purple-800">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full z-30 shadow-md text-gray-900 hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Foto de Perfil */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-20">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
              <img
                src={profileImage}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition shadow-lg"
            >
              <Camera size={18} className="text-white" />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Nome e Stats */}
      <div className="mt-20 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{donorData.name}</h1>
        <p className="text-gray-600 mt-1">{donorData.email}</p>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mt-6 max-w-md mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-center gap-2 text-purple-600 mb-1">
              <Heart size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalDonations}</p>
            <p className="text-sm text-gray-600">Doações</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
              <DollarSign size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              R$ {totalAmount.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-sm text-gray-600">Doado</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 px-6">
        <div className="flex gap-2 bg-white rounded-2xl p-1 shadow-sm max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "info"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Informações
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "history"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Histórico
          </button>
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <AnimatePresence mode="wait">
        {activeTab === "info" && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 px-6 space-y-4 max-w-2xl mx-auto"
          >
            {/* Informações Pessoais */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Dados Pessoais</h2>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User size={20} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Nome Completo</p>
                    <p className="font-medium text-gray-900">{donorData.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{donorData.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User size={20} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">CPF</p>
                    <p className="font-medium text-gray-900">{donorData.cpf}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium text-gray-900">{donorData.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Endereço</h2>
              </div>

              <div className="space-y-2 text-gray-700">
                <p>{donorData.address.street}, {donorData.address.number}</p>
                <p>{donorData.address.neighborhood}</p>
                <p>{donorData.address.city} - {donorData.address.state}</p>
                <p>CEP: {donorData.address.zipCode}</p>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800">
                  💡 <strong>Em breve:</strong> Usaremos sua localização para mostrar ONGs próximas a você!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 px-6 space-y-4 max-w-2xl mx-auto"
          >
            {donationHistory.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <History size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Nenhuma doação ainda</p>
                <p className="text-gray-500 text-sm mt-2">
                  Suas doações aparecerão aqui
                </p>
              </div>
            ) : (
              donationHistory.map((donation) => (
                <motion.div
                  key={donation.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        donation.type === "monetary" 
                          ? "bg-green-100" 
                          : "bg-blue-100"
                      }`}>
                        {donation.type === "monetary" ? (
                          <DollarSign size={20} className="text-green-600" />
                        ) : (
                          <Package size={20} className="text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{donation.ongName}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar size={14} />
                          {donation.date}
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                      {getStatusText(donation.status)}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {donation.type === "monetary" ? (
                      <div>
                        <p className="text-sm text-gray-600">Valor doado</p>
                        <p className="text-xl font-bold text-green-600">{donation.amount}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Itens doados</p>
                        <p className="text-gray-900">{donation.items}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}