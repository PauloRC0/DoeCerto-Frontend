import { api } from './api';

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
   * Busca as doações recebidas pela ONG logada
   * Mapeado para converter os campos do backend para o padrão do frontend
   */
  async getReceivedDonations(params?: { type?: 'monetary' | 'material'; skip?: number; take?: number }) {
    try {
      const queryString = params && Object.keys(params).length > 0
        ? `?${new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as any).toString()}`
        : '';

      const response = await api<any>(`/donations/me/received${queryString}`);
      
      // Conforme seu console: response.data (corpo) -> data (objeto) -> data (array)
      const rawArray = response?.data?.data?.data || response?.data?.data || [];
      
      if (!Array.isArray(rawArray)) return [];

      // Mapeamento de propriedades (Backend -> Frontend)
      return rawArray.map((item: any) => ({
        id: item.id,
        // Converte 'monetary'/'material' e o status para o formato esperado pelo componente
        type: item.donationType?.toLowerCase() || 'material',
        status: item.donationStatus?.toUpperCase() || 'PENDING',
        amount: item.monetaryAmount,
        materialDescription: item.materialDescription,
        materialQuantity: item.materialQuantity,
        proofUrl: item.proofUrl,
        createdAt: item.createdAt,
        donor: {
          user: {
            name: item.donor?.user?.name || "Doador Anônimo"
          }
        }
      })) as DonationService[];

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
    const { data } = await api<DonationService>(`/donations/${id}`);
    return data;
  }
};