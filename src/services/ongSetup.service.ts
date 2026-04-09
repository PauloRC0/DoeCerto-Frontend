import { api } from './api';

export interface OngUpdateData {
  about?: string;
  contactNumber?: string;
  websiteUrl?: string;
  categoryIds?: number[];
  avatar?: File;
  banner?: File;
}

export const OngSetupService = {
  async getCategories() {
    const { data } = await api<any>('/categories?take=100');
    return data?.data || data || [];
  },

  // ETAPA 1: Dados textuais e Categorias (Envia como JSON - aqui as categorias funcionam)
  async updateProfileData(data: OngUpdateData) {
    let url = data.websiteUrl?.trim();
    if (url && !url.startsWith('http')) url = `https://${url}`;

    const payload = {
      bio: data.about || '',
      contactNumber: data.contactNumber || '',
      websiteUrl: url || '',
      categoryIds: data.categoryIds ? data.categoryIds.map(Number) : [],
    };

    return api('/ongs/me/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  // ETAPA 2: Imagens (Envia como FormData - Corrigido para o seu Backend)
  async updateProfileImages(
    avatar?: File | null,
    banner?: File | null,
    bannerCrop?: { x: number; y: number },
  ) {
    // Se não tem imagem nova, nem chama a API para não dar erro de "processamento"
    if (!avatar && !banner) return;

    const formData = new FormData();

    // Importante: Só anexe se for realmente um arquivo
    if (avatar instanceof File) {
      formData.append('avatar', avatar);
    }
    
    if (banner instanceof File) {
      formData.append('banner', banner);
      if (bannerCrop) {
        formData.append('bannerCropX', String(Math.round(bannerCrop.x)));
        formData.append('bannerCropY', String(Math.round(bannerCrop.y)));
      }
    }

    return api('/ongs/me/profile', {
      method: 'POST',
      // Não passamos headers aqui, o browser resolve o boundary
      body: formData,
    });
  },
};