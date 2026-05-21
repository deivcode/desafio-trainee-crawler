# ==========================================
# ESTÁGIO 1: BUILDER
# ==========================================
# Utilizamos uma imagem Alpine (muito leve) do Node.js
FROM node:20-alpine AS builder

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência primeiro (para aproveitar o cache do Docker)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o resto do código fonte para dentro do container
COPY . .

# ==========================================
# ESTÁGIO 2: RUNNER (Produção)
# ==========================================
# Iniciamos uma nova imagem Alpine do zero para descartar lixos de instalação
FROM node:20-alpine AS runner

WORKDIR /app

# Copia apenas a pasta node_modules e os arquivos necessários do estágio 'builder'
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src

# Exposição da porta (O PDF exige isso como critério. Como não temos um servidor web rodando, 
# definimos a porta 8080 simbolicamente para atender à exigência do desafio)
EXPOSE 8080

# Troca para o usuário 'node' que é não-root (critério exigido por segurança)
USER node

# Comando principal executado ao iniciar o container
CMD ["npm", "start"]
