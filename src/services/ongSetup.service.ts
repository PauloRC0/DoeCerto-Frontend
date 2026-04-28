import { api } from './api';

export interface OngUpdateData {
  description?: string;
  contactNumber?: string;
  websiteUrls?: string[];
  yearsOfOperation?: number;
  categoryIds?: number[];
}

export const OngSetupService = {
  async getCategories() {
    const { data } = await api<any>('/categories?take=100');
    return data?.data || data || [];
  },

  async updateProfileData(data: OngUpdateData) {
    let url = (data.websiteUrls && data.websiteUrls.length > 0) 
      ? data.websiteUrls[0].trim() 
      : '';

    if (url && !url.startsWith('http')) {
      url = `https://${url}`;
    }

    const payload = {
      description: data.description || '',
      contactNumber: data.contactNumber || '',
      // Ajustado para Array conforme exigido pelo seu DTO (@IsArray)
      website: url ? [url] : [], 
      categoryIds: data.categoryIds ? data.categoryIds.map(Number) : [],
      yearsOfOperation: data.yearsOfOperation || null,
    };

    return api('/ongs/me/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  async updateProfileImages(
    avatar?: File | null, 
    banner?: File | null, 
    bannerCrop?: { x: number; y: number }
  ) {
    if (!avatar && !banner) return;
    const formData = new FormData();
    
    if (avatar instanceof File) formData.append('avatar', avatar);
    if (banner instanceof File) {
      formData.append('banner', banner);
      if (bannerCrop) {
        formData.append('bannerCropX', String(Math.round(bannerCrop.x)));
        formData.append('bannerCropY', String(Math.round(bannerCrop.y)));
      }
    }
    
    return api('/ongs/me/profile', { 
      method: 'POST', 
      body: formData 
    });
  },
};