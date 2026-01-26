// src/data/ongs.ts

export type Ong = {
  id: number;
  name: string;
  banner: string;
  logo: string;
  description: string;
  mission: string;
  since: string;
  donations: number;
  years: number;
  impactedPeople: number;
  distance: string;
  // Novos campos de contato
  phone: string;
  instagram: string;
  address: string;
};

export const ongs: Ong[] = [
  {
    id: 1,
    name: "SOS Gatinhos",
    banner: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&w=1600&q=80",
    logo: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&w=400&q=80",
    description: "Resgatamos, cuidamos e realojamos gatinhos abandonados. Atuamos com equipes de resgate e lares temporários em toda a região metropolitana.",
    mission: "Proteger e encontrar lares seguros para todos os gatinhos, promovendo adoção responsável.",
    since: "2018",
    donations: 1240,
    years: 7,
    impactedPeople: 4200,
    distance: "1.2 km",
    phone: "(81) 98888-7777",
    instagram: "@sos_gatinhos_ong",
    address: "Rua das Patas, 123, Centro - Igarassu/PE"
  },
  {
    id: 2,
    name: "Patinhas Felizes",
    banner: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&w=1600&q=80",
    logo: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&w=400&q=80",
    description: "Acolhemos cães e gatos, oferecendo abrigo, tratamentos e programas de adoção para animais vítimas de maus-tratos.",
    mission: "Reduzir o abandono e ampliar o número de adoções por meio de conscientização e apoio veterinário.",
    since: "2015",
    donations: 980,
    years: 10,
    impactedPeople: 3500,
    distance: "2.6 km",
    phone: "(81) 97777-6666",
    instagram: "@patinhasfelizes_oficial",
    address: "Av. Beira Rio, 450, Beira Mar - Paulista/PE"
  },
  {
    id: 3,
    name: "Casa do Bem",
    banner: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&w=1600&q=80",
    logo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&w=400&q=80",
    description: "Apoiamos famílias em situação de vulnerabilidade extrema com cestas básicas, cursos profissionalizantes e assistência social.",
    mission: "Gerar oportunidades e fortalecer redes locais de apoio para famílias em situação de risco.",
    since: "2012",
    donations: 2040,
    years: 12,
    impactedPeople: 12000,
    distance: "3.1 km",
    phone: "(81) 3456-1234",
    instagram: "@casadobem_pe",
    address: "Rua da Esperança, 88, Vila Nova - Recife/PE"
  },
  {
    id: 4,
    name: "Ação Solidária",
    banner: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&w=1600&q=80",
    logo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&w=400&q=80",
    description: "Coletamos e distribuímos doações para campanhas emergenciais e programas contínuos de combate à pobreza extrema.",
    mission: "Mobilizar a sociedade para ações rápidas e sustentáveis em momentos de crise social.",
    since: "2010",
    donations: 1522,
    years: 14,
    impactedPeople: 8700,
    distance: "4.0 km",
    phone: "(81) 99988-1122",
    instagram: "@acaosolidaria_br",
    address: "Pátio do Socorro, s/n, Distrito Industrial - Abreu e Lima/PE"
  },
  {
    id: 5,
    name: "Mãos que Ajudam",
    banner: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&w=1600&q=80",
    logo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&w=400&q=80",
    description: "Projetos comunitários com foco em distribuição de alimentos prontos e inclusão social de jovens periféricos.",
    mission: "Estabelecer redes locais para garantir acesso a alimentos e oportunidades de desenvolvimento.",
    since: "2016",
    donations: 970,
    years: 8,
    impactedPeople: 5400,
    distance: "5.2 km",
    phone: "(81) 98765-4321",
    instagram: "@maosqueajudam_ong",
    address: "Rua São Miguel, 202, Morro Azul - Olinda/PE"
  },
  {
    id: 6,
    name: "Projeto Nutrir",
    banner: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&w=1600&q=80",
    logo: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&w=400&q=80",
    description: "Fornecemos refeições nutritivas balanceadas e apoio nutricional técnico para comunidades com altos índices de desnutrição.",
    mission: "Combater a fome por meio de alimentação adequada e educação nutricional continuada.",
    since: "2014",
    donations: 1880,
    years: 10,
    impactedPeople: 7600,
    distance: "6.3 km",
    phone: "(81) 3030-4040",
    instagram: "@projetonutrir_viva",
    address: "Estrada do Encanamento, 1200, Casa Forte - Recife/PE"
  },
  {
    id: 7,
    name: "Crianças Primeiro",
    banner: "https://images.unsplash.com/photo-1503457574462-bd27054394c1?auto=format&w=1600&q=80",
    logo: "https://images.unsplash.com/photo-1503457574462-bd27054394c1?auto=format&w=400&q=80",
    description: "Programas educacionais de reforço escolar, artes e proteção para crianças e adolescentes em situação de risco familiar.",
    mission: "Garantir acesso à educação de qualidade e proteção integral para o futuro das crianças.",
    since: "2013",
    donations: 720,
    years: 11,
    impactedPeople: 5400,
    distance: "7.4 km",
    phone: "(81) 91122-3344",
    instagram: "@criancas_primeiro",
    address: "Rua do Futuro, 33, Jardim Planalto - Igarassu/PE"
  },
  {
    id: 8,
    name: "Anjos da Rua",
    banner: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&w=1600&q=80",
    logo: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&w=400&q=80",
    description: "Atendimento noturno a pessoas em situação de rua, distribuindo kits de higiene, cobertores e orientação para reabilitação.",
    mission: "Oferecer suporte emergencial digno e caminhos reais para a reintegração social.",
    since: "2011",
    donations: 1640,
    years: 13,
    impactedPeople: 10300,
    distance: "8.1 km",
    phone: "(81) 98877-0099",
    instagram: "@anjosdarua_pe",
    address: "Praça do Diário, s/n, Santo Antônio - Recife/PE"
  }
];