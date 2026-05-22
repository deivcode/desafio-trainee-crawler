// Funções puras separadas para facilitar os testes unitários

export function converterAvaliacaoParaNumero(classeEstrela: string): number {
    const notaEmTexto = classeEstrela.split(' ')[1] || '';
    const mapaNotas: Record<string, number> = {
        'One': 1, 'Two': 2, 'Three': 3, 'Four': 4, 'Five': 5
    };
    return mapaNotas[notaEmTexto] || 0;
}

export function limparPreco(textoPreco: string): number {
    return parseFloat(textoPreco.replace('£', '')) || 0;
}

export function verificarEstoque(textoDisponibilidade: string): boolean {
    return textoDisponibilidade.trim() === 'In stock';
}
