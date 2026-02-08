"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Award,
  Plus,
  Trash2,
  Phone,
  Instagram,
  Tag,
  Wallet,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormSection } from "@/components/ui/form-section";
import { CustomSelect } from "@/components/ui/custom-select";
import { InputGroup } from "@/components/ui/input-group";
import { ImageUploader } from "@/components/ui/image-uploader";

import { OngProfileService } from "@/services/ongs-profile.service";
import { OngSetupService } from "@/services/ongSetup.service";

export default function OngSetupProfile() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [ongName, setOngName] = useState("Minha ONG");
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);

  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [address, setAddress] = useState("");
  const [years, setYears] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [pixType, setPixType] = useState("CNPJ");

  const pixOptions = ["CNPJ", "CPF", "E-mail", "Telefone", "Chave Aleatória"];

  useEffect(() => {
    async function loadInitialData() {
      try {
        // 1. Carrega categorias do banco
        const categories = await OngSetupService.getCategories();
        setAvailableCategories(categories || []);

        // 2. Busca perfil atualizado (Usando o serviço que limpa as URLs)
        const profile = await OngProfileService.getMyProfile();

        if (profile) {
          setOngName(profile.name || "Minha ONG");
          // Backend mapeia bio -> about
          setBio(profile.about || "");
          setPhone(profile.contactNumber || "");
          setInstagram(profile.websiteUrl || "");

          // Tratamento de Endereço (Cidade - UF)
          if (profile.address) {
            const addr = typeof profile.address === 'object'
              ? `${profile.address.city || ''}${profile.address.state ? ' - ' + profile.address.state : ''}`
              : profile.address;
            setAddress(addr);
          }

          // Anos de atuação baseado no createdAt
          if (profile.createdAt) {
            const diff = new Date().getFullYear() - new Date(profile.createdAt).getFullYear();
            setYears(diff.toString());
          }

          if (profile.avatarUrl) setLogoPreview(profile.avatarUrl);
          if (profile.bannerUrl) setBannerPreview(profile.bannerUrl);

          if (profile.categories) {
            setSelectedCategoryIds(profile.categories.map((c: any) => c.id));
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleLogoChange = (file: File) => {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleBannerChange = (file: File) => {
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleAddItems = () => {
    if (!newItem.trim()) return;
    const itemsToAdd = newItem.split(',').map(item => item.trim()).filter(Boolean);
    setItems(prev => [...prev, ...itemsToAdd]);
    setNewItem("");
  };

  const handleFinalize = async () => {
    setLoading(true);
    try {
      // ETAPA 1: Dados textuais
      await OngSetupService.updateProfileData({
        about: bio,
        contactNumber: phone,
        address,
        websiteUrl: instagram,
        categoryIds: selectedCategoryIds,
      });

      // ETAPA 2: Imagens
      if (logoFile || bannerFile) {
        await OngSetupService.updateProfileImages(
          logoFile || undefined,
          bannerFile || undefined
        );
      }

      router.push("/ong-dashboard");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Houve um erro ao salvar seu perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#4a1d7a]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-32">
      <div className="relative w-full">
        <ImageUploader
          variant="banner"
          image={bannerPreview}
          onImageChange={handleBannerChange}
          label="Adicionar Foto de Capa"
        />

        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full z-30 shadow-md text-gray-900 hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="absolute -bottom-14 left-6 sm:left-10 z-40">
          <ImageUploader
            variant="logo"
            image={logoPreview}
            onImageChange={handleLogoChange}
            label="Logo"
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 mt-20 sm:mt-24 max-w-4xl mx-auto">
        <header className="flex flex-col items-start text-left pt-6">
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight break-words w-full">
            {ongName}
          </h1>
          <p className="text-[#4a1d7a] text-[10px] sm:text-xs mt-1 uppercase font-black tracking-widest opacity-70">
            Configuração de Perfil
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormSection title="Sobre a ONG" className="md:col-span-2">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Descreva a história da sua ONG..."
                className="w-full text-base leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 border-none transition-all"
                rows={4}
              />
            </FormSection>

            <FormSection title="Anos de Atuação" icon={Award} className="flex flex-col justify-center">
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="Ex: 5"
                className="w-full text-xl font-black text-gray-900 bg-gray-50 p-4 rounded-xl outline-none border-none"
              />
            </FormSection>
          </div>

          <FormSection title="Canais de Contato e Local" italicTitle>
            <div className="space-y-3 sm:space-y-4">
              <InputGroup icon={Phone} placeholder="WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <InputGroup
                icon={Instagram}
                placeholder="Link do Instagram ou Site"
                iconColor="text-pink-400"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
              <InputGroup
                icon={MapPin}
                placeholder="Cidade - UF"
                iconColor="text-blue-400"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </FormSection>

          <FormSection title="Categorias de Atuação" icon={Tag}>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-sm font-bold transition-all border ${selectedCategoryIds.includes(cat.id)
                      ? "bg-[#4a1d7a] text-white border-[#4a1d7a] shadow-md"
                      : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-purple-50"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </FormSection>

          <FormSection title="Receber Doações via PIX" icon={Wallet} className="bg-gradient-to-br from-white to-purple-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <CustomSelect label="Tipo de Chave" value={pixType} options={pixOptions} onChange={setPixType} />
              <input
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Chave PIX"
                className="w-full bg-white p-4 rounded-xl border border-gray-100 outline-none text-sm focus:border-purple-300 transition-colors"
              />
            </div>
          </FormSection>

          <FormSection title="Itens que aceitamos">
            <div className="grid grid-cols-[1fr_48px] gap-2 mb-4">
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Ex: Ração..."
                className="w-full bg-gray-50 p-3 rounded-xl outline-none text-sm min-w-0 border-none focus:ring-1 focus:ring-purple-100"
              />
              <button
                type="button"
                onClick={handleAddItems}
                className="aspect-square bg-[#4a1d7a] text-white flex items-center justify-center rounded-xl active:scale-95 transition-transform"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((item, i) => (
                <span key={i} className="flex items-center gap-2 bg-purple-50 text-[#4a1d7a] px-3 py-1.5 rounded-full text-[11px] font-black border border-purple-100">
                  {item}
                  <Trash2
                    size={12}
                    className="cursor-pointer text-red-400"
                    onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                  />
                </span>
              ))}
            </div>
          </FormSection>
        </div>
      </div>

      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-4 left-0 right-0 px-4 z-[100]">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={handleFinalize}
            disabled={loading}
            className="w-full py-4 rounded-2xl text-lg font-black text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Finalizar meu Perfil"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}