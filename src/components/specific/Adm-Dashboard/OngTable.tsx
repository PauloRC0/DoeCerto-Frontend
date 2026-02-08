"use client";

import { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Eye, 
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { 
  getOngsByStatus,
  approveOng,
  rejectOng,
  type OngAdminData
} from '@/services/admin.service';
import toast from 'react-hot-toast';

type OngStatus = 'pending' | 'approved' | 'rejected';

// --- SUB-COMPONENTE: BADGE DE STATUS ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
  };
  const label = status === 'approved' ? 'Aprovada' : status === 'rejected' ? 'Rejeitada' : 'Pendente';
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${styles[status as keyof typeof styles] || styles.pending}`}>
      {label}
    </span>
  );
};

// --- SUB-COMPONENTE: MODAL DE APROVAÇÃO ---
const ApproveModal = ({ isOpen, onClose, onConfirm, ongName }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Aprovar ONG?</h3>
        <p className="text-gray-500 mb-8">Deseja confirmar a aprovação da ONG <br/><span className="font-bold text-gray-900">{ongName}</span>?</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-black hover:bg-gray-200 transition-colors">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-black hover:bg-green-700 shadow-lg shadow-green-200 transition-colors">Aprovar</button>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTE: MODAL DE REJEIÇÃO ---
const RejectModal = ({ isOpen, onClose, onConfirm, reason, setReason }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
        <h3 className="text-2xl font-black text-gray-900 mb-6">Motivo da Rejeição</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Descreva o motivo..."
          className="w-full px-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-red-200 focus:outline-none h-32 mb-6 resize-none"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-black hover:bg-gray-200">Cancelar</button>
          <button 
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason)} 
            className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-black hover:bg-red-700 disabled:opacity-50 shadow-lg shadow-red-200 transition-all"
          >
            Rejeitar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTE: MODAL DE DETALHES ---
const DetailsModal = ({ ong, onClose, status, onApproveClick, onRejectClick }: any) => {
  if (!ong) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] max-w-2xl w-full p-10 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-black text-gray-900">Dados da ONG</h3>
          <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"><X size={24} /></button>
        </div>
        <div className="space-y-8">
          <div className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl border border-gray-100">
            <StatusBadge status={ong.status} />
            <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
              <Calendar size={16} /> {new Date(ong.createdAt).toLocaleDateString('pt-BR')}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section><label className="text-xs font-black text-purple-400 uppercase tracking-wider block mb-2">Nome</label><p className="text-lg font-black text-gray-900">{ong.name}</p></section>
            <section><label className="text-xs font-black text-purple-400 uppercase tracking-wider block mb-2">CNPJ</label><p className="text-lg font-bold text-gray-900">{ong.cnpj}</p></section>
            <section><label className="text-xs font-black text-purple-400 uppercase tracking-wider block mb-2">E-mail</label><p className="text-gray-700 font-bold">{ong.email}</p></section>
            <section><label className="text-xs font-black text-purple-400 uppercase tracking-wider block mb-2">Telefone</label><p className="text-gray-700 font-bold">{ong.contactNumber || 'Não informado'}</p></section>
          </div>
          <div className="flex gap-4 pt-8 border-t border-gray-100">
            {status !== 'approved' && <button onClick={() => onApproveClick(ong)} className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95">Aprovar</button>}
            {status !== 'rejected' && <button onClick={() => onRejectClick(ong.id)} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-95">Rejeitar</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function OngTableWithAPI({ status, onClose, onUpdate }: any) {
  const [ongs, setOngs] = useState<OngAdminData[]>([]);
  const [allOngs, setAllOngs] = useState<OngAdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [selectedOng, setSelectedOng] = useState<any>(null);
  const [ongToApprove, setOngToApprove] = useState<any>(null);
  const [ongToRejectId, setOngToRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const itemsPerPage = 10;

  useEffect(() => { loadOngs(); }, [status]);

  useEffect(() => {
    if (allOngs.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      setOngs(allOngs.slice(startIndex, startIndex + itemsPerPage));
    }
  }, [currentPage, allOngs]);

  const loadOngs = async () => {
    setLoading(true);
    try {
      const response = await getOngsByStatus(status, 0, 1000);
      const data = response.data || [];
      setAllOngs(data);
      setTotal(data.length);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmApprove = async () => {
    try {
      await approveOng(ongToApprove.id);
      toast.success('ONG aprovada!');
      setOngToApprove(null);
      setSelectedOng(null);
      loadOngs();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Falha na aprovação');
    }
  };

  const handleConfirmReject = async (reason: string) => {
    try {
      await rejectOng(ongToRejectId!, reason);
      toast.success('ONG rejeitada!');
      setOngToRejectId(null);
      setRejectReason('');
      setSelectedOng(null);
      loadOngs();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Falha na rejeição');
    }
  };

  const config = {
    pending: { title: 'ONGs Pendentes', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    approved: { title: 'ONGs Aprovadas', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    rejected: { title: 'ONGs Recusadas', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
  }[status as OngStatus];

  return (
    <div className="h-full flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
      {/* Header do Card */}
      <div className={`${config.bg} border-b ${config.border} p-8`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-3xl font-black ${config.color} tracking-tight`}>{config.title}</h2>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Total: {total}</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-3 hover:bg-white/60 rounded-2xl transition-all"><X size={24} className={config.color} /></button>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-[6px] border-purple-100 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full">
            {/* CABEÇALHO OPACO: bg-gray-50 sólido e z-index garantido */}
            <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wide">Nome</th>
                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wide">E-mail</th>
                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wide">CNPJ</th>
                <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ongs.map((ong) => (
                <tr key={ong.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 size={20} />
                      </div>
                      <p className="font-black text-gray-900">{ong.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-600 font-bold">{ong.email}</td>
                  <td className="px-8 py-5 text-sm text-gray-600 font-bold">{ong.cnpj}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => setSelectedOng(ong)} title="Ver Detalhes" className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Eye size={18} /></button>
                      {status !== 'approved' && <button onClick={() => setOngToApprove(ong)} title="Aprovar" className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"><Check size={18} /></button>}
                      {status !== 'rejected' && <button onClick={() => setOngToRejectId(ong.id)} title="Rejeitar" className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><X size={18} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginação */}
      {total > itemsPerPage && (
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Página {currentPage} de {Math.ceil(total/itemsPerPage)}</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 rounded-xl border-2 border-gray-200 disabled:opacity-20 hover:bg-white transition-all"><ChevronLeft size={20} /></button>
            <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(total/itemsPerPage), p + 1))} disabled={currentPage >= total/itemsPerPage} className="p-3 rounded-xl border-2 border-gray-200 disabled:opacity-20 hover:bg-white transition-all"><ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Modais */}
      <DetailsModal ong={selectedOng} status={status} onClose={() => setSelectedOng(null)} onApproveClick={(ong: any) => setOngToApprove(ong)} onRejectClick={(id: number) => setOngToRejectId(id)} />
      <ApproveModal isOpen={!!ongToApprove} ongName={ongToApprove?.name} onClose={() => setOngToApprove(null)} onConfirm={handleConfirmApprove} />
      <RejectModal isOpen={!!ongToRejectId} reason={rejectReason} setReason={setRejectReason} onClose={() => { setOngToRejectId(null); setRejectReason(''); }} onConfirm={handleConfirmReject} />
    </div>
  );
}