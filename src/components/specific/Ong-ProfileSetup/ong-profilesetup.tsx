"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Plus,
  Trash2,
  Phone,
  Instagram,
  Tag,
  Wallet,
  Loader2,
  ArrowLeft,
  Building2,
  Search,
  Globe2,
  MapPinned,
  Milestone,
  Info,
  Navigation,
  Flag
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormSection } from "@/components/ui/form-section";
import { CustomSelect } from "@/components/ui/custom-select";
import { InputGroup } from "@/components/ui/input-group";
import { ImageUploader } from "@/components/ui/image-uploader";
import { BankAccountService } from "@/services/bank-account.service";
import { OngsProfileService } from "@/services/ongs-profile.service";
import { OngSetupService } from "@/services/ongSetup.service";
import { WishlistService } from "@/services/wishlist.service";

export default function OngSetupProfile() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [ongName, setOngName] = useState("Minha ONG");
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);

  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("Brasil");
  const [address, setAddress] = useState("");
  const [years, setYears] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerCrop, setBannerCrop] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [ongId, setOngId] = useState<number | null>(null);

  const [bankName, setBankName] = useState("");
  const [agencyNumber, setAgencyNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [accountType, setAccountType] = useState("Corrente");

  const accountTypeOptions = ["Corrente", "Poupança", "Aplicação"];

  useEffect(() => {
    async function loadInitialData() {
      try {
        setInitialLoading(true);

        const categories = await OngSetupService.getCategories();
        setAvailableCategories(categories || []);

        const profile = await OngsProfileService.getMyProfile();

        if (profile) {
          setOngId(profile.id);
          setOngName(profile.name || "Minha ONG");

          // CORREÇÃO: Usando 'description' em vez de 'about' para alinhar com o DTO
          setDescription(profile.description || "");
          setPhone(profile.contactNumber || "");
          setWebsite(profile.website || "");

          try {
            const wishlistData = await WishlistService.getItems(profile.id);
            setItems(wishlistData || []);
          } catch (err) {
            console.error("Erro ao carregar wishlist:", err);
          }

          if (profile.address) {
            const addr = typeof profile.address === 'object'
              ? `${profile.address.city || ''}${profile.address.state ? ' - ' + profile.address.state : ''}`
              : profile.address;
            setAddress(addr);
          }

          if (profile.yearsOfOperation) {
            setYears(profile.yearsOfOperation.toString());
          } else if (profile.createdAt) {
            const diff = new Date().getFullYear() - new Date(profile.createdAt).getFullYear();
            setYears(diff.toString());
          }

          if (profile.avatarUrl) setLogoPreview(profile.avatarUrl);
          if (profile.bannerUrl) setBannerPreview(profile.bannerUrl);

          if (profile.categories) {
            setSelectedCategoryIds(profile.categories.map((c: any) => c.id));
          }
        }

        const bankData = await BankAccountService.getMyAccount();
        if (bankData) {
          setBankName(bankData.bankName || "");
          setAgencyNumber(bankData.agencyNumber || "");
          setAccountNumber(bankData.accountNumber || "");
          setPixKey(bankData.pixKey || "");
          setAccountType(bankData.accountType || "Corrente");
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

  const handleAddItems = async () => {
    if (!newItem.trim() || !ongId) return;
    try {
      const addedItem = await WishlistService.addItem(ongId, newItem.trim(), 1);
      setItems(prev => [...prev, addedItem]);
      setNewItem("");
    } catch (error) {
      alert("Erro ao salvar item na lista de desejos.");
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!ongId) return;
    try {
      await WishlistService.deleteItem(ongId, itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      alert("Erro ao remover item do servidor.");
    }
  };

  const handleFinalize = async () => {
    setLoading(true);
    try {
      await OngSetupService.updateProfileData({
        description: description,
        contactNumber: phone,
        websiteUrls: website ? [website] : [],
        categoryIds: selectedCategoryIds,
        yearsOfOperation: years ? Number(years) : undefined,
      });

      if (logoFile || bannerFile) {
        await OngSetupService.updateProfileImages(
          logoFile,
          bannerFile,
          bannerFile ? bannerCrop : undefined
        );
      }

      await BankAccountService.saveAccount({
        bankName,
        agencyNumber,
        accountNumber,
        accountType,
        pixKey
      });

      router.push("/ong-dashboard");
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      const errorMessage = error.message?.includes("avatar")
        ? "Erro ao processar a imagem. Tente usar um formato .jpg ou .png menor."
        : error.message || "Houve um erro ao salvar seu perfil.";
      alert(errorMessage);
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
          onCropChange={setBannerCrop}
          label="Adicionar Foto de Capa"
        />

        <button
          onClick={() => router.push("/ong-dashboard")}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

          <FormSection title="Canais de Contato" italicTitle>
            <div className="space-y-3 sm:space-y-4">
              <InputGroup icon={Phone} placeholder="WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <InputGroup
                icon={Instagram}
                placeholder="Link do Instagram ou Site"
                iconColor="text-pink-400"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </FormSection>

          <FormSection title="Endereço Completo" italicTitle>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <InputGroup
                  icon={Search}
                  placeholder="CEP"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
                <InputGroup
                  icon={Globe2}
                  placeholder="País"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <InputGroup
                icon={MapPinned}
                placeholder="Rua / Logradouro"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="w-full sm:w-1/3">
                  <InputGroup
                    icon={Milestone}
                    placeholder="Nº"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-2/3">
                  <InputGroup
                    icon={Info}
                    placeholder="Complemento (Apto, Bloco...)"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                  />
                </div>
              </div>

              <InputGroup
                icon={Navigation}
                placeholder="Bairro"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
              />

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="col-span-2">
                  <InputGroup
                    icon={Building2}
                    placeholder="Cidade"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <InputGroup
                    icon={Flag}
                    placeholder="UF"
                    value={state}
                    maxLength={2}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                  />
                </div>
              </div>
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

          <FormSection title="Dados para Recebimento" icon={Wallet} className="bg-gradient-to-br from-white to-purple-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-purple-400 mb-1 block ml-1">Instituição Bancária</label>
                <input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Ex: Nubank, Itaú, Banco do Brasil..."
                  className="w-full bg-white p-4 rounded-xl border border-gray-100 outline-none text-sm focus:border-purple-300 transition-colors shadow-sm"
                />
              </div>

              <CustomSelect
                label="Tipo de Conta"
                value={accountType}
                options={accountTypeOptions}
                onChange={setAccountType}
              />

              <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase text-purple-400 mb-1 block ml-1">Chave PIX</label>
                <input
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="CPF, E-mail, Telefone ou Chave"
                  className="w-full bg-white p-4 rounded-xl border border-gray-100 outline-none text-sm focus:border-purple-300 transition-colors shadow-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase text-purple-400 mb-1 block ml-1">Agência</label>
                <input
                  value={agencyNumber}
                  onChange={(e) => setAgencyNumber(e.target.value)}
                  placeholder="0001"
                  className="w-full bg-white p-4 rounded-xl border border-gray-100 outline-none text-sm focus:border-purple-300 transition-colors shadow-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase text-purple-400 mb-1 block ml-1">Conta com Dígito</label>
                <input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="123456-7"
                  className="w-full bg-white p-4 rounded-xl border border-gray-100 outline-none text-sm focus:border-purple-300 transition-colors shadow-sm"
                />
              </div>
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
              {items.map((item) => (
                <span
                  key={item.id}
                  className="flex items-center gap-2 bg-purple-50 text-[#4a1d7a] px-3 py-1.5 rounded-full text-[11px] font-black border border-purple-100"
                >
                  {item.description}
                  <Trash2
                    size={12}
                    className="cursor-pointer text-red-400 hover:text-red-600 transition-colors"
                    onClick={() => handleDeleteItem(item.id)}
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