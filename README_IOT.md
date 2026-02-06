# IoT Monitor Dashboard
# Aplicação web completa para coleta, monitoramento e visualização de dados de dispositivos IoT, com dashboard em tempo real, gerenciamento de dispositivos, histórico de leituras e sistema de alertas configuráveis.

# --------------------------------------------------
# Funcionalidades Principais

# 1. Dashboard em Tempo Real
# - Gráficos interativos de temperatura, umidade e pressão (usando Recharts)
# - Atualização automática a cada 5 segundos
# - Seletor de dispositivos com status de conexão ativo/inativo

# 2. Gerenciamento de Dispositivos
# - Cadastro e edição de dispositivos IoT
# - Geração automática de tokens de autenticação
# - Exibição da última conexão do dispositivo
# - Exclusão de dispositivos

# 3. Histórico de Leituras
# - Visualização completa de todas as leituras de sensores
# - Filtros por dispositivo e tipo de sensor

# 4. Sistema de Alertas Configuráveis
# - Criação de alertas com condições personalizadas (acima de, abaixo de, entre)
# - Configuração de limites individuais por sensor
# - Histórico de alertas disparados

# 5. API para IoT
# - Endpoint público para envio de leituras: /api/trpc/iot.submitReading
# - Validação automática de dados recebidos

# --------------------------------------------------
# Arquitetura Técnica

# Stack de Tecnologia
# - Frontend: React 19, Tailwind CSS 4, Recharts
# - Backend: Express, tRPC 11, Node.js
# - Banco de Dados: MySQL com Drizzle ORM

# Estrutura do Banco de Dados

# users
# ├── id (PK)
# ├── openId (OAuth)
# ├── name, email
# └── role (user/admin)

# iot_devices
# ├── id (PK)
# ├── userId (FK)
# ├── name, description, location
# ├── deviceToken
# ├── isActive, lastSeen
# └── createdAt, updatedAt

# sensor_readings
# ├── id (PK)
# ├── deviceId (FK)
# ├── sensorType (temperatura, umidade, pressão, etc.)
# ├── value, unit
# ├── timestamp
# └── createdAt

# Alertas
# GET    /api/trpc/alerts.configs
# POST   /api/trpc/alerts.createConfig
# PATCH  /api/trpc/alerts.updateConfig
# DELETE /api/trpc/alerts.deleteConfig
# GET    /api/trpc/alerts.history?limit=100

# --------------------------------------------------
# Instalação e Configuração

# Pré-requisitos
# - Node.js 22 ou superior
# - MySQL 8 ou superior
# - npm ou pnpm

# Setup Inicial
# # Instalar dependências
# pnpm install

# # Configurar variáveis de ambiente
# # Copiar .env.example para .env e preencher

# # Executar migrações do banco de dados
# pnpm db:push

# # Popular banco com dados de exemplo (opcional)
# npx tsx seed-db.ts

# # Iniciar servidor de desenvolvimento
# pnpm dev

# Variáveis de Ambiente Necessárias
# DATABASE_URL=mysql://user:password@localhost:3306/iot_monitor
# JWT_SECRET=sua-chave-secreta
# NODE_ENV=development
# DEV_AUTH=true
# VITE_APP_ID=dev-local
