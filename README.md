# COPA DAS DISTRIBUIDORAS PB & RN FOODS 2026

Sistema de Competição Gamificada para a PB & RN Foods.

## Visão Geral

A Copa das Distribuidoras transforma indicadores comerciais do ERP em uma competição inspirada na Copa do Mundo. Cada supervisor representa uma Seleção e cada vendedor representa um Jogador.

## Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, NestJS
- **Banco de Dados**: PostgreSQL, Prisma ORM
- **Autenticação**: JWT

## Estrutura do Projeto

```
copa-das-distribuidoras/
├── src/
│   ├── app/              # Pages e Routes (Next.js App Router)
│   ├── components/       # Componentes React
│   ├── engine/           # Game Engine (regras de negócio)
│   ├── lib/              # Utilitários e configurações
│   ├── parser/           # Parser de dados do ERP
│   ├── types/            # Definições TypeScript
│   └── utils/            # Funções auxiliares
├── prisma/               # Schema do banco de dados
├── public/               # Arquivos estáticos
└── package.json
```

## Instalação

```bash
# Instalar dependências
npm install

# Configurar banco de dados
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# Gerar migrations
npx prisma generate
npx prisma db push

# Iniciar desenvolvimento
npm run dev
```

## Funcionalidades

### Dashboard Principal
- Tabela da Copa com classificação
- Ranking Geral
- Top 5 Jogadores
- Top 5 Técnicos
- Melhor Seleção
- Artilheiro
- Cronômetro para próxima rodada

### Seleções
- Página dedicada para cada seleção
- Escudo, técnico e jogadores
- Pontuação e estatísticas
- Histórico de rodadas

### Jogadores
- Perfil completo do jogador
- Estatísticas de vendas
- Gols e cartões
- Evolução semanal

### Técnicos
- Ranking dos supervisores
- Campanha da seleção
- Estatísticas de desempenho

### Importação de Dados
- Upload de arquivos XLS/XLSX/PDF
- Parser inteligente por colunas
- Processamento automático

### Estatísticas
- Dashboards com gráficos
- Comparativos entre seleções
- Análise de performance

### Configurações
- Ajuste de regras do jogo
- Exportação/Importação de dados
- Notificações

## Regras da Copa

| Ação | Gols |
|------|------|
| R$ 10.000 vendidos | +1 Gol |
| Novo cliente positivado | +2 Gols |
| Cliente reativado | +3 Gols |
| Venda Mix Estratégico | +2 Gols |
| Craque da Partida | +5 Gols |
| Cartão Amarelo | -3 Gols |
| Cartão Vermelho | -5 Gols |

### Evolução
- 20%: +1 Gol
- 40%: +2 Gols
- 60%: +3 Gols
- 80%: +4 Gols
- 100%: +5 Gols

## Modos de Exibição

- **Normal**: Padrão para desktop
- **TV**: Interface ampliada para televisões
- **Apresentação**: Modo para apresentações

## Arquitetura

O sistema segue os princípios SOLID e arquitetura limpa:

- **Game Engine**: Módulo independente para cálculos de regras
- **Parser ERP**: Camada de importação inteligente
- **Componentes**: UI modular e reutilizável
- **Serviços**: Lógica de negócio separada da apresentação

## Licença

Desenvolvido para uso interno da PB & RN Foods.
