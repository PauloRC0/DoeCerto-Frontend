import Image from 'next/image';
import { 
  Bell, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Home, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  LogOut 
} from 'lucide-react';

export default function AdminDashboard() {
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
            <SidebarLink icon={<Home size={22} />} label="Home" active />
            <SidebarLink icon={<LayoutDashboard size={22} />} label="Dashboard" />
            <SidebarLink icon={<MessageSquare size={22} />} label="Message" />
          </nav>
        </div>

        <div className="p-8 space-y-3 border-t border-white/10">
          <SidebarLink icon={<Settings size={22} />} label="settings" />
          <SidebarLink icon={<LogOut size={22} />} label="Logout" />
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col bg-[#F8F9FA] overflow-hidden">
        
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-12 bg-[#F5F5F5] border-b border-gray-200 shrink-0">
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
              <Bell size={26} className="text-[#3b1c63] group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute top-2 right-2 w-3 h-3 bg-[#ff4d4d] rounded-full border-2 border-[#F5F5F5] shadow-sm"></span>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:border-[#7c3aed]/30 transition-colors cursor-pointer">
              <span className="text-sm font-bold text-[#3b1c63] hidden xl:block tracking-tight">
                Paulo Ricardo
              </span>
              <div className="w-9 h-9 bg-[#7c3aed] rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo Centralizado */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto w-full px-8">
            
            <div className="pt-16 pb-12 text-center md:text-left">
              <h1 className="text-5xl font-black text-[#6B39A7] tracking-tighter mb-4">
                Bem-Vindo, Paulo
              </h1>
              <p className="text-[#6B39A7] text-xl font-bold max-w-2xl">
                Gerencie as ONGs cadastradas e acompanhe o status de cada solicitação.
              </p>
            </div>

            <div className="pb-16 flex justify-center md:justify-start">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-[1000px]"> 
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

function StatusCard({ title, count, label, icon, bgColor, innerColor, btnColor }: any) {
  return (
    <div className={`${bgColor} rounded-[3rem] p-7 flex flex-col items-center shadow-sm hover:shadow-md transition-all duration-300`}>
      <div className={`${innerColor} w-full rounded-[2.5rem] py-12 flex flex-col items-center mb-6 shadow-lg`}>
        <div className="mb-4">{icon}</div>
        <h3 className="text-white font-bold text-lg mb-2 text-center leading-tight">
          {title}
        </h3>
        <span className="text-white text-7xl font-black mb-2 tracking-tighter">{count}</span>
        <span className="text-white/90 text-[10px] font-black uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>

      <button className={`${btnColor} w-full py-4 rounded-full text-white font-black text-xs uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all`}>
        Ver Detalhes
      </button>
    </div>
  );
}