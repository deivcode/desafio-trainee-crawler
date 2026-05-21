import { describe, it, expect } from 'vitest';

// Um teste inicial simples para garantir que a etapa de 'test' do Pipeline vai rodar com sucesso.
describe('Validação Inicial do Ambiente de Testes', () => {
    it('o framework de testes deve estar rodando corretamente', () => {
        expect(1 + 1).toBe(2);
    });
});
