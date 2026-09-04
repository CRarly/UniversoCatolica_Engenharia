import { app, BrowserWindow, shell } from "electron";
import { createServer } from "node:http";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

// -------------------------------------------------------------
// Servidor de Ranking Local Integrado (Porta 5174)
// -------------------------------------------------------------
const RANKING_PORT = 5174;
const HEADER = ["id", "name", "score", "correct", "errors", "elapsed", "completed", "playedAt", "projectName", "projectParts"];

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ";" && !quoted) {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }
  cells.push(cell);
  return cells;
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function startRankingServer(dataFile) {
  async function ensureDatabase() {
    await mkdir(dirname(dataFile), { recursive: true });
    try {
      await readFile(dataFile, "utf8");
    } catch {
      await writeFile(dataFile, `${HEADER.join(";")}\n`, "utf8");
    }
  }

  async function readRanking() {
    await ensureDatabase();
    const content = await readFile(dataFile, "utf8");
    return content
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .slice(1)
      .filter(Boolean)
      .map((line) => {
        const values = parseCsvLine(line);
        const row = Object.fromEntries(HEADER.map((key, idx) => [key, values[idx] ?? ""]));
        return {
          id: row.id,
          name: row.name,
          score: Number(row.score),
          correct: Number(row.correct),
          errors: Number(row.errors),
          elapsed: Number(row.elapsed),
          completed: row.completed === "true",
          playedAt: row.playedAt,
          projectName: row.projectName,
          projectParts: Number(row.projectParts),
        };
      })
      .sort((a, b) => b.score - a.score || a.errors - b.errors || a.elapsed - b.elapsed);
  }

  const server = createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === "/ranking") {
      if (req.method === "GET") {
        try {
          const list = await readRanking();
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify(list));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }

      if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", async () => {
          try {
            const data = JSON.parse(body);
            await ensureDatabase();
            const row = [
              csvCell(data.id),
              csvCell(data.name),
              csvCell(data.score),
              csvCell(data.correct),
              csvCell(data.errors),
              csvCell(data.elapsed),
              csvCell(data.completed),
              csvCell(data.playedAt),
              csvCell(data.projectName),
              csvCell(data.projectParts),
            ].join(";") + "\n";
            const current = await readFile(dataFile, "utf8");
            await writeFile(dataFile, current + row, "utf8");
            const updated = await readRanking();
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify(updated));
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      }
    }

    res.writeHead(404);
    res.end("Not found");
  });

  server.listen(RANKING_PORT, "127.0.0.1", () => {
    console.log(`Servidor de ranking interno ativo em http://127.0.0.1:${RANKING_PORT}`);
  });

  return server;
}

// -------------------------------------------------------------
// Servidor de Arquivos Estáticos do Jogo
// -------------------------------------------------------------
function startStaticServer(staticDir) {
  return new Promise((resolveServer) => {
    const server = createServer(async (req, res) => {
      try {
        const parsed = new URL(req.url, `http://${req.headers.host}`);
        let decodedPath = decodeURIComponent(parsed.pathname);
        if (decodedPath.endsWith("/")) decodedPath += "index.html";

        let filePath = resolve(staticDir, "." + decodedPath);

        try {
          const s = await stat(filePath);
          if (s.isDirectory()) {
            filePath = join(filePath, "index.html");
          }
        } catch {
          if (!extname(filePath)) {
            filePath += ".html";
          }
        }

        const ext = extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        const data = await readFile(filePath);

        res.writeHead(200, {
          "Content-Type": contentType,
          "Cache-Control": "no-cache",
        });
        res.end(data);
      } catch {
        try {
          const fallbackData = await readFile(join(staticDir, "index.html"));
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(fallbackData);
        } catch {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Arquivo não encontrado.");
        }
      }
    });

    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      console.log(`Servidor do jogo ativo em http://127.0.0.1:${port}`);
      resolveServer({ server, port });
    });
  });
}

// -------------------------------------------------------------
// Inicialização da Janela Desktop
// -------------------------------------------------------------
let mainWindow = null;
let rankingServer = null;
let gameServer = null;

async function createWindow() {
  const userDataDir = app.getPath("userData");
  const dataFile = join(userDataDir, "ranking.csv");
  rankingServer = startRankingServer(dataFile);

  const appRoot = app.getAppPath();
  const staticDir = resolve(appRoot, "out");

  const { server, port } = await startStaticServer(staticDir);
  gameServer = server;

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 980,
    minHeight: 640,
    title: "Desafio Estrutural - Engenharia Civil",
    icon: join(appRoot, "public", "branding", "universo-catolica.jpeg"),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(`http://127.0.0.1:${port}`);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (rankingServer) rankingServer.close();
  if (gameServer) gameServer.close();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

