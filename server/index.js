import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const STATUSES = ["to_apply", "applied", "interview", "offer", "rejected", "no_answer"];

app.get("/api/applications", (req, res) => {
  const { status } = req.query;
  let rows;
  if (status && STATUSES.includes(status)) {
    rows = db.prepare("SELECT * FROM applications WHERE status = ? ORDER BY updated_at DESC").all(status);
  } else {
    rows = db.prepare("SELECT * FROM applications ORDER BY updated_at DESC").all();
  }
  res.json(rows);
});

app.post("/api/applications", (req, res) => {
  const { company, role, contract, status, applied_on, link, location, notes } = req.body;
  if (!company || !role) {
    return res.status(400).json({ error: "company and role are required" });
  }
  if (status && !STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${STATUSES.join(", ")}` });
  }
  const result = db.prepare(`
    INSERT INTO applications (company, role, contract, status, applied_on, link, location, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    company.trim(), role.trim(), contract || "alternance", status || "to_apply",
    applied_on || null, link || null, location || null, notes || null,
  );
  const row = db.prepare("SELECT * FROM applications WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(row);
});

app.patch("/api/applications/:id", (req, res) => {
  const existing = db.prepare("SELECT * FROM applications WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "not found" });

  const allowed = ["company", "role", "contract", "status", "applied_on", "link", "location", "notes"];
  const updates = Object.entries(req.body).filter(([k]) => allowed.includes(k));
  if (updates.length === 0) return res.status(400).json({ error: "nothing to update" });
  if (req.body.status && !STATUSES.includes(req.body.status)) {
    return res.status(400).json({ error: "invalid status" });
  }

  const setClause = updates.map(([k]) => `${k} = ?`).join(", ");
  db.prepare(`UPDATE applications SET ${setClause}, updated_at = datetime('now') WHERE id = ?`)
    .run(...updates.map(([, v]) => v), req.params.id);

  res.json(db.prepare("SELECT * FROM applications WHERE id = ?").get(req.params.id));
});

app.delete("/api/applications/:id", (req, res) => {
  const result = db.prepare("DELETE FROM applications WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

app.get("/api/stats", (req, res) => {
  const total = db.prepare("SELECT COUNT(*) AS n FROM applications").get().n;
  const byStatus = {};
  for (const s of STATUSES) {
    byStatus[s] = db.prepare("SELECT COUNT(*) AS n FROM applications WHERE status = ?").get(s).n;
  }
  const sent = total - byStatus.to_apply;
  const answered = byStatus.interview + byStatus.offer + byStatus.rejected;
  res.json({
    total,
    byStatus,
    responseRate: sent ? Math.round((100 * answered) / sent) : 0,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
