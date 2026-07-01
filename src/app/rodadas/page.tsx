'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ChevronDown, 
  Trophy,
  Users,
  Medal,
  TrendingUp
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import rodadasData from '@/../public/data/rodadas.json';

export default function RodadasPage() {
  const [rodadaSelecionada, setRodadaSelecionada] = useState(1);
  const [selecoesExpandidas, setSelecoesExpandidas] = useState<Record<string, boolean>>({});

  const rodadas = rodadasData.rodadas;
  const rodadaAtual = rodadas.find(r => r.numero === rodadaSelecionada);

  if (!rodadaAtual) return null;

  const toggleSelecao = (nome: string) => {
    setSelecoesExpandidas(prev => ({ ...prev, [nome]: !prev[nome] }));
  };

  const classificacao = rodadaAtual.selecoes.sort((a, b) => b.totalVendido - a.totalVendido);
  const totalRodada = rodadaAtual.totalRodada;

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
            RODADAS
          </h1>
          <p className="text-sm md:text-gray-400">Resultados detalhados de cada rodada</p>
        </motion.header>

        {/* Seletor de Rodada */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-6 md:mb-8"
        >
          <div className="inline-flex rounded-xl glass-card p-1">
            {rodadas.map((rodada) => (
              <button
                key={rodada.numero}
                onClick={() => {
                  setRodadaSelecionada(rodada.numero);
                  setSelecoesExpandidas({});
                }}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all duration-300 ${
                  rodadaSelecionada === rodada.numero
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-sm md:text-base">Rodada {rodada.numero}</span>
                </div>
                <div className="text-[10px] md:text-xs opacity-80 mt-0.5">
                  {rodada.dataInicio} a {rodada.dataFim}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Resumo da Rodada */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8"
        >
          <div className="glass-card p-3 md:p-4 text-center">
            <p className="text-[10px] md:text-xs text-gray-400 mb-1 uppercase tracking-wider">Faturamento</p>
            <p className="text-lg md:text-2xl font-bold text-primary-500">
              R$ {(totalRodada / 1000).toFixed(0)}k
            </p>
          </div>
          <div className="glass-card p-3 md:p-4 text-center">
            <p className="text-[10px] md:text-xs text-gray-400 mb-1 uppercase tracking-wider">Gols</p>
            <p className="text-lg md:text-2xl font-bold text-copa-gold">
              {rodadaAtual.totalGols}
            </p>
          </div>
          <div className="glass-card p-3 md:p-4 text-center">
            <p className="text-[10px] md:text-xs text-gray-400 mb-1 uppercase tracking-wider">Seleções</p>
            <p className="text-lg md:text-2xl font-bold text-blue-500">
              {rodadaAtual.selecoes.length}
            </p>
          </div>
        </motion.div>

        {/* Pódio da Rodada */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 md:mb-8"
        >
          <h2 className="text-base md:text-lg font-display font-bold mb-4 flex items-center gap-2 gradient-text">
            <Medal className="w-4 h-4 md:w-5 md:h-5" />
            Classificação da Rodada {rodadaSelecionada}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {/* 2° Lugar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-4 md:p-5 relative overflow-hidden order-2 md:order-1"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 to-gray-500" />
              <div className="text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 md:mb-3 rounded-full bg-gray-500/10 flex items-center justify-center border-2 border-gray-500/30">
                  <span className="text-lg md:text-xl font-bold text-gray-400">2°</span>
                </div>
                <h3 className="text-base md:text-lg font-bold mb-1" style={{ color: classificacao[1]?.cor }}>{classificacao[1]?.nome}</h3>
                <p className="text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3">Técnico: {classificacao[1]?.tecnico}</p>
                <div className="space-y-1">
                  <p className="text-lg md:text-xl font-bold" style={{ color: classificacao[1]?.cor }}>{classificacao[1]?.totalGols} gols</p>
                  <p className="text-[10px] md:text-xs text-gray-400">R$ {(classificacao[1]?.totalVendido / 1000).toFixed(0)}k</p>
                </div>
              </div>
            </motion.div>

            {/* 1° Lugar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-4 md:p-5 relative overflow-hidden order-1 md:order-2 border-copa-gold/30"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-copa-gold to-yellow-500" />
              <div className="absolute inset-0 bg-gradient-to-b from-copa-gold/5 to-transparent pointer-events-none" />
              <div className="text-center relative">
                <div className="w-14 h-14 md:w-18 md:h-18 mx-auto mb-2 md:mb-3 rounded-full bg-copa-gold/10 flex items-center justify-center border-2 border-copa-gold/40">
                  <Trophy className="w-7 h-7 md:w-8 md:h-8 text-copa-gold" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-copa-gold mb-1">{classificacao[0]?.nome}</h3>
                <p className="text-[10px] md:text-xs text-gray-400 mb-2 md:mb-3">Técnico: {classificacao[0]?.tecnico}</p>
                <div className="space-y-1">
                  <p className="text-xl md:text-2xl font-bold text-copa-gold">{classificacao[0]?.totalGols} gols</p>
                  <p className="text-[10px] md:text-xs text-gray-400">R$ {(classificacao[0]?.totalVendido / 1000).toFixed(0)}k</p>
                </div>
              </div>
            </motion.div>

            {/* 3° Lugar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-4 md:p-5 relative overflow-hidden order-3"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 to-amber-700" />
              <div className="text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 md:mb-3 rounded-full bg-amber-600/10 flex items-center justify-center border-2 border-amber-600/30">
                  <span className="text-lg md:text-xl font-bold text-amber-600">3°</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-amber-600 mb-1">{classificacao[2]?.nome}</h3>
                <p className="text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3">Técnico: {classificacao[2]?.tecnico}</p>
                <div className="space-y-1">
                  <p className="text-lg md:text-xl font-bold text-amber-600">{classificacao[2]?.totalGols} gols</p>
                  <p className="text-[10px] md:text-xs text-gray-400">R$ {(classificacao[2]?.totalVendido / 1000).toFixed(0)}k</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 4° e 5° Lugar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-6 md:mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {classificacao.slice(3).map((sel, index) => (
              <div
                key={sel.nome}
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
                      <p className="text-lg md:text-xl font-bold" style={{ color: sel.cor }}>{sel.totalGols}</p>
                      <p className="text-[10px] md:text-xs text-gray-400">gols</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm md:text-base font-bold" style={{ color: sel.cor }}>
                        R$ {(sel.totalVendido / 1000).toFixed(0)}k
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-400">faturamento</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Detalhes por Seleção */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-base md:text-lg font-display font-bold mb-4 flex items-center gap-2 gradient-text">
            <Users className="w-4 h-4 md:w-5 md:h-5" />
            Detalhes por Seleção
          </h2>

          <div className="space-y-2 md:space-y-3">
            {classificacao.map((selecao, index) => {
              const isExpandido = selecoesExpandidas[selecao.nome] || false;
              const posicao = index + 1;
              
              return (
                <motion.div
                  key={selecao.nome}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="glass-card overflow-hidden"
                  style={{ borderLeft: `4px solid ${selecao.cor}` }}
                >
                  {/* Header da Seleção */}
                  <div 
                    className="p-3 md:p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => toggleSelecao(selecao.nome)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl font-bold" style={{ color: selecao.cor }}>
                          {posicao}º
                        </div>
                        <div>
                          <h3 className="font-bold text-sm md:text-base" style={{ color: selecao.cor }}>{selecao.nome}</h3>
                          <p className="text-[10px] md:text-xs text-gray-400">Técnico: {selecao.tecnico} • {selecao.jogadores.length} jogadores</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 md:gap-6">
                        <div className="text-right">
                          <p className="text-lg md:text-xl font-bold" style={{ color: selecao.cor }}>{selecao.totalGols}</p>
                          <p className="text-[10px] md:text-xs text-gray-400">gols</p>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-sm md:text-base font-bold" style={{ color: selecao.cor }}>
                            R$ {(selecao.totalVendido / 1000).toFixed(0)}k
                          </p>
                          <p className="text-[10px] md:text-xs text-gray-400">faturamento</p>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpandido ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Barra de progresso */}
                    <div className="mt-2 md:mt-3 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(selecao.totalVendido / totalRodada) * 100}%` }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: selecao.cor }}
                      />
                    </div>
                  </div>

                  {/* Lista de Jogadores */}
                  <AnimatePresence>
                    {isExpandido && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/[0.04]"
                      >
                        <div className="p-3 md:p-4">
                          <h4 className="text-[10px] md:text-xs font-bold mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2 uppercase tracking-wider" style={{ color: selecao.cor }}>
                            <Users className="w-3 h-3" />
                            Jogadores - {selecao.jogadores.length} ativos
                          </h4>
                          
                          {/* Tabela de Jogadores com Métricas */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-[10px] md:text-xs">
                              <thead>
                                <tr className="border-b border-white/[0.06]">
                                  <th className="text-left py-1.5 md:py-2 px-1.5 md:px-2 text-gray-400 font-medium">#</th>
                                  <th className="text-left py-1.5 md:py-2 px-1.5 md:px-2 text-gray-400 font-medium">Jogador</th>
                                  <th className="text-right py-1.5 md:py-2 px-1 md:px-2 text-gray-400 font-medium">Fatur.</th>
                                  <th className="text-center py-1.5 md:py-2 px-1 md:px-2 font-medium" title="Gols por Vendas">
                                    <span className="text-green-400">⚽</span>
                                    <span className="hidden md:inline text-gray-400 ml-0.5">Gols</span>
                                  </th>
                                  <th className="text-center py-1.5 md:py-2 px-1 md:px-2 font-medium" title="Assistências (Novo Cliente)">
                                    <span className="text-blue-400">👟</span>
                                    <span className="hidden md:inline text-gray-400 ml-0.5">Assist.</span>
                                  </th>
                                  <th className="text-center py-1.5 md:py-2 px-1 md:px-2 font-medium" title="Virada de Jogo (Reativação)">
                                    <span className="text-purple-400">⭐</span>
                                    <span className="hidden md:inline text-gray-400 ml-0.5">Virada</span>
                                  </th>
                                  <th className="text-center py-1.5 md:py-2 px-1 md:px-2 font-medium" title="Jogada Ensaíada (Mix Estratégico)">
                                    <span className="text-yellow-400">⚡</span>
                                    <span className="hidden md:inline text-gray-400 ml-0.5">Mix</span>
                                  </th>
                                  <th className="text-center py-1.5 md:py-2 px-1 md:px-2 font-medium" title="Craque da Partida (+5 Gols)">
                                    <span className="text-copa-gold">🏆</span>
                                    <span className="hidden md:inline text-gray-400 ml-0.5">Craque</span>
                                  </th>
                                  <th className="text-center py-1.5 md:py-2 px-1 md:px-2 font-medium" title="Cartão Amarelo (-3 Gols)">
                                    <span className="text-orange-400">🟨</span>
                                    <span className="hidden md:inline text-gray-400 ml-0.5">Amarelo</span>
                                  </th>
                                  <th className="text-center py-1.5 md:py-2 px-1 md:px-2 font-medium" title="Cartão Vermelho (-5 Gols)">
                                    <span className="text-red-400">🟥</span>
                                    <span className="hidden md:inline text-gray-400 ml-0.5">Vermelho</span>
                                  </th>
                                  <th className="text-center py-1.5 md:py-2 px-1.5 md:px-2 text-white font-bold">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selecao.jogadores
                                  .sort((a, b) => b.vendaFaturada - a.vendaFaturada)
                                  .map((jogador, jIndex) => (
                                    <tr 
                                      key={jogador.rca}
                                      className="border-b border-white/[0.02] hover:bg-white/[0.02]"
                                    >
                                      <td className="py-2 md:py-2.5 px-1.5 md:px-2 font-bold" style={{ color: selecao.cor }}>
                                        {jIndex + 1}º
                                      </td>
                                      <td className="py-2 md:py-2.5 px-1.5 md:px-2">
                                        <p className="font-medium text-[11px] md:text-xs text-white truncate max-w-[120px] md:max-w-none">{jogador.nome}</p>
                                        <p className="text-[9px] md:text-[10px] text-gray-500">RCA {jogador.rca}</p>
                                      </td>
                                      <td className="py-2 md:py-2.5 px-1 md:px-2 text-right">
                                        <span className="font-bold text-copa-green text-[11px] md:text-xs">
                                          R$ {(jogador.vendaFaturada / 1000).toFixed(1)}k
                                        </span>
                                      </td>
                                      <td className="py-2 md:py-2.5 px-1 md:px-2 text-center">
                                        <span className="font-bold text-green-400">{jogador.metricas?.golsPorVendas || 0}</span>
                                      </td>
                                      <td className="py-2 md:py-2.5 px-1 md:px-2 text-center">
                                        <span className="font-bold text-blue-400">{jogador.metricas?.assistencias || 0}</span>
                                      </td>
                                      <td className="py-2 md:py-2.5 px-1 md:px-2 text-center">
                                        <span className="font-bold text-purple-400">{jogador.metricas?.viradasDeJogo || 0}</span>
                                      </td>
                                      <td className="py-2 md:py-2.5 px-1 md:px-2 text-center">
                                        <span className="font-bold text-yellow-400">{jogador.metricas?.jogadasEnsaiadas || 0}</span>
                                      </td>
                                      <td className="py-2 md:py-2.5 px-1 md:px-2 text-center">
                                        <span className="font-bold text-copa-gold">{jogador.metricas?.craqueDaPartida || 0}</span>
                                      </td>
                                      <td className="py-2 md:py-2.5 px-1 md:px-2 text-center">
                                        <span className="font-bold text-orange-400">{jogador.metricas?.cartaoAmarelo || 0}</span>
                                      </td>
                                      <td className="py-2 md:py-2.5 px-1 md:px-2 text-center">
                                        <span className="font-bold text-red-400">{jogador.metricas?.cartaoVermelho || 0}</span>
                                      </td>
                                      <td className="py-2 md:py-2.5 px-1.5 md:px-2 text-center">
                                        <span className="px-1.5 md:px-2 py-0.5 rounded font-bold text-[11px] md:text-xs" style={{ backgroundColor: `${selecao.cor}20`, color: selecao.cor }}>
                                          {jogador.gols}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Legenda */}
                          <div className="mt-3 pt-3 border-t border-white/[0.04]">
                            <p className="text-[9px] md:text-[10px] text-gray-500 mb-1.5 font-medium">LEGENDA:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2 text-[9px] md:text-[10px]">
                              <span className="text-gray-400"><span className="text-green-400">⚽</span> R$10k = 1 gol</span>
                              <span className="text-gray-400"><span className="text-blue-400">👟</span> Novo cliente = 2 gols</span>
                              <span className="text-gray-400"><span className="text-purple-400">⭐</span> Reativação = 3 gols</span>
                              <span className="text-gray-400"><span className="text-yellow-400">⚡</span> Mix estratégico = 2 gols</span>
                              <span className="text-gray-400"><span className="text-copa-gold">🏆</span> Craque = +5 gols</span>
                              <span className="text-gray-400"><span className="text-orange-400">🟨</span> Amarelo = -3 gols</span>
                              <span className="text-gray-400"><span className="text-red-400">🟥</span> Vermelho = -5 gols</span>
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

        {/* Comparativo entre Rodadas */}
        {rodadaSelecionada === 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-6 md:mt-8 glass-card p-4 md:p-5"
          >
            <h2 className="text-base md:text-lg font-display font-bold mb-4 flex items-center gap-2 gradient-text">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
              Comparativo Rodada 1 vs Rodada 2
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-gray-400 font-medium">Seleção</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 text-gray-400 font-medium">R1</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 text-gray-400 font-medium">R2</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 text-gray-400 font-medium">Var%</th>
                  </tr>
                </thead>
                <tbody>
                  {rodadas[0].selecoes.map((sel1) => {
                    const sel2 = rodadas[1].selecoes.find(s => s.nome === sel1.nome);
                    if (!sel2) return null;
                    const variacao = ((sel2.totalGols - sel1.totalGols) / sel1.totalGols * 100).toFixed(1);
                    return (
                      <tr key={sel1.nome} className="border-b border-white/[0.02]">
                        <td className="py-2 md:py-3 px-2 md:px-4 font-medium" style={{ color: sel1.cor }}>{sel1.nome}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-right">{sel1.totalGols}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-right">{sel2.totalGols}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-right">
                          <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs ${Number(variacao) >= 0 ? 'bg-primary-500/10 text-primary-400' : 'bg-red-500/10 text-red-400'}`}>
                            {Number(variacao) >= 0 ? '+' : ''}{variacao}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
