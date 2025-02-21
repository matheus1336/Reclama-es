const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database("./reclamacoes.db");

// Criar tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS reclamacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    modelo TEXT,
    data TEXT,
    descricao TEXT,
    solucao TEXT
)`);

// Rota para receber reclamações
app.post("/reclamacoes", (req, res) => {
    const { modelo, data, descricao, solucao } = req.body;
    db.run(`INSERT INTO reclamacoes (modelo, data, descricao, solucao) VALUES (?, ?, ?, ?)`, 
        [modelo, data, descricao, solucao], 
        function (err) {
            if (err) {
                return res.status(500).send("Erro ao salvar reclamação.");
            }
            res.send({ id: this.lastID });
        }
    );
});

// Rota para obter estatísticas
app.get("/estatisticas", (req, res) => {
    const mes = req.query.mes || "2025-02";  // Exemplo: "2025-02" (Fevereiro)
    db.all(`SELECT modelo, COUNT(*) as total FROM reclamacoes WHERE data LIKE ? GROUP BY modelo`, 
        [`${mes}%`], 
        (err, rows) => {
            if (err) {
                return res.status(500).send("Erro ao buscar estatísticas.");
            }
            res.send(rows);
        }
    );
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
