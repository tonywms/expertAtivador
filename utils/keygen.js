// utils/keygen.js - VERSÃO CORRIGIDA (TUDO MINÚSCULO)

/**
 * Bloco 2: Tradução Dinâmica
 * Mapeia caracteres específicos ou aplica deslocamento +10
 */
const traduzirBloco2 = (char) => {
    const tabela = { 
        'c': 'm', 'f': 'p', 'g': 'q', 'k': 'u', 'i': 's', 
        'j': 't', 'd': 'n', 'b': 'l'
    };
    const c = char.toLowerCase();
    if (tabela[c]) return tabela[c];
    
    if (c >= 'a' && c <= 'z') {
        return String.fromCharCode(((c.charCodeAt(0) - 97 + 10) % 26) + 97);
    }
    return char;
};

/**
 * Bloco 2: Tradução Inversa
 */
const traduzirBloco2Inverso = (char) => {
    const tabelaInversa = { 
        'm': 'c', 'p': 'f', 'q': 'g', 'u': 'k', 's': 'i', 
        't': 'j', 'n': 'd', 'l': 'b'
    };
    const c = char.toLowerCase();
    if (tabelaInversa[c]) return tabelaInversa[c];
    
    if (c >= 'a' && c <= 'z') {
        return String.fromCharCode(((c.charCodeAt(0) - 97 - 10 + 26) % 26) + 97);
    }
    return char;
};

/**
 * Bloco 3: Gerador de Prefixo Dinâmico
 */
const gerarBloco3Dinamico = (dataValidade) => {
    const prefixo = "FLCDMCFDF";
    
    try {
        const ano = parseInt(dataValidade.split("/")[2]);
        const charAno = String.fromCharCode(74 + (ano - 2026));
        return (prefixo + charAno).toUpperCase();
    } catch (e) {
        return (prefixo + "J").toUpperCase(); 
    }
};

const gerarChaveFinal = (hwid, dataValidade) => {
    if (!hwid || !hwid.includes("-") || hwid.trim().length < 9) {
        console.error(`[VALIDAÇÃO] HWID com formato incorreto: ${hwid}`);
        return "ERRO_FORMATO";
    }

    try {
        const partes = hwid.toLowerCase().split("-");
        
        if (!partes[0] || !partes[1]) {
            return "ERRO_FORMATO";
        }

        // BLOCO 1: Recuo de 2 posições (MINÚSCULO)
        const b1 = partes[0].replace(/[a-z]/g, c => 
            String.fromCharCode(((c.charCodeAt(0) - 97 - 2 + 26) % 26) + 97)
        );
        // NÃO CONVERTE b1 PARA MAIÚSCULO - mantém minúsculo!

        // BLOCO 2: Tradução (MINÚSCULO)
        const primeiroChar = partes[1][0] || '';
        const isTraduzido = ['m','p','q','u','s','t','n','l'].includes(primeiroChar);
        
        let b2;
        if (isTraduzido) {
            b2 = partes[1].replace(/[a-z]/g, c => traduzirBloco2Inverso(c));
        } else {
            b2 = partes[1].replace(/[a-z]/g, c => traduzirBloco2(c));
        }
        // NÃO CONVERTE b2 PARA MAIÚSCULO - mantém minúsculo!

        // BLOCO 3: Prefixo Dinâmico (MAIÚSCULO)
        const b3 = gerarBloco3Dinamico(dataValidade);

        // BLOCO 4: Assinatura (MAIÚSCULO)
        const b4 = "EFFEGHIHEFGGFE";

        // RESULTADO: Bloco1 MINÚSCULO - Bloco2 MINÚSCULO - Bloco3 MAIÚSCULO - Bloco4 MAIÚSCULO
        const resultado = `${b1}-${b2}-${b3}-${b4}`;
        
        console.log(`[KEYGEN] Sucesso! In: ${hwid} -> Out: ${resultado}`);
        
        return resultado;

    } catch (error) {
        console.error("Erro no processamento:", error);
        return null;
    }
};

module.exports = { gerarChaveFinal };