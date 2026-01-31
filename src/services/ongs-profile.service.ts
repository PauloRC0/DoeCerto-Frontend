import { api } from './api';

export interface Category {
  id: number;
  name: string;
}

export interface OngProfileData {
  bio?: string;
  contactNumber?: string;
  address?: string;
  websiteUrl?: string;
  categoryIds?: number[];
  logoFile?: File;
}

export const OngProfileService = {
  /**
   * Busca o perfil completo da ONG logada.
   * Rota: GET /ongs/me/profile
   */
async getMyProfile() {
  // Remova qualquer tentativa de passar parâmetros aqui
  const { data } = await api<unknown>('/ongs/me/profile'); 
  return data;
},

  /**
   * Lista todas as categorias disponíveis para seleção no formulário.
   * Rota: GET /categories
   */
  async getCategories() {
    const { data } = await api<{ data?: unknown } | unknown[]>('/categories?take=100');
    // Ajusta o retorno baseado na estrutura comum do NestJS/Prisma (paginada ou array simples)
    return (data && typeof data === 'object' && 'data' in data ? data.data : data) || [];
  },

  /**
   * Salva os dados do perfil e a imagem separadamente.
   * O backend espera JSON para dados e FormData para arquivos.
   */

  // ... getMyProfile e getCategories permanecem iguais

async upsertProfile(data: OngProfileData) {
    // Tratamento do Instagram:
    // Se a ONG digitou "sos_gatinhos" ou "@sos_gatinhos", 
    // transformamos no link completo exigido pelo backend.
    let finalUrl = "";
    if (data.websiteUrl) {
      const handle = data.websiteUrl.replace('@', '').trim();
      if (handle) {
        finalUrl = `https://www.instagram.com/${handle}`;
      }
    }

    const payload = {
      bio: data.bio || '',
      contactNumber: data.contactNumber || '',
      address: data.address || '',
      websiteUrl: finalUrl, // Agora é uma URL válida para o backend
      categoryIds: (data.categoryIds || []).map(id => Number(id)),
    };

    // 1. Envio dos dados JSON
    await api('/ongs/me/profile', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // 2. Upload da imagem se houver arquivo
    if (data.logoFile) {
      const formData = new FormData();
      formData.append('file', data.logoFile);

      return api('/ongs/me/profile', {
        method: 'POST',
        body: formData,
      });
    }
  }
};