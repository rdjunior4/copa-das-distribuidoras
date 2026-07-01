'use client';

import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Users,
  Zap,
  DollarSign,
  Medal,
  Target,
  Shield
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import rodadasData from '@/../public/data/rodadas.json';

export default function HomePage() {
  const rodadas = rodadasData.rodadas;
  const selecoes = rodadasData.selecoes;

  const totalGeral = rodadas.reduce((a, r) => a + r.totalRodada, 0);
  const totalGols = rodadas.reduce((a, r) => a + r.totalGols, 0);
  const totalClientes = rodadasData.clientesNovos.rodada1.total + rodadasData.clientesNovos.rodada2.total;

  const rankingGeral = selecoes.map(sel => {
    const r1 = rodadas[0].selecoes.find(s => s.nome === sel.nome);
    const r2 = rodadas[1].selecoes.find(s => s.nome === sel.nome);
    const totalVendido = (r1?.totalVendido || 0) + (r2?.totalVendido || 0);
    const totalGols = (r1?.totalGols || 0) + (r2?.totalGols || 0);
    return {
      ...sel,
      totalVendido,
      totalGols,
      jogadores: r1?.jogadores.length || 0
    };
  }).sort((a, b) => b.totalVendido - a.totalVendido);

  const melhorJogador = rodadas.flatMap(r => 
    r.selecoes.flatMap(s => 
      s.jogadores.map(j => ({
        ...j,
        selecao: s.nome,
        cor: s.cor
      }))
    )
  ).reduce((melhor, atual) => {
    const totalAtual = rodadas.reduce((acc, r) => {
      const sel = r.selecoes.find(s => s.nome === atual.selecao);
      if (!sel) return acc;
      const j = sel.jogadores.find(j => j.rca === atual.rca);
      return acc + (j?.vendaFaturada || 0);
    }, 0);
    
    const totalMelhor = melhor ? rodadas.reduce((acc, r) => {
      const sel = r.selecoes.find(s => s.nome === melhor.selecao);
      if (!sel) return acc;
      const j = sel.jogadores.find(j => j.rca === melhor.rca);
      return acc + (j?.vendaFaturada || 0);
    }, 0) : 0;
    
    return totalAtual > totalMelhor ? { ...atual, totalVendido: totalAtual } : melhor;
  }, null as any);

  return (
    <div className="min-h-screen page-content">
      <Navbar />
      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-3 md:mb-4">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-[10px] md:text-xs font-medium text-primary-500 uppercase tracking-wider">AO VIVO</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold gradient-text mb-2">
            COPA DAS DISTRIBUIDORAS
          </h1>
          <p className="text-sm md:text-lg text-gray-400">PB & RN FOODS - Competição Comercial 2026</p>
        </motion.header>

        {/* Cards de Resumo Total */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-10"
        >
          <div className="glass-card p-3 md:p-5">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary-500" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">Faturamento</span>
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-500">
              R$ {(totalGeral / 1000000).toFixed(2)}M
            </p>
          </div>

          <div className="glass-card p-3 md:p-5">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-copa-gold/10 flex items-center justify-center">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-copa-gold" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">Gols</span>
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-copa-gold">
              {totalGols}
            </p>
          </div>

          <div className="glass-card p-3 md:p-5">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">Clientes Novos</span>
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-500">
              {totalClientes}
            </p>
          </div>

          <div className="glass-card p-3 md:p-5">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">Seleções</span>
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-500">
              {selecoes.length}
            </p>
          </div>
        </motion.div>

        {/* Classificação Geral */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 md:mb-10"
        >
          <h2 className="text-base md:text-lg font-display font-bold mb-4 md:mb-6 flex items-center gap-2 gradient-text">
            <Medal className="w-4 h-4 md:w-5 md:h-5" />
            Classificação Geral
          </h2>

          {/* Pódio - Top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
            {/* 2° Lugar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-4 md:p-6 relative overflow-hidden order-2 md:order-1"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 to-gray-500" />
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-gray-500/10 flex items-center justify-center border-2 border-gray-500/30">
                  <span className="text-xl md:text-2xl font-bold text-gray-400">2°</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-1" style={{ color: rankingGeral[1]?.cor }}>{rankingGeral[1]?.nome}</h3>
                <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4">Técnico: {rankingGeral[1]?.tecnico}</p>
                <div className="space-y-1 md:space-y-2">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-gray-400">Faturamento</span>
                    <span className="font-bold" style={{ color: rankingGeral[1]?.cor }}>R$ {(rankingGeral[1]?.totalVendido / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-gray-400">Gols</span>
                    <span className="font-bold" style={{ color: rankingGeral[1]?.cor }}>{rankingGeral[1]?.totalGols}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 1° Lugar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-4 md:p-6 relative overflow-hidden order-1 md:order-2 border-copa-gold/30"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-copa-gold to-yellow-500" />
              <div className="absolute inset-0 bg-gradient-to-b from-copa-gold/5 to-transparent pointer-events-none" />
              <div className="text-center relative">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 rounded-full bg-copa-gold/10 flex items-center justify-center border-2 border-copa-gold/40">
                  <Trophy className="w-8 h-8 md:w-10 md:h-10 text-copa-gold" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-copa-gold mb-1">{rankingGeral[0]?.nome}</h3>
                <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-4">Técnico: {rankingGeral[0]?.tecnico}</p>
                <div className="space-y-1 md:space-y-2">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-gray-400">Faturamento</span>
                    <span className="font-bold text-copa-gold">R$ {(rankingGeral[0]?.totalVendido / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-gray-400">Gols</span>
                    <span className="font-bold text-copa-gold">{rankingGeral[0]?.totalGols}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3° Lugar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-4 md:p-6 relative overflow-hidden order-3"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 to-amber-700" />
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-amber-600/10 flex items-center justify-center border-2 border-amber-600/30">
                  <span className="text-xl md:text-2xl font-bold text-amber-600">3°</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-amber-600 mb-1">{rankingGeral[2]?.nome}</h3>
                <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4">Técnico: {rankingGeral[2]?.tecnico}</p>
                <div className="space-y-1 md:space-y-2">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-gray-400">Faturamento</span>
                    <span className="font-bold text-amber-600">R$ {(rankingGeral[2]?.totalVendido / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-gray-400">Gols</span>
                    <span className="font-bold text-amber-600">{rankingGeral[2]?.totalGols}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 4° e 5° Lugar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {rankingGeral.slice(3).map((sel, index) => (
              <motion.div
                key={sel.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="glass-card p-4 md:p-5"
                style={{ borderLeft: `4px solid ${sel.cor}` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl font-bold" style={{ color: sel.cor }}>
                      {index + 4}°
                    </div>
                    <div>
                      <h3 className="font-bold text-sm md:text-base" style={{ color: sel.cor }}>{sel.nome}</h3>
                      <p className="text-[10px] md:text-xs text-gray-400">Técnico: {sel.tecnico}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-right">
                      <p className="font-bold text-sm md:text-base" style={{ color: sel.cor }}>{sel.totalGols} gols</p>
                      <p className="text-[10px] md:text-xs text-gray-400">R$ {(sel.totalVendido / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Melhor Jogador */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-6 md:mb-10"
        >
          <h2 className="text-base md:text-lg font-display font-bold mb-4 md:mb-6 flex items-center gap-2 gradient-text">
            <Target className="w-4 h-4 md:w-5 md:h-5" />
            Artilheiro da Copa
          </h2>

          <div className="glass-card p-4 md:p-6 max-w-md">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold" style={{ color: melhorJogador?.cor, backgroundColor: `${melhorJogador?.cor}15` }}>
                {melhorJogador?.rca}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-bold truncate" style={{ color: melhorJogador?.cor }}>{melhorJogador?.nome}</h3>
                <p className="text-xs md:text-sm text-gray-400">RCA {melhorJogador?.rca} • {melhorJogador?.selecao}</p>
              </div>
              <div className="text-right">
                <p className="text-lg md:text-2xl font-bold" style={{ color: melhorJogador?.cor }}>
                  R$ {(melhorJogador?.totalVendido / 1000).toFixed(0)}k
                </p>
                <p className="text-[10px] md:text-xs text-gray-400">total acumulado</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resumo por Rodada */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-base md:text-lg font-display font-bold mb-4 md:mb-6 flex items-center gap-2 gradient-text">
            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
            Resumo por Rodada
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {rodadas.map((rodada, index) => (
              <div key={rodada.numero} className="glass-card p-4 md:p-5">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div>
                    <h3 className="font-bold text-base md:text-lg">Rodada {rodada.numero}</h3>
                    <p className="text-[10px] md:text-xs text-gray-400">{rodada.dataInicio} a {rodada.dataFim}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg md:text-xl font-bold text-primary-500">R$ {(rodada.totalRodada / 1000).toFixed(0)}k</p>
                    <p className="text-[10px] md:text-xs text-gray-400">{rodada.totalGols} gols</p>
                  </div>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  {rodada.selecoes
                    .sort((a, b) => b.totalVendido - a.totalVendido)
                    .map((sel, sIndex) => (
                      <div key={sel.nome} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded flex items-center justify-center text-[10px] md:text-xs font-bold" style={{ color: sel.cor }}>
                            {sIndex + 1}º
                          </div>
                          <span className="text-xs md:text-sm">{sel.nome}</span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                          <span className="text-xs md:text-sm font-medium" style={{ color: sel.cor }}>
                            {sel.totalGols} gols
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
