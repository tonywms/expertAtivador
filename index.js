const express = require('express');
const cors = require('cors');
const path = require('path');
const { gerarChaveFinal } = require('./utils/keygen');

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static('public'));

// Rota da API
app.get('/api/gerar', (req, res) => {
    const { hwid, validade } = req.query;
    
    if (!hwid || !validade) {
        return res.status(400).json({ 
            sucesso: false,
            error: 'Parâmetros insuficientes. Use: hwid e validade'
        });
    }
    
    const chave = gerarChaveFinal(hwid, validade);
    
    if (chave === "ERRO_FORMATO") {
        return res.status(400).json({ 
            sucesso: false,
            error: 'HWID inválido. Formato correto: ABC-123DEF'
        });
    }
    
    res.json({ 
        sucesso: true,
        chave_gerada: chave,
        hwid_origem: hwid,
        expira_em: validade
    });
});

// Rota principal - serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📝 Página: http://localhost:${PORT}`);
    console.log(`🔑 API: http://localhost:${PORT}/api/gerar?hwid=ABC-123&validade=25/12/2025`);
});