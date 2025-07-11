// Importação dos módulos necessários
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// Inicialização do aplicativo Express
const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÃO DA CONEXÃO COM O BANCO DE DADOS ---
// A string de conexão é lida da variável de ambiente.
// Em ambiente local, virá do arquivo .env.
// Em produção na Netlify, virá das configurações do site.
const connectionString = process.env.NETLIFY_DATABASE_URL;

if (!connectionString) {
    throw new Error("A variável de ambiente NETLIFY_DATABASE_URL não foi definida.");
}

const pool = new Pool({
    connectionString: connectionString,
    // A Netlify e outros provedores de banco de dados em nuvem geralmente exigem SSL
    ssl: {
        rejectUnauthorized: false
    }
});

// --- ROTAS DA API ---

// ROTA GET: Buscar todos os itens da lista
app.get('/api/items', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM items ORDER BY id ASC');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ROTA POST: Adicionar um novo item à lista
app.post('/api/items', async (req, res) => {
    const { description, quantity } = req.body;

    if (!description || !quantity) {
        return res.status(400).json({ error: 'Descrição e quantidade são obrigatórios.' });
    }

    try {
        const query = 'INSERT INTO items (description, quantity) VALUES ($1, $2) RETURNING *';
        const values = [description, quantity];
        const { rows } = await pool.query(query, values);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ROTA DELETE: Deletar um item pelo ID
app.delete('/api/items/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM items WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Item não encontrado.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar item:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
