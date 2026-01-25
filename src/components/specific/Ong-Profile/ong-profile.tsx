"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Award, Camera, Plus, Trash2, Phone, Instagram, Save, Tag, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OngSetupProfile() {
  const router = useRouter();

  const [images, setImages] = useState({ banner: "", logo: "" });
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  // Estado para múltiplas categorias
  const [categories, setCategories] = useState<string[]>([]);

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
          <span className="text-[#4a1d7a] font-black text-xs uppercase tracking-widest drop-shadow-sm">
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

          {/* Categorias - Nova Seção Multiselect */}
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

          {/* Sobre e Tempo de Existência */}
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

          {/* Contato */}
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

          {/* Itens Aceitos */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 rounded-2xl bg-white shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-[#4a1d7a] mb-3">Itens que aceitamos</h2>
            <div className="flex gap-3 mb-4">
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Ex: Ração, Cobertores..."
                className="flex-1 bg-gray-50 p-4 rounded-xl outline-none text-lg border-none focus:ring-2 focus:ring-purple-100"
              />
              <button
                onClick={() => { if (newItem) setItems([...items, newItem]); setNewItem(""); }}
                className="bg-[#4a1d7a] text-white px-6 rounded-xl hover:bg-[#3b1762] shadow-lg transition-all active:scale-95 flex items-center justify-center"
              >
                <Plus size={24} />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {items.map((item, i) => (
                <span key={i} className="flex items-center gap-2 bg-purple-50 text-[#4a1d7a] px-4 py-2 rounded-full text-sm font-black border border-purple-100 shadow-sm transition-all">
                  {item}
                  <Trash2 size={16} className="cursor-pointer text-red-400 hover:text-red-600 transition-colors" onClick={() => setItems(items.filter((_, idx) => idx !== i))} />
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