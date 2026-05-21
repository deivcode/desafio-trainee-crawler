# Desafio Técnico - Trainee Crawler / RPA & IA

Este repositório contém a solução do desafio técnico para a vaga de Trainee na trilha de Crawler/RPA + IA. O objetivo é realizar a extração de dados estruturados do site [books.toscrape.com](http://books.toscrape.com/), contendo um pipeline completo de CI/CD.

## 🚀 Como rodar o scraper localmente

### Pré-requisitos
- Node.js v20+ 
- Docker e docker-compose (opcional, para rodar em container)

### Opção 1: Sem Docker (Usando Node nativo)
1. Clone este repositório:
   ```bash
   git clone https://github.com/deivcode/desafio-trainee-crawler.git
   cd desafio-trainee-crawler
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o script:
   ```bash
   npm start
   ```
Os arquivos `data.json` e `data.csv` aparecerão na raiz do projeto contendo os dados extraídos.

### Opção 2: Com Docker (Recomendado)
Para rodar sem se preocupar com as dependências do Node instaladas na máquina:
1. Garanta que o Docker Desktop está aberto.
2. Na raiz do projeto, execute:
   ```bash
   docker-compose up --build
   ```
O volume mapeado no `docker-compose.yml` garantirá que os arquivos extraídos (`data.json` e `data.csv`) sejam salvos diretamente na sua pasta local do Windows.

---

## 📊 Estrutura dos dados extraídos

O script realiza o scraping da página inicial e salva duas versões do resultado.

**Schema do JSON (`data.json`)**
```json
[
  {
    "titulo": "A Light in the Attic",
    "preco": 51.77,
    "emEstoque": true,
    "avaliacao": 3,
    "dataColeta": "2026-05-21T15:00:00.000Z"
  }
]
```
- `titulo` (string): Título completo do livro.
- `preco` (number): Valor decimal limpo (sem o símbolo £).
- `emEstoque` (boolean): `true` se estiver "In stock".
- `avaliacao` (number): Número inteiro representando as estrelas da review (1 a 5).
- `dataColeta` (string): Timestamp em formato ISO 8601 do momento da raspagem.

**Schema do CSV (`data.csv`)**
```csv
Título,Preço,EmEstoque,Avaliação,DataColeta
"A Light in the Attic",51.77,true,3,2026-05-21T15:00:00.000Z
```

---

## ⚙️ Como o pipeline funciona (GitLab CI)

O arquivo `.gitlab-ci.yml` foi desenhado com foco em segurança, cache e deploy seletivo, rodando em 4 etapas (stages):

1. **lint**: Executa o `ESLint` para garantir que as regras de formatação do TypeScript e as boas práticas não foram violadas. Se falhar, o pipeline é abortado.
2. **test**: Executa o framework de testes `Vitest`. Garante que não haja quebras no código antes de passar para a esteira de construção.
3. **build**: Utiliza a imagem `docker-in-docker` (dind) para realizar a construção (build) do nosso Dockerfile e faz o `push` para o Container Registry do GitLab, fazendo a autenticação via variáveis mascaradas padrão (`$CI_REGISTRY_USER`, etc).
4. **deploy**: Utiliza uma imagem levíssima do Alpine apenas para simular (via `echo`) os comandos de update-service na AWS ECS. **Regra crítica:** este stage foi configurado (`rules`) para rodar apenas se o commit ocorrer na branch `main`.

*Nota: Um sistema de cache foi configurado para a pasta `.npm` no pipeline, economizando tempo considerável na instalação de dependências entre os jobs.*

---

## 🧠 Decisões Técnicas

- **Linguagem / Tipagem:** Escolhi **TypeScript** com o ecossistema Node, usando o `tsx` para executar nativamente sem precisar de complexos passos de transpilação (tsc) no desenvolvimento. Isso garante checagem estática de tipos, evitando bugs bobos durante o scraping.
- **Ferramentas de extração:** Utilizei `axios` para o client HTTP e `cheerio` para fazer o parseamento do HTML. Sendo um site estático (sem renderização via JS), bibliotecas pesadas como Puppeteer ou Playwright seriam um "overengineering" que apenas atrasaria o pipeline e consumiria mais RAM no CI/CD.
- **Framework de Testes:** Escolhi o **Vitest** ao invés do Jest. A justificativa é que o Vitest tem suporte nativo para ESM (`type: "module"`) e TypeScript sem necessidade de nenhuma configuração (Zero Config). 
- **Docker Multi-stage:** Optei por dividir a imagem Docker em um estágio `builder` e outro `runner`, baseados no `node:20-alpine`. Isso descarta sujeiras de instalação, produz uma imagem final muito mais leve e garante a execução como um usuário `node` sem privilégios root.

---

## ⏱️ O que eu faria diferente com mais tempo

1. **Scraping Recursivo / Paginação:** Faria o crawler descobrir a URL da próxima página iterando sobre todas as páginas do catálogo até esgotá-las.
2. **Sistema anti-bot:** Adicionaria cabeçalhos (headers) dinâmicos simulando navegadores diferentes, rotação de proxies e tempos de espera (delays) randômicos.
3. **Observabilidade (Logs):** Trocaria o simples `console.log` por uma biblioteca de log robusta (como o `Winston` ou `Pino`) para guardar e formatar os logs de execução de forma profissional caso isso rodasse na nuvem.

---

## 🤖 Como utilizei Inteligência Artificial durante o desafio

Encarei o uso de IAs generativas como um parceiro de **Pair Programming**. 
Eu me responsabilizei inteiramente pela construção das ideias e pela lógica principal de extração de dados do scraper (mapear os seletores e estruturar as interfaces). 

Enquanto isso, utilizei a IA de forma iterativa para atuar como meu "copiloto" nas tarefas infraestruturais repetitivas:
- Na organização do documento de projeto e no preenchimento de padrões básicos do `.gitignore`.
- Na migração de testes, utilizando a IA para debugar e sugerir rapidamente a troca do Jest pelo Vitest por causa da resolução de módulos ESM do Node.
- Na discussão e validação da minha estrutura de Dockerfile (Multi-stage). A IA me ajudou a identificar e contornar uma falha comum do `docker-compose.yml`, sugerindo um volume anônimo para proteger a pasta `node_modules` do container Linux de sofrer sobrescrita com os binários do Windows local.

Essa abordagem me permitiu focar no negócio (business logic) de web scraping sem esbarrar por horas em problemas pontuais de configuração e ambiente, demonstrando como ferramentas de IA auxiliam na produtividade.
