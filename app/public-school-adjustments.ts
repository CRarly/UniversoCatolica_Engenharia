import type { Question } from "./questions";

type AccessibleRow = readonly [
  id: number,
  prompt: string,
  correct: string,
  wrong1: string,
  wrong2: string,
  wrong3: string,
  explanation: string,
  category?: string,
];

const accessibleRows: readonly AccessibleRow[] = [
  [2, "O teste de consistência verifica se o concreto fresco está fácil de misturar e espalhar. O que ele avalia?", "A facilidade de trabalhar com o concreto", "A cor final da parede", "A resistência do aço", "O peso da brita", "Esse teste avalia a consistência e a facilidade de usar o concreto ainda fresco."],
  [7, "A armadura é o conjunto de barras de aço dentro do concreto. Por que ela precisa ficar coberta por uma camada de concreto?", "Para proteger o aço contra calor, umidade e ferrugem", "Para aumentar apenas o peso", "Para substituir as formas", "Para dispensar a cura", "A camada de concreto protege o aço e ajuda os dois materiais a trabalharem juntos."],
  [11, "Na escala 1:50, cada 1 cm no papel vale 50 cm reais. Quanto 1 cm representa na construção?", "50 cm", "5 cm", "5 m", "50 m", "A indicação 1:50 significa que cada centímetro desenhado representa 50 centímetros reais."],
  [16, "Uma sapata fica próxima à superfície do terreno. Por isso, ela é um exemplo de:", "Fundação superficial", "Telhado", "Fundação sempre profunda", "Revestimento", "A sapata distribui a carga perto da superfície e é classificada como fundação superficial."],
  [17, "Antes de escolher a fundação, a equipe faz uma sondagem no terreno. O que ela procura conhecer?", "As camadas e a resistência do solo", "A cor da fachada", "A quantidade de tomadas", "O modelo das portas", "A sondagem ajuda a entender o solo que receberá o peso da construção."],
  [21, "O peso da própria construção existe durante toda a sua vida útil. Esse peso é uma carga:", "Permanente", "Temporária de poucos minutos", "Inexistente", "Somente hidráulica", "Como o peso próprio permanece, ele é considerado uma carga permanente."],
  [23, "O concreto resiste bem quando é apertado, e o aço ajuda quando a peça é puxada. Em uma viga, o aço combate principalmente:", "As forças de tração", "A cor do concreto", "O barulho da obra", "A passagem de água", "As barras de aço ajudam a viga nas regiões que tendem a ser alongadas."],
  [25, "A verga é uma pequena peça colocada acima de portas e janelas. Para que ela serve?", "Distribuir o peso e reduzir rachaduras", "Levar água ao banheiro", "Medir o terreno", "Sustentar sozinha o telhado", "A verga distribui o peso ao redor da abertura e ajuda a evitar fissuras."],
  [28, "Antes de iniciar uma tarefa com risco no canteiro, a equipe deve:", "Planejar o serviço e usar as proteções necessárias", "Começar sem orientação", "Retirar a sinalização", "Improvisar ferramentas", "Planejamento, orientação e proteção reduzem a chance de acidentes."],
  [29, "Em um serviço realizado em local alto, qual cuidado é essencial?", "Usar proteção contra queda e seguir orientação", "Trabalhar na borda sem proteção", "Subir com as mãos ocupadas", "Retirar o guarda-corpo", "O trabalho em altura exige planejamento e sistemas de proteção contra quedas."],
  [35, "Um tubo de esgoto horizontal precisa ter uma pequena inclinação. Por quê?", "Para a água e os resíduos escoarem pela gravidade", "Para aumentar a tensão elétrica", "Para impedir toda ventilação", "Para deixar o tubo mais pesado", "A inclinação correta permite que o conteúdo siga até a rede de esgoto."],
  [40, "O rufo é uma peça usada no encontro entre telhado e parede. Qual problema ele ajuda a evitar?", "Entrada de água e infiltração", "Falta de energia", "Desgaste do piso interno", "Afundamento do terreno", "O rufo fecha o encontro e direciona a água da chuva."],
  [43, "Sobras de concreto, blocos e tijolos devem ser separadas no canteiro principalmente para:", "Facilitar o reaproveitamento ou a reciclagem", "Misturar todo o lixo", "Aumentar o desperdício", "Impedir a limpeza", "Separar resíduos minerais permite dar a eles um destino mais adequado."],
  [44, "Uma equipe usa um modelo digital 3D que reúne desenhos e informações da obra. Essa forma de trabalho é conhecida como:", "BIM", "Pintura", "Compactação", "Topografia manual", "O BIM reúne modelos e informações para apoiar o projeto e a construção."],
  [49, "Em um mapa do terreno, uma curva de nível liga pontos que estão:", "Na mesma altura", "Com a mesma cor", "Na mesma rua", "Com o mesmo tipo de solo", "As curvas de nível ajudam a enxergar as diferentes alturas do terreno."],
  [50, "Para levantar a posição de pontos de um terreno, a estação total mede principalmente:", "Ângulos e distâncias", "A cor do solo", "A resistência da tinta", "O consumo de água", "Com ângulos e distâncias, o equipamento ajuda a localizar pontos do terreno."],
  [54, "Um corpo de prova de concreto é apertado em uma máquina até romper. Esse teste verifica:", "Quanto o concreto resiste à compressão", "A cor do cimento", "A inclinação do telhado", "A quantidade de janelas", "O ensaio mostra quanto esforço de compressão o concreto suporta."],
  [57, "Algumas tarefas não podem atrasar sem atrasar a obra inteira. No cronograma, elas formam:", "O caminho crítico", "A lista de pinturas", "O estoque de materiais", "A planta de localização", "O caminho crítico reúne as tarefas que controlam a data final da obra."],
  [75, "Uma argamassa está seca e muito difícil de espalhar. Isso significa que ela tem pouca:", "Facilidade de aplicação", "Altura", "Transparência", "Tensão elétrica", "A facilidade de misturar e aplicar um material também é chamada de trabalhabilidade."],
  [77, "O peso de uma laje precisa chegar ao solo. Qual sequência mostra o caminho mais comum?", "Laje, viga, pilar, fundação e solo", "Janela, porta, pintura e telha", "Solo, tomada, tinta e laje", "Telha, torneira, vidro e areia", "Cada elemento passa as cargas ao elemento de apoio até que elas cheguem ao terreno."],
  [81, "Na escala 1:100, cada 1 cm vale 1 m real. Uma linha de 3 cm representa:", "3 m", "30 cm", "30 m", "300 m", "Três centímetros no desenho correspondem a três metros na construção."],
  [87, "Uma parede de 10 m² receberá duas demãos, totalizando 20 m² de pintura. Se 1 litro cobre 10 m², quantos litros são necessários?", "2 litros", "1 litro", "5 litros", "20 litros", "Dividindo 20 m² pelo rendimento de 10 m² por litro, o resultado é 2 litros."],
  [89, "Adicionar água demais ao concreto deixa mais espaços vazios depois da secagem. Qual pode ser a consequência?", "O concreto pode ficar mais fraco", "O concreto vira aço", "A resistência sempre aumenta", "A cura deixa de ser necessária", "Água em excesso pode aumentar os vazios e reduzir a resistência do concreto."],
  [90, "Um pilar ajuda a levar o peso da construção até a fundação. Por que não deve ser removido sem análise?", "A construção pode perder parte de seu apoio", "O piso fica mais claro", "As janelas deixam de abrir", "A pintura seca mais rápido", "Retirar um pilar pode interromper o caminho das cargas e causar riscos."],
  [91, "Uma parte do terreno afundou mais que a outra. O que pode aparecer na construção?", "Rachaduras e inclinação", "Mais iluminação", "Menor consumo de água", "Paredes mais leves", "O afundamento desigual pode deformar a construção e provocar fissuras."],
  [92, "Uma régua apoiada nas pontas se curva quando pressionada no meio. Na parte de baixo, o material tende a ser:", "Esticado", "Apenas pintado", "Molhado", "Comprimido em todos os pontos", "Ao se curvar para baixo, a região inferior tende a se alongar, situação chamada de tração."],
  [93, "A ventilação da rede de esgoto ajuda a equilibrar o ar dentro dos tubos. Isso evita principalmente:", "Mau cheiro causado pela perda de água dos sifões", "Falta de luz nos cômodos", "Ferrugem nas armaduras", "Aquecimento das tomadas", "O equilíbrio de pressão ajuda a manter a água que bloqueia os gases nos sifões."],
  [94, "Em um mapa, curvas de nível muito próximas mostram que a altura muda rapidamente. O terreno é:", "Mais inclinado", "Totalmente plano", "Sem relevo", "Sempre alagado", "Quanto mais próximas as curvas, maior costuma ser a inclinação do terreno."],
  [95, "A pintura interna e o serviço no jardim não dependem um do outro. Quando há equipes disponíveis, eles podem:", "Acontecer ao mesmo tempo", "Ser sempre cancelados", "Começar somente após a entrega", "Usar a mesma ferramenta obrigatoriamente", "Atividades independentes podem ser realizadas em paralelo."],
  [96, "Em uma sala quente, um elemento externo faz sombra sobre a janela sem bloquear o ar. Ele ajuda a:", "Reduzir o calor do sol", "Aumentar a temperatura", "Fechar toda ventilação", "Retirar a cobertura", "O sombreamento reduz a entrada direta de radiação solar."],
  [97, "Quando ruas e calçadas impedem a água de entrar no solo, durante a chuva ocorre mais:", "Água correndo pela superfície e risco de alagamento", "Infiltração natural", "Absorção pelo solo", "Formação de áreas verdes", "Superfícies impermeáveis fazem mais água escoar rapidamente."],
  [98, "Um revestimento secou rápido demais e surgiram pequenas rachaduras. A causa mais provável é:", "Encolhimento durante a secagem", "Excesso de iluminação", "Aumento da corrente elétrica", "Movimento da porta", "A perda rápida de água pode fazer o material encolher e fissurar."],
  [99, "O cinto usado em trabalho em altura deve ficar preso a um sistema capaz de:", "Impedir ou parar uma queda com segurança", "Medir paredes", "Transportar concreto", "Substituir qualquer andaime", "O conjunto deve limitar a queda e reduzir suas consequências."],
  [100, "Uma tubulação e uma viga aparecem ocupando o mesmo espaço nos desenhos. O que a equipe deve fazer?", "Corrigir o conflito antes de construir", "Executar os dois no mesmo lugar", "Ignorar os desenhos", "Apagar todas as medidas", "Comparar e ajustar os projetos antes da obra evita improvisos e retrabalho."],
  [101, "Ao comprar pisos, a equipe inclui uma pequena quantidade extra para cortes e quebras. Por quê?", "Porque existem perdas normais durante o serviço", "Porque todo piso será descartado", "Porque não é necessário medir", "Porque o projeto não importa", "Uma margem realista evita que falte material durante a execução."],
  [102, "Para comparar dois materiais de forma sustentável, é importante observar produção, uso e descarte. Isso significa analisar:", "Todo o ciclo de vida", "Apenas a cor", "Somente o preço", "Somente a embalagem", "O ciclo de vida considera as etapas pelas quais o material passa."],

  [385, "Uma lâmpada de 60 W e outra de 10 W ficam acesas pelo mesmo tempo. Qual tende a consumir mais energia?", "A lâmpada de 60 W", "A lâmpada de 10 W", "As duas sempre consomem zero", "A potência não influencia", "Para o mesmo tempo de uso, o aparelho de maior potência consome mais energia.", "Elétrica"],
  [386, "Em um fio, aumentar muito a corrente aumenta o aquecimento. Isso acontece porque:", "Mais corrente produz mais calor no fio", "A corrente resfria o cobre", "O fio deixa de ter resistência", "A tensão vira água", "A passagem de corrente em um material com resistência produz calor.", "Elétrica"],
  [387, "Uma extensão muito longa pode causar maior queda de tensão porque:", "O caminho da corrente fica mais comprido", "A tomada muda de cor", "O aparelho fica mais leve", "O fio deixa de conduzir", "Quanto maior o comprimento do fio, maior tende a ser sua resistência.", "Elétrica"],
  [388, "Dois cabos têm o mesmo material e comprimento. Qual tende a oferecer menor resistência?", "O cabo mais grosso", "O cabo mais fino", "Os dois sempre têm resistência infinita", "O cabo sem condutor", "Uma seção maior facilita a passagem da corrente.", "Elétrica"],
  [389, "Um aparelho de 1.000 W possui potência igual a:", "1 kW", "10 kW", "100 kW", "0,01 kW", "Mil watts correspondem a um quilowatt.", "Elétrica"],
  [390, "Um equipamento feito para 127 V é ligado por engano em 220 V. Qual é o principal risco?", "Receber tensão excessiva e queimar", "Consumir sempre zero", "Funcionar sem corrente", "Virar um disjuntor", "Uma tensão muito acima da indicada pode danificar o equipamento.", "Segurança elétrica"],
  [391, "Um cabo suporta certa corrente com segurança. O disjuntor deve desligar antes que:", "O cabo aqueça de forma perigosa", "A parede seja pintada", "A lâmpada ilumine", "O interruptor seja usado", "A proteção deve impedir que uma corrente excessiva danifique o cabo.", "Segurança elétrica"],
  [392, "A casa tem circuitos separados. Se houver um problema apenas nas tomadas da cozinha, o ideal é que:", "Somente o circuito afetado seja desligado", "Toda a rua fique sem energia", "Nenhuma proteção funcione", "A tensão aumente", "A divisão em circuitos limita o problema e facilita a manutenção.", "Projeto elétrico"],
  [393, "Uma pequena parte da corrente está escapando por um caminho indevido. Qual dispositivo pode perceber essa fuga?", "O DR", "O interruptor comum", "A lâmpada", "O eletroduto", "O DR compara a corrente que vai e volta e desliga quando encontra diferença.", "Segurança elétrica"],
  [394, "Uma descarga atmosférica próxima provoca um pico rápido de tensão. Qual dispositivo ajuda a limitar esse pico?", "O DPS", "A torneira", "O sifão", "O prumo", "O DPS protege a instalação contra aumentos rápidos de tensão.", "Segurança elétrica"],
  [395, "Em uma casa, lâmpadas ligadas em paralelo recebem:", "A mesma tensão da rede", "Sempre correntes iguais", "Resistência zero", "Metade da frequência", "Os ramos em paralelo estão conectados aos mesmos pontos da fonte.", "Elétrica"],
  [396, "Duas pilhas de 1,5 V são ligadas em série, no mesmo sentido. Qual é a tensão total?", "3 V", "1,5 V", "0,75 V", "15 V", "Em série e no mesmo sentido, as tensões das pilhas se somam.", "Elétrica"],
  [397, "Muitos cabos carregados estão apertados no mesmo eletroduto. Qual cuidado é necessário?", "Verificar o aquecimento e o dimensionamento", "Molhar os cabos", "Retirar os disjuntores", "Cobrir tudo com papel", "Cabos agrupados dissipam calor com mais dificuldade.", "Segurança elétrica"],
  [398, "Alguns motores puxam mais corrente no instante em que são ligados. Por isso, o projeto deve considerar:", "A corrente de partida", "A cor do motor", "O peso da tomada", "A altura do quadro", "O pico de partida pode ser maior que a corrente durante o funcionamento normal.", "Elétrica"],
  [399, "Uma sala vazia permanece com luzes e ar-condicionado ligados. Qual ação reduz o desperdício?", "Desligar os equipamentos sem uso", "Abrir a geladeira", "Aumentar a potência", "Ligar mais lâmpadas", "Equipamentos ligados sem necessidade consomem energia sem benefício.", "Eficiência energética"],
  [400, "A carcaça metálica de um equipamento ficou energizada por uma falha. O aterramento ajuda a:", "Conduzir a corrente de falha por um caminho de proteção", "Aumentar o consumo", "Substituir todos os cabos", "Manter a carcaça energizada", "O aterramento reduz o risco de uma tensão perigosa permanecer na parte metálica.", "Segurança elétrica"],
  [401, "Chuveiro, forno e ferro elétrico são ligados ao mesmo tempo. O que pode acontecer se a instalação não suportar a soma das cargas?", "O disjuntor pode desligar por sobrecarga", "A energia passa a ser gratuita", "A corrente fica sempre zero", "Os cabos ficam mais frios", "A soma de aparelhos potentes pode superar a capacidade do circuito.", "Elétrica"],
  [402, "Para reduzir o aquecimento em um cabo que transporta muita corrente, uma solução de projeto pode ser:", "Usar um cabo corretamente dimensionado, com seção maior", "Diminuir ainda mais a seção", "Aumentar o comprimento", "Retirar a proteção", "Um condutor adequado oferece menor resistência e dissipa o calor com segurança.", "Projeto elétrico"],

  [421, "Uma viga apoiada nas pontas recebe peso no meio. Qual parte tende a se alongar?", "A parte inferior", "Somente a pintura", "A parte que não existe", "Toda a peça igualmente", "Na curvatura mais comum, a parte de baixo fica esticada.", "Estruturas"],
  [422, "Duas vigas iguais recebem a mesma carga, mas uma delas tem um vão maior. A de vão maior tende a:", "Curvar mais", "Curvar menos em qualquer situação", "Perder todo o peso", "Virar uma parede", "Aumentar a distância entre os apoios costuma aumentar a deformação.", "Estruturas"],
  [423, "Uma laje se deformou além do esperado. Qual acabamento pode ser afetado?", "Paredes e revestimentos", "Somente a cor do céu", "A conta de energia", "A água da rua", "A movimentação excessiva pode provocar rachaduras nos elementos apoiados.", "Estruturas"],
  [424, "Por que uma barra de aço de uma viga não deve ser cortada sem análise?", "Ela ajuda a peça a resistir às cargas", "Ela serve apenas de decoração", "Ela conduz esgoto", "Ela substitui a tinta", "A armadura foi calculada para ajudar a estrutura a suportar esforços.", "Estruturas"],
  [425, "Durante o transporte, pedras e pasta do concreto se separaram. Esse problema deixa a mistura:", "Pouco uniforme", "Mais homogênea", "Transformada em aço", "Sem necessidade de cura", "O concreto deve chegar e ser lançado com seus componentes bem distribuídos.", "Concreto"],
  [426, "Depois de retirar a forma, apareceram muitos buracos no concreto. Uma causa possível é:", "Preenchimento ou vibração inadequados", "Excesso de iluminação", "Uso de capacete", "Boa compactação", "A vibração adequada ajuda o concreto a preencher os espaços da forma.", "Concreto"],
  [427, "A camada de concreto sobre o aço ficou muito fina. Com o tempo, isso pode facilitar:", "A ferrugem da armadura", "A ventilação da sala", "A economia de água", "A iluminação natural", "Uma cobertura suficiente protege o aço da umidade e do ambiente.", "Durabilidade"],
  [428, "Uma estrutura próxima ao mar recebe sais e umidade. Qual parte precisa de atenção especial?", "As armaduras de aço", "Somente a pintura do teto", "Os interruptores desligados", "O mobiliário", "Sais e umidade podem favorecer a corrosão do aço dentro do concreto.", "Durabilidade"],
  [429, "Duas partes da fundação afundam quantidades diferentes. Qual problema pode aparecer?", "Rachaduras na construção", "Mais luz natural", "Menor consumo elétrico", "Telhas mais leves", "O afundamento desigual deforma a edificação.", "Solo e fundações"],
  [430, "O solo perto da superfície é fraco, mas há uma camada resistente mais abaixo. Uma opção pode ser:", "Usar fundação profunda", "Apoiar a obra na pintura", "Retirar todos os pilares", "Construir sem projeto", "A fundação profunda pode levar as cargas até uma camada de solo mais resistente.", "Solo e fundações"],
  [431, "Há água no solo durante a escavação. O que a equipe deve fazer?", "Considerar essa condição no projeto e na execução", "Ignorar a água", "Ligar cabos dentro da poça", "Retirar a sinalização", "A água altera o comportamento do terreno e exige cuidados na escavação.", "Solo e fundações"],
  [432, "Uma rua recebeu muito asfalto e concreto, mas pouca drenagem. Durante chuva forte, aumenta o risco de:", "Alagamento", "Infiltração total da água", "Desaparecimento da chuva", "Redução das poças", "Superfícies impermeáveis fazem a água escoar mais rapidamente.", "Drenagem"],
  [433, "Fechar uma torneira muito rapidamente pode causar um golpe de pressão no tubo. Esse efeito acontece por causa:", "Da mudança rápida do movimento da água", "Da cor da tubulação", "Da pintura da parede", "Do peso da janela", "A parada brusca da água pode gerar uma onda de pressão.", "Instalações hidráulicas"],
  [434, "A água percorre um tubo muito longo e com muitas curvas. O que tende a acontecer com a pressão disponível?", "Ela diminui", "Ela aumenta sem limite", "Ela vira corrente elétrica", "Ela não sofre nenhum efeito", "O atrito no caminho faz o escoamento perder parte de sua energia.", "Instalações hidráulicas"],
  [435, "Uma junta permite pequenos movimentos entre partes da construção. A impermeabilização nesse ponto deve:", "Acompanhar o movimento sem rasgar", "Ser sempre rígida e quebradiça", "Bloquear a junta com entulho", "Conduzir eletricidade", "O detalhe precisa continuar vedando mesmo com pequenas movimentações.", "Impermeabilização"],
  [436, "Uma tarefa do cronograma não tem nenhum dia de folga. Se ela atrasar e nada for recuperado:", "A entrega da obra pode atrasar", "O prazo sempre diminui", "A tarefa deixa de existir", "O custo vira zero", "Sem folga, o atraso passa diretamente para as etapas seguintes.", "Planejamento"],
  [437, "Para estimar o custo de 1 m² de parede, a equipe deve somar principalmente:", "Materiais, mão de obra e equipamentos usados", "Apenas a cor dos blocos", "Somente o endereço", "Apenas o número de janelas", "O custo do serviço reúne os recursos necessários para executar uma unidade.", "Orçamento"],
  [438, "Dois materiais têm a mesma função. Para escolher o mais sustentável, é melhor comparar:", "Produção, uso, manutenção e descarte", "Somente a embalagem", "Apenas a cor", "Somente o anúncio", "A comparação deve considerar todas as etapas da vida do material.", "Sustentabilidade"],
  [439, "Uma fachada recebe sol forte à tarde. Qual solução pode reduzir o calor dentro da sala?", "Criar sombra sobre as janelas", "Pintar o vidro de preto", "Fechar toda ventilação", "Retirar a cobertura", "Sombreamento bem posicionado reduz a entrada direta de calor solar.", "Conforto"],
  [440, "No desenho, um tubo atravessa uma viga. Qual é a melhor decisão antes da obra?", "Ajustar os projetos com as equipes responsáveis", "Furar a viga sem perguntar", "Ignorar o tubo", "Apagar todas as medidas", "Resolver o conflito no projeto evita improvisos e riscos na construção.", "Compatibilização"],
];

const accessibleById = new Map<number, AccessibleRow>(
  accessibleRows.map((row) => [row[0], row]),
);

export function adaptQuestionsForPublicSchool(questions: Question[]): Question[] {
  return questions.map((question) => {
    const row = accessibleById.get(question.id);
    if (!row) return question;

    const [, prompt, correct, wrong1, wrong2, wrong3, explanation, category] = row;
    return {
      ...question,
      category: category ?? question.category,
      prompt,
      options: [correct, wrong1, wrong2, wrong3],
      answer: 0,
      explanation,
    };
  });
}
