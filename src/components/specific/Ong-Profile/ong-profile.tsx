"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Award, Camera, Plus, Trash2, Phone, Instagram, Tag, Wallet, Landmark, ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OngSetupProfile() {
  const router = useRouter();

  const [images, setImages] = useState({ banner: "", logo: "" });
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  
  // Estados para o PIX
  const [pixKey, setPixKey] = useState("");
  const [pixType, setPixType] = useState("CNPJ");
  const [isPixTypeOpen, setIsPixTypeOpen] = useState(false);
  const [pixName, setPixName] = useState("");
  const [pixBank, setPixBank] = useState("");

  const pixOptions = ["CNPJ", "CPF", "E-mail", "Telefone", "Chave Aleatória"];

  const availableCategories = [
    "Proteção Animal", "Apoio Infantil", "Saúde", "Educação",
    "Meio Ambiente", "Idosos", "Cultura", "Esporte", "Alimentação"
  ];

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) setImages(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
  };

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-32">

      {/* Banner Editável */}
      <div className="relative w-full h-[340px] bg-gradient-to-tr from-purple-100 via-violet-50 to-pink-100 border-b border-purple-100">
        {images.banner && (
          <img src={images.banner} className="absolute inset-0 w-full h-full object-cover object-top" alt="Banner" />
        )}
        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all group">
          <Camera className="text-purple-600/70 mb-2 group-hover:scale-110 transition-transform" size={32} />
          <span className="text-[#4a1d7a] font-black text-xs uppercase tracking-widest drop-shadow-sm px-4 text-center">
            Adicionar Foto de Capa
          </span>
          <input type="file" className="hidden" onChange={(e) => handleImage(e, 'banner')} />
        </label>

        <div className="absolute -bottom-12 left-6 z-50 w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white flex items-center justify-center">
          {images.logo ? (
            <img src={images.logo} className="w-full h-full object-cover" alt="Logo" />
          ) : (
            <div className="flex flex-col items-center text-purple-200">
              <Camera size={30} />
              <span className="text-[10px] font-bold uppercase mt-1">Logo</span>
            </div>
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-purple-600/10 cursor-pointer opacity-0 hover:opacity-100 transition-opacity backdrop-blur-[2px]">
            <Camera className="text-purple-600" size={24} />
            <input type="file" className="hidden" onChange={(e) => handleImage(e, 'logo')} />
          </label>
        </div>
      </div>

      <div className="px-6 mt-20 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">SOS Gatinhos</h1>
        <p className="text-[#4a1d7a] text-sm mt-1 uppercase font-black tracking-widest opacity-70">Configuração de Perfil</p>

        <div className="mt-8 grid grid-cols-1 gap-6">

          {/* 1. SOBRE E ANOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="h-full p-6 md:p-8 rounded-2xl bg-white shadow-md border border-gray-100">
                <h2 className="text-lg font-bold text-[#4a1d7a] mb-3 flex items-center gap-2">Sobre a ONG</h2>
                <textarea
                  placeholder="Descreva a história e o trabalho da sua ONG..."
                  className="w-full text-lg leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 border-none transition-all"
                  rows={4}
                />
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-white shadow-md border border-gray-100 flex flex-col justify-center">
              <h3 className="text-base font-bold text-[#4a1d7a] mb-2 flex items-center gap-2">
                <Award size={18} /> Anos de Atuação
              </h3>
              <input
                type="number"
                placeholder="Ex: 5"
                className="w-full text-2xl font-black text-gray-900 bg-gray-50 p-4 rounded-xl outline-none border-none"
              />
            </motion.div>
          </div>

          {/* 2. CONTATO */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 rounded-2xl bg-white shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-[#4a1d7a] mb-6 italic border-l-4 border-purple-200 pl-4">Canais de Contato e Local</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                <Phone size={22} className="text-purple-400" />
                <input placeholder="WhatsApp / Telefone" className="bg-transparent outline-none w-full text-lg font-medium" />
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                <Instagram size={22} className="text-pink-400" />
                <input placeholder="@instagram_ong" className="bg-transparent outline-none w-full text-lg font-medium" />
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                <MapPin size={22} className="text-blue-400" />
                <input placeholder="Cidade - UF (Ex: Recife - PE)" className="bg-transparent outline-none w-full text-lg font-medium" />
              </div>
            </div>
          </motion.div>

          {/* 3. CATEGORIAS */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 rounded-2xl bg-white shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-[#4a1d7a] mb-4 flex items-center gap-2">
              <Tag size={20} /> Categorias de Atuação
            </h2>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => {
                const isSelected = categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isSelected
                        ? "bg-[#4a1d7a] text-white border-[#4a1d7a] shadow-md scale-105"
                        : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-purple-50 hover:text-purple-600"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* 4. DOAÇÕES PIX (DROPDOWN ESTILIZADO) */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white via-white to-purple-50 shadow-md border border-purple-100">
            <h2 className="text-lg font-bold text-[#4a1d7a] mb-6 flex items-center gap-2">
              <Wallet size={20} className="text-purple-600" /> Receber Doações via PIX
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              
              {/* Dropdown Customizado */}
              <div className="space-y-2 relative">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Tipo de Chave</label>
                <button 
                  onClick={() => setIsPixTypeOpen(!isPixTypeOpen)}
                  className="w-full bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between text-gray-700 font-bold hover:border-purple-200 transition-all shadow-sm"
                >
                  {pixType}
                  <ChevronDown size={18} className={`text-purple-500 transition-transform ${isPixTypeOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isPixTypeOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-[110] top-[85px] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden"
                    >
                      {pixOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setPixType(option);
                            setIsPixTypeOpen(false);
                          }}
                          className="w-full p-4 text-left hover:bg-purple-50 flex items-center justify-between group transition-colors"
                        >
                          <span className={`font-bold ${pixType === option ? 'text-purple-600' : 'text-gray-600'}`}>
                            {option}
                          </span>
                          {pixType === option && <Check size={16} className="text-purple-600" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Chave PIX ({pixType})</label>
                <input 
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="Insira a chave aqui"
                  className="w-full bg-white p-4 rounded-xl border border-gray-100 text-gray-700 font-bold focus:ring-2 focus:ring-purple-200 outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Instituição Bancária</label>
                <div className="relative">
                  <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                  <input 
                    value={pixBank}
                    onChange={(e) => setPixBank(e.target.value)}
                    placeholder="Ex: Nubank, Inter..."
                    className="w-full bg-white p-4 pl-12 rounded-xl border border-gray-100 text-gray-700 font-bold focus:ring-2 focus:ring-purple-200 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Nome do Titular</label>
                <input 
                  value={pixName}
                  onChange={(e) => setPixName(e.target.value)}
                  placeholder="Nome p/ conferência"
                  className="w-full bg-white p-4 rounded-xl border border-gray-100 text-gray-700 font-bold focus:ring-2 focus:ring-purple-200 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </motion.div>

          {/* 5. ITENS FÍSICOS */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 rounded-2xl bg-white shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-[#4a1d7a] mb-3 flex items-center gap-2">Itens que aceitamos (Físicos)</h2>
            <div className="flex gap-2 mb-4">
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Ex: Ração, Cobertores..."
                className="flex-1 bg-gray-50 p-3 md:p-4 rounded-xl outline-none text-base md:text-lg border-none focus:ring-2 focus:ring-purple-100 min-w-0"
              />
              <button
                onClick={() => { if (newItem) setItems([...items, newItem]); setNewItem(""); }}
                className="bg-[#4a1d7a] text-white px-4 md:px-6 rounded-xl hover:bg-[#3b1762] shadow-lg transition-all active:scale-95 flex items-center justify-center shrink-0"
              >
                <Plus size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {items.map((item, i) => (
                <span key={i} className="flex items-center gap-2 bg-purple-50 text-[#4a1d7a] px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-black border border-purple-100 shadow-sm transition-all">
                  {item}
                  <Trash2 size={14} className="cursor-pointer text-red-400 hover:text-red-600 transition-colors md:w-4 md:h-4" onClick={() => setItems(items.filter((_, idx) => idx !== i))} />
                </span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Botão de Salvar */}
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-4 left-0 right-0 px-6 z-[100]">
        <div className="max-w-4xl mx-auto">
          <button
            className="w-full py-5 rounded-2xl text-xl font-black text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:brightness-110"
          >
            Finalizar meu Perfil
          </button>
        </div>
      </motion.div>

    </div>
  );
}