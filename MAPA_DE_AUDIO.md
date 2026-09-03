# Mapa de áudio do jogo

O sistema sonoro é produzido pelo próprio navegador e funciona sem internet. Música, ambiência e efeitos possuem canais separados para que os eventos importantes continuem claros sobre a trilha.

## Estados do jogo

| Estado | Trilha e ambiência | Objetivo |
| --- | --- | --- |
| Lobby | **Canteiro em preparação**: acordes leves, melodia acolhedora, ruído distante de máquinas, marteladas e metal | Receber o participante sem criar pressão |
| Pergunta — tempo normal | **Ritmo da construção**: melodia animada, batida marcada, motor grave e ferramentas espaçadas | Sustentar energia e sensação de avanço |
| Últimos 10 segundos | **Contagem de emergência**: ritmo acelerado, pulsos curtos, alerta crescente e ferramentas agitadas | Tornar a urgência imediatamente perceptível |
| Vitória | **Projeto entregue**: fanfarra crescente, acorde final e brilho sonoro | Recompensar a conclusão da construção |
| Game over | **Obra interrompida**: notas descendentes, impacto grave e poeira | Comunicar a derrota sem usar um som agressivo demais |

## Eventos de ação

| Evento | Som aplicado | Relação com a ação |
| --- | --- | --- |
| Pressionar botão | Clique digital curto | Confirma a interação |
| Ativar ou desativar som | Tom ascendente ou descendente | Indica claramente o novo estado do áudio |
| Escolher projeto | Dois tons positivos e encaixe metálico | Representa a seleção de uma nova planta |
| Iniciar ou tentar novamente | Pequena subida musical com ruído de partida | Marca o começo de uma nova obra |
| Nova pergunta | Dois sinais leves | Indica que o próximo desafio está disponível |
| Escolher alternativa | Clique com altura diferente para cada opção | Confirma a resposta escolhida |
| Resposta correta | Acorde positivo, marteladas, encaixe metálico e poeira leve | Acompanha a chegada e a montagem da nova etapa |
| Resposta incorreta | Alerta grave, deslocamento da bola, impacto, metal e entulho | Reforça a demolição provocada pelo erro |
| Tempo esgotado | Três avisos, estalo estrutural, queda grave e desmoronamento | Diferencia o colapso por tempo da demolição por erro |
| Entrada nos 10 segundos | Alerta alternado crescente | Marca a mudança para o estado de urgência |
| Baixar ranking | Confirmação aguda em dois tons | Indica que o arquivo foi solicitado |
| Voltar ou escolher outra construção | Transição descendente e retorno suave | Sinaliza a troca de tela |

O controle **Som ativo/desativado** continua interrompendo todos os canais ao mesmo tempo. Por regra dos navegadores, o áudio começa após a primeira interação do usuário com a página.
