import { createServer } from "node:http";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const PORT = Number(process.env.RANKING_PORT || 5174);
const DATA_FILE = resolve(process.env.RANKING_CSV_FILE || resolve(process.cwd(), "data", "ranking.csv"));
const HEADER = ["id", "name", "score", "correct", "errors", "elapsed", "completed", "playedAt", "projectName", "projectParts"];

function parseLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ";" && !quoted) {
      cells.push(cell);
      cell = "";
    } else {
      cell += character;
    }
  }
  cells.push(cell);
  return cells;
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

async function ensureDatabase() {
  await mkdir(dirname(DATA_FILE), { recursive: true });
  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, `${HEADER.join(";")}\n`, "utf8");
  }
}

async function readRanking() {
  await ensureDatabase();
  const content = await readFile(DATA_FILE, "utf8");
  return content
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const values = parseLine(line);
      const row = Object.fromEntries(HEADER.map((key, index) => [key, values[index] ?? ""]));
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

async function writeRanking(entries) {
  const lines = entries.map((entry) => HEADER.map((key) => csvCell(entry[key])).join(";"));
  const nextContent = `\uFEFF${HEADER.join(";")}\n${lines.join("\n")}${lines.length ? "\n" : ""}`;
  const temporaryFile = `${DATA_FILE}.tmp`;
  await writeFile(temporaryFile, nextContent, "utf8");
  await rename(temporaryFile, DATA_FILE);
}

function corsHeaders(contentType = "application/json; charset=utf-8") {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
    "Content-Type": contentType,
  };
}

function send(response, status, body, headers = {}) {
  response.writeHead(status, { ...corsHeaders(), ...headers });
  response.end(body);
}

function validNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) >= 0;
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS") {
      response.writeHead(204, corsHeaders());
      response.end();
      return;
    }

    if (request.method === "GET" && request.url === "/health") {
      send(response, 200, JSON.stringify({ status: "ok" }));
      return;
    }

    if (request.method === "GET" && request.url === "/ranking") {
      send(response, 200, JSON.stringify(await readRanking()));
      return;
    }

    if (request.method === "GET" && request.url === "/ranking.csv") {
      await ensureDatabase();
      const csv = await readFile(DATA_FILE);
      response.writeHead(200, {
        ...corsHeaders("text/csv; charset=utf-8"),
        "Content-Disposition": 'attachment; filename="ranking-desafio-estrutural.csv"',
      });
      response.end(csv);
      return;
    }

    if (request.method === "POST" && request.url === "/ranking") {
      let body = "";
      for await (const chunk of request) {
        body += chunk;
        if (body.length > 1_000_000) throw new Error("Requisição muito grande");
      }
      const entry = JSON.parse(body);
      if (
        typeof entry.id !== "string" ||
        typeof entry.name !== "string" ||
        !entry.name.trim() ||
        typeof entry.projectName !== "string" ||
        !validNumber(entry.score) ||
        !validNumber(entry.correct) ||
        !validNumber(entry.errors) ||
        !validNumber(entry.elapsed) ||
        !validNumber(entry.projectParts)
      ) {
        send(response, 400, JSON.stringify({ error: "Resultado inválido" }));
        return;
      }

      const sanitized = {
        ...entry,
        name: entry.name.trim().replace(/[\r\n]+/g, " ").slice(0, 50),
        projectName: entry.projectName.trim().replace(/[\r\n]+/g, " ").slice(0, 80),
        score: Number(entry.score),
        correct: Number(entry.correct),
        errors: Number(entry.errors),
        elapsed: Number(entry.elapsed),
        projectParts: Number(entry.projectParts),
        completed: Boolean(entry.completed),
      };
      const ranking = [...await readRanking(), sanitized]
        .sort((a, b) => b.score - a.score || a.errors - b.errors || a.elapsed - b.elapsed)
        .slice(0, 1000);
      await writeRanking(ranking);
      send(response, 201, JSON.stringify(ranking));
      return;
    }

    send(response, 404, JSON.stringify({ error: "Rota não encontrada" }));
  } catch (error) {
    send(response, 500, JSON.stringify({ error: error instanceof Error ? error.message : "Erro interno" }));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[ranking] CSV disponível em http://127.0.0.1:${PORT}/ranking.csv`);
});
