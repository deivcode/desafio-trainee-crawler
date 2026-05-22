import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { limparPreco, verificarEstoque, converterAvaliacaoParaNumero } from './utils.js';

// Definimos o contrato do nosso objeto Livro usando o TypeScript
interface Book {
    titulo: string;
    preco: number;
    emEstoque: boolean;
    avaliacao: number;
    dataColeta: string; // Adicionado para manter o histórico temporal da coleta (útil para versionamento e Data Lakes)
}

async function extrairDados() {
    try {
        console.log('\x1b[36m%s\x1b[0m', "🚀 Iniciando o robô Ronaldo o extrator de dados ...");

        // Array para armazenar os objetos dos livros extraídos
        const livros: Book[] = [];

        //  Paginação simples usando .map

        for (let pagina = 1; pagina <= 2; pagina++) {
            console.log('\x1b[33m%s\x1b[0m', `⏳ Baixando a página ${pagina}...`);
            
            // Ética de Scraping: Delay de 1.5s entre as requisições para não sobrecarregar o servidor
            if (pagina > 1) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            // Ética de Scraping: Enviando um User-Agent identificável, conforme exigido nas regras
            const resposta = await axios.get(`https://books.toscrape.com/catalogue/page-${pagina}.html`, {
                headers: {
                    'User-Agent': 'Robo-Trainee-Devnology/1.0 (+https://github.com/deivcode)'
                }
            });
            const $ = cheerio.load(resposta.data);

            //  Transforma o HTML direto em um array de objetos Book utilizando as funções puras de utilitários
            const livrosDessaPagina: Book[] = $('article.product_pod').map((_, el) => ({
                titulo: $(el).find('h3 a').attr('title') || '',
                preco: limparPreco($(el).find('.price_color').text()),
                emEstoque: verificarEstoque($(el).find('.instock.availability').text()),
                avaliacao: converterAvaliacaoParaNumero($(el).find('p.star-rating').attr('class') || ''),
                dataColeta: new Date().toLocaleString('pt-BR')
            })).get();

            // Despeja os livros dessa página dentro do array principal
            livros.push(...livrosDessaPagina);
        }

        console.log('\x1b[32m%s\x1b[0m', `✅ Extração finalizada! ${livros.length} livros encontrados.`);

        // 3. Salvando a lista de dados no arquivo JSON
        fs.writeFileSync('data.json', JSON.stringify(livros, null, 2));
        console.log('📦 Arquivo data.json gerado com sucesso!');

        // 4. Montando a estrutura e salvando no arquivo CSV
        // Usamos ponto e vírgula (;) porque o Excel no Brasil se confunde com vírgulas normais
        const cabecalhoCsv = 'Título;Preço;EmEstoque;Avaliação;DataColeta\n';
        const linhasCsv = livros.map(l => `"${l.titulo}";${l.preco};${l.emEstoque};${l.avaliacao};"${l.dataColeta}"`).join('\n');
        // O '\ufeff' é o BOM (Byte Order Mark). Ele diz para o Excel que o arquivo é UTF-8, corrigindo os acentos (Ç, ~)
        fs.writeFileSync('data.csv', '\ufeff' + cabecalhoCsv + linhasCsv);
        console.log('\x1b[32m%s\x1b[0m', '📊 Arquivo data.csv gerado com sucesso!');

    } catch (erro) {
        // Se o site cair ou houver qualquer erro de rede, o bloco catch segura aqui
        console.error("❌ Erro crítico ao processar o scraping:", erro);
    }
}

// Inicia a execução do robô
extrairDados();