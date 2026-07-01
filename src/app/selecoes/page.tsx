'use client';

import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Shield,
  DollarSign
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import rodadasData from '@/../public/data/rodadas.json';

export default function SelecoesPage() {
  const selecoes = rodadasData.selecoes;
  const rodadas = rodadasData.rodadas;

  const rankingSelecoes = selecoes.map(sel => {
    const r1 = rodadas[0].selecoes.find(s => s.nome === sel.nome);
    const r2 = rodadas[1].selecoes.find(s => s.nome === sel.nome);
    const totalVendido = (r1?.totalVendido || 0) + (r2?.totalVendido || 0);
    const totalGols = (r1?.totalGols || 0) + (r2?.totalGols || 0);
    const jogadores = r1?.jogadores.length || 0;
    return {
      ...sel,
      totalVendido,
      totalGols,
      jogadores
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
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-display font-bold gradient-text mb-3 md:mb-4">
            AS SELEÇÕES
          </h1>
          <p className="text-sm md:text-xl text-gray-400">
            Cinco regiões, um objetivo: ser campeão!
          </p>
        </motion.header>

        {/* Grid de Seleções */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {rankingSelecoes.map((selecao, index) => (
            <motion.div
              key={selecao.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4 md:p-6 relative overflow-hidden"
              style={{ 
                borderColor: `${selecao.cor}33`,
                borderLeft: `4px solid ${selecao.cor}`
              }}
            >
              {/* Posição */}
              <div className="absolute top-3 right-3 md:top-4 md:right-4">
                <span className="text-2xl md:text-3xl font-bold" style={{ color: selecao.cor }}>
                  {index + 1}°
                </span>
              </div>

              {/* Conteúdo */}
              <div className="relative z-10">
                {/* Escudo */}
                <div 
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-4"
                  style={{ backgroundColor: `${selecao.cor}20` }}
                >
                  <Shield 
                    className="w-6 h-6 md:w-8 md:h-8" 
                    style={{ color: selecao.cor }}
                  />
                </div>

                {/* Nome */}
                <h2 className="text-xl md:text-2xl font-display font-bold mb-1 md:mb-2" style={{ color: selecao.cor }}>
                  {selecao.nome}
                </h2>

                {/* Técnico */}
                <p className="text-xs md:text-gray-400 mb-3 md:mb-4">
                  Técnico: <span className="text-white font-medium">{selecao.tecnico}</span>
                </p>

                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  <div className="text-center">
                    <p className="text-xl md:text-2xl font-bold" style={{ color: selecao.cor }}>
                      {selecao.totalGols}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400">Gols</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl md:text-2xl font-bold" style={{ color: selecao.cor }}>
                      {selecao.jogadores}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400">Jogadores</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg md:text-2xl font-bold" style={{ color: selecao.cor }}>
                      R$ {(selecao.totalVendido / 1000).toFixed(0)}k
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400">Faturamento</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ranking Geral */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-4 md:p-6"
        >
          <h2 className="text-lg md:text-2xl font-display font-bold mb-4 md:mb-6 flex items-center gap-2 gradient-text">
            <Trophy className="w-5 h-5 md:w-6 md:h-6" />
            Ranking Geral
          </h2>

          <div className="space-y-2 md:space-y-4">
            {rankingSelecoes.map((selecao, index) => (
              <motion.div
                key={selecao.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
                style={{ borderLeft: `4px solid ${selecao.cor}` }}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="text-xl md:text-2xl font-bold w-8 md:w-12 text-center" style={{ color: selecao.cor }}>
                    {index + 1}°
                  </span>
                  <div>
                    <h3 className="text-sm md:text-lg font-bold" style={{ color: selecao.cor }}>
                      {selecao.nome}
                    </h3>
                    <p className="text-[10px] md:text-sm text-gray-400">
                      {selecao.jogadores} jogadores • Técnico: {selecao.tecnico}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                  <div className="text-center">
                    <p className="text-lg md:text-2xl font-bold" style={{ color: selecao.cor }}>
                      {selecao.totalGols}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400">Gols</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm md:text-lg font-bold" style={{ color: selecao.cor }}>
                      R$ {(selecao.totalVendido / 1000000).toFixed(2)}M
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400">Faturamento</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
