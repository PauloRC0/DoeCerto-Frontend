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
    const [resProfile, resReviews] = await Promise.all([
      api<any>(`/ongs/${ongId}/profile`), // ✅ Ajustado para a rota correta do controller
      api<any>(`/ongs/${ongId}/ratings`)
    ]);

    const source = resProfile.data;

    return {
      id: source.id,
      name: source.name || "ONG sem nome",
      cnpj: source.cnpj || "Não informado",
      banner: this._formatImageUrl(source.bannerUrl),
      logo: this._formatImageUrl(source.avatarUrl),
      description: source.about || "ONG verificada.",
      phone: source.contactNumber || "Não informado",
      instagram: source.websiteUrl || "Não informado",
      address: source.address ? `${source.address.city}, ${source.address.state}` : "Endereço não informado",
      distance: "—", 
      years: this._calculateYears(source.createdAt || new Date()),
      numberOfRatings: source.rating?.count || 0,
      rating: Number(source.rating?.average) || 0,
      donations: source.receivedDonations || 0,
      categories: source.categories || [],
      reviews: resReviews.data || []
    };
  },

  /**
   * ADICIONADO: Envia a avaliação para a API
   */
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