const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  const { nome } = req.query;

  try {
    let result;

    if (nome) {
      result = await pool.query(
        "SELECT * FROM funcionarios WHERE nome ILIKE $1",
        [`%${nome}%`],
      );
    } else {
      result = await pool.query("SELECT * FROM funcionarios");
    }

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/criar", async (req, res) => {
  const { nome, cargo, username, senha, is_admin } = req.body;

  try {
    await pool.query(
      `INSERT INTO funcionarios (nome, cargo, username, senha, is_admin) 
            VALUES ($1, $2, $3, $4, $5)`,
      [nome, cargo, username || null, senha || null, is_admin || false],
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/criar/interno", async (req, res) => {
  const { nome, cargo, username } = req.body;

  try {
    await pool.query(
      `INSERT INTO funcionarios (nome, cargo, username) 
            VALUES ($1, $2, $3)`,
      [nome, cargo, username || null],
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, cargo, username } = req.body;

  try {
    const result = await pool.query(
      `UPDATE funcionarios 
                SET nome = COALESCE($1, nome),
                    cargo = COALESCE($2, cargo),
                    username = COALESCE($3, username),
                    is_admin = COALESCE($4, is_admin)
            WHERE id = $5
          RETURNING *`,
      [nome, cargo, username, is_admin, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id/admin", async (req, res) => {
  const { id } = req.params;
  const { is_admin } = req.body;

  try {
    const result = await pool.query(
      `UPDATE funcionarios 
                SET 
                    is_admin = COALESCE($1, is_admin)
            WHERE id = $2
          RETURNING *`,
      [is_admin, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM funcionarios WHERE id = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }
    res.status(200).json({ message: "Funcionário excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
