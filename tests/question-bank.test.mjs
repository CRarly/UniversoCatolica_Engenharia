import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true },
});

after(async () => {
  await vite.close();
});

test("keeps the requested question totals and valid alternatives", async () => {
  const { QUESTIONS, QUESTIONS_BY_LEVEL } = await vite.ssrLoadModule("/app/questions.ts");

  assert.equal(QUESTIONS.length, 460);
  assert.equal(QUESTIONS_BY_LEVEL.Fácil.length, 240);
  assert.equal(QUESTIONS_BY_LEVEL.Intermediária.length, 120);
  assert.equal(QUESTIONS_BY_LEVEL.Difícil.length, 100);
  assert.equal(new Set(QUESTIONS.map((question) => question.id)).size, QUESTIONS.length);
  assert.equal(new Set(QUESTIONS.map((question) => question.prompt)).size, QUESTIONS.length);

  for (const question of QUESTIONS) {
    assert.equal(question.options.length, 4, `Alternativas inválidas na questão ${question.id}`);
    assert.equal(new Set(question.options).size, 4, `Alternativas repetidas na questão ${question.id}`);
    assert.ok(question.answer >= 0 && question.answer < 4, `Resposta inválida na questão ${question.id}`);
    assert.ok(question.explanation.length > 15, `Explicação curta na questão ${question.id}`);
  }
});

test("includes electrical questions at all three difficulty levels", async () => {
  const { QUESTIONS_BY_LEVEL } = await vite.ssrLoadModule("/app/questions.ts");

  for (const [level, questions] of Object.entries(QUESTIONS_BY_LEVEL)) {
    const electrical = questions.filter((question) =>
      question.category.toLocaleLowerCase("pt-BR").includes("elétrica"),
    );
    assert.ok(electrical.length >= 18, `${level} precisa conter questões de elétrica`);
  }
});
