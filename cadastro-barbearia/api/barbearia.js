// barbearia.js
const { Barber } = require('./db');

const handler = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { nome, sobrenome, telefone, email, senha } = req.body;
        try {
            const newBarber = new Barber({ nome, sobrenome, telefone, email, senha });
            await newBarber.save();
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
};

module.exports = handler;
