
const { Barber } = require('./db');

const handler = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { email, senha } = req.body;
        try {
            const user = await Barber.findOne({ email, senha });
            if (user) {
                res.status(200).json({ message: 'Login bem-sucedido' });
            } else {
                res.status(401).json({ message: 'Email ou senha incorretos' });
            }
        } catch (error) {
            console.error('Erro no servidor:', error);
            res.status(500).json({ message: 'Erro no servidor' });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
};

module.exports = handler;
