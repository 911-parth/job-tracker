// Using node's built-in SQLite (node:sqlite, Node 22.5+) instead of
// better-sqlite3: same API style, zero native dependencies to compile.
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("tracker.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    contract TEXT NOT NULL DEFAULT 'alternance',
    status TEXT NOT NULL DEFAULT 'to_apply',
    applied_on TEXT,
    link TEXT,
    location TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

export default db;
