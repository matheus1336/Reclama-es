const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./reclamacoes.db");

db.run(`CREATE TABLE IF NOT EXISTS reclamacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    modelo TEXT,
    data TEXT,
    descricao TEXT,
    solucao TEXT
)`);

// Rota para cadastrar uma reclamação
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

// Rota para obter todas as reclamações
app.get("/reclamacoes", (req, res) => {
    db.all(`SELECT * FROM reclamacoes`, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Erro ao buscar reclamações.");
        }
        res.send(rows);
    });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
