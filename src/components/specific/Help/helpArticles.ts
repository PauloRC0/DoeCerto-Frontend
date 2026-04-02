export interface HelpArticle {
  id: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  tags: string[];
  steps: string[];
  infoBox?: string;
  cta: string;
  ctaRoute: string;
  ctaSecondary?: string;
  ctaSecondaryRoute?: string;
}

export const helpArticles: HelpArticle[] = [
  {
    id: "como-doar-dinheiro",
    iconName: "Banknote",
    iconBg: "#0f2318",
    iconColor: "#4ade80",
    title: "Como fazer uma doação em dinheiro",
    desc: "Via Pix para qualquer ONG",
    tags: ["doação", "pix", "dinheiro", "transferir", "pagar", "monetária"],
    steps: [
      "Na tela inicial, encontre a ONG que deseja apoiar",
      'Toque em "Doar" e selecione "Doar dinheiro"',
      "Copie a chave Pix ou escaneie o QR Code gerado",
      "Faça a transferência pelo seu banco normalmente",
      "Volte ao app, informe o valor e anexe o comprovante",
    ],
    infoBox: "Suas doações ficam registradas no histórico e a ONG recebe uma notificação em tempo real.",
    cta: "Ver ONGs disponíveis",
    ctaRoute: "/home",
  },
  {
    id: "como-doar-itens",
    iconName: "Package",
    iconBg: "#0f1a28",
    iconColor: "#60a5fa",
    title: "Como doar itens físicos",
    desc: "Roupas, alimentos e outros materiais",
    tags: ["itens", "material", "doação", "objetos", "roupa", "alimento", "físico"],
    steps: [
      "Na tela inicial, acesse o perfil da ONG desejada",
      'Toque em "Doar" e selecione "Doar itens"',
      "Escolha um item da lista de necessidades da ONG",
      "Informe a quantidade e uma descrição detalhada",
      "Confirme — a ONG entrará em contato pelo WhatsApp",
    ],
    infoBox: "O telefone cadastrado no seu perfil será usado pela ONG para combinar a entrega dos itens.",
    cta: "Ir para tela inicial",
    ctaRoute: "/home",
  },
  {
    id: "completar-perfil-doador",
    iconName: "UserCircle",
    iconBg: "#180f2e",
    iconColor: "#c084fc",
    title: "Completar meu perfil",
    desc: "Adicionar telefone, foto e bio",
    tags: ["perfil", "foto", "telefone", "cadastro", "editar", "whatsapp", "nome"],
    steps: [
      "Toque no seu avatar no canto superior direito",
      'Selecione "Meu Perfil" no menu',
      'Toque em "Editar Perfil" para alterar nome, telefone e bio',
      "Para mudar a foto, toque no ícone de câmera sobre seu avatar",
      'Salve as alterações tocando no ícone de confirmação "✓"',
    ],
    infoBox: "O telefone é obrigatório para receber contato das ONGs em doações de itens físicos.",
    cta: "Ir para meu perfil",
    ctaRoute: "/dashboard",
  },
  {
    id: "historico-doacoes",
    iconName: "History",
    iconBg: "#1e1208",
    iconColor: "#fb923c",
    title: "Ver histórico de doações",
    desc: "Acompanhe todas as suas contribuições",
    tags: ["histórico", "doações", "passado", "status", "pendente", "concluído", "cancelado"],
    steps: [
      "Acesse seu perfil pelo avatar no topo da tela inicial",
      'Toque na aba "Histórico"',
      "Veja o status de cada doação (Pendente, Concluída, Cancelada)",
      "Toque em qualquer doação para ver os detalhes completos",
    ],
    cta: "Ver meu histórico",
    ctaRoute: "/dashboard",
  },
  {
    id: "avaliar-ong",
    iconName: "Star",
    iconBg: "#1e1808",
    iconColor: "#facc15",
    title: "Como avaliar uma ONG",
    desc: "Deixe uma nota e comentário",
    tags: ["avaliar", "nota", "estrela", "comentário", "review", "feedback", "avaliação"],
    steps: [
      "Abra o perfil público da ONG que deseja avaliar",
      'Role até a seção "Estatísticas" e toque em "Avaliar"',
      "Escolha de 1 a 5 estrelas",
      "Escreva um breve depoimento sobre sua experiência",
      "Toque em Enviar Avaliação",
    ],
    infoBox: "Sua avaliação fica visível no perfil da ONG e ajuda outros doadores a escolher as melhores instituições.",
    cta: "Ir para tela inicial",
    ctaRoute: "/home",
  },
  {
    id: "ong-perfil-setup",
    iconName: "Building2",
    iconBg: "#180f2e",
    iconColor: "#a78bfa",
    title: "Configurar perfil da ONG",
    desc: "Logo, banner, contato e dados bancários",
    tags: ["ong", "perfil", "configurar", "banco", "pix", "logo", "banner", "categorias", "setup"],
    steps: [
      'No seu dashboard, toque em "Editar Perfil"',
      "Adicione logo, banner, descrição e contato",
      "Selecione as categorias em que sua ONG atua",
      "Preencha os dados bancários para receber doações via Pix",
      "Adicione itens que sua ONG aceita na lista de necessidades",
      'Toque em "Finalizar meu Perfil" para salvar tudo',
    ],
    infoBox: "Sua ONG precisa ser aprovada por um administrador antes de aparecer no catálogo de doações.",
    cta: "Configurar meu perfil",
    ctaRoute: "/ong-profilesetup",
  },
  {
    id: "ong-lista-necessidades",
    iconName: "ClipboardList",
    iconBg: "#0a1a28",
    iconColor: "#38bdf8",
    title: "Gerenciar lista de necessidades",
    desc: "Itens que sua ONG aceita receber",
    tags: ["lista", "necessidades", "itens", "wishlist", "aceitar", "ong", "materiais"],
    steps: [
      'Acesse a configuração do perfil em "Editar Perfil"',
      'Role até a seção "Itens que aceitamos"',
      "Digite o nome do item no campo e toque no botão +",
      "Para remover um item, toque no ícone de lixeira ao lado dele",
      'Salve tudo tocando em "Finalizar meu Perfil"',
    ],
    infoBox: "Os itens da lista aparecem para os doadores ao escolherem o que querem contribuir com sua ONG.",
    cta: "Gerenciar lista",
    ctaRoute: "/ong-profilesetup",
  },
  {
    id: "esqueci-senha",
    iconName: "KeyRound",
    iconBg: "#1e0a10",
    iconColor: "#fb7185",
    title: "Esqueci minha senha",
    desc: "Recupere o acesso à sua conta",
    tags: ["senha", "esqueci", "recuperar", "redefinir", "acesso", "email", "login"],
    steps: [
      'Na tela de login, toque em "Esqueceu a senha?"',
      "Digite o e-mail cadastrado e toque em Redefinir",
      "Verifique sua caixa de entrada e também a pasta de spam",
      "Clique no link recebido por e-mail",
      "Crie uma nova senha com pelo menos 8 caracteres",
    ],
    infoBox: "O link de redefinição expira em poucos minutos. Se não receber o e-mail, aguarde e tente novamente.",
    cta: "Recuperar minha senha",
    ctaRoute: "/forgot-password",
  },
];

export const featuredArticleIds = [
  "como-doar-dinheiro",
  "como-doar-itens",
  "completar-perfil-doador",
  "historico-doacoes",
];