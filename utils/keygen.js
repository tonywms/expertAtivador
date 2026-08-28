// utils/keygen.js

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
    
    // Se não estiver na tabela, desloca 10 posições no alfabeto
    if (c >= 'a' && c <= 'z') {
        return String.fromCharCode(((c.charCodeAt(0) - 97 + 10) % 26) + 97);
    }
    return char;
};

/**
 * Bloco 2: Tradução Inversa
 * Mapeia caracteres específicos ou aplica deslocamento -10
 */
const traduzirBloco2Inverso = (char) => {
    const tabelaInversa = { 
        'm': 'c', 'p': 'f', 'q': 'g', 'u': 'k', 's': 'i', 
        't': 'j', 'n': 'd', 'l': 'b'
    };
    const c = char.toLowerCase();
    if (tabelaInversa[c]) return tabelaInversa[c];
    
    // Se não estiver na tabela, desloca -10 posições no alfabeto
    if (c >= 'a' && c <= 'z') {
        return String.fromCharCode(((c.charCodeAt(0) - 97 - 10 + 26) % 26) + 97);
    }
    return char;
};

/**
 * Bloco 3: Gerador de Prefixo Dinâmico + Sufixo de Ano
 */
const gerarBloco3Dinamico = (dataValidade) => {
    const prefixo = "FLCDMCFDF"; 
    
    try {
        const ano = parseInt(dataValidade.split("/")[2]);
        // Para 2026 = J, 2027 = K, 2028 = L, etc.
        const charAno = String.fromCharCode(74 + (ano - 2026));
        return (prefixo + charAno).toUpperCase();
    } catch (e) {
        return (prefixo + "J").toUpperCase(); 
    }
};

const gerarChaveFinal = (hwid, dataValidade) => {
    // --- TRAVA DE SEGURANÇA (VALIDAÇÃO) ---
    if (!hwid || !hwid.includes("-") || hwid.trim().length < 9) {
        console.error(`[VALIDAÇÃO] HWID com formato incorreto: ${hwid}`);
        return "ERRO_FORMATO";
    }

    try {
        const partes = hwid.toLowerCase().split("-");
        
        if (!partes[0] || !partes[1]) {
            return "ERRO_FORMATO";
        }

        // --- BLOCO 1: DINÂMICO (Recuo de 2 posições) ---
        const b1 = partes[0].replace(/[a-z]/g, c => 
            String.fromCharCode(((c.charCodeAt(0) - 97 - 2 + 26) % 26) + 97)
        );

        // --- BLOCO 2: DINÂMICO (Tradução via Tabela ou Shift +10) ---
        // VERIFICAÇÃO: Se o bloco 2 já está no formato "traduzido" (c,m,p,q,etc)
        // então aplica a tradução inversa, senão aplica a tradução normal
        const primeiroChar = partes[1][0] || '';
        const isTraduzido = ['m','p','q','u','s','t','n','l'].includes(primeiroChar);
        
        let b2;
        if (isTraduzido) {
            // Se já está traduzido, aplica inverso para voltar ao original
            b2 = partes[1].replace(/[a-z]/g, c => traduzirBloco2Inverso(c));
        } else {
            // Se está no formato original, aplica tradução normal
            b2 = partes[1].replace(/[a-z]/g, c => traduzirBloco2(c));
        }

        // --- BLOCO 3: DINÂMICO (Base do Sistema + Variável de Ano) ---
        const b3 = gerarBloco3Dinamico(dataValidade);

        // --- BLOCO 4: ASSINATURA DO SISTEMA ---
        const b4 = "EFFEGHIHEFGGFE";

        const resultado = `${b1.toUpperCase()}-${b2.toUpperCase()}-${b3}-${b4}`;
        
        console.log(`[KEYGEN] Sucesso! In: ${hwid} -> Out: ${resultado}`);
        
        return resultado;

    } catch (error) {
        console.error("Erro no processamento:", error);
        return null;
    }
};

module.exports = { gerarChaveFinal };