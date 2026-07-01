import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar Seleções
  const selecoes = await Promise.all([
    prisma.selecao.upsert({
      where: { nome: 'Sertão PB' },
      update: {},
      create: {
        nome: 'Sertão PB',
        cor: 'VERDE',
      },
    }),
    prisma.selecao.upsert({
      where: { nome: 'Metropolitana PB' },
      update: {},
      create: {
        nome: 'Metropolitana PB',
        cor: 'AZUL',
      },
    }),
    prisma.selecao.upsert({
      where: { nome: 'Litoral Norte' },
      update: {},
      create: {
        nome: 'Litoral Norte',
        cor: 'ROXO',
      },
    }),
    prisma.selecao.upsert({
      where: { nome: 'Costa Potiguar' },
      update: {},
      create: {
        nome: 'Costa Potiguar',
        cor: 'AMARELO',
      },
    }),
    prisma.selecao.upsert({
      where: { nome: 'Sertão de Ouro' },
      update: {},
      create: {
        nome: 'Sertão de Ouro',
        cor: 'LARANJA',
      },
    }),
  ]);

  console.log('Seleções criadas:', selecoes.map(s => s.nome));

  // Criar Técnicos
  const tecnicos = await Promise.all([
    prisma.tecnico.upsert({
      where: { id: 'tecnico-carlos' },
      update: {},
      create: {
        id: 'tecnico-carlos',
        nome: 'Carlos Eduardo',
        equipe: 'Sertão PB',
        vitorias: 4,
        empates: 1,
        derrotas: 0,
        golsPro: 12,
        golsContra: 3,
        saldo: 9,
        pontuacao: 13,
      },
    }),
    prisma.tecnico.upsert({
      where: { id: 'tecnico-fernando' },
      update: {},
      create: {
        id: 'tecnico-fernando',
        nome: 'Fernando',
        equipe: 'Metropolitana PB',
        vitorias: 3,
        empates: 1,
        derrotas: 1,
        golsPro: 10,
        golsContra: 5,
        saldo: 5,
        pontuacao: 10,
      },
    }),
    prisma.tecnico.upsert({
      where: { id: 'tecnico-wanderley' },
      update: {},
      create: {
        id: 'tecnico-wanderley',
        nome: 'Wanderley',
        equipe: 'Litoral Norte',
        vitorias: 2,
        empates: 2,
        derrotas: 1,
        golsPro: 8,
        golsContra: 6,
        saldo: 2,
        pontuacao: 8,
      },
    }),
    prisma.tecnico.upsert({
      where: { id: 'tecnico-roberto' },
      update: {},
      create: {
        id: 'tecnico-roberto',
        nome: 'Roberto',
        equipe: 'Costa Potiguar',
        vitorias: 1,
        empates: 1,
        derrotas: 3,
        golsPro: 5,
        golsContra: 9,
        saldo: -4,
        pontuacao: 4,
      },
    }),
    prisma.tecnico.upsert({
      where: { id: 'tecnico-marcos' },
      update: {},
      create: {
        id: 'tecnico-marcos',
        nome: 'Marcos',
        equipe: 'Sertão de Ouro',
        vitorias: 0,
        empates: 1,
        derrotas: 4,
        golsPro: 3,
        golsContra: 15,
        saldo: -12,
        pontuacao: 1,
      },
    }),
  ]);

  console.log('Técnicos criados:', tecnicos.map(t => t.nome));

  // Criar Jogadores de exemplo
  const jogadores = await Promise.all([
    prisma.jogador.create({
      data: {
        nome: 'João Silva',
        equipe: 'Sertão PB',
        funcao: 'Vendedor',
        vendas: 150000,
        clientesPositivados: 12,
        clientesReativados: 3,
        mixEstrategico: 8,
        inadimplencia: 5000,
        gols: 8,
        evolucao: 85,
        pontuacao: 25,
      },
    }),
    prisma.jogador.create({
      data: {
        nome: 'Pedro Santos',
        equipe: 'Metropolitana PB',
        funcao: 'Vendedor',
        vendas: 120000,
        clientesPositivados: 10,
        clientesReativados: 2,
        mixEstrategico: 6,
        inadimplencia: 8000,
        gols: 6,
        evolucao: 72,
        pontuacao: 18,
      },
    }),
    prisma.jogador.create({
      data: {
        nome: 'Lucas Oliveira',
        equipe: 'Litoral Norte',
        funcao: 'Vendedor',
        vendas: 95000,
        clientesPositivados: 8,
        clientesReativados: 2,
        mixEstrategico: 5,
        inadimplencia: 12000,
        gols: 5,
        evolucao: 68,
        pontuacao: 15,
      },
    }),
    prisma.jogador.create({
      data: {
        nome: 'Marcos Souza',
        equipe: 'Costa Potiguar',
        funcao: 'Vendedor',
        vendas: 80000,
        clientesPositivados: 6,
        clientesReativados: 1,
        mixEstrategico: 4,
        inadimplencia: 15000,
        gols: 4,
        evolucao: 55,
        pontuacao: 12,
      },
    }),
    prisma.jogador.create({
      data: {
        nome: 'André Lima',
        equipe: 'Sertão de Ouro',
        funcao: 'Vendedor',
        vendas: 65000,
        clientesPositivados: 5,
        clientesReativados: 1,
        mixEstrategico: 3,
        inadimplencia: 20000,
        gols: 3,
        evolucao: 45,
        pontuacao: 9,
      },
    }),
  ]);

  console.log('Jogadores criados:', jogadores.map(j => j.nome));

  // Criar primeira rodada
  const rodada = await prisma.rodada.create({
    data: {
      numero: 1,
      dataInicio: new Date('2026-06-08'),
      dataFim: new Date('2026-06-14'),
      processada: true,
    },
  });

  console.log('Rodada 1 criada');

  // Criar configurações padrão
  const configuracoes = await Promise.all([
    prisma.configuracao.upsert({
      where: { chave: 'valor_gol_venda' },
      update: {},
      create: {
        chave: 'valor_gol_venda',
        valor: '10000',
        descricao: 'Valor em vendas para marcar 1 gol',
      },
    }),
    prisma.configuracao.upsert({
      where: { chave: 'gols_positivacao' },
      update: {},
      create: {
        chave: 'gols_positivacao',
        valor: '2',
        descricao: 'Gols por novo cliente positivado',
      },
    }),
    prisma.configuracao.upsert({
      where: { chave: 'gols_reativacao' },
      update: {},
      create: {
        chave: 'gols_reativacao',
        valor: '3',
        descricao: 'Gols por cliente reativado',
      },
    }),
    prisma.configuracao.upsert({
      where: { chave: 'gols_mix_estrategico' },
      update: {},
      create: {
        chave: 'gols_mix_estrategico',
        valor: '2',
        descricao: 'Gols por venda mix estratégico',
      },
    }),
    prisma.configuracao.upsert({
      where: { chave: 'gols_craque_partida' },
      update: {},
      create: {
        chave: 'gols_craque_partida',
        valor: '5',
        descricao: 'Gols para craque da partida',
      },
    }),
  ]);

  console.log('Configurações criadas:', configuracoes.length);

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
