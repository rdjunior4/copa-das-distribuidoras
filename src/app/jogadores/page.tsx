'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Award,
  Search,
  ChevronDown,
  Shirt,
  ChevronUp
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import rodadasData from '@/../public/data/rodadas.json';

interface Metricas {
  golsPorVendas: number;
  assistencias: number;
  viradasDeJogo: number;
  jogadasEnsaiadas: number;
  craqueDaPartida: number;
  cartaoAmarelo: number;
  cartaoVermelho: number;
}

export default function JogadoresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipe, setSelectedEquipe] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'gols' | 'vendas'>('gols');
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  const allEquipes = rodadasData.rodadas[0].selecoes.map(s => ({
    nome: s.nome,
    cor: s.cor
  }));

  const jogadoresMap = useMemo(() => {
    const map = new Map<string, { 
      rca: number; nome: string; equipe: string; cor: string; 
      vendaR1: number; vendaR2: number; golsR1: number; golsR2: number;
      metricasR1: Metricas | null; metricasR2: Metricas | null;
    }>();

    for (const rodada of rodadasData.rodadas) {
      for (const selecao of rodada.selecoes) {
        for (const jogador of selecao.jogadores) {
          const key = `${jogador.rca}-${selecao.nome}`;
          const existing = map.get(key);
          if (existing) {
            if (rodada.numero === 1) {
              existing.vendaR1 = jogador.vendaFaturada;
              existing.golsR1 = jogador.gols;
              existing.metricasR1 = jogador.metricas || null;
            } else {
              existing.vendaR2 = jogador.vendaFaturada;
              existing.golsR2 = jogador.gols;
              existing.metricasR2 = jogador.metricas || null;
            }
          } else {
            map.set(key, {
              rca: jogador.rca,
              nome: jogador.nome,
              equipe: selecao.nome,
              cor: selecao.cor,
              vendaR1: rodada.numero === 1 ? jogador.vendaFaturada : 0,
              vendaR2: rodada.numero === 2 ? jogador.vendaFaturada : 0,
              golsR1: rodada.numero === 1 ? jogador.gols : 0,
              golsR2: rodada.numero === 2 ? jogador.gols : 0,
              metricasR1: rodada.numero === 1 ? (jogador.metricas || null) : null,
              metricasR2: rodada.numero === 2 ? (jogador.metricas || null) : null,
            });
          }
        }
      }
    }

    return Array.from(map.values());
  }, []);

  const processedJogadores = useMemo(() => {
    return jogadoresMap.map(j => ({
      ...j,
      gols: j.golsR1 + j.golsR2,
      vendas: j.vendaR1 + j.vendaR2,
      metricasAcumuladas: {
        golsPorVendas: (j.metricasR1?.golsPorVendas || 0) + (j.metricasR2?.golsPorVendas || 0),
        assistencias: (j.metricasR1?.assistencias || 0) + (j.metricasR2?.assistencias || 0),
        viradasDeJogo: (j.metricasR1?.viradasDeJogo || 0) + (j.metricasR2?.viradasDeJogo || 0),
        jogadasEnsaiadas: (j.metricasR1?.jogadasEnsaiadas || 0) + (j.metricasR2?.jogadasEnsaiadas || 0),
        craqueDaPartida: (j.metricasR1?.craqueDaPartida || 0) + (j.metricasR2?.craqueDaPartida || 0),
        cartaoAmarelo: (j.metricasR1?.cartaoAmarelo || 0) + (j.metricasR2?.cartaoAmarelo || 0),
        cartaoVermelho: (j.metricasR1?.cartaoVermelho || 0) + (j.metricasR2?.cartaoVermelho || 0),
      }
    }));
  }, [jogadoresMap]);

  const filteredJogadores = useMemo(() => {
    return processedJogadores
      .filter(j => 
        j.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedEquipe === 'all' || j.equipe === selectedEquipe)
      )
      .sort((a, b) => {
        if (sortBy === 'gols') return b.gols - a.gols || b.vendas - a.vendas;
        return b.vendas - a.vendas || b.gols - a.gols;
      });
  }, [processedJogadores, searchTerm, selectedEquipe, sortBy]);

  const stats = useMemo(() => ({
    total: filteredJogadores.length,
    totalGols: filteredJogadores.reduce((acc, j) => acc + j.gols, 0),
    totalVendas: filteredJogadores.reduce((acc, j) => acc + j.vendas, 0),
    artilheiro: filteredJogadores[0],
  }), [filteredJogadores]);

  return (
    <div className="min-h-screen page-content">
      <Navbar />
      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-display font-bold gradient-text mb-2">
            JOGADORES
          </h1>
          <p className="text-sm md:text-gray-400">Acompanhe o desempenho de cada jogador</p>
        </motion.header>

        {/* Stats Gerais */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6"
        >
          <div className="glass-card p-3 md:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-copa-green" />
              <span className="text-[10px] md:text-xs text-gray-400">Jogadores</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-copa-green">{stats.total}</p>
          </div>
          <div className="glass-card p-3 md:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-copa-green" />
              <span className="text-[10px] md:text-xs text-gray-400">Total Gols</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-copa-green">{stats.totalGols}</p>
          </div>
          <div className="glass-card p-3 md:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-copa-green" />
              <span className="text-[10px] md:text-xs text-gray-400">Total Vendas</span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-copa-green">R$ {(stats.totalVendas / 1000000).toFixed(2)}M</p>
          </div>
        </motion.div>

        {/* Artilheiro Destaque */}
        {stats.artilheiro && stats.artilheiro.gols > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 md:p-5 mb-4 md:mb-6 border-l-3 border-copa-gold"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-copa-gold/20 flex items-center justify-center">
                  <Award className="w-5 h-5 md:w-6 md:h-6 text-copa-gold" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-gray-400">ARTILHEIRO DA COPA</p>
                  <p className="text-sm md:text-base font-bold text-white">{stats.artilheiro.nome}</p>
                  <p className="text-[10px] md:text-xs" style={{ color: stats.artilheiro.cor }}>
                    {stats.artilheiro.equipe} • RCA {stats.artilheiro.rca}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl md:text-3xl font-bold text-copa-gold">{stats.artilheiro.gols}</p>
                <p className="text-[10px] md:text-xs text-gray-400">gols</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabela de Pontuação */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-4 md:p-5 mb-4 md:mb-6"
        >
          <h2 className="text-base md:text-lg font-display font-bold mb-3 md:mb-4 gradient-text">
            COMO MARCAR PONTOS
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 md:py-3 px-2 md:px-3 text-gray-400 font-medium">Ação</th>
                  <th className="text-center py-2 md:py-3 px-2 md:px-3 text-gray-400 font-medium">Nome na Copa</th>
                  <th className="text-center py-2 md:py-3 px-2 md:px-3 text-gray-400 font-medium">Pontuação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/[0.03]">
                  <td className="py-2.5 md:py-3 px-2 md:px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[10px] md:text-xs">$</span>
                      <span className="text-white text-[11px] md:text-sm">R$ 10.000 em vendas</span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-base md:text-lg">⚽</span>
                      <span className="font-bold text-green-400 text-[11px] md:text-sm">GOL</span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <span className="font-bold text-white text-[11px] md:text-sm">1 Gol</span>
                  </td>
                </tr>
                <tr className="border-b border-white/[0.03]">
                  <td className="py-2.5 md:py-3 px-2 md:px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-[10px] md:text-xs">👥</span>
                      <span className="text-white text-[11px] md:text-sm">Novo cliente positivado</span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-base md:text-lg">👟</span>
                      <span className="font-bold text-blue-400 text-[11px] md:text-sm">ASSISTÊNCIA</span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <span className="font-bold text-white text-[11px] md:text-sm">2 Gols</span>
                  </td>
                </tr>
                <tr className="border-b border-white/[0.03]">
                  <td className="py-2.5 md:py-3 px-2 md:px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-[10px] md:text-xs">🔄</span>
                      <span className="text-white text-[11px] md:text-sm">Cliente reativado</span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-base md:text-lg">⭐</span>
                      <span className="font-bold text-purple-400 text-[11px] md:text-sm">VIRADA DE JOGO</span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <span className="font-bold text-white text-[11px] md:text-sm">3 Gols</span>
                  </td>
                </tr>
                <tr className="border-b border-white/[0.03]">
                  <td className="py-2.5 md:py-3 px-2 md:px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-[10px] md:text-xs">🛒</span>
                      <span className="text-white text-[11px] md:text-sm">Venda de mix estratégico</span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-base md:text-lg">⚡</span>
                      <span className="font-bold text-yellow-400 text-[11px] md:text-sm">JOGADA ENSAIADA</span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <span className="font-bold text-white text-[11px] md:text-sm">2 Gols</span>
                  </td>
                </tr>
                <tr className="border-b border-white/[0.03] bg-white/[0.02]">
                  <td className="py-2.5 md:py-3 px-2 md:px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[10px] md:text-xs">⭐</span>
                      <span className="text-white text-[11px] md:text-sm">Melhor vendedor da rodada<br/><span className="text-[9px] md:text-[10px] text-gray-400">(efetivar 3 ou mais ações)</span></span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-base md:text-lg">🏆</span>
                      <span className="font-bold text-green-400 text-[11px] md:text-sm">CRAQUE DA PARTIDA</span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <span className="font-bold text-green-400 text-[11px] md:text-sm">+5 Gols</span>
                  </td>
                </tr>
                <tr className="border-b border-white/[0.03] bg-orange-500/5">
                  <td className="py-2.5 md:py-3 px-2 md:px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-[10px] md:text-xs">⚠️</span>
                      <span className="text-white text-[11px] md:text-sm">Perda de cliente ativo<br/><span className="text-[9px] md:text-[10px] text-gray-400">(efetivado no mês anterior)</span></span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-base md:text-lg">🟨</span>
                      <span className="font-bold text-orange-400 text-[11px] md:text-sm">CARTÃO AMARELO</span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <span className="font-bold text-orange-400 text-[11px] md:text-sm">-3 Gols</span>
                  </td>
                </tr>
                <tr className="bg-red-500/5">
                  <td className="py-2.5 md:py-3 px-2 md:px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-[10px] md:text-xs">❗</span>
                      <span className="text-white text-[11px] md:text-sm">2 maiores com inadimplência</span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-base md:text-lg">🟥</span>
                      <span className="font-bold text-red-400 text-[11px] md:text-sm">CARTÃO VERMELHO</span>
                    </div>
                  </td>
                  <td className="py-2.5 md:py-3 px-2 md:px-3 text-center">
                    <span className="font-bold text-red-400 text-[11px] md:text-sm">-5 Gols</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Políticas Oficiais */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 md:mb-6"
        >
          <h2 className="text-base md:text-lg font-display font-bold mb-3 md:mb-4 gradient-text">
            POLÍTICAS OFICIAIS DA COPA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Craque da Partida */}
            <div className="glass-card p-4 border-t-3 border-copa-gold">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-copa-gold/20 flex items-center justify-center">
                  <span className="text-lg md:text-xl">🏆</span>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-gray-400">POLÍTICA DO</p>
                  <p className="text-xs md:text-sm font-bold text-copa-gold">CRAQUE DA PARTIDA</p>
                </div>
              </div>
              <p className="text-[10px] md:text-xs text-gray-300 mb-3">
                Concedido ao jogador que efetivar <span className="text-copa-gold font-bold">3 ou mais ações pontuáveis</span> na rodada.
              </p>
              <div className="text-center py-2 rounded-lg bg-copa-gold/10 border border-copa-gold/20">
                <p className="text-lg md:text-xl font-bold text-copa-gold">+5 GOLS</p>
                <p className="text-[9px] md:text-[10px] text-gray-400">para o melhor vendedor</p>
              </div>
            </div>

            {/* Cartão Amarelo */}
            <div className="glass-card p-4 border-t-3 border-orange-400">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-400/20 flex items-center justify-center">
                  <span className="text-lg md:text-xl">🟨</span>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-gray-400">POLÍTICA DO</p>
                  <p className="text-xs md:text-sm font-bold text-orange-400">CARTÃO AMARELO</p>
                </div>
              </div>
              <p className="text-[10px] md:text-xs text-gray-300 mb-3">
                Cliente efetivado no mês anterior mas não efetivado na rodada atual.
              </p>
              <div className="text-center py-2 rounded-lg bg-orange-400/10 border border-orange-400/20">
                <p className="text-lg md:text-xl font-bold text-orange-400">-3 GOLS</p>
                <p className="text-[9px] md:text-[10px] text-gray-400">por cliente perdido</p>
              </div>
            </div>

            {/* Cartão Vermelho */}
            <div className="glass-card p-4 border-t-3 border-red-500">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-lg md:text-xl">🟥</span>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-gray-400">POLÍTICA DO</p>
                  <p className="text-xs md:text-sm font-bold text-red-500">CARTÃO VERMELHO</p>
                </div>
              </div>
              <p className="text-[10px] md:text-xs text-gray-300 mb-3">
                Os 2 jogadores com maior inadimplência na rodada recebem penalidade.
              </p>
              <div className="text-center py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-lg md:text-xl font-bold text-red-500">-5 GOLS</p>
                <p className="text-[9px] md:text-[10px] text-gray-400">para cada jogador</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-3 md:p-4 mb-4 md:mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar jogador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 input-field text-xs md:text-sm"
              />
            </div>

            {/* Filtro por Equipe */}
            <div className="relative">
              <select
                value={selectedEquipe}
                onChange={(e) => setSelectedEquipe(e.target.value)}
                className="appearance-none w-full px-3 md:px-4 py-2 pr-10 input-field cursor-pointer text-xs md:text-sm"
              >
                <option value="all">Todas as Equipes</option>
                {allEquipes.map(eq => (
                  <option key={eq.nome} value={eq.nome}>{eq.nome}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Ordenação */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none w-full px-3 md:px-4 py-2 pr-10 input-field cursor-pointer text-xs md:text-sm"
              >
                <option value="gols">Ordenar por Gols</option>
                <option value="vendas">Ordenar por Vendas</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Lista de Jogadores - Ranking */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card overflow-hidden"
        >
          <div className="px-3 py-2.5 md:px-4 md:py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-copa-green" />
              <span className="text-xs md:text-sm font-bold text-copa-green">
                JOGADORES - {filteredJogadores.length} ATIVOS
              </span>
            </div>
          </div>
          
          <div className="divide-y divide-white/[0.03]">
            {filteredJogadores.map((jogador, index) => {
              const isExpanded = expandedPlayer === `${jogador.rca}-${jogador.equipe}`;
              return (
                <motion.div
                  key={`${jogador.rca}-${jogador.equipe}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + index * 0.02 }}
                  className="hover:bg-white/[0.02] transition-colors"
                  style={{ borderLeft: `3px solid ${jogador.cor}` }}
                >
                  {/* Player Row */}
                  <div 
                    className="flex items-center gap-3 px-3 py-3 md:px-4 md:py-3.5 cursor-pointer"
                    onClick={() => setExpandedPlayer(isExpanded ? null : `${jogador.rca}-${jogador.equipe}`)}
                  >
                    {/* Posição */}
                    <div 
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[11px] md:text-xs font-bold flex-shrink-0"
                      style={{ 
                        backgroundColor: `${jogador.cor}15`,
                        color: jogador.cor 
                      }}
                    >
                      {index + 1}º
                    </div>

                    {/* Nome e RCA */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-bold text-white truncate">
                        {jogador.nome}
                      </p>
                      <p className="text-[10px] md:text-[11px] text-gray-400">
                        RCA {jogador.rca}
                      </p>
                    </div>

                    {/* Faturamento */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs md:text-sm font-bold text-copa-green">
                        R$ {(jogador.vendas / 1000).toFixed(1)}k
                      </p>
                      <p className="text-[9px] md:text-[10px] text-gray-500">faturamento</p>
                    </div>

                    {/* Gols */}
                    <div className="text-right flex-shrink-0 w-10 md:w-12">
                      <p className="text-sm md:text-base font-bold" style={{ color: jogador.cor }}>
                        {jogador.gols}
                      </p>
                      <p className="text-[9px] md:text-[10px] text-gray-500">gols</p>
                    </div>

                    {/* Expand Icon */}
                    <div className="flex-shrink-0 ml-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Metrics */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 md:px-4 md:pb-4 pt-0 border-t border-white/[0.03]">
                          <p className="text-[10px] md:text-xs text-gray-400 mb-2 mt-2 font-medium">DETALHAMENTO DOS GOLS POR RODADA</p>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {/* Rodada 1 */}
                            <div className="p-2 rounded-lg bg-white/[0.02]">
                              <p className="text-[9px] md:text-[10px] text-gray-500 mb-1.5 font-medium">Rodada 1</p>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>⚽</span> Gols por Vendas
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-green-400">{jogador.metricasR1?.golsPorVendas || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>👟</span> Assistências
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-blue-400">{jogador.metricasR1?.assistencias || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>⭐</span> Virada de Jogo
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-purple-400">{jogador.metricasR1?.viradasDeJogo || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>⚡</span> Jogada Ensaíada
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-yellow-400">{jogador.metricasR1?.jogadasEnsaiadas || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>🏆</span> Craque da Partida
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-green-400">{jogador.metricasR1?.craqueDaPartida || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>🟨</span> Cartão Amarelo
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-orange-400">{jogador.metricasR1?.cartaoAmarelo || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>🟥</span> Cartão Vermelho
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-red-400">{jogador.metricasR1?.cartaoVermelho || 0}</span>
                                </div>
                              </div>
                              <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                                <span className="text-[10px] md:text-xs font-bold text-white">Total Gols</span>
                                <span className="text-xs md:text-sm font-bold" style={{ color: jogador.cor }}>{jogador.golsR1}</span>
                              </div>
                            </div>

                            {/* Rodada 2 */}
                            <div className="p-2 rounded-lg bg-white/[0.02]">
                              <p className="text-[9px] md:text-[10px] text-gray-500 mb-1.5 font-medium">Rodada 2</p>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>⚽</span> Gols por Vendas
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-green-400">{jogador.metricasR2?.golsPorVendas || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>👟</span> Assistências
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-blue-400">{jogador.metricasR2?.assistencias || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>⭐</span> Virada de Jogo
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-purple-400">{jogador.metricasR2?.viradasDeJogo || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>⚡</span> Jogada Ensaíada
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-yellow-400">{jogador.metricasR2?.jogadasEnsaiadas || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>🏆</span> Craque da Partida
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-green-400">{jogador.metricasR2?.craqueDaPartida || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>🟨</span> Cartão Amarelo
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-orange-400">{jogador.metricasR2?.cartaoAmarelo || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1">
                                    <span>🟥</span> Cartão Vermelho
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-red-400">{jogador.metricasR2?.cartaoVermelho || 0}</span>
                                </div>
                              </div>
                              <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                                <span className="text-[10px] md:text-xs font-bold text-white">Total Gols</span>
                                <span className="text-xs md:text-sm font-bold" style={{ color: jogador.cor }}>{jogador.golsR2}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {filteredJogadores.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Shirt className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum jogador encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
