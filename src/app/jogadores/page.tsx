'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Award,
  Search,
  ChevronDown,
  Shirt
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import rodadasData from '@/../public/data/rodadas.json';

export default function JogadoresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipe, setSelectedEquipe] = useState<string>('all');
  const [selectedRodada, setSelectedRodada] = useState<number | 'accumulated'>('accumulated');
  const [sortBy, setSortBy] = useState<'gols' | 'vendas'>('gols');

  const allEquipes = rodadasData.rodadas[0].selecoes.map(s => ({
    nome: s.nome,
    cor: s.cor
  }));

  const jogadoresMap = useMemo(() => {
    const map = new Map<string, { rca: number; nome: string; equipe: string; cor: string; vendaR1: number; vendaR2: number; golsR1: number; golsR2: number }>();

    for (const rodada of rodadasData.rodadas) {
      for (const selecao of rodada.selecoes) {
        for (const jogador of selecao.jogadores) {
          const key = `${jogador.rca}-${selecao.nome}`;
          const existing = map.get(key);
          if (existing) {
            if (rodada.numero === 1) {
              existing.vendaR1 = jogador.vendaFaturada;
              existing.golsR1 = jogador.gols;
            } else {
              existing.vendaR2 = jogador.vendaFaturada;
              existing.golsR2 = jogador.gols;
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

        {/* Filtros */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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

        {/* Lista de Jogadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredJogadores.map((jogador, index) => (
            <motion.div
              key={`${jogador.rca}-${jogador.equipe}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.03 }}
              className="glass-card-hover p-3 md:p-4 relative overflow-hidden"
              style={{ borderColor: `${jogador.cor}33` }}
            >
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm md:text-base font-bold truncate" style={{ color: jogador.cor }}>
                      {jogador.nome}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-400">
                      {jogador.equipe} • RCA {jogador.rca}
                    </p>
                  </div>
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl font-bold flex-shrink-0 ml-2"
                    style={{ 
                      backgroundColor: `${jogador.cor}20`,
                      color: jogador.cor 
                    }}
                  >
                    {jogador.gols}
                  </div>
                </div>

                {/* Stats Compactas */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-white/[0.03]">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Target className="w-3 h-3" style={{ color: jogador.cor }} />
                      <span className="text-[10px] text-gray-400">Gols</span>
                    </div>
                    <p className="text-sm md:text-base font-bold" style={{ color: jogador.cor }}>
                      {jogador.gols}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03]">
                    <div className="flex items-center gap-1 mb-0.5">
                      <TrendingUp className="w-3 h-3" style={{ color: jogador.cor }} />
                      <span className="text-[10px] text-gray-400">Vendas</span>
                    </div>
                    <p className="text-sm md:text-base font-bold" style={{ color: jogador.cor }}>
                      R$ {(jogador.vendas / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>

                {/* Detalhes por Rodada */}
                <div className="text-[10px] md:text-xs text-gray-400 grid grid-cols-2 gap-1">
                  <span>R1: {jogador.golsR1}g • R$ {(jogador.vendaR1 / 1000).toFixed(0)}k</span>
                  <span>R2: {jogador.golsR2}g • R$ {(jogador.vendaR2 / 1000).toFixed(0)}k</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
