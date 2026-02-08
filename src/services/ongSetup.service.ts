import { api } from './api';

export interface OngUpdateData {
  about?: string;
  contactNumber?: string;
  address?: string; 
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

  // Chamada para dados textuais
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

  // Chamada para imagens
  async updateProfileImages(avatar?: File, banner?: File) {
    const formData = new FormData();

    if (avatar) formData.append('avatar', avatar);
    if (banner) formData.append('banner', banner);

    return api('/ongs/me/profile', {
      method: 'POST',
      body: formData,
    });
  },
};