'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Calendar, 
  DollarSign,
  Users,
  Clock
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import rodadasData from '@/../public/data/rodadas.json';

export default function InadimplenciaPage() {
  const [rodadaFiltro, setRodadaFiltro] = useState<number | 'all'>('all');
  const [empresaFiltro, setEmpresaFiltro] = useState<string>('all');

  const inadimplencia = rodadasData.inadimplencia;

  const todosClientes = [
    ...(inadimplencia.rodada1.clientes || []).map(c => ({ ...c, rodada: 1, periodo: inadimplencia.rodada1.periodo })),
    ...(inadimplencia.rodada2.clientes || []).map(c => ({ ...c, rodada: 2, periodo: inadimplencia.rodada2.periodo }))
  ];

  const clientesFiltrados = todosClientes.filter(cliente => {
    if (rodadaFiltro !== 'all' && cliente.rodada !== rodadaFiltro) return false;
    if (empresaFiltro !== 'all' && cliente.empresa !== empresaFiltro) return false;
    return true;
  });

  const totalTitulos = clientesFiltrados.reduce((acc, c) => acc + c.titulos, 0);
  const totalValor = clientesFiltrados.reduce((acc, c) => acc + c.valorAtualizado, 0);
  const totalClientesCount = clientesFiltrados.length;

  const clientesPorRCA = clientesFiltrados.reduce((acc, cliente) => {
    const key = cliente.rca;
    if (!acc[key]) {
      acc[key] = {
        rca: cliente.rca,
        responsavel: cliente.responsavel,
        empresa: cliente.empresa,
        titulos: 0,
        valor: 0,
        clientes: 0
      };
    }
    acc[key].titulos += cliente.titulos;
    acc[key].valor += cliente.valorAtualizado;
    acc[key].clientes += 1;
    return acc;
  }, {} as Record<number, { rca: number; responsavel: string; empresa: string; titulos: number; valor: number; clientes: number }>);

  const rankingRCA = Object.values(clientesPorRCA).sort((a, b) => b.valor - a.valor);

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
            INADIMPLÊNCIA
          </h1>
          <p className="text-sm md:text-gray-400">Controle de títulos em atraso</p>
        </motion.header>

        {/* Filtros */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-3 md:p-4 mb-4 md:mb-6"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] md:text-xs text-gray-400 mb-1.5 md:mb-2 block">Rodada</label>
              <select
                value={rodadaFiltro}
                onChange={(e) => setRodadaFiltro(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full px-3 md:px-4 py-2 input-field text-xs md:text-sm"
              >
                <option value="all">Todas</option>
                <option value={1}>Rodada 1</option>
                <option value={2}>Rodada 2</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] md:text-xs text-gray-400 mb-1.5 md:mb-2 block">Empresa</label>
              <select
                value={empresaFiltro}
                onChange={(e) => setEmpresaFiltro(e.target.value)}
                className="w-full px-3 md:px-4 py-2 input-field text-xs md:text-sm"
              >
                <option value="all">Todas</option>
                <option value="PB Foods">PB Foods</option>
                <option value="RN Foods">RN Foods</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Cards de Resumo */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6"
        >
          <div className="glass-card p-3 md:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" />
              <span className="text-[10px] md:text-xs text-gray-400">Clientes</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-red-500">{totalClientesCount}</p>
          </div>
          <div className="glass-card p-3 md:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-500" />
              <span className="text-[10px] md:text-xs text-gray-400">Títulos</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-orange-500">{totalTitulos}</p>
          </div>
          <div className="glass-card p-3 md:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500" />
              <span className="text-[10px] md:text-xs text-gray-400">Valor</span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-yellow-500">R$ {(totalValor / 1000).toFixed(1)}k</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Tabela de Clientes */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card p-4 md:p-5"
          >
            <h2 className="text-base md:text-lg font-display font-bold mb-3 md:mb-4 flex items-center gap-2 gradient-text">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
              Clientes Inadimplentes
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-2 md:py-3 px-1.5 md:px-2 text-gray-400 font-medium">Cliente</th>
                    <th className="text-left py-2 md:py-3 px-1.5 md:px-2 text-gray-400 font-medium hidden sm:table-cell">RCA</th>
                    <th className="text-center py-2 md:py-3 px-1.5 md:px-2 text-gray-400 font-medium">Tít.</th>
                    <th className="text-right py-2 md:py-3 px-1.5 md:px-2 text-gray-400 font-medium">Valor</th>
                    <th className="text-center py-2 md:py-3 px-1.5 md:px-2 text-gray-400 font-medium">Dias</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados
                    .sort((a, b) => b.diasAtraso - a.diasAtraso)
                    .map((cliente, index) => (
                    <tr key={index} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="py-2 md:py-3 px-1.5 md:px-2">
                        <div>
                          <p className="font-medium text-white text-[11px] md:text-xs truncate max-w-[150px] md:max-w-none">{cliente.cliente}</p>
                          <p className="text-[10px] md:text-xs text-gray-500 sm:hidden">RCA {cliente.rca}</p>
                          <p className="text-[10px] md:text-xs text-gray-500 hidden sm:block">{cliente.empresa} • {cliente.vencimento}</p>
                        </div>
                      </td>
                      <td className="py-2 md:py-3 px-1.5 md:px-2 hidden sm:table-cell">
                        <span className="text-[10px] md:text-xs text-gray-400">RCA {cliente.rca}</span>
                      </td>
                      <td className="py-2 md:py-3 px-1.5 md:px-2 text-center">
                        <span className="px-1 md:px-2 py-0.5 rounded text-[10px] md:text-xs bg-orange-500/10 text-orange-400">
                          {cliente.titulos}
                        </span>
                      </td>
                      <td className="py-2 md:py-3 px-1.5 md:px-2 text-right">
                        <span className="font-bold text-yellow-500 text-[11px] md:text-xs">
                          R$ {cliente.valorAtualizado.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-2 md:py-3 px-1.5 md:px-2 text-center">
                        <span className={`px-1 md:px-2 py-0.5 rounded text-[10px] md:text-xs ${
                          cliente.diasAtraso >= 15 
                            ? 'bg-red-500/10 text-red-400' 
                            : 'bg-orange-500/10 text-orange-400'
                        }`}>
                          {cliente.diasAtraso}d
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Ranking por RCA */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-4 md:p-5"
          >
            <h2 className="text-base md:text-lg font-display font-bold mb-3 md:mb-4 flex items-center gap-2 gradient-text">
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              Por Responsável
            </h2>

            <div className="space-y-2 md:space-y-3">
              {rankingRCA.map((rca, index) => (
                <div 
                  key={rca.rca}
                  className="p-2.5 md:p-3 rounded-lg bg-white/[0.02] border-l-3 border-red-500"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="font-medium text-white text-xs md:text-sm">RCA {rca.rca}</p>
                      <p className="text-[10px] md:text-xs text-gray-400 truncate max-w-[120px] md:max-w-none">{rca.responsavel}</p>
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-500">{rca.empresa}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] md:text-xs text-gray-400">
                      {rca.clientes} {rca.clientes > 1 ? 'clientes' : 'cliente'} • {rca.titulos} tít.
                    </span>
                    <span className="font-bold text-yellow-500 text-xs md:text-sm">
                      R$ {rca.valor.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Resumo por Rodada */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
        >
          <div className="glass-card p-4 md:p-5">
            <h3 className="font-bold mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base gradient-text">
              <Calendar className="w-4 h-4" />
              Rodada 1 (08-14/06)
            </h3>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div className="text-center p-2 md:p-3 rounded-lg bg-white/[0.02]">
                <p className="text-[10px] md:text-xs text-gray-400 mb-1">PB Foods</p>
                <p className="font-bold text-xs md:text-sm text-red-400">R$ {inadimplencia.rodada1.pb.valorComJuros.toFixed(2)}</p>
                <p className="text-[10px] md:text-xs text-gray-500">{inadimplencia.rodada1.pb.titulos} títulos</p>
              </div>
              <div className="text-center p-2 md:p-3 rounded-lg bg-white/[0.02]">
                <p className="text-[10px] md:text-xs text-gray-400 mb-1">RN Foods</p>
                <p className="font-bold text-xs md:text-sm text-red-400">R$ {inadimplencia.rodada1.rn.valorComJuros.toFixed(2)}</p>
                <p className="text-[10px] md:text-xs text-gray-500">{inadimplencia.rodada1.rn.titulos} títulos</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 md:p-5">
            <h3 className="font-bold mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base gradient-text">
              <Calendar className="w-4 h-4" />
              Rodada 2 (15-21/06)
            </h3>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div className="text-center p-2 md:p-3 rounded-lg bg-white/[0.02]">
                <p className="text-[10px] md:text-xs text-gray-400 mb-1">PB Foods</p>
                <p className="font-bold text-xs md:text-sm text-red-400">R$ {inadimplencia.rodada2.pb.valorComJuros.toFixed(2)}</p>
                <p className="text-[10px] md:text-xs text-gray-500">{inadimplencia.rodada2.pb.titulos} títulos</p>
              </div>
              <div className="text-center p-2 md:p-3 rounded-lg bg-white/[0.02]">
                <p className="text-[10px] md:text-xs text-gray-400 mb-1">RN Foods</p>
                <p className="font-bold text-xs md:text-sm text-red-400">R$ {inadimplencia.rodada2.rn.valorComJuros.toFixed(2)}</p>
                <p className="text-[10px] md:text-xs text-gray-500">{inadimplencia.rodada2.rn.titulos} títulos</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
