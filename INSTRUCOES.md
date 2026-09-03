# Desafio Estrutural — como executar

## Opção mais simples no Windows

1. Instale o [Node.js 22 LTS ou superior](https://nodejs.org/) caso ainda não esteja instalado.
2. Extraia a pasta do jogo.
3. Dê dois cliques no arquivo `iniciar-jogo.bat`.
4. Na primeira execução, aguarde a instalação dos componentes. O navegador abrirá o endereço `http://localhost:5173`.

Mantenha a janela do terminal aberta enquanto estiver jogando. Para encerrar o jogo, feche essa janela ou pressione `Ctrl + C`.

## Execução pelo terminal

Abra o terminal dentro da pasta e execute:

```bash
npm install
npm run dev:local
```

Depois, acesse [http://localhost:5173](http://localhost:5173).

## Controles e regras

- Use o mouse ou as teclas `1`, `2`, `3` e `4` para responder.
- Informe o nome e escolha uma das seis construções: três de 6 partes, duas de 8 e uma de 10.
- Cada resposta correta adiciona uma etapa do projeto escolhido.
- A nova etapa desce pelo cabo, encaixa na construção e recebe efeitos visuais de montagem.
- Cada erro ou estouro do tempo de 30 segundos remove a última etapa presente.
- Nos 10 segundos finais, a trilha acelera e a equipe entra em estado de urgência.
- Os três colaboradores chibi se movimentam de formas diferentes durante a urgência.
- Se a obra ficar sem nenhuma etapa após uma demolição, a partida termina.
- A pontuação combina acertos, rapidez e quantidade de demolições.
- O botão de som fica no canto superior direito.

## Uso da tela

- O jogo ocupa a janela inteira e não usa barra de rolagem na página.
- Em telas menores, o canteiro fica acima dos controles; em telas maiores, os dois aparecem lado a lado.
- Para uma melhor leitura durante eventos presenciais, mantenha o zoom do navegador em 100% e use o modo de tela cheia (`F11`).

## Ranking e arquivo CSV

- Os resultados são salvos automaticamente em `data/ranking.csv`.
- O lobby mostra o ranking geral e a tela final mostra o ranking da construção realizada.
- O botão `BAIXAR CSV` fornece uma cópia que pode ser aberta no Excel.
- Para evitar bloqueio do arquivo no Windows, não deixe `data/ranking.csv` aberto no Excel durante uma partida.
- Faça uma cópia de segurança desse arquivo antes de trocar de computador ou substituir a pasta do jogo.

## Banco de questões

As questões ficam nos arquivos `app/questions.ts`, `app/expanded-questions.ts` e `app/public-school-adjustments.ts`. O banco foi calibrado para estudantes do ensino médio da rede pública e possui 240 questões fáceis, 120 intermediárias e 100 difíceis, incluindo conteúdos de construção civil e instalações elétricas nos três níveis. As fáceis usam reconhecimento e situações do cotidiano; as intermediárias trabalham aplicação direta; e as difíceis exigem mais raciocínio, mas apresentam contexto, pistas e fórmulas quando necessário, sem cobrar formação técnica anterior. Projetos de 6 partes usam perguntas fáceis, projetos de 8 partes usam perguntas intermediárias e o projeto de 10 partes usa perguntas difíceis. Cada questão possui quatro alternativas, resposta correta e explicação. O sorteio evita repetições durante a partida e embaralha as alternativas.

O arquivo `MAPA_DE_AUDIO.md` documenta as trilhas, ambiências e efeitos associados aos estados e às ações do jogo. Todo o áudio é gerado localmente pelo navegador, sem depender de arquivos externos ou conexão com a internet.
