"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  Star, 
  Users,
  Building2,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Heart,
  Award
} from 'lucide-react';
import { getMetrics, getCategories, deleteCategory, type MetricsData, type CategoryData } from '@/services/metrics.service';
import CategoryModal from './CategoryModal';
import toast from 'react-hot-toast';

export default function MetricsPanel() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCategories, setTotalCategories] = useState(0);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

  const TAKE = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [metricsData, categoriesResponse] = await Promise.all([
        getMetrics(),
        getCategories(0, TAKE)
      ]);
      setMetrics(metricsData);
      setCategories(categoriesResponse.data);
      setTotalCategories(categoriesResponse.total);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreCategories = async () => {
    if (loadingMore || categories.length >= totalCategories) return;

    setLoadingMore(true);
    try {
      const response = await getCategories(categories.length, TAKE);
      setCategories(prev => [...prev, ...response.data]);
    } catch (error) {
      console.error('Erro ao carregar mais categorias:', error);
      toast.error('Erro ao carregar mais categorias');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCategorySuccess = () => {
    loadData();
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (confirm(`Deseja realmente excluir a categoria "${name}"?`)) {
      try {
        await deleteCategory(id);
        toast.success('Categoria excluída!');
        loadData();
      } catch (error) {
        toast.error('Erro ao excluir categoria');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-[6px] border-purple-100 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-[#F8F9FA] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-[#6B39A7] tracking-tight">Painel de Métricas</h1>
          <p className="text-gray-500 font-bold mt-2">Gerenciamento de Engajamento e Categorias</p>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={<Building2 size={32} />}
          title="ONGs Cadastradas"
          value={metrics?.generalStats.totalOngs.toString() || '0'}
          color="bg-blue-500"
        />
        <StatCard
          icon={<Users size={32} />}
          title="Total de Doadores"
          value={metrics?.generalStats.totalDonors.toLocaleString('pt-BR') || '0'}
          color="bg-purple-500"
        />
      </div>

      {/* Grid de Rankings Padronizados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RankingCard
          title="ONGs: Mais Doadas (Qtd)"
          icon={<Heart size={24} />}
          items={metrics?.topOngsByDonationCount || []}
          color="text-red-600"
          bgColor="bg-red-50"
          valueFormatter={(val: number) => `${val} doações`}
        />

        <RankingCard
          title="Maiores Doadores (Frequência)"
          icon={<Award size={24} />}
          items={metrics?.topDonorsByFrequency || []}
          color="text-blue-600"
          bgColor="bg-blue-50"
          valueFormatter={(val: number) => `${val} contribuições`}
        />

        <RankingCard
          title="Melhores Avaliadas"
          icon={<Star size={24} />}
          items={metrics?.topPositiveRatings || []}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
          valueFormatter={(val: number) => `${val.toFixed(1)} ⭐`}
        />

        <RankingCard
          title="Avaliações Baixas"
          icon={<TrendingDown size={24} />}
          items={metrics?.topNegativeRatings || []}
          color="text-red-500"
          bgColor="bg-red-50"
          valueFormatter={(val: number) => `${val.toFixed(1)} ⭐`}
        />
      </div>

      {/* Análise de Categorias */}
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-2xl">
              <Tag size={24} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Distribuição por Categoria</h2>
          </div>
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 bg-[#6B39A7] text-white px-6 py-3 rounded-2xl font-black hover:bg-[#5a2d8f] transition-all shadow-lg"
          >
            <Plus size={20} />
            Nova Categoria
          </button>
        </div>

        <div className="space-y-4">
          {metrics?.categoriesStats.map((cat, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-gray-900">{cat.name}</span>
                <span className="text-sm font-bold text-gray-500">{cat.count} ONGs ({cat.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 rounded-2xl">
            <Tag size={24} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Lista de Categorias</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(categories) ? categories.map((category) => (
            <div key={category.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 hover:border-purple-300 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Tag size={20} className="text-purple-600" />
                  </div>
                  <h3 className="font-black text-gray-900">{category.name}</h3>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingCategory(category);
                      setShowCategoryModal(true);
                    }}
                    className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )) : null}
        </div>

        {categories.length < totalCategories && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMoreCategories}
              disabled={loadingMore}
              className="bg-[#6B39A7] text-white px-8 py-3 rounded-2xl font-black hover:bg-[#5a2d8f] disabled:opacity-50 shadow-lg transition-all"
            >
              {loadingMore ? 'Carregando...' : 'Ver Mais'}
            </button>
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(null);
        }}
        onSuccess={handleCategorySuccess}
        editingCategory={editingCategory}
      />
    </div>
  );
}

function StatCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
      <div className="flex items-center gap-4">
        <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}

function RankingCard({ title, icon, items, color, bgColor, valueFormatter }: any) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 ${bgColor} rounded-2xl`}>
          {React.cloneElement(icon, { className: color })}
        </div>
        <h2 className="text-2xl font-black text-gray-900">{title}</h2>
      </div>
      <div className="space-y-3">
        {items.map((item: any, idx: number) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
            <div className="flex items-center gap-4">
              <span className={`text-2xl font-black ${color}`}>#{idx + 1}</span>
              <div>
                <p className="font-black text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-400 font-bold lowercase italic">
                  {item.email || 'contato@ong.org'}
                </p>
              </div>
            </div>
            <span className={`text-xl font-black ${color}`}>{valueFormatter(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}