'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Database, 
  Bell, 
  Shield,
  Download,
  Upload,
  Trash2,
  Save
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import toast from 'react-hot-toast';

export default function ConfiguracoesPage() {
  const [configs, setConfigs] = useState({
    valorGolVenda: 10000,
    golsPositivacao: 2,
    golsReativacao: 3,
    golsMixEstrategico: 2,
    golsCraquePartida: 5,
    penalidadeAmarelo: -3,
    penalidadeVermelho: -5,
    notificacoes: true,
    modoAutomatico: true,
  });

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const handleExport = () => {
    toast.success('Dados exportados com sucesso!');
  };

  const handleImport = () => {
    toast.success('Dados importados com sucesso!');
  };

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      toast.success('Dados limpos com sucesso!');
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
            CONFIGURAÇÕES
          </h1>
          <p className="text-xl text-gray-400">
            Ajuste as regras e configurações do sistema
          </p>
        </motion.header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Regras do Jogo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary-500" />
              Regras do Jogo
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Valor por Gol (Vendas)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">R$</span>
                  <input
                    type="number"
                    value={configs.valorGolVenda}
                    onChange={(e) => setConfigs({ ...configs, valorGolVenda: Number(e.target.value) })}
                    className="flex-1 input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Gols por Positivação
                </label>
                <input
                  type="number"
                  value={configs.golsPositivacao}
                  onChange={(e) => setConfigs({ ...configs, golsPositivacao: Number(e.target.value) })}
                  className="w-full input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Gols por Reativação
                </label>
                <input
                  type="number"
                  value={configs.golsReativacao}
                  onChange={(e) => setConfigs({ ...configs, golsReativacao: Number(e.target.value) })}
                  className="w-full input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Gols por Mix Estratégico
                </label>
                <input
                  type="number"
                  value={configs.golsMixEstrategico}
                  onChange={(e) => setConfigs({ ...configs, golsMixEstrategico: Number(e.target.value) })}
                  className="w-full input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Gols por Craque da Partida
                </label>
                <input
                  type="number"
                  value={configs.golsCraquePartida}
                  onChange={(e) => setConfigs({ ...configs, golsCraquePartida: Number(e.target.value) })}
                  className="w-full input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Penalidade Cartão Amarelo
                </label>
                <input
                  type="number"
                  value={configs.penalidadeAmarelo}
                  onChange={(e) => setConfigs({ ...configs, penalidadeAmarelo: Number(e.target.value) })}
                  className="w-full input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Penalidade Cartão Vermelho
                </label>
                <input
                  type="number"
                  value={configs.penalidadeVermelho}
                  onChange={(e) => setConfigs({ ...configs, penalidadeVermelho: Number(e.target.value) })}
                  className="w-full input-field"
                />
              </div>
            </div>
          </motion.div>

          {/* Configurações do Sistema */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                Banco de Dados
              </h2>

              <div className="space-y-4">
                <button 
                  onClick={handleExport}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar Dados
                </button>

                <button 
                  onClick={handleImport}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Importar Backup
                </button>

                <button 
                  onClick={handleClearData}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-500 font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar Todos os Dados
                </button>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-500" />
                Notificações
              </h2>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 cursor-pointer">
                  <span>Notificações por Email</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={configs.notificacoes}
                      onChange={(e) => setConfigs({ ...configs, notificacoes: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${configs.notificacoes ? 'bg-primary-500' : 'bg-gray-600'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${configs.notificacoes ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 cursor-pointer">
                  <span>Processamento Automático</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={configs.modoAutomatico}
                      onChange={(e) => setConfigs({ ...configs, modoAutomatico: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${configs.modoAutomatico ? 'bg-primary-500' : 'bg-gray-600'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${configs.modoAutomatico ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Configurações
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
