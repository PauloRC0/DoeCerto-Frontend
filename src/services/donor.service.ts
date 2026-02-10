import { api } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UpdateProfileDTO {
  contactNumber?: string;
  bio?: string;
}

export interface DonorProfileData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  avatarUrl: string | null;
  bio: string;
  isNewProfile?: boolean; // Campo extra para controle de modal
}

export interface DonationHistory {
  id: number;
  donationType: "monetary" | "material";
  donationStatus: "pending" | "completed" | "canceled";
  monetaryAmount?: number;
  materialDescription?: string;
  createdAt: string;
  ong: {
    user: {
      name: string;
    };
  };
}
export const DonorService = {
  _formatImageUrl(path: string | null): string | null {
    if (!path) return null;
    const cleanPath = path.replace(/\\/g, "/");
    return `${API_URL}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
  },

  /**
   * Busca os dados do perfil.
   * Se retornar 404, o objeto é devolvido com isNewProfile: true.
   */
  async getMyProfile(): Promise<DonorProfileData> {
    try {
      const { data } = await api<any>("/donors/me/profile");
      return {
        ...this._mapProfileData(data),
        isNewProfile: false
      };
    } catch (error: any) {
      // Captura o erro 404 vindo do api.ts
      if (error.status === 404 || error.message?.includes("404")) {
        console.warn("Doador novo detectado (sem perfil no banco).");
        return {
          name: "",
          email: "",
          cpf: "",
          phone: "",
          avatarUrl: null,
          bio: "",
          isNewProfile: true // Identificador para abrir o modal no frontend
        };
      }
      throw error;
    }
  },

  /**
   * Cria ou Atualiza o perfil (Upsert).
   * Envia multipart/form-data se houver arquivo, ou JSON para textos.
   */
  async updateProfile(payload: FormData | UpdateProfileDTO): Promise<DonorProfileData> {
    const isFormData = payload instanceof FormData;

    const { data } = await api<any>("/donors/me/profile", {
      method: "POST", // POST em rotas de perfil costuma ser usado para criação/atualização
      body: isFormData ? payload : JSON.stringify(payload),
      headers: isFormData ? {} : { "Content-Type": "application/json" }
    });

    return this._mapProfileData(data);
  },

  async updateAccountName(name: string): Promise<void> {
    // Aqui usamos o helper 'api' que já está importado no arquivo do service
    await api('/users/me', {
      method: "PATCH",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" }
    });
  },


async getDonationHistory(): Promise<DonationHistory[]> {
  try {
    const response = await api<any>('/donations/me/sent', {
      method: 'GET',
    });

    // Sua API NestJS retorna { data: [...], pagination: {...} }
    // O Axios/Helper costuma colocar isso dentro de outra propriedade data.
    const rawArray = response?.data?.data || response?.data || [];

    if (!Array.isArray(rawArray)) return [];

    return rawArray.map((d: any) => ({
      id: d.id,
      donationType: d.donationType.toLowerCase(),
      donationStatus: d.donationStatus.toLowerCase(),
      monetaryAmount: d.monetaryAmount,
      materialDescription: d.materialDescription,
      createdAt: d.createdAt,
      ong: {
        user: {
          name: d.ong?.user?.name || "Instituição"
        }
      }
    }));
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }
},
  _mapProfileData(data: any): DonorProfileData {
    if (!data) return { name: "", email: "", cpf: "", phone: "", avatarUrl: null, bio: "" };

    const donor = data.donor || data;
    const user = donor.user || data.user || {};

    return {
      name: user.name || donor.name || "",
      email: user.email || donor.email || "",
      cpf: donor.cpf || "",
      phone: data.contactNumber || donor.contactNumber || "",
      avatarUrl: this._formatImageUrl(data.avatarUrl || donor.profile?.avatarUrl),
      bio: data.bio || ""
    };
  }
};