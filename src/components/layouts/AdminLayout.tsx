"use client";

import Image from 'next/image';
import { useState } from 'react';
import {
  Bell,
  User,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type AdminLayoutProps = {
  children: React.ReactNode;
  activeMenu?: 'home' | 'dashboard' | 'messages' | 'settings';
  adminName?: string;
};

export default function AdminLayout({ children, activeMenu = 'home', adminName = 'Administrador' }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Implementar logout
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 overflow-hidden">
      {/* Sidebar Lateral */}
      <aside className="w-72 bg-[#6B39A7] text-white flex flex-col shrink-0 shadow-2xl z-20">
        <div className="p-8 flex-1">
          <div className="mb-12 mt-4 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">
              Painel do Administrador
            </h2>
          </div>

          <nav className="space-y-3">
            <SidebarLink 
              icon={<Home size={22} />} 
              label="Home" 
              active={activeMenu === 'home'} 
            />
            <SidebarLink 
              icon={<LayoutDashboard size={22} />} 
              label="Dashboard" 
              active={activeMenu === 'dashboard'}
            />
            <SidebarLink 
              icon={<MessageSquare size={22} />} 
              label="Message" 
              active={activeMenu === 'messages'}
            />
          </nav>
        </div>

        <div className="p-8 space-y-3 border-t border-white/10">
          <SidebarLink 
            icon={<Settings size={22} />} 
            label="settings" 
            active={activeMenu === 'settings'}
          />
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all rounded-xl text-white/60 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={22} />
            <span className="text-lg capitalize tracking-tight">Logout</span>
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col bg-[#F8F9FA] overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-12 bg-[#F5F5F5] border-b border-gray-200 shrink-0 relative">
          {/* Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="md:ml-[-288px] flex items-center justify-center">
              <Image
                src="/logo_roxa.svg"
                alt="DoeCerto"
                width={150}
                height={50}
                priority
                className="object-contain pointer-events-auto"
              />
            </div>
          </div>

          <div className="flex-1" />

          {/* Perfil e Notificações */}
          <div className="flex-1 flex items-center justify-end gap-5 z-10">
            <div className="relative group cursor-pointer p-2 hover:bg-gray-200/50 rounded-full transition-all">
              <Bell size={26} className="text-[#3b1c63] group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute top-2 right-2 w-3 h-3 bg-[#ff4d4d] rounded-full border-2 border-[#F5F5F5] shadow-sm"></span>
            </div>

            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:border-[#7c3aed]/30 transition-colors cursor-pointer">
              <span className="text-sm font-bold text-[#3b1c63] hidden xl:block tracking-tight">
                {adminName}
              </span>
              <div className="w-9 h-9 bg-[#7c3aed] rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active = false }: any) {
  return (
    <div className={`
      flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all rounded-xl relative group
      ${active
        ? 'bg-white/10 text-white font-bold'
        : 'text-white/60 hover:bg-white/5 hover:text-white'}
    `}>
      {active && (
        <div className="absolute left-0 w-1.5 h-6 bg-[#FFF15F] rounded-r-full" />
      )}
      <span className="transition-transform group-hover:scale-105 duration-200">
        {icon}
      </span>
      <span className="text-lg capitalize tracking-tight">{label}</span>
    </div>
  );
}