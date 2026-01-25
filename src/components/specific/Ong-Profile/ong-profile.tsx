"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Award, Plus, Trash2, Phone, Instagram, Tag, Wallet, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";

// Importação dos componentes que você enviou
import { FormSection } from "@/components/ui/form-section";
import { CustomSelect } from "@/components/ui/custom-select";
import { InputGroup } from "@/components/ui/input-group";
import { ImageUploader } from "@/components/ui/image-uploader";

export default function OngSetupProfile() {
  const router = useRouter();

  // Estados
  const [images, setImages] = useState({ banner: "", logo: "" });
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  
  const [pixKey, setPixKey] = useState("");
  const [pixType, setPixType] = useState("CNPJ");
  const [pixName, setPixName] = useState("");
  const [pixBank, setPixBank] = useState("");

  const pixOptions = ["CNPJ", "CPF", "E-mail", "Telefone", "Chave Aleatória"];
  const availableCategories = [
    "Proteção Animal", "Apoio Infantil", "Saúde", "Educação",
    "Meio Ambiente", "Idosos", "Cultura", "Esporte", "Alimentação"
  ];

  // Handlers
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) setImages(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
  };

  const toggleCategory = (cat: string) => {
    setCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-32">

      {/* SEÇÃO DE IMAGENS (Utilizando o ImageUploader) */}
      <div className="relative">
        <ImageUploader 
          variant="banner" 
          image={images.banner} 
          onImageChange={(e) => handleImage(e, 'banner')} 
          label="Adicionar Foto de Capa"
        />
        <ImageUploader 
          variant="logo" 
          image={images.logo} 
          onImageChange={(e) => handleImage(e, 'logo')} 
          label="Logo"
        />
      </div>

      <div className="px-6 mt-20 max-w-4xl mx-auto">
        <header>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">SOS Gatinhos</h1>
          <p className="text-[#4a1d7a] text-sm mt-1 uppercase font-black tracking-widest opacity-70">Configuração de Perfil</p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6">

          {/* 1. SOBRE E ANOS (Utilizando FormSection) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormSection title="Sobre a ONG" className="md:col-span-2">
              <textarea
                placeholder="Descreva a história e o trabalho da sua ONG..."
                className="w-full text-lg leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 border-none transition-all"
                rows={4}
              />
            </FormSection>

            <FormSection title="Anos de Atuação" icon={Award} className="flex flex-col justify-center">
              <input
                type="number"
                placeholder="Ex: 5"
                className="w-full text-2xl font-black text-gray-900 bg-gray-50 p-4 rounded-xl outline-none border-none"
              />
            </FormSection>
          </div>

          {/* 2. CONTATO (Utilizando FormSection + InputGroup) */}
          <FormSection title="Canais de Contato e Local" italicTitle>
            <div className="space-y-4">
              <InputGroup icon={Phone} placeholder="WhatsApp / Telefone" />
              <InputGroup icon={Instagram} placeholder="@instagram_ong" iconColor="text-pink-400" />
              <InputGroup icon={MapPin} placeholder="Cidade - UF (Ex: Recife - PE)" iconColor="text-blue-400" />
            </div>
          </FormSection>

          {/* 3. CATEGORIAS */}
          <FormSection title="Categorias de Atuação" icon={Tag}>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => {
                const isSelected = categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                      isSelected
                        ? "bg-[#4a1d7a] text-white border-[#4a1d7a] shadow-md scale-105"
                        : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-purple-50 hover:text-purple-600"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </FormSection>

          {/* 4. DOAÇÕES PIX (Utilizando CustomSelect) */}
          <FormSection 
            title="Receber Doações via PIX" 
            icon={Wallet} 
            className="bg-gradient-to-br from-white via-white to-purple-50 border-purple-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <CustomSelect 
                label="Tipo de Chave" 
                value={pixType} 
                options={pixOptions} 
                onChange={setPixType} 
              />
              
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
          </FormSection>

          {/* 5. ITENS FÍSICOS */}
          <FormSection title="Itens que aceitamos (Físicos)">
            <div className="flex gap-2 mb-4">
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Ex: Ração, Cobertores..."
                className="flex-1 bg-gray-50 p-4 rounded-xl outline-none text-lg border-none focus:ring-2 focus:ring-purple-100 min-w-0"
              />
              <button
                onClick={() => { if (newItem) setItems([...items, newItem]); setNewItem(""); }}
                className="bg-[#4a1d7a] text-white px-6 rounded-xl hover:bg-[#3b1762] shadow-lg transition-all active:scale-95 flex items-center justify-center shrink-0"
              >
                <Plus size={24} />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {items.map((item, i) => (
                <span key={i} className="flex items-center gap-2 bg-purple-50 text-[#4a1d7a] px-4 py-2 rounded-full text-sm font-black border border-purple-100 shadow-sm transition-all group">
                  {item}
                  <Trash2 
                    size={14} 
                    className="cursor-pointer text-red-400 hover:text-red-600 transition-colors" 
                    onClick={() => setItems(items.filter((_, idx) => idx !== i))} 
                  />
                </span>
              ))}
            </div>
          </FormSection>

        </div>
      </div>

      {/* Botão de Finalizar */}
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-4 left-0 right-0 px-6 z-[100]">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => console.log("Salvar:", { images, items, categories, pixKey })}
            className="w-full py-5 rounded-2xl text-xl font-black text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:brightness-110"
          >
            Finalizar meu Perfil
          </button>
        </div>
      </motion.div>

    </div>
  );
}