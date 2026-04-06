// Localizado em wms-expert-api/api/gerar.js
const { gerarChaveFinal } = require('../utils/keygen');

module.exports = async (req, res) => {
    // Habilita o CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { hwid, validade } = req.query;

    // Validações mais amigáveis
    if (!hwid || !validade) {
        return res.status(400).json({ 
            sucesso: false,
            error: 'Parâmetros insuficientes. É necessário informar HWID e data de validade.',
            exemplo: '/api/gerar?hwid=ABC-123&validade=25/12/2025' 
        });
    }

    // Validar formato da data
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(validade)) {
        return res.status(400).json({
            sucesso: false,
            error: 'Formato de data inválido. Use DD/MM/AAAA (ex: 25/12/2025)'
        });
    }

    try {
        const chave = gerarChaveFinal(hwid, validade);
        
        if (chave === "ERRO_FORMATO") {
            return res.status(400).json({ 
                sucesso: false,
                error: 'HWID inválido. Certifique-se de usar o formato correto (ex: ABC-123DEF)'
            });
        }
        
        return res.status(200).json({ 
            sucesso: true,
            chave_gerada: chave,
            hwid_origem: hwid,
            expira_em: validade,
            mensagem: 'Chave gerada com sucesso!'
        });
    } catch (error) {
        return res.status(500).json({ 
            sucesso: false,
            error: 'Erro interno no motor de geração de chaves. Contate o suporte.' 
        });
    }
};