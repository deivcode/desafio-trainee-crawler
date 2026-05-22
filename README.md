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
    "dataColeta": "21/05/2026, 15:00:00"
  }
]
```
- `titulo` (string): Título completo do livro.
- `preco` (number): Valor decimal limpo (sem o símbolo £).
- `emEstoque` (boolean): `true` se estiver "In stock".
- `avaliacao` (number): Número inteiro representando as estrelas da review (1 a 5).
- `dataColeta` (string): Timestamp em formato local de quando a raspagem ocorreu.

**Schema do CSV (`data.csv`)**
```csv
Título;Preço;EmEstoque;Avaliação;DataColeta
"A Light in the Attic";51.77;true;3;"21/05/2026, 15:00:00"
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

1. Utilizaria a API da OpenAI ou gemini para ler o parágrafo da descrição do livro em textos livres e estruturar atributos difíceis de encontrar através de RegEx.
2. Adoraria ter codado algo que usaria esses dados extraidos, como um dashboard, que pegaria direto os dados ou do csv ou do json ou ate mesmo um site basico em html.

---

## 🤖 Como utilizei Inteligência Artificial durante o desafio

Encarei o uso de IAs generativas como um parceiro de **Pair Programming**. 
Eu me responsabilizei inteiramente pela construção das ideias e pela lógica principal de extração de dados do scraper (mapear os seletores e estruturar as interfaces). 

Enquanto isso, utilizei a IA de forma iterativa para atuar como meu "copiloto" nas tarefas infraestruturais repetitivas:

- Eu primeiramente tive que aprender alguns termos citados para o desafio como CI/CD e Pipeline. O Docker eu já havia utilizado para rodar bancos de dados, mas fiz perguntas pontuais para a IA me relembrar conceitos importantes (como volumes e Multi-stage), além dos vídeos que eu assisti sobre, que também me ajudaram muito.
- Utilizei o **Antigravity** (IDE com IA Agentic integrada) como meu "caderno inteligente" e assistente de Pair Programming. Usei a plataforma para armazenar minhas ideias, planejar a lógica de negócio estruturada e debater arquiteturas em tempo real, mantendo todo o contexto do projeto centralizado.
- Na organização do documento de projeto, na estilização que me levaria horas organizando tracinhos para ficar bonito, como os de stage na pipeline, e o todo list que pedi para a IA montar com base no que eu havia digitado. Eu fiz o todo list, mas colocar quadradinhos, emojis e cores eu pedi para a IA.
- Na discussão e validação da minha estrutura de Dockerfile (Multi-stage). A IA me ajudou a identificar e contornar uma falha comum do `docker-compose.yml`, sugerindo um volume anônimo para proteger a pasta `node_modules` do container Linux de sofrer sobrescrita com os binários do Windows local.
- Na criação dos testes unitários do Node.js. Como minha experiência prévia com testes era mais focada em Frontend (E2E com Cypress), utilizei a IA para entender a sintaxe do framework Vitest e estruturar os testes das funções utilitárias (Backend).

**O que não funcionou de primeira:**
Quando tentei pedir para a IA gerar o código completo da raspagem de uma vez só, o código falhava, pois a IA não tinha o contexto exato do HTML do site. Tive que recuar e mapear os seletores (`article.product_pod`, `.price_color`) manualmente pelo DevTools do navegador.

**Exemplos de Prompts utilizados:**
- *"Me explique como funciona uma Pipeline CI/CD no GitLab de forma simples e com analogias reais."*
- *"Como estruturar um Dockerfile com multi-stage build para uma aplicação Node.js rodando sem permissão de root?"*
- *"Como posso consertar o erro de EBUSY no Node.js ao tentar reescrever um arquivo CSV no Windows?"*
- *"Formate este texto bruto de requisitos em uma lista de tarefas (TODO list) com marcações Markdown e Emojis."*
- *"Como escrevo um teste unitário básico no Vitest para uma função em Node.js? Estou mais acostumado com testes E2E no Cypress."*

Essa abordagem me permitiu focar no negócio de web scraping sem esbarrar por horas em problemas pontuais de configuração e ambiente, demonstrando como ferramentas de IA auxiliam na produtividade.
