import { api } from './api';

// 1. Pegamos a URL do .env aqui para usar no mapeamento
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
  async getReceivedDonations(params?: { type?: 'monetary' | 'material'; skip?: number; take?: number }) {
    try {
      const queryString = params && Object.keys(params).length > 0
        ? `?${new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as any).toString()}`
        : '';

      const response = await api<any>(`/donations/me/received${queryString}`);
      
      const rawArray = response?.data?.data?.data || response?.data?.data || [];
      
      if (!Array.isArray(rawArray)) return [];

      return rawArray.map((item: any) => {
        // CORREÇÃO DAS BARRAS: Transforma \ em / para o navegador entender
        let formattedProofUrl = item.proofOfPaymentUrl || item.proofUrl;
        
        if (formattedProofUrl && !formattedProofUrl.startsWith('http')) {
          // Troca \ por / e limpa barras duplas iniciais
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
          proofUrl: formattedProofUrl, // Agora a URL já vai completa e corrigida para o componente
          createdAt: item.createdAt,
          donor: {
            user: {
              name: item.donor?.user?.name || "Doador Anônimo"
            }
          }
        };
      }) as DonationService[];

    } catch (error) {
      console.error("Erro no DonationService.getReceivedDonations:", error);
      return [];
    }
  },

  async acceptDonation(id: number) {
    const { data } = await api<any>(`/donations/${id}/accept`, {
      method: 'PATCH'
    });
    return data;
  },

  async rejectDonation(id: number) {
    const { data } = await api<any>(`/donations/${id}/reject`, {
      method: 'PATCH'
    });
    return data;
  },

  async getDonationById(id: number) {
    const { data } = await api<any>(`/donations/${id}`);
    return data;
  }
};