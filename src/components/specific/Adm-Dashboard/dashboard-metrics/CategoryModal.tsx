"use client";

import { useState, useEffect } from 'react';
import { X, Tag, Trash2, AlertTriangle } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory, type CategoryData } from '@/services/metrics.service';
import toast from 'react-hot-toast';

// --- INTERFACES ---
interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingCategory?: CategoryData | null;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: { id: string; name: string } | null;
}

// --- MODAL DE CADASTRO E EDIÇÃO ---
export function CategoryModal({ isOpen, onClose, onSuccess, editingCategory }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingCategory) setName(editingCategory.name);
    else setName('');
  }, [editingCategory, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Nome da categoria é obrigatório');

    setLoading(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name: name.trim() });
        toast.success('Categoria atualizada!');
      } else {
        await createCategory({ name: name.trim() });
        toast.success('Categoria criada!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar categoria');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-2xl">
              <Tag size={24} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs font-black text-purple-400 uppercase tracking-wider mb-3">Nome da Categoria</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Educação, Saúde..."
              className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-purple-200 focus:outline-none font-bold text-gray-900 transition-all"
              required
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#6B39A7] text-white py-4 rounded-2xl font-black hover:bg-[#5a2d8f] disabled:opacity-50 shadow-lg shadow-purple-200 transition-all">
              {loading ? 'Salvando...' : editingCategory ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- MODAL DE EXCLUSÃO ---
export function DeleteCategoryModal({ isOpen, onClose, onSuccess, category }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !category) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCategory(Number(category.id));
      toast.success('Categoria excluída!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao excluir categoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl border border-red-50 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-3xl text-red-600">
            <AlertTriangle size={40} />
          </div>
        </div>

        <h3 className="text-2xl font-black text-gray-900 mb-2">Excluir Categoria?</h3>
        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
          Você está prestes a apagar <span className="text-red-600 font-bold">"{category.name}"</span>. 
          Esta ação não pode ser desfeita.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-black hover:bg-red-700 disabled:opacity-50 shadow-lg shadow-red-100 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Apagando...' : <><Trash2 size={20} /> Sim, excluir</>}
          </button>
          
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}