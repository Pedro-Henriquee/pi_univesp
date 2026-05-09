const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/escalas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM escalas");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/escalas/:funcionario_id", async (req, res) => {
  const { funcionario_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM escalas WHERE funcionario_id = $1",
      [funcionario_id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Escala não encontrada" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/escalas/criar", async (req, res) => {
  const { funcionario_id, dia_semana, hora_inicio, hora_fim, folga } = req.body;

  try {
    await pool.query(
      `INSERT INTO escalas (funcionario_id, dia_semana, hora_inicio, hora_fim, folga) 
            VALUES ($1, $2, $3, $4, $5)`,
      [
        funcionario_id,
        dia_semana,
        hora_inicio || null,
        hora_fim || null,
        folga || false,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/escalas/:id", async (req, res) => {
  const { id } = req.params;
  const { funcionario_id, dia_semana, hora_inicio, hora_fim, folga } = req.body;

  try {
    const result = await pool.query(
      `UPDATE escalas 
                SET funcionario_id = $1,
                dia_semana = $2,
                hora_inicio = $3,
                hora_fim = $4,
                folga = $5
            WHERE id = $6`,
      [funcionario_id, dia_semana, hora_inicio, hora_fim, folga, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Escala não encontrada" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/escalas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM escalas WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Escala não encontrada" });
    }
    res.status(200).json({ message: "Escala excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
