import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("portfolio.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL, -- 'stage' or 'motion'
    title TEXT NOT NULL,
    description TEXT,
    thumbnail TEXT,
    videoUrl TEXT,
    venue TEXT,
    usage TEXT,
    role TEXT,
    period TEXT,
    concept TEXT,
    scope TEXT,
    result TEXT,
    displayOrder INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed initial data if empty
const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
if (projectCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO projects (category, title, description, thumbnail, videoUrl, venue, usage, role, period, concept, scope, result, displayOrder)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run('stage', 'Musical "The Great Gatsby"', 'Stage visuals for the main act.', 'https://picsum.photos/seed/gatsby/800/450', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Seoul Arts Center', 'LED Screen', 'Lead Visual Artist', '2023.05 - 2023.08', 'Gilded Age Opulence', 'Full Stage Design', 'High Praise for Immersion', 1);
  insert.run('motion', 'Brand Launch: TechX', '2.5D Motion graphics for product launch.', 'https://picsum.photos/seed/techx/800/450', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '-', 'Social Media / Event Opening', 'Motion Designer', '2024.01', 'Futuristic Minimalism', 'Title & Transition Graphics', '1M+ Views', 1);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/projects", (req, res) => {
    const category = req.query.category;
    let projects;
    if (category) {
      projects = db.prepare("SELECT * FROM projects WHERE category = ? ORDER BY displayOrder ASC").all(category);
    } else {
      projects = db.prepare("SELECT * FROM projects ORDER BY displayOrder ASC").all();
    }
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const { category, title, description, thumbnail, videoUrl, venue, usage, role, period, concept, scope, result, displayOrder } = req.body;
    const info = db.prepare(`
      INSERT INTO projects (category, title, description, thumbnail, videoUrl, venue, usage, role, period, concept, scope, result, displayOrder)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(category, title, description, thumbnail, videoUrl, venue, usage, role, period, concept, scope, result, displayOrder || 0);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const { category, title, description, thumbnail, videoUrl, venue, usage, role, period, concept, scope, result, displayOrder } = req.body;
    db.prepare(`
      UPDATE projects SET 
        category = ?, title = ?, description = ?, thumbnail = ?, videoUrl = ?, 
        venue = ?, usage = ?, role = ?, period = ?, concept = ?, scope = ?, result = ?, displayOrder = ?
      WHERE id = ?
    `).run(category, title, description, thumbnail, videoUrl, venue, usage, role, period, concept, scope, result, displayOrder, id);
    res.json({ success: true });
  });

  app.delete("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM projects WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/messages", (req, res) => {
    const messages = db.prepare("SELECT * FROM messages ORDER BY createdAt DESC").all();
    res.json(messages);
  });

  app.post("/api/messages", (req, res) => {
    const { name, email, type, message } = req.body;
    db.prepare("INSERT INTO messages (name, email, type, message) VALUES (?, ?, ?, ?)").run(name, email, type, message);
    res.json({ success: true });
  });

  // Simple Auth (Hardcoded for demo/portfolio admin)
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    if (password === "4463") { // In a real app, use better auth
      res.json({ token: "fake-jwt-token" });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
