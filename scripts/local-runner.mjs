import { spawn } from "node:child_process";
import { resolve } from "node:path";

const children = [];
const node = process.execPath;
const api = spawn(node, [resolve("scripts/ranking-server.mjs")], { stdio: "inherit" });
const web = spawn(
  node,
  [resolve("node_modules/vite/bin/vite.js"), "--host", "127.0.0.1", "--port", "5173"],
  { stdio: "inherit" },
);
children.push(api, web);

let closing = false;
function shutdown(code = 0) {
  if (closing) return;
  closing = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  setTimeout(() => process.exit(code), 80);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
api.on("exit", (code) => {
  if (!closing && code) shutdown(code);
});
web.on("exit", (code) => {
  if (!closing) shutdown(code ?? 0);
});
