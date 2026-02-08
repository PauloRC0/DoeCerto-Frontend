"use client";

import { useState, useEffect } from 'react';
// Update the import path below if AdminLayout is located elsewhere
import AdminLayout from '../../layouts/AdminLayout';
import DashboardHome from './DashboardHome';
import OngTable from './OngTable';
import { getMyProfile, getOngsByStatus } from '@/services/admin.service';

type ViewType = 'home' | 'pending' | 'approved' | 'rejected';

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [adminName, setAdminName] = useState<string>('');

  // Carregar informações reais da API
  useEffect(() => {
    loadAdminProfile();
    loadStats();
  }, []);

  const loadAdminProfile = async () => {
    try {
      const profile = await getMyProfile();
      console.log('Admin profile loaded:', profile);
      const name = profile.user.name || 'Administrador';
      console.log('Using name:', name);
      setAdminName(name);
    } catch (error) {
      console.error('Erro ao carregar perfil do admin:', error);
      setAdminName('Administrador');
    }
  };

  const loadStats = async () => {
    try {
      // Carregar contagens de cada status
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        getOngsByStatus('pending', 0, 1),
        getOngsByStatus('approved', 0, 1),
        getOngsByStatus('rejected', 0, 1)
      ]);

      setStats({
        pending: pendingRes.total,
        approved: approvedRes.total,
        rejected: rejectedRes.total
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Manter valores zerados em caso de erro
    }
  };

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    loadStats(); // Recarregar estatísticas ao voltar
  };

  const handleUpdate = () => {
    loadStats(); // Recarregar estatísticas após ações
  };

  return (
    <AdminLayout activeMenu="home" adminName={adminName}>
      {/* Renderização condicional sem reload */}
      {currentView === 'home' && (
        <DashboardHome 
          onNavigate={handleNavigate}
          stats={stats}
          adminName={adminName}
        />
      )}

      {currentView === 'pending' && (
        <div className="p-8 h-full">
          <OngTable 
            status="pending"
            onClose={handleBackToHome}
            onUpdate={handleUpdate}
          />
        </div>
      )}

      {currentView === 'approved' && (
        <div className="p-8 h-full">
          <OngTable 
            status="approved"
            onClose={handleBackToHome}
            onUpdate={handleUpdate}
          />
        </div>
      )}

      {currentView === 'rejected' && (
        <div className="p-8 h-full">
          <OngTable 
            status="rejected"
            onClose={handleBackToHome}
            onUpdate={handleUpdate}
          />
        </div>
      )}
    </AdminLayout>
  );
}