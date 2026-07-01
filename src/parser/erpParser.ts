import * as XLSX from 'xlsx';
import { ParserResult, Venda, Inadimplencia } from '@/types';

const COLUNAS_VENDAS = {
  rcaCodigo: ['Codigo RCA', 'Codigo', 'RCA Codigo'],
  rcaNome: ['RCA', 'Nome RCA', 'RCA Nome'],
  qtdeNFs: ['Qtde NFs', 'Qtde NFS', 'NFs'],
  qtClientesPosit: ['Qt Clientes Posit', 'Clientes Positivados'],
  supervisorCodigo: ['Codigo (Supervisor)', 'Supervisor Codigo'],
  supervisorNome: ['Supervisor', 'Nome Supervisor'],
  valorVenda: ['Vl venda faturada', 'Venda Faturada', 'Valor Venda'],
  valorLiquido: ['Vl venda liquida', 'Venda Liquida'],
  valorDevolucao: ['Vl devolucao', 'Devolucao'],
  valorCMV: ['Vl CMV', 'CMV'],
  valorLucro: ['Vl lucro', 'Lucro'],
  valorMeta: ['Vl meta', 'Meta'],
  percentualMeta: ['% Meta', 'Meta %'],
  percentualLucro: ['% Lucro', 'Lucro %'],
  pesoKg: ['Peso carregado (kg)', 'Peso', 'Peso Kg'],
  valorDesconto: ['Vl desconto', 'Desconto'],
  prazoMedio: ['Prazo medio', 'Prazo Medio'],
  qtMixVendido: ['Qt mix vendido', 'Mix Vendido'],
};

const COLUNAS_CLIENTES_NOVOS = {
  codigo: ['Codigo', 'Cod Cliente'],
  nome: ['Cliente', 'Nome Cliente'],
  fantasia: ['Fantasia', 'Nome Fantasia'],
  cnpjCpf: ['CNPJ/CPF', 'CNPJ', 'CPF'],
  tipoPessoa: ['Tipo de Pessoa', 'Tipo Pessoa'],
  atividade: ['Atividade'],
  ramoAtividade: ['Ramo Atividade', 'Ramo'],
  praca: ['Praca', 'Praca Comercial'],
  endereco: ['Endereco Comercial', 'Endereco'],
  telefone: ['Telefone Comercial', 'Telefone'],
  email: ['E-mail', 'Email'],
  estado: ['Estado', 'UF'],
  bloqueado: ['Bloqueio', 'Bloqueado'],
};

function detectarColunas(headers: string[], mapeamento: Record<string, string[]>): Record<string, number> {
  const colunasDetectadas: Record<string, number> = {};
  
  for (const [campo, opcoes] of Object.entries(mapeamento)) {
    for (const opcao of opcoes) {
      const indice = headers.findIndex(
        h => h.toLowerCase().includes(opcao.toLowerCase())
      );
      if (indice !== -1) {
        colunasDetectadas[campo] = indice;
        break;
      }
    }
  }
  
  return colunasDetectadas;
}

function limparValorMonetario(valor: string | number): number {
  if (typeof valor === 'number') return valor;
  if (!valor) return 0;
  
  const valorStr = String(valor)
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();
  
  const numero = parseFloat(valorStr);
  return isNaN(numero) ? 0 : numero;
}

function limparPercentual(valor: string | number): number {
  if (typeof valor === 'number') return valor;
  if (!valor) return 0;
  
  const valorStr = String(valor).replace('%', '').replace(',', '.').trim();
  const numero = parseFloat(valorStr);
  return isNaN(numero) ? 0 : numero;
}

function parseVendasXLS(buffer: Buffer, nomeArquivo: string): ParserResult {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  if (dados.length < 2) {
    return {
      tipo: 'VENDAS',
      dados: [],
      metadados: {
        arquivo: nomeArquivo,
        totalRegistros: 0,
        colunas: [],
      },
    };
  }
  
  const headers = dados[0] as string[];
  const colunasDetectadas = detectarColunas(headers, COLUNAS_VENDAS);
  
  const vendas: Venda[] = [];
  
  for (let i = 1; i < dados.length; i++) {
    const row = dados[i] as any[];
    
    if (!row || row.every(cell => cell === null || cell === undefined || cell === '')) {
      continue;
    }
    
    const venda: Venda = {
      id: `venda-${nomeArquivo}-${i}`,
      rcaCodigo: colunasDetectadas.rcaCodigo !== undefined ? parseInt(row[colunasDetectadas.rcaCodigo]) || 0 : 0,
      rcaNome: colunasDetectadas.rcaNome !== undefined ? String(row[colunasDetectadas.rcaNome] || '') : '',
      supervisorCodigo: colunasDetectadas.supervisorCodigo !== undefined ? parseInt(row[colunasDetectadas.supervisorCodigo]) || 0 : 0,
      supervisorNome: colunasDetectadas.supervisorNome !== undefined ? String(row[colunasDetectadas.supervisorNome] || '') : '',
      dataVenda: new Date(),
      valorVenda: colunasDetectadas.valorVenda !== undefined ? limparValorMonetario(row[colunasDetectadas.valorVenda]) : 0,
      valorLiquido: colunasDetectadas.valorLiquido !== undefined ? limparValorMonetario(row[colunasDetectadas.valorLiquido]) : 0,
      valorDevolucao: colunasDetectadas.valorDevolucao !== undefined ? limparValorMonetario(row[colunasDetectadas.valorDevolucao]) : 0,
      valorCMV: colunasDetectadas.valorCMV !== undefined ? limparValorMonetario(row[colunasDetectadas.valorCMV]) : 0,
      valorLucro: colunasDetectadas.valorLucro !== undefined ? limparValorMonetario(row[colunasDetectadas.valorLucro]) : 0,
      valorMeta: colunasDetectadas.valorMeta !== undefined ? limparValorMonetario(row[colunasDetectadas.valorMeta]) : 0,
      percentualMeta: colunasDetectadas.percentualMeta !== undefined ? limparPercentual(row[colunasDetectadas.percentualMeta]) : 0,
      percentualLucro: colunasDetectadas.percentualLucro !== undefined ? limparPercentual(row[colunasDetectadas.percentualLucro]) : 0,
      pesoKg: colunasDetectadas.pesoKg !== undefined ? limparValorMonetario(row[colunasDetectadas.pesoKg]) : 0,
      valorDesconto: colunasDetectadas.valorDesconto !== undefined ? limparValorMonetario(row[colunasDetectadas.valorDesconto]) : 0,
      prazoMedio: colunasDetectadas.prazoMedio !== undefined ? limparValorMonetario(row[colunasDetectadas.prazoMedio]) : 0,
      qtdeNFs: colunasDetectadas.qtdeNFs !== undefined ? parseInt(row[colunasDetectadas.qtdeNFs]) || 0 : 0,
      qtClientesPosit: colunasDetectadas.qtClientesPosit !== undefined ? parseInt(row[colunasDetectadas.qtClientesPosit]) || 0 : 0,
      qtMixVendido: colunasDetectadas.qtMixVendido !== undefined ? parseInt(row[colunasDetectadas.qtMixVendido]) || 0 : 0,
    };
    
    if (venda.rcaNome) {
      vendas.push(venda);
    }
  }
  
  return {
    tipo: 'VENDAS',
    dados: vendas,
    metadados: {
      arquivo: nomeArquivo,
      totalRegistros: vendas.length,
      colunas: Object.keys(colunasDetectadas),
    },
  };
}

function parseClientesNovosXLS(buffer: Buffer, nomeArquivo: string): ParserResult {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  if (dados.length < 2) {
    return {
      tipo: 'CLIENTES_NOVOS',
      dados: [],
      metadados: {
        arquivo: nomeArquivo,
        totalRegistros: 0,
        colunas: [],
      },
    };
  }
  
  const headers = dados[0] as string[];
  const colunasDetectadas = detectarColunas(headers, COLUNAS_CLIENTES_NOVOS);
  
  const clientes: any[] = [];
  
  for (let i = 1; i < dados.length; i++) {
    const row = dados[i] as any[];
    
    if (!row || row.every(cell => cell === null || cell === undefined || cell === '')) {
      continue;
    }
    
    const cliente = {
      id: `cliente-${nomeArquivo}-${i}`,
      codigo: colunasDetectadas.codigo !== undefined ? String(row[colunasDetectadas.codigo] || '') : '',
      nome: colunasDetectadas.nome !== undefined ? String(row[colunasDetectadas.nome] || '') : '',
      fantasia: colunasDetectadas.fantasia !== undefined ? String(row[colunasDetectadas.fantasia] || '') : '',
      cnpjCpf: colunasDetectadas.cnpjCpf !== undefined ? String(row[colunasDetectadas.cnpjCpf] || '') : '',
      tipoPessoa: colunasDetectadas.tipoPessoa !== undefined ? String(row[colunasDetectadas.tipoPessoa] || '') : '',
      atividade: colunasDetectadas.atividade !== undefined ? String(row[colunasDetectadas.atividade] || '') : '',
      ramoAtividade: colunasDetectadas.ramoAtividade !== undefined ? String(row[colunasDetectadas.ramoAtividade] || '') : '',
      praca: colunasDetectadas.praca !== undefined ? String(row[colunasDetectadas.praca] || '') : '',
      endereco: colunasDetectadas.endereco !== undefined ? String(row[colunasDetectadas.endereco] || '') : '',
      telefone: colunasDetectadas.telefone !== undefined ? String(row[colunasDetectadas.telefone] || '') : '',
      email: colunasDetectadas.email !== undefined ? String(row[colunasDetectadas.email] || '') : '',
      estado: colunasDetectadas.estado !== undefined ? String(row[colunasDetectadas.estado] || '') : '',
      bloqueado: colunasDetectadas.bloqueado !== undefined ? String(row[colunasDetectadas.bloqueado] || '').toLowerCase().includes('sim') : false,
    };
    
    if (cliente.nome) {
      clientes.push(cliente);
    }
  }
  
  return {
    tipo: 'CLIENTES_NOVOS',
    dados: clientes,
    metadados: {
      arquivo: nomeArquivo,
      totalRegistros: clientes.length,
      colunas: Object.keys(colunasDetectadas),
    },
  };
}

function parseInadimplenciaPDF(buffer: Buffer, nomeArquivo: string): ParserResult {
  const dados: Inadimplencia[] = [];
  
  const estadoMatch = nomeArquivo.match(/(PB|RN)/);
  const estado = estadoMatch ? estadoMatch[1] : 'PB';
  
  const semanaMatch = nomeArquivo.match(/(\d{2}\.\d{2})\s+a\s+(\d{2}\.\d{2})/);
  const semana = semanaMatch ? `${semanaMatch[1]} a ${semanaMatch[2]}` : '';
  
  return {
    tipo: 'INADIMPLENCIA',
    dados,
    metadados: {
      arquivo: nomeArquivo,
      totalRegistros: dados.length,
      colunas: ['clienteCodigo', 'clienteNome', 'valorTitulo', 'diasAtraso', 'estado'],
      semana,
    },
  };
}

export function parseArquivo(buffer: Buffer, nomeArquivo: string): ParserResult {
  const extensao = nomeArquivo.split('.').pop()?.toLowerCase();
  
  if (extensao === 'xls' || extensao === 'xlsx') {
    if (nomeArquivo.toUpperCase().includes('VENDAS')) {
      return parseVendasXLS(buffer, nomeArquivo);
    }
    
    if (nomeArquivo.toUpperCase().includes('CLIENTES NOVOS')) {
      return parseClientesNovosXLS(buffer, nomeArquivo);
    }
  }
  
  if (extensao === 'pdf') {
    return parseInadimplenciaPDF(buffer, nomeArquivo);
  }
  
  return {
    tipo: 'VENDAS',
    dados: [],
    metadados: {
      arquivo: nomeArquivo,
      totalRegistros: 0,
      colunas: [],
    },
  };
}

export function detectarSemana(nomeArquivo: string): string | null {
  const match = nomeArquivo.match(/(\d{2}\.\d{2})\s+a\s+(\d{2}\.\d{2})/);
  if (match) {
    return `${match[1]} a ${match[2]}`;
  }
  return null;
}

export function detectarVendedor(nomeArquivo: string): string | null {
  const vendedores = ['CARLOS EDUARDO', 'FERNANDO', 'WANDERLEY'];
  
  for (const vendedor of vendedores) {
    if (nomeArquivo.toUpperCase().includes(vendedor)) {
      return vendedor;
    }
  }
  
  return null;
}

export function detectarEstado(nomeArquivo: string): string | null {
  if (nomeArquivo.toUpperCase().includes('PB')) return 'PB';
  if (nomeArquivo.toUpperCase().includes('RN')) return 'RN';
  return null;
}
