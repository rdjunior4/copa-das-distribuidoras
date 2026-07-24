'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Zap,
  DollarSign,
  Calendar
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import rodadasData from '@/../public/data/rodadas.json';

export default function EstatisticasPage() {
  const rodadas = rodadasData.rodadas;
  const selecoes = rodadasData.selecoes;
  const inadimplencia = rodadasData.inadimplencia;
  const clientesNovos = rodadasData.clientesNovos;

  const totalGeral = rodadas.reduce((a, r) => a + r.totalRodada, 0);
  const totalGols = rodadas.reduce((a, r) => a + r.totalGols, 0);
  const totalClientes = clientesNovos.rodada1.total + clientesNovos.rodada2.total;
  const totalInadimplencia = inadimplencia.rodada1.pb.valorComJuros + 
                              inadimplencia.rodada1.rn.valorComJuros +
                              inadimplencia.rodada2.pb.valorComJuros + 
                              inadimplencia.rodada2.rn.valorComJuros;

  const ESTATISTICAS = [
    { titulo: 'Total Vendido', valor: `R$ ${(totalGeral / 1000000).toFixed(2)}M`, icone: DollarSign, cor: '#68C200' },
    { titulo: 'Clientes Novos', valor: `${totalClientes}`, icone: Users, cor: '#3b82f6' },
    { titulo: 'Total Gols', valor: `${totalGols}`, icone: Zap, cor: '#f97316' },
    { titulo: 'Inadimplência', valor: `R$ ${(totalInadimplencia / 1000).toFixed(1)}k`, icone: AlertTriangle, cor: '#ef4444' },
  ];

  const rankingSelecoes = selecoes.map(sel => {
    const r1 = rodadas[0].selecoes.find(s => s.nome === sel.nome);
    const r2 = rodadas[1].selecoes.find(s => s.nome === sel.nome);
    const totalVendido = (r1?.totalVendido || 0) + (r2?.totalVendido || 0);
    const totalGols = (r1?.totalGols || 0) + (r2?.totalGols || 0);
    const variacao = r1 && r2 ? ((r2.totalGols - r1.totalGols) / r1.totalGols * 100) : 0;
    return {
      ...sel,
      totalVendido,
      totalGols,
      variacao,
      jogadores: r1?.jogadores.length || 0
    };
  }).sort((a, b) => b.totalVendido - a.totalVendido);

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
          <h1 className="text-3xl md:text-5xl font-display font-bold gradient-text mb-2 md:mb-3">
            ESTATÍSTICAS
          </h1>
          <p className="text-sm md:text-lg text-gray-400">
            Análise consolidada de todas as rodadas
          </p>
        </motion.header>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
          {ESTATISTICAS.map((stat, index) => (
            <motion.div
              key={stat.titulo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass-card p-3 md:p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icone className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: stat.cor }} />
                <span className="text-[10px] md:text-xs text-gray-400">{stat.titulo}</span>
              </div>
              <p className="text-lg md:text-2xl font-bold" style={{ color: stat.cor }}>
                {stat.valor}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Ranking de Seleções */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 md:p-5 mb-4 md:mb-6"
        >
          <h2 className="text-base md:text-lg font-display font-bold mb-3 md:mb-4 flex items-center gap-2 gradient-text">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
            Ranking de Seleções (Acumulado)
          </h2>

          <div className="space-y-2 md:space-y-3">
            {rankingSelecoes.map((sel, index) => (
              <motion.div
                key={sel.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-white/[0.02]"
                style={{ borderLeft: `3px solid ${sel.cor}` }}
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-base md:text-lg font-bold" style={{ color: sel.cor }}>
                  {index + 1}º
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm md:text-base" style={{ color: sel.cor }}>{sel.nome}</h3>
                  <p className="text-[10px] md:text-xs text-gray-400">Técnico: {sel.tecnico} • {sel.jogadores} jogadores</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm md:text-base" style={{ color: sel.cor }}>
                    R$ {(sel.totalVendido / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-400">acumulado</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm md:text-base" style={{ color: sel.cor }}>
                    {sel.totalGols}
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-400">gols</p>
                </div>
                <div className="text-right">
                  <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs ${sel.variacao >= 0 ? 'bg-primary-500/10 text-primary-400' : 'bg-red-500/10 text-red-400'}`}>
                    {sel.variacao >= 0 ? '+' : ''}{sel.variacao.toFixed(1)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Detalhamento por Rodada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          {rodadas.map((rodada, index) => (
            <motion.div
              key={rodada.numero}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="glass-card p-4 md:p-5"
            >
              <h2 className="text-base md:text-lg font-display font-bold mb-3 md:mb-4 flex items-center gap-2 gradient-text">
                <Calendar className="w-4 h-4" />
                Rodada {rodada.numero}
              </h2>
              <p className="text-[10px] md:text-xs text-gray-400 mb-2 md:mb-3">{rodada.dataInicio} a {rodada.dataFim}</p>

              <div className="space-y-1.5 md:space-y-2">
                {rodada.selecoes
                  .sort((a, b) => b.totalVendido - a.totalVendido)
                  .map((sel, sIndex) => (
                    <div key={sel.nome} className="flex items-center justify-between p-2 md:p-2.5 rounded-lg bg-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sel.cor }} />
                        <span className="text-xs md:text-sm">{sel.nome}</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-4">
                        <span className="text-xs md:text-sm font-medium" style={{ color: sel.cor }}>
                          R$ {(sel.totalVendido / 1000).toFixed(0)}k
                        </span>
                        <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-0.5 rounded" style={{ backgroundColor: `${sel.cor}15`, color: sel.cor }}>
                          {sel.totalGols} gols
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/[0.04] flex justify-between items-center">
                <span className="text-xs md:text-sm font-medium">Total Rodada</span>
                <span className="font-bold text-sm md:text-base gradient-text">
                  R$ {(rodada.totalRodada / 1000).toFixed(0)}k
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Inadimplência */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-4 md:p-5"
        >
          <h2 className="text-base md:text-lg font-display font-bold mb-3 md:mb-4 flex items-center gap-2 gradient-text">
            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
            Inadimplência por Rodada
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {Object.entries(inadimplencia).map(([key, rodada]) => {
              const r = rodada as any;
              const num = parseInt(key.replace('rodada', ''));
              const labels: Record<number, string> = {
                1: 'Rodada 1 (08-14/06)',
                2: 'Rodada 2 (15-21/06)',
                3: 'Rodada 3 (22-30/06)',
                4: 'Rodada 4 (01-05/07)',
                5: 'Rodada 5 (06-12/07)',
                6: 'Rodada 6 (13-20/07)'
              };
              const hasPbRn = r.pb && r.rn;
              return (
                <div key={key} className="p-3 md:p-4 rounded-xl bg-white/[0.02]">
                  <h3 className="font-medium text-xs md:text-sm mb-2">{labels[num] || key}</h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                      <p className="text-[10px] md:text-xs text-gray-400">PB</p>
                      <p className="font-bold text-xs md:text-sm text-red-400">
                        R$ {hasPbRn ? (r.pb.valorComJuros / 1000).toFixed(1) : (r.totalValor * 0.6 / 1000).toFixed(1)}k
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500">{hasPbRn ? r.pb.titulos : Math.round(r.total * 0.6)} títulos</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                      <p className="text-[10px] md:text-xs text-gray-400">RN</p>
                      <p className="font-bold text-xs md:text-sm text-red-400">
                        R$ {hasPbRn ? (r.rn.valorComJuros / 1000).toFixed(1) : (r.totalValor * 0.4 / 1000).toFixed(1)}k
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500">{hasPbRn ? r.rn.titulos : Math.round(r.total * 0.4)} títulos</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
