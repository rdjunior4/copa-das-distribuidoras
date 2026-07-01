'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  Target,
  Award,
  Shield
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';

const TECNICOS_MOCK = [
  { 
    id: '1', 
    nome: 'Carlos Eduardo', 
    equipe: 'Sertão PB', 
    cor: '#68C200', 
    vitorias: 4, 
    empates: 1, 
    derrotas: 0, 
    golsPro: 12, 
    golsContra: 3, 
    saldo: 9, 
    pontuacao: 13,
    posicao: 1
  },
  { 
    id: '2', 
    nome: 'Fernando', 
    equipe: 'Metropolitana PB', 
    cor: '#3b82f6', 
    vitorias: 3, 
    empates: 1, 
    derrotas: 1, 
    golsPro: 10, 
    golsContra: 5, 
    saldo: 5, 
    pontuacao: 10,
    posicao: 2
  },
  { 
    id: '3', 
    nome: 'Wanderley', 
    equipe: 'Litoral Norte', 
    cor: '#8b5cf6', 
    vitorias: 2, 
    empates: 2, 
    derrotas: 1, 
    golsPro: 8, 
    golsContra: 6, 
    saldo: 2, 
    pontuacao: 8,
    posicao: 3
  },
  { 
    id: '4', 
    nome: 'Roberto', 
    equipe: 'Costa Potiguar', 
    cor: '#FFD700', 
    vitorias: 1, 
    empates: 1, 
    derrotas: 3, 
    golsPro: 5, 
    golsContra: 9, 
    saldo: -4, 
    pontuacao: 4,
    posicao: 4
  },
  { 
    id: '5', 
    nome: 'Marcos', 
    equipe: 'Sertão de Ouro', 
    cor: '#f97316', 
    vitorias: 0, 
    empates: 1, 
    derrotas: 4, 
    golsPro: 3, 
    golsContra: 15, 
    saldo: -12, 
    pontuacao: 1,
    posicao: 5
  },
];

export default function TecnicosPage() {
  const getPosicaoIcon = (posicao: number) => {
    switch (posicao) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${posicao}º`;
    }
  };

  return (
    <div className="min-h-screen bg-copa-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
            TÉCNICOS
          </h1>
          <p className="text-xl text-gray-400">
            Ranking dos supervisores que comandam as seleções
          </p>
        </motion.header>

        {/* Ranking dos Técnicos */}
        <div className="space-y-6">
          {TECNICOS_MOCK.map((tecnico, index) => (
            <motion.div
              key={tecnico.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-card p-6 relative overflow-hidden"
              style={{ borderColor: `${tecnico.cor}33` }}
            >
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Posição e Info */}
                <div className="flex items-center gap-4 lg:w-1/3">
                  <span className="text-4xl">{getPosicaoIcon(tecnico.posicao)}</span>
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${tecnico.cor}20` }}
                  >
                    <Shield className="w-8 h-8" style={{ color: tecnico.cor }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: tecnico.cor }}>
                      {tecnico.nome}
                    </h2>
                    <p className="text-gray-400">{tecnico.equipe}</p>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-3xl font-bold" style={{ color: tecnico.cor }}>
                      {tecnico.pontuacao}
                    </p>
                    <p className="text-xs text-gray-400">Pontos</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-3xl font-bold" style={{ color: tecnico.cor }}>
                      {tecnico.golsPro}
                    </p>
                    <p className="text-xs text-gray-400">Gols Pró</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-3xl font-bold" style={{ color: tecnico.cor }}>
                      {tecnico.saldo > 0 ? `+${tecnico.saldo}` : tecnico.saldo}
                    </p>
                    <p className="text-xs text-gray-400">Saldo</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-3xl font-bold" style={{ color: tecnico.cor }}>
                      {tecnico.vitorias}
                    </p>
                    <p className="text-xs text-gray-400">Vitórias</p>
                  </div>
                </div>

                {/* Campanha */}
                <div className="lg:w-1/4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Campanha</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-500">{tecnico.vitorias}</p>
                      <p className="text-xs text-gray-400">V</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-yellow-500">{tecnico.empates}</p>
                      <p className="text-xs text-gray-400">E</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-red-500">{tecnico.derrotas}</p>
                      <p className="text-xs text-gray-400">D</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
