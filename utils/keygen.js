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
 * Bloco 3: Gerador de Prefixo Dinâmico + Sufixo de Ano (CORRIGIDO)
 */
const gerarBloco3Dinamico = (dataValidade) => {
    // Prefixo base correto do sistema original
    const prefixo = "FKCDLCFDF";
    
    try {
        if (!dataValidade || !dataValidade.includes('/')) {
            return (prefixo + "J").toUpperCase();
        }
        
        const partes = dataValidade.split("/");
        const ano = parseInt(partes[2]);
        
        // Calcular caractere do ano (a partir de 2026)
        // 2026 = J (74), 2027 = K (75), 2028 = L (76), etc.
        let charCode = 74 + (ano - 2026);
        
        // Garantir que está dentro do range de letras maiúsculas
        if (charCode < 65) charCode = 65; // A
        if (charCode > 90) charCode = 90; // Z
        
        const charAno = String.fromCharCode(charCode);
        return (prefixo + charAno).toUpperCase();
        
    } catch (e) {
        console.error("Erro ao gerar Bloco 3:", e);
        return (prefixo + "J").toUpperCase();
    }
};

const gerarChaveFinal = (hwid, dataValidade) => {
    // --- TRAVA DE SEGURANÇA (VALIDAÇÃO) ---
    // Verifica se existe, se tem hífen e se tem pelo menos 9 caracteres (ex: ABCD-EFGH)
    if (!hwid || !hwid.includes("-") || hwid.trim().length < 9) {
        console.error(`[VALIDAÇÃO] HWID com formato incorreto: ${hwid}`);
        return "ERRO_FORMATO";
    }

    try {
        const partes = hwid.toLowerCase().split("-");
        
        // Verifica se as duas partes principais do HWID foram preenchidas
        if (!partes[0] || !partes[1]) {
            return "ERRO_FORMATO";
        }

        // --- BLOCO 1: DINÂMICO (Recuo de 2 posições) ---
        const b1 = partes[0].replace(/[a-z]/g, c => 
            String.fromCharCode(((c.charCodeAt(0) - 97 - 2 + 26) % 26) + 97)
        );

        // --- BLOCO 2: DINÂMICO (Tradução via Tabela ou Shift +10) ---
        const b2 = partes[1].replace(/[a-z]/g, c => traduzirBloco2(c));

        // --- BLOCO 3: DINÂMICO (Base do Sistema + Variável de Ano) - CORRIGIDO ---
        const b3 = gerarBloco3Dinamico(dataValidade);

        // --- BLOCO 4: ASSINATURA DO SISTEMA ---
        const b4 = "EFFEGHIHEFGGFE";

        const resultado = `${b1}-${b2}-${b3}-${b4}`;
        
        console.log(`[KEYGEN] Sucesso! In: ${hwid} -> Out: ${resultado}`);
        
        return resultado;

    } catch (error) {
        console.error("Erro no processamento:", error);
        return null;
    }
};

module.exports = { gerarChaveFinal };