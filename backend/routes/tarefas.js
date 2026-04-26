const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/tarefas", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tarefas LEFT JOIN funcionarios ON tarefas.funcionario_id = funcionarios.id",
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/tarefas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM tarefas LEFT JOIN funcionarios ON tarefas.funcionario_id = $1",
      [id],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/tarefas/criar", async (req, res) => {
  const { titulo, descricao, funcionario_id, prazo } = req.body;

  try {
    await pool.query(
      `INSERT INTO tarefas (titulo, descricao, funcionario_id, prazo) 
            VALUES ($1, $2, $3, $4)`,
      [titulo, descricao, funcionario_id || null, prazo],
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
            WHERE id = $5`,
      [titulo, descricao, funcionario_id, prazo, id],
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
    const result = await pool.query("DELETE FROM tarefas WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
