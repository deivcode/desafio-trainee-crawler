import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

// Definimos o contrato do nosso objeto Livro usando o TypeScript
interface Book {
  titulo: string;
  preco: number;
  emEstoque: boolean;
  avaliacao: number;
}

async function rasparSite() {
    try {
        console.log("⏳ Acessando a livraria e baixando o HTML...");
        
        // 1. Aguarda a requisição HTTP baixar o HTML da página alvo
        const resposta = await axios.get('https://books.toscrape.com/');
        const $ = cheerio.load(resposta.data);
        
        // Array para armazenar os objetos dos livros extraídos
        const livros: Book[] = [];

        // 2. Itera sobre todos os elementos HTML que representam um livro na listagem
        $('article.product_pod').each((index, element) => {
            
            // Extrai o título (usando o atributo 'title' para evitar pegar o texto truncado/cortado)
            const titulo = $(element).find('h3 a').attr('title') || '';

            // Extrai o Preço, remove o símbolo da libra (£) e converte para número decimal
            const textoPreco = $(element).find('.price_color').text();
            const preco = parseFloat(textoPreco.replace('£', ''));

            // Verifica a disponibilidade em estoque (limpando espaços em branco com trim)
            const textoDisponibilidade = $(element).find('.instock.availability').text().trim();
            const emEstoque = textoDisponibilidade === 'In stock';

            // Extrai a classe da estrela (ex: "star-rating Three") para isolar a nota
            const classeEstrela = $(element).find('p.star-rating').attr('class') || '';
            const notaEmTexto = classeEstrela.split(' ')[1]; // Isola a segunda palavra da classe
            
            // Dicionário para mapear as notas em texto para valores numéricos inteiros
            const mapaNotas: Record<string, number> = {
                'One': 1, 'Two': 2, 'Three': 3, 'Four': 4, 'Five': 5
            };
            const avaliacao = mapaNotas[notaEmTexto] || 0;

            // Insere o livro estruturado no nosso array principal
            livros.push({ titulo, preco, emEstoque, avaliacao });
        });

        console.log(`✅ Extração finalizada! ${livros.length} livros encontrados.`);

        // 3. Salvando a lista de dados no arquivo JSON
        fs.writeFileSync('data.json', JSON.stringify(livros, null, 2));
        console.log('📦 Arquivo data.json gerado com sucesso!');

        // 4. Montando a estrutura e salvando no arquivo CSV
        const cabecalhoCsv = 'Título,Preço,EmEstoque,Avaliação\n';
        const linhasCsv = livros.map(l => `"${l.titulo}",${l.preco},${l.emEstoque},${l.avaliacao}`).join('\n');
        fs.writeFileSync('data.csv', cabecalhoCsv + linhasCsv);
        console.log('📊 Arquivo data.csv gerado com sucesso!');
        
    } catch (erro) {
        // Se o site cair ou houver qualquer erro de rede, o bloco catch segura aqui
        console.error("❌ Erro crítico ao processar o scraping:", erro);
    }
}

// Inicia a execução do robô
rasparSite();