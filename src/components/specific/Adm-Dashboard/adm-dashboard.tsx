import React from 'react';
import Image from 'next/image';
import { Bell, User } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 overflow-hidden">

      <main className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-12 bg-[#F5F5F5] border-b border-gray-200">
          <div className="w-64" /> 
          
          {/* Logo */}
          <div className="flex-shrink-0">
             <Image 
                src="/logo_roxa.svg" 
                alt="DoeCerto" 
                width={150} 
                height={50} 
                priority 
                className="object-contain"
              />
          </div>

          {/* Ações de Usuário */}
          <div className="w-64 flex items-center justify-end gap-5">
            {/* Notificação mais moderna */}
            <div className="relative group cursor-pointer p-2 hover:bg-gray-200/50 rounded-full transition-all">
              <Bell size={26} className="text-[#3b1c63] group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2 right-2 w-3 h-3 bg-[#ff4d4d] rounded-full border-2 border-[#F5F5F5] shadow-sm"></span>
            </div>
            
            {/* Perfil do Usuário */}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:border-[#7c3aed]/30 transition-colors cursor-pointer">
              <span className="text-sm font-bold text-[#3b1c63] hidden xl:block tracking-tight">
                Paulo Ricardo
              </span>
              <div className="w-9 h-9 bg-[#7c3aed] rounded-full flex items-center justify-center shadow-inner">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
        </div>
      </main>
    </div>
  );
}