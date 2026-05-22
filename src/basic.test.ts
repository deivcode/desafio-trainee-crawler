import { describe, it, expect } from 'vitest';
import { limparPreco, verificarEstoque, converterAvaliacaoParaNumero } from './utils.js';

describe('Testes Utilitários do Scraper', () => {
    it('deve limpar o símbolo da libra e retornar apenas o número decimal', () => {
        expect(limparPreco('£51.77')).toBe(51.77);
        expect(limparPreco('£0.00')).toBe(0);
    });

    it('deve verificar corretamente a disponibilidade em estoque limpando os espaços', () => {
        expect(verificarEstoque('  In stock  ')).toBe(true);
        expect(verificarEstoque('Out of stock')).toBe(false);
    });

    it('deve converter a classe de estrelas (texto) para o número inteiro correto', () => {
        expect(converterAvaliacaoParaNumero('star-rating Three')).toBe(3);
        expect(converterAvaliacaoParaNumero('star-rating One')).toBe(1);
        expect(converterAvaliacaoParaNumero('star-rating Unknown')).toBe(0);
    });
});
