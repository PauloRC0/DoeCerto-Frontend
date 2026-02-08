import { api } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const OngProfileService = {
  /**
   * Corrige caminhos do Windows (\\) para URLs (/) e anexa a URL base.
   */
  formatImageUrl(path: string | null) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    
    const cleanPath = path.replace(/\\/g, "/");
    const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    
    return `${API_URL}${finalPath}`;
  },

  /**
   * Busca o perfil e prepara os dados para o layout do Dashboard.
   */
  async getMyProfile() {
    // Chamada direta da função api conforme seu tipo T
    const { data } = await api<any>('/ongs/me/profile');
    
    // Cálculo de tempo de plataforma
    const yearCreated = data.createdAt ? new Date(data.createdAt).getFullYear() : new Date().getFullYear();
    const currentYear = new Date().getFullYear();
    const diff = currentYear - yearCreated;

    return {
      ...data,
      name: data.name || "ONG sem nome",
      initial: (data.name || "O").charAt(0).toUpperCase(),
      avatarUrl: this.formatImageUrl(data.avatarUrl),
      bannerUrl: this.formatImageUrl(data.bannerUrl),
      // 'about' já vem mapeado corretamente do seu backend revisado
      about: data.about || "Nenhuma descrição disponível.",
      displayYears: diff <= 0 ? "Novo na plataforma" : `${diff} ${diff === 1 ? 'ano' : 'anos'}`,
      stats: {
        donations: data.receivedDonations || 0,
        ratingAverage: Number(data.rating?.average) || 0,
      }
    };
  }
};