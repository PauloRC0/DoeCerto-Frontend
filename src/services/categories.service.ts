// Função utilitária para mapear os campos personalizados de cada ONG
function mapOngFields(ong: any, sectionType: string): Ong {
  const rawPath = ong.avatarUrl || ong.profile?.avatarUrl || (ong.user && ong.user.avatarUrl);
  const cats = ong.categories?.map((c: any) => c.name) || [];
  let distance: string | number = "";
  if (sectionType === "nearby") {
    distance = typeof ong.distance === "number" ? ong.distance : ong.distance ?? "";
  } else {
    distance = "";
  }
  return {
    id: ong.userId || ong.id,
    name: ong.name || (ong.user && ong.user.name) || "ONG sem nome",
    img: rawPath ? (rawPath.startsWith("/") ? rawPath : OngsProfileService._formatImageUrl(rawPath)) : "",
    distance: distance.toString(),
    categories: cats.length > 0 ? cats : ["Outros"],
    donationCount: ong.donationCount,
    averageRating: ong.averageRating,
    numberOfRatings: ong.numberOfRatings,
    formattedDate: ong.formattedDate,
  };
}
import { OngsProfileService } from "./ongs-profile.service";

export type Ong = {
  id: number;
  name: string;
  img: string;
  distance: string;
  categories: string[];
  donationCount?: number;
  averageRating?: number;
  numberOfRatings?: number;
  formattedDate?: string;
};

export type CatalogSection = {
  type: string;
  title: string;
  items: Ong[];
};
/**
 * Busca e mapeia as seções do catálogo para uso direto no componente
 */
export async function getMappedCatalogSections(filters: CatalogFilters = {}) {
  try {
    const data = await getCatalog(filters);
    if (!data || !Array.isArray(data)) return [];

    return data.map((section: any) => {
      const items: Ong[] = (section.items || []).map((ong: any) => mapOngFields(ong, section.type));
      return {
        type: section.type,
        title: section.title || section.type,
        items,
      };
    });
  } catch (error) {
    console.error("Erro ao mapear catálogo:", error);
    return [];
  }
}
import { api } from "./api";

export interface Category {
  id: number;
  name: string;
}

export interface CatalogFilters {
  searchTerm?: string;
  categoryIds?: number | number[];
  offset?: number;
  limit?: number;
}

/**
 * Busca categorias do back-end
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await api<any>("/categories?take=100");
    
    // Tratamento de resposta flexível para arrays ou objetos envelopados
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data;
    
    return [];
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
}

/**
 * Busca o catálogo seguindo a lógica do seu CatalogService (NestJS)
 */
export async function getCatalog(filters: CatalogFilters = {}) {
  try {
    const queryParams = new URLSearchParams();

    if (filters.searchTerm?.trim()) {
      queryParams.append("searchTerm", filters.searchTerm.trim());
    }

    if (filters.categoryIds) {
      const ids = Array.isArray(filters.categoryIds) ? filters.categoryIds : [filters.categoryIds];
      ids.forEach(id => queryParams.append("categoryIds", id.toString()));
    }

    if (filters.offset !== undefined) queryParams.append("offset", filters.offset.toString());
    if (filters.limit !== undefined) queryParams.append("limit", filters.limit.toString());

    const { data } = await api<any>(`/catalog?${queryParams.toString()}`);
    return data; // Retorna CatalogSectionDto[] ou CatalogSectionDto (se houver busca)
  } catch (error) {
    console.error("Erro ao buscar catálogo:", error);
    throw error;
  }
}