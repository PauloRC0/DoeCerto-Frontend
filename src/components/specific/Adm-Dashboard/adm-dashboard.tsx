import Image from 'next/image';
import { Bell, User, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 overflow-hidden">
      <main className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-12 bg-[#F5F5F5] border-b border-gray-200">
          <div className="w-64" />
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
          <div className="w-64 flex items-center justify-end gap-5">
            <div className="relative group cursor-pointer p-2 hover:bg-gray-200/50 rounded-full transition-all">
              <Bell size={26} className="text-[#3b1c63] group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2 right-2 w-3 h-3 bg-[#ff4d4d] rounded-full border-2 border-[#F5F5F5] shadow-sm"></span>
            </div>
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
          {/* Seção de Texto */}
          <div className="px-12 pt-12 pb-8 bg-white">
            <h1 className="text-5xl font-black text-[#6B39A7] tracking-tighter mb-2">
              Bem-Vindo, Paulo
            </h1>
            <p className="text-[#6B39A7] text-lg font-bold max-w-2xl">
              Gerencie as ONGs cadastradas e acompanhe o status de cada solicitação.
            </p>
          </div>

         {/* Grid de Cards*/}
          <div className="px-12 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl"> 
              
              <StatusCard
                title="ONGs Pendentes"
                count="12"
                label="Em Análise"
                icon={<Clock size={48} className="text-white" />}
                bgColor="bg-[#FFF15F]"
                innerColor="bg-[#FFC107]"
                btnColor="bg-[#FFC107]"
              />
              <StatusCard
                title="ONGs Aceitas"
                count="12"
                label="Aceitas"
                icon={<CheckCircle size={48} className="text-white" />}
                bgColor="bg-[#79E69B]"
                innerColor="bg-[#006400]"
                btnColor="bg-[#004d00]"
              />
              <StatusCard
                title="ONGs Recusadas"
                count="12"
                label="Recusadas"
                icon={<XCircle size={48} className="text-white" />}
                bgColor="bg-[#F26470]"
                innerColor="bg-[#B30000]"
                btnColor="bg-[#990000]"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusCard({ title, count, label, icon, bgColor, innerColor, btnColor }: any) {
  return (
    <div className={`${bgColor} rounded-[1.5rem] p-6 flex flex-col items-center shadow-sm`}>
      {/* Bloco Interno Arredondado */}
      <div className={`${innerColor} w-full rounded-[1.2rem] py-10 flex flex-col items-center mb-6`}>
        <div className="mb-2 opacity-90">{icon}</div>
        <h3 className="text-white font-bold text-xl mb-2 text-center">
          {title}
        </h3>
        <span className="text-white text-7xl font-black mb-2">{count}</span>
        <span className="text-white/90 text-sm font-medium">
          {label}
        </span>
      </div>

      <button className={`${btnColor} w-full py-3 rounded-xl text-white font-bold text-base shadow-lg hover:brightness-110 transition-all`}>
        Ver Detalhes
      </button>
    </div>
  );
}