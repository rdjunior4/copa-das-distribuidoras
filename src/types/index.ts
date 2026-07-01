export type SelecaoCor = 'VERDE' | 'AZUL' | 'ROXO' | 'AMARELO' | 'LARANJA';

export interface Selecao {
  id: string;
  nome: string;
  cor: SelecaoCor;
  escudo?: string;
  supervisorId?: string;
  supervisor?: Tecnico;
  jogadores?: Jogador[];
}

export interface Tecnico {
  id: string;
  nome: string;
  foto?: string;
  equipe?: string;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsPro: number;
  golsContra: number;
  saldo: number;
  pontuacao: number;
}

export interface Jogador {
  id: string;
  nome: string;
  foto?: string;
  funcao?: string;
  equipe?: string;
  supervisor?: string;
  vendas: number;
  clientesPositivados: number;
  clientesReativados: number;
  mixEstrategico: number;
  inadimplencia: number;
  cartaoAmarelo: number;
  cartaoVermelho: number;
  gols: number;
  evolucao: number;
  pontuacao: number;
}

export interface Rodada {
  id: string;
  numero: number;
  dataInicio: Date;
  dataFim: Date;
  processada: boolean;
  snapshot?: any;
}

export interface RodadaSelecao {
  id: string;
  rodadaId: string;
  selecaoId: string;
  gols: number;
  golsContra: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  pontos: number;
  posicao?: number;
  cartaoAmarelo: number;
  cartaoVermelho: number;
}

export interface RodadaJogador {
  id: string;
  rodadaId: string;
  jogadorId: string;
  vendas: number;
  clientesPositivados: number;
  clientesReativados: number;
  mixEstrategico: number;
  inadimplencia: number;
  gols: number;
  evolucao: number;
  cartaoAmarelo: number;
  cartaoVermelho: number;
  craquePartida: boolean;
}

export interface Resultado {
  id: string;
  rodadaId: string;
  selecaoCasa: string;
  selecaoFora: string;
  golsCasa: number;
  golsFora: number;
}

export interface Venda {
  id: string;
  clienteId?: string;
  rcaCodigo: number;
  rcaNome: string;
  supervisorCodigo: number;
  supervisorNome: string;
  dataVenda: Date;
  valorVenda: number;
  valorLiquido: number;
  valorDevolucao: number;
  valorCMV: number;
  valorLucro: number;
  valorMeta: number;
  percentualMeta: number;
  percentualLucro: number;
  pesoKg: number;
  valorDesconto: number;
  prazoMedio: number;
  qtdeNFs: number;
  qtClientesPosit: number;
  qtMixVendido: number;
}

export interface Inadimplencia {
  id: string;
  clienteCodigo: string;
  clienteNome: string;
  cnpjCpf?: string;
  notaFiscal?: string;
  dataVencimento: Date;
  valorTitulo: number;
  diasAtraso: number;
  valorComJuros: number;
  praca?: string;
  rcaCodigo?: number;
  rcaNome?: string;
  estado: string;
  dataProcessamento: Date;
}

export interface ClassificacaoSelecao {
  posicao: number;
  selecao: Selecao;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsPro: number;
  golsContra: number;
  saldo: number;
  pontos: number;
}

export interface EstatisticasGerais {
  totalVendido: number;
  clientesPositivados: number;
  clientesReativados: number;
  mixEstrategico: number;
  inadimplenciaTotal: number;
  totalGols: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
}

export interface GameEngineResult {
  gols: number;
  cartaoAmarelo: boolean;
  cartaoVermelho: boolean;
  craquePartida: boolean;
  detalhes: {
    vendaGols: number;
    positivacaoGols: number;
    reativacaoGols: number;
    mixGols: number;
    evolucaoGols: number;
    penalidadeInadimplencia: number;
  };
}

export interface ParserResult {
  tipo: 'VENDAS' | 'CLIENTES_NOVOS' | 'INADIMPLENCIA';
  dados: any[];
  metadados: {
    arquivo: string;
    totalRegistros: number;
    colunas: string[];
    semana?: string;
  };
}
