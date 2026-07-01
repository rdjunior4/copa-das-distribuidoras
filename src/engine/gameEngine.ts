import { GameEngineResult, ClassificacaoSelecao, EstatisticasGerais } from '@/types';

const VALOR_GOL_VENDA = 10000;
const GOL_POSITIVACAO = 2;
const GOL_REATIVACAO = 3;
const GOL_MIX_ESTRATEGICO = 2;
const GOL_CRAQUE_PARTIDA = 5;
const PENALIDADE_AMARELO = -3;
const PENALIDADE_VERMELHO = -5;

const EVOLUCAO_LIMITES = [
  { min: 100, gols: 5 },
  { min: 80, gols: 4 },
  { min: 60, gols: 3 },
  { min: 40, gols: 2 },
  { min: 20, gols: 1 },
];

export function calcularGolsVenda(valorVenda: number): number {
  return Math.floor(valorVenda / VALOR_GOL_VENDA);
}

export function calcularGolsEvolucao(percentualEvolucao: number): number {
  for (const limite of EVOLUCAO_LIMITES) {
    if (percentualEvolucao >= limite.min) {
      return limite.gols;
    }
  }
  return 0;
}

export function calcularJogador(
  vendasRodada: number,
  clientesPositivados: number = 0,
  clientesReativados: number = 0,
  mixEstrategico: number = 0,
  inadimplenciaAtual: number = 0,
  inadimplenciaAnterior: number = 0,
  evolucaoPercentual: number = 0,
  acoesPontuaveis: number = 0
): GameEngineResult {
  const vendaGols = calcularGolsVenda(vendasRodada);
  const positivacaoGols = clientesPositivados * GOL_POSITIVACAO;
  const reativacaoGols = clientesReativados * GOL_REATIVACAO;
  const mixGols = mixEstrategico * GOL_MIX_ESTRATEGICO;
  const evolucaoGols = calcularGolsEvolucao(evolucaoPercentual);

  const craquePartida = acoesPontuaveis >= 3;
  const craqueGols = craquePartida ? GOL_CRAQUE_PARTIDA : 0;

  let penalidadeInadimplencia = 0;
  let amarelo = false;
  let vermelho = false;

  if (inadimplenciaAtual > 0 && inadimplenciaAnterior > 0) {
    if (inadimplenciaAtual > inadimplenciaAnterior) {
      amarelo = true;
      penalidadeInadimplencia += PENALIDADE_AMARELO;
    }
  }

  if (inadimplenciaAtual > 10000) {
    vermelho = true;
    penalidadeInadimplencia += PENALIDADE_VERMELHO;
  }

  const golsTotais = 
    vendaGols + 
    positivacaoGols + 
    reativacaoGols + 
    mixGols + 
    evolucaoGols + 
    craqueGols + 
    penalidadeInadimplencia;

  return {
    gols: Math.max(0, golsTotais),
    cartaoAmarelo: amarelo,
    cartaoVermelho: vermelho,
    craquePartida,
    detalhes: {
      vendaGols,
      positivacaoGols,
      reativacaoGols,
      mixGols,
      evolucaoGols,
      penalidadeInadimplencia,
    },
  };
}

export function calcularClassificacaoSelecao(
  nomeSelecao: string,
  vendedores: { nome: string; vendaFaturada: number }[],
  clientesNovos: number = 0,
  inadimplencia: number = 0
): Omit<ClassificacaoSelecao, 'selecao'> {
  const totalVendido = vendedores.reduce((acc, v) => acc + v.vendaFaturada, 0);
  const golsVenda = calcularGolsVenda(totalVendido);
  const golsPositivacao = clientesNovos * GOL_POSITIVACAO;
  
  let penalidadeInadimplencia = 0;
  if (inadimplencia > 10000) {
    penalidadeInadimplencia = PENALIDADE_VERMELHO;
  } else if (inadimplencia > 5000) {
    penalidadeInadimplencia = PENALIDADE_AMARELO;
  }

  const golsPro = Math.max(0, golsVenda + golsPositivacao + penalidadeInadimplencia);
  const golsContra = Math.abs(penalidadeInadimplencia);

  return {
    posicao: 0,
    jogos: 1,
    vitorias: golsPro > golsContra ? 1 : 0,
    empates: golsPro === golsContra ? 1 : 0,
    derrotas: golsPro < golsContra ? 1 : 0,
    golsPro,
    golsContra,
    saldo: golsPro - golsContra,
    pontos: golsPro > golsContra ? 3 : golsPro === golsContra ? 1 : 0,
  };
}

export function processarRodada(dadosRodada: any) {
  const resultado: any[] = [];

  for (const supervisor of dadosRodada.supervisores) {
    const vendedores = supervisor.vendedores.map((v: any) => ({
      nome: v.nome,
      vendaFaturada: v.vendaFaturada,
    }));

    const totalVendido = supervisor.totalVendido;
    const golsVenda = calcularGolsVenda(totalVendido);

    resultado.push({
      supervisor: supervisor.nome,
      codigo: supervisor.codigo,
      totalVendido,
      golsVenda,
      vendedores: supervisor.vendedores.map((v: any) => ({
        ...v,
        gols: calcularGolsVenda(v.vendaFaturada),
      })),
    });
  }

  return resultado;
}

export function calcularEstatisticasGerais(jogadores: any[]): EstatisticasGerais {
  return jogadores.reduce(
    (acc, jogador) => ({
      totalVendido: acc.totalVendido + (jogador.vendaFaturada || jogador.vendas || 0),
      clientesPositivados: acc.clientesPositivados + (jogador.clientesPositivados || 0),
      clientesReativados: acc.clientesReativados + (jogador.clientesReativados || 0),
      mixEstrategico: acc.mixEstrategico + (jogador.mixEstrategico || 0),
      inadimplenciaTotal: acc.inadimplenciaTotal + (jogador.inadimplencia || 0),
      totalGols: acc.totalGols + (jogador.gols || 0),
      cartoesAmarelos: acc.cartoesAmarelos + (jogador.cartaoAmarelo || 0),
      cartoesVermelhos: acc.cartoesVermelhos + (jogador.cartaoVermelho || 0),
    }),
    {
      totalVendido: 0,
      clientesPositivados: 0,
      clientesReativados: 0,
      mixEstrategico: 0,
      inadimplenciaTotal: 0,
      totalGols: 0,
      cartoesAmarelos: 0,
      cartoesVermelhos: 0,
    }
  );
}
