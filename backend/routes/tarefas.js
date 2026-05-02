const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/tarefas", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        tarefas.id AS tarefa_id,
        tarefas.titulo,
        tarefas.descricao,
        tarefas.funcionario_id,
        tarefas.prazo,
        funcionarios.nome AS funcionario_nome
      FROM tarefas
      LEFT JOIN funcionarios ON tarefas.funcionario_id = funcionarios.id`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/tarefas/criar", async (req, res) => {
  const { titulo, descricao, funcionario_id, prazo } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tarefas (titulo, descricao, funcionario_id, prazo) 
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [titulo, descricao, funcionario_id || null, prazo]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, funcionario_id, prazo } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tarefas 
       SET titulo = $1,
           descricao = $2,
           funcionario_id = $3, 
           prazo = $4 
       WHERE id = $5
       RETURNING *`,
      [titulo, descricao, funcionario_id, prazo, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/tarefas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM tarefas WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;