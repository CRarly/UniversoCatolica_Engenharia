import assert from "node:assert/strict";
import test from "node:test";

test("renders the game shell and the individual chibi crew", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>Desafio Estrutural \| Engenharia Civil<\/title>/);
  assert.match(html, /class="game-layout status-start"/);
  assert.match(html, /\/characters\/colaboradora-capacete\.png/);
  assert.match(html, /\/characters\/colaborador-projetos\.png/);
  assert.match(html, /\/characters\/colaboradora-planta\.png/);
  assert.match(html, /class="crew-member crew-four"/);
});
