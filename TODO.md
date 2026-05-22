# 📋 Desafio Técnico Trainee: Web Scraper & CI/CD - Planejamento de Tarefas

roadmap organizado para guiar o desenvolvimento do projeto passo a passo.

---

## 🛠️ Fase 1: Configuração Inicial e Infraestrutura
- [x] Inicializar projeto Node.js (`npm init -y`)
- [x] Instalar TypeScript, `@types/node` e `tsx` como dependências de desenvolvimento
- [x] Inicializar e configurar o `tsconfig.json`
- [x] Criar o arquivo `src/index.ts` e validar execução local com `npx tsx watch src/index.ts`

---

## 🕷️ Fase 2: Desenvolvimento do Web Scraper (`books.toscrape.com`)
- [x] Definir e instalar a biblioteca de scraping (Recomendado: `cheerio` + `axios` ou `fetch` nativo)
- [x] Criar cliente HTTP com `User-Agent` personalizado e política de delay (polidez/ética de scraping)
- [x] Fazer requisição para a página inicial e carregar HTML
- [x] Criar funções de parsing para extrair dados dos livros:
  - [x] **Título do livro**
  - [x] **Preço** (limpar símbolo monetário e tratar como número)
  - [x] **Avaliação / Rating** (converter classes como `star-rating Three` para o número correspondente `3`)
  - [x] **Disponibilidade** (em estoque ou esgotado)

---

## 💾 Fase 3: Persistência de Dados
- [x] Implementar a exportação dos dados coletados para formato **JSON**
- [x] Implementar a exportação dos dados coletados para formato **CSV**
- [x] Validar a consistência e a codificação dos arquivos gerados locally

---

## 🧪 Fase 4: Qualidade de Código e Testes Unitários
- [x] Configurar ferramenta de Linting (ex: ESLint) e validar regras de boas práticas
- [x] Instalar framework de testes (Recomendado: `vitest` ou `jest`)
- [x] Criar testes unitários para as funções críticas (ex: conversor de string rating para número, parser de preço, limpadores de string)
- [x] Rodar os testes localmente e garantir que todos passam

---

## 🐳 Fase 5: Containerização (Dockerfile)
- [x] Criar o arquivo `Dockerfile` na raiz do projeto
- [x] Utilizar uma imagem base leve e otimizada (como `node:alpine` ou `node:slim`)
- [x] Configurar segurança com usuário **não-root** (`node`)
- [x] Adicionar comentários detalhados explicando cada instrução no Dockerfile
- [x] *Diferencial:* Implementar build em múltiplos estágios (Multi-stage build)

---

## 🚀 Fase 6: Pipeline GitLab CI/CD (`.gitlab-ci.yml`)
- [x] Criar arquivo `.gitlab-ci.yml` na raiz do projeto
- [x] Configurar a stage `lint`: rodar o linter do projeto e falhar caso haja erros
- [x] Configurar a stage `test`: rodar os testes unitários e falhar caso algum falhe
- [x] Configurar a stage `build`: construir a imagem Docker do scraper e realizar o `push` para o GitLab Container Registry usando variáveis internas do GitLab CI
- [x] Configurar a stage `deploy`: simular comandos de deploy para o AWS ECS (usar `echo` com comandos de deploy fictícios rodando apenas na branch `main`)
- [x] *Bônus:* Configurar cache na pipeline para acelerar os próximos builds

---

## 📝 Fase 7: Documentação (README.md)
- [x] Escrever guia rápido de instalação e execução (localmente sem Docker e localmente com Docker)
- [x] Documentar a estrutura/schema dos dados finais (JSON e CSV)
- [x] Explicar conceitualmente cada stage da pipeline CI/CD
- [x] Registrar as decisões técnicas tomadas e o porquê de cada escolha
- [x] Criar seção dedicada detalhando a utilização de IAs

