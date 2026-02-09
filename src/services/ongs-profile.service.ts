import { api } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const OngsProfileService = {
  _formatImageUrl(path: string | null) {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/\\/g, "/");
    return `${API_URL}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
  },

  _calculateYears(createdAt: string | Date) {
    const yearCreated = new Date(createdAt).getFullYear();
    const diff = new Date().getFullYear() - yearCreated;
    return diff <= 0 ? "Novo" : `${diff} ${diff === 1 ? 'ano' : 'anos'}`;
  },

  async getPublicProfile(ongId: number) {
    try {
      // Fazemos as chamadas em paralelo para performance
      const [resBase, resProfile, resReviews] = await Promise.all([
        api<any>(`/ongs/${ongId}`).catch(() => ({ data: {} })),         // Cadastro
        api<any>(`/ongs/${ongId}/profile`).catch(() => ({ data: {} })), // Perfil
        api<any>(`/ongs/${ongId}/ratings`).catch(() => ({ data: [] }))  // Avaliações
      ]);

      const base = resBase.data;
      const profile = resProfile.data;

      return {
        id: base.id || profile.id || ongId,
        name: profile.name || base.name || base.user?.name || "ONG sem nome",
        cnpj: base.cnpj || base.ong?.cnpj || profile.cnpj || profile.ong?.cnpj || "CNPJ não informado",
        banner: this._formatImageUrl(profile.bannerUrl || base.bannerUrl),
        logo: this._formatImageUrl(profile.avatarUrl || base.avatarUrl),
        description: profile.about || profile.bio || base.about || "ONG verificada.",
        
        phone: profile.contactNumber || base.contactNumber || "Não informado",
        instagram: profile.websiteUrl || base.websiteUrl || "Não informado",
        
        address: profile.address?.city 
          ? `${profile.address.city}, ${profile.address.state}` 
          : (base.address || "Endereço não informado"),
        
        years: this._calculateYears(base.createdAt || profile.createdAt || new Date()),
        numberOfRatings: profile.rating?.count || base.numberOfRatings || 0,
        rating: Number(profile.rating?.average || base.averageRating || 0),
        categories: profile.categories || base.categories || [],
        reviews: Array.isArray(resReviews.data) ? resReviews.data : (resReviews.data?.data || []),
        
        donations: profile.receivedDonations || base.receivedDonations || 0,
        distance: base.distance || "—"
      };
    } catch (error) {
      console.error("Erro crítico no OngsProfileService:", error);
      throw error;
    }
  },

  async postReview(ongId: number, score: number, comment: string) {
    return api(`/ongs/${ongId}/ratings`, {
      method: "POST",
      body: JSON.stringify({ score, comment }),
    });
  },

  async getMyProfile() {
    const { data } = await api<any>('/ongs/me/profile');
    return {
      ...data,
      name: data.name || "ONG sem nome",
      avatarUrl: this._formatImageUrl(data.avatarUrl),
      bannerUrl: this._formatImageUrl(data.bannerUrl),
      displayYears: this._calculateYears(data.createdAt || new Date()),
      stats: {
        donations: data.receivedDonations || 0,
        ratingAverage: Number(data.rating?.average) || 0,
      }
    };
  }
};