module.exports = (req, res) => {
    res.status(200).json({
        status: 'online',
        message: 'WMS Expert Activator API',
        endpoints: {
            gerar_chave: '/api/gerar?hwid=SEU_HWID&validade=25/12/2025',
            documentacao: '/'
        }
    });
};