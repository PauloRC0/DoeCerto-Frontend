import { api } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface DonationService {
  id: number;
  type: 'monetary' | 'material';
  amount?: number;
  materialDescription?: string;
  materialQuantity?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
  proofUrl?: string;
  createdAt: string;
  donor?: {
    user: {
      name: string;
    }
  };
}

export const DonationService = {
  /**
   * Registra uma doação material
   * Rota: POST /donations
   */
async createMaterialDonation(ongId: number, payload: {
    wishlistItemId: number | null | string;
    quantity: number;
    description: string;
  }) {
    try {
      // O backend rejeitou explicitamente a propriedade 'wishlistItemId'.
      // Vamos enviar apenas os dados que ele aceita na rota POST /donations.
      const body: any = {
        ongId: Number(ongId),
        materialQuantity: payload.quantity.toString(),
        materialDescription: payload.description,
        donationType: 'material' 
      };

      console.log("📦 Enviando apenas o que o backend permite:", body);

      const response = await api<any>(`/donations`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      
      return response?.data ?? response;
    } catch (error: any) {
      // Se o erro for 400, o log abaixo ajudará a ver o que sobrou de errado
      console.error("❌ Erro retornado pelo servidor:", error);
      throw error;
    }
  },

  async getReceivedDonations(params?: { type?: 'monetary' | 'material'; skip?: number; take?: number }) {
    try {
      const queryString = params && Object.keys(params).length > 0
        ? `?${new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as any).toString()}`
        : '';

      const response = await api<any>(`/donations/me/received${queryString}`);
      const rawArray = response?.data?.data?.data || response?.data?.data || response?.data || [];

      if (!Array.isArray(rawArray)) return [];

      return rawArray.map((item: any) => {
        let formattedProofUrl = item.proofOfPaymentUrl || item.proofUrl;
        if (formattedProofUrl && !formattedProofUrl.startsWith('http')) {
          const cleanPath = formattedProofUrl.replace(/\\/g, '/').replace(/^\/+/, '');
          formattedProofUrl = `${API_URL}/${cleanPath}`;
        }

        return {
          id: item.id,
          type: item.donationType?.toLowerCase() || 'material',
          status: item.donationStatus?.toUpperCase() || 'PENDING',
          amount: item.monetaryAmount,
          materialDescription: item.materialDescription,
          materialQuantity: item.materialQuantity,
          proofUrl: formattedProofUrl,
          createdAt: item.createdAt,
          donor: { user: { name: item.donor?.user?.name || "Doador Anônimo" } }
        };
      }) as DonationService[];
    } catch (error) {
      console.error("Erro ao buscar doações:", error);
      return [];
    }
  },

  async acceptDonation(id: number) {
    const response = await api<any>(`/donations/${id}/accept`, { method: 'PATCH' });
    return response?.data ?? response;
  },

  async rejectDonation(id: number) {
    const response = await api<any>(`/donations/${id}/reject`, { method: 'PATCH' });
    return response?.data ?? response;
  },

  async getDonationById(id: number) {
    const response = await api<any>(`/donations/${id}`);
    return response?.data ?? response;
  }
};