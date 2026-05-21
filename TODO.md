# 📋 Desafio Técnico Trainee: Web Scraper & CI/CD - Planejamento de Tarefas

roadmap organizado para guiar o desenvolvimento do projeto passo a passo.

---

## 🛠️ Fase 1: Configuração Inicial e Infraestrutura
- [x] Inicializar projeto Node.js (`npm init -y`)
- [x] Instalar TypeScript, `@types/node` e `tsx` como dependências de desenvolvimento
- [x] Inicializar e configurar o `tsconfig.json`
- [ ] Criar o arquivo `src/index.ts` e validar execução local com `npx tsx watch src/index.ts`

---

## 🕷️ Fase 2: Desenvolvimento do Web Scraper (`books.toscrape.com`)
- [ ] Definir e instalar a biblioteca de scraping (Recomendado: `cheerio` + `axios` ou `fetch` nativo)
- [ ] Criar cliente HTTP com `User-Agent` personalizado e política de delay (polidez/ética de scraping)
- [ ] Fazer requisição para a página inicial e carregar HTML
- [ ] Criar funções de parsing para extrair dados dos livros:
  - [ ] **Título do livro**
  - [ ] **Preço** (limpar símbolo monetário e tratar como número)
  - [ ] **Avaliação / Rating** (converter classes como `star-rating Three` para o número correspondente `3`)
  - [ ] **Disponibilidade** (em estoque ou esgotado)
  - [ ] **Link de detalhes**
- [ ] Implementar a lógica de **Paginação** para navegar pelas páginas do site de forma ordenada e segura

---

## 💾 Fase 3: Persistência de Dados
- [ ] Implementar a exportação dos dados coletados para formato **JSON**
- [ ] Implementar a exportação dos dados coletados para formato **CSV**
- [ ] Validar a consistência e a codificação dos arquivos gerados locally

---

## 🧪 Fase 4: Qualidade de Código e Testes Unitários
- [ ] Configurar ferramenta de Linting (ex: ESLint) e validar regras de boas práticas
- [ ] Instalar framework de testes (Recomendado: `vitest` ou `jest`)
- [ ] Criar testes unitários para as funções críticas (ex: conversor de string rating para número, parser de preço, limpadores de string)
- [ ] Rodar os testes localmente e garantir que todos passam

---

## 🐳 Fase 5: Containerização (Dockerfile)
- [ ] Criar o arquivo `Dockerfile` na raiz do projeto
- [ ] Utilizar uma imagem base leve e otimizada (como `node:alpine` ou `node:slim`)
- [ ] Configurar segurança com usuário **não-root** (`node`)
- [ ] Adicionar comentários detalhados explicando cada instrução no Dockerfile
- [ ] *Diferencial:* Implementar build em múltiplos estágios (Multi-stage build)

---

## 🚀 Fase 6: Pipeline GitLab CI/CD (`.gitlab-ci.yml`)
- [ ] Criar arquivo `.gitlab-ci.yml` na raiz do projeto
- [ ] Configurar a stage `lint`: rodar o linter do projeto e falhar caso haja erros
- [ ] Configurar a stage `test`: rodar os testes unitários e falhar caso algum falhe
- [ ] Configurar a stage `build`: construir a imagem Docker do scraper e realizar o `push` para o GitLab Container Registry usando variáveis internas do GitLab CI
- [ ] Configurar a stage `deploy`: simular comandos de deploy para o AWS ECS (usar `echo` com comandos de deploy fictícios rodando apenas na branch `main`)
- [ ] *Bônus:* Configurar cache na pipeline para acelerar os próximos builds

---

## 📝 Fase 7: Documentação (README.md)
- [ ] Escrever guia rápido de instalação e execução (localmente sem Docker e localmente com Docker)
- [ ] Documentar a estrutura/schema dos dados finais (JSON e CSV)
- [ ] Explicar conceitualmente cada stage da pipeline CI/CD
- [ ] Registrar as decisões técnicas tomadas e o porquê de cada escolha
- [ ] Criar seção dedicada detalhando a utilização de IAs (ChatGPT, Claude, etc.) durante o processo (prompts utilizados, sucessos e aprendizados)

---

## 🏆 Fase 8: Bônus e Diferenciais (Opcionais)
- [ ] *Bônus 1:* Implementar automação dinâmica de navegador com **Playwright**
- [ ] *Bônus 2:* Integrar com uma API de LLM para extrair dados estruturados adicionais das descrições dos livros
- [ ] *Bônus 3:* Criar um arquivo `docker-compose.yml` para inicializar o scraper junto a uma base de dados local para persistência direta
