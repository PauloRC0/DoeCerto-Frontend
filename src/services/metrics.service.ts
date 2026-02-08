import { api } from "./api";

// --- Tipos ---
export interface CategoryData {
  id: number;
  name: string;
}

export interface MetricItem {
  id: number;
  name: string;
  value: number;
  category?: string;
}

export interface CategoryStats {
  name: string;
  count: number;
  percentage: number;
}

export interface GeneralStats {
  totalOngs: number;
  totalDonors: number;
}

export interface MetricsData {
  topOngsByDonationCount: MetricItem[]; // ONGs que mais receberam doações (Qtd)
  topDonorsByFrequency: MetricItem[];   // Doadores que mais doaram (Qtd)
  topPositiveRatings: MetricItem[];
  topNegativeRatings: MetricItem[];
  categoriesStats: CategoryStats[];
  generalStats: GeneralStats;
}

// --- Configuração de Mock ---
// Mude para 'false' quando a API estiver pronta
const USE_MOCK = true;

// --- Serviços de Categorias ---

export async function getCategories(skip = 0, take = 10): Promise<{ data: CategoryData[], total: number }> {
  const { data } = await api<any>(`/categories?skip=${skip}&take=${take}`);
  return {
    data: data.data || data,
    total: data.pagination?.total || data.total || 0
  };
}

export async function createCategory(categoryData: { name: string }): Promise<CategoryData> {
  const { data } = await api<any>('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
  return data.data || data;
}

export async function updateCategory(id: number, categoryData: { name: string }): Promise<CategoryData> {
  const { data } = await api<any>(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(categoryData),
  });
  return data.data || data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api(`/categories/${id}`, { method: 'DELETE' });
}

// --- Serviços de Métricas ---

export async function getMetrics(): Promise<MetricsData> {
  try {
    if (USE_MOCK) return getMockedMetrics();

    const { data } = await api<any>('/admin/metrics');
    
    return {
      topOngsByDonationCount: normalizeMetrics(data.topOngsByDonationCount),
      topDonorsByFrequency: normalizeMetrics(data.topDonorsByFrequency),
      topPositiveRatings: normalizeMetrics(data.topPositiveRatings),
      topNegativeRatings: normalizeMetrics(data.topNegativeRatings),
      categoriesStats: normalizeCategoryStats(data.categoriesStats || []),
      generalStats: {
        totalOngs: data.generalStats?.totalOngs || 0,
        totalDonors: data.generalStats?.totalDonors || 0,
      }
    };
  } catch (error) {
    console.error('Erro ao carregar métricas:', error);
    return getMockedMetrics();
  }
}

// --- Funções Auxiliares ---

function normalizeMetrics(rawData: any[] = []): MetricItem[] {
  return rawData.map((item: any) => ({
    id: item.id || Math.random(),
    name: item.name || 'Não informado',
    value: item.value || item.count || 0,
    category: item.category || '',
  }));
}

function normalizeCategoryStats(rawData: any[]): CategoryStats[] {
  const stats = rawData.map((item: any) => ({
    name: item.name || 'Sem categoria',
    count: item.count || 0,
    percentage: item.percentage || 0,
  }));

  const total = stats.reduce((sum, stat) => sum + stat.count, 0);
  return stats.map(stat => ({
    ...stat,
    percentage: total > 0 ? Math.round((stat.count / total) * 100) : 0,
  }));
}

function getMockedMetrics(): MetricsData {
  return {
    topOngsByDonationCount: [
      { id: 1, name: 'ONG Vida Animal', value: 154, category: 'Pets' },
      { id: 2, name: 'Educação para Todos', value: 120, category: 'Educação' },
      { id: 3, name: 'EcoMundo', value: 89, category: 'Meio Ambiente' },
    ],
    topDonorsByFrequency: [
      { id: 1, name: 'Carlos Silva', value: 42 },
      { id: 2, name: 'Ana Oliveira', value: 38 },
      { id: 3, name: 'Marcos Souza', value: 25 },
    ],
    topPositiveRatings: [
      { id: 1, name: 'ONG Vida Animal', value: 5.0, category: 'Pets' },
      { id: 2, name: 'Educação para Todos', value: 4.8, category: 'Educação' },
    ],
    topNegativeRatings: [
      { id: 10, name: 'ONG Teste Errado', value: 1.5, category: 'Geral' },
    ],
    categoriesStats: [
      { name: 'Educação', count: 10, percentage: 50 },
      { name: 'Saúde', count: 5, percentage: 25 },
      { name: 'Pets', count: 5, percentage: 25 },
    ],
    generalStats: {
      totalOngs: 20,
      totalDonors: 450,
    }
  };
}