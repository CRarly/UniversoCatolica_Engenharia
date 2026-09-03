import type { Question } from "./questions";

type TextQuestion = readonly [
  category: string,
  prompt: string,
  correct: string,
  wrong1: string,
  wrong2: string,
  wrong3: string,
  explanation: string,
];

const expandedQuestions: Question[] = [];
let nextId = 103;

function addTextQuestions(level: Question["level"], rows: readonly TextQuestion[]) {
  rows.forEach(([category, prompt, correct, wrong1, wrong2, wrong3, explanation]) => {
    expandedQuestions.push({
      id: nextId++,
      category,
      level,
      prompt,
      options: [correct, wrong1, wrong2, wrong3],
      answer: 0,
      explanation,
    });
  });
}

function ptNumber(value: number, maximumFractionDigits = 2) {
  return value.toLocaleString("pt-BR", { maximumFractionDigits });
}

function addNumericQuestion(
  level: Question["level"],
  category: string,
  prompt: string,
  correct: number,
  wrongValues: number[],
  unit: string,
  explanation: string,
  maximumFractionDigits = 2,
) {
  const format = (value: number) => `${ptNumber(value, maximumFractionDigits)}${unit}`;
  const correctText = format(correct);
  const alternatives = new Set<string>();

  for (const candidate of [...wrongValues, correct * 2, correct / 2, correct + 1, correct + 5, correct * 3]) {
    if (candidate > 0) {
      const formatted = format(candidate);
      if (formatted !== correctText) alternatives.add(formatted);
    }
    if (alternatives.size === 3) break;
  }

  expandedQuestions.push({
    id: nextId++,
    category,
    level,
    prompt,
    options: [correctText, ...Array.from(alternatives)] as [string, string, string, string],
    answer: 0,
    explanation,
  });
}

// 186 novas questões fáceis: 65 de elétrica e 121 de fundamentos da construção.
addTextQuestions("Fácil", [
  ["Elétrica", "O que é corrente elétrica?", "O movimento ordenado de cargas elétricas", "A cor do fio", "A quantidade de tomadas", "O calor do ambiente", "Corrente elétrica é o movimento organizado de cargas em um circuito."],
  ["Elétrica", "Qual é a unidade de medida da corrente elétrica?", "Ampere (A)", "Volt (V)", "Watt (W)", "Metro (m)", "A corrente elétrica é medida em amperes."],
  ["Elétrica", "Qual é a unidade de medida da tensão elétrica?", "Volt (V)", "Ampere (A)", "Ohm (Ω)", "Litro (L)", "A tensão elétrica é medida em volts."],
  ["Elétrica", "Qual é a unidade de medida da resistência elétrica?", "Ohm (Ω)", "Watt (W)", "Volt (V)", "Quilograma (kg)", "A resistência elétrica é medida em ohms."],
  ["Elétrica", "Qual é a unidade mais usada para indicar a potência de uma lâmpada?", "Watt (W)", "Ampere-hora (Ah)", "Metro quadrado (m²)", "Pascal (Pa)", "A potência elétrica de aparelhos e lâmpadas é indicada em watts."],
  ["Elétrica", "Qual é a principal função de um interruptor de iluminação?", "Abrir ou fechar o circuito da lâmpada", "Aumentar a tensão da rede", "Substituir o disjuntor", "Medir o consumo mensal", "O interruptor comanda a passagem de corrente no circuito da lâmpada."],
  ["Elétrica", "Para que serve uma tomada?", "Conectar um equipamento à instalação elétrica", "Medir a área do cômodo", "Apoiar a fiação no telhado", "Armazenar energia sem bateria", "A tomada cria um ponto de conexão entre o aparelho e a instalação."],
  ["Segurança elétrica", "Qual dispositivo desliga o circuito quando ocorre uma corrente excessiva?", "Disjuntor", "Interruptor simples", "Lâmpada", "Eletroduto", "O disjuntor protege o circuito contra sobrecorrentes."],
  ["Segurança elétrica", "Antes de trocar uma tomada, a primeira medida segura é:", "Desligar o circuito no quadro", "Molhar as mãos", "Usar um fio mais fino", "Encostar nos condutores", "Desligar o circuito reduz o risco de choque durante a manutenção."],
  ["Segurança elétrica", "Por que não se deve tocar em equipamentos elétricos com as mãos molhadas?", "A água pode aumentar o risco de choque", "A água aumenta a potência", "O aparelho fica mais leve", "A tensão deixa de existir", "A umidade facilita a passagem de corrente e aumenta o risco de choque."],
  ["Materiais elétricos", "Qual destes materiais é bom condutor de eletricidade?", "Cobre", "Borracha", "Vidro", "Madeira seca", "O cobre conduz eletricidade e é muito usado em cabos."],
  ["Materiais elétricos", "Qual destes materiais é normalmente usado como isolante elétrico?", "Borracha", "Cobre", "Alumínio", "Aço", "A borracha dificulta a passagem de corrente e pode atuar como isolante."],
  ["Elétrica", "O que a tensão elétrica representa em um circuito?", "A diferença de potencial entre dois pontos", "O peso dos cabos", "A área do quadro", "A quantidade de lâmpadas queimadas", "A tensão é a diferença de potencial que impulsiona as cargas elétricas."],
  ["Elétrica", "O que a resistência elétrica faz?", "Dificulta a passagem da corrente", "Produz água potável", "Mede o comprimento do fio", "Elimina a tensão da rede", "A resistência representa a oposição à passagem da corrente elétrica."],
  ["Elétrica", "Em uma instalação residencial, os fios são protegidos mecanicamente dentro de:", "Eletrodutos", "Calhas de chuva", "Tubos de esgoto", "Vergalhões", "Eletrodutos organizam e protegem os condutores elétricos."],
  ["Elétrica", "Onde ficam reunidos os disjuntores de uma residência?", "No quadro de distribuição", "Na caixa-d'água", "Na fundação", "No telhado", "O quadro de distribuição reúne os dispositivos de proteção dos circuitos."],
  ["Segurança elétrica", "Qual é a função básica do aterramento de proteção?", "Oferecer um caminho seguro para correntes de falha", "Aumentar o consumo", "Substituir todos os disjuntores", "Acender lâmpadas mais fortes", "O aterramento ajuda a conduzir correntes de falha e reduzir tensões perigosas."],
  ["Segurança elétrica", "Ligar muitos aparelhos potentes em uma única extensão pode causar:", "Sobrecarga e aquecimento", "Economia automática de energia", "Redução da corrente a zero", "Aumento da ventilação", "O excesso de carga pode aquecer os condutores e causar acidentes."],
  ["Elétrica", "Qual equipamento registra a energia consumida em uma residência?", "Medidor de energia", "Interruptor", "Campainha", "Eletroduto", "O medidor registra o consumo de energia elétrica da unidade."],
  ["Elétrica", "Na conta de energia, o consumo costuma ser informado em:", "Quilowatt-hora (kWh)", "Quilômetro por hora", "Litro por minuto", "Metro quadrado", "O quilowatt-hora mede a energia elétrica consumida ao longo do tempo."],
  ["Eficiência energética", "Em geral, qual lâmpada consome menos energia para iluminar de modo semelhante?", "Lâmpada LED", "Lâmpada incandescente", "Vela", "Resistência de chuveiro", "Lâmpadas LED costumam produzir a mesma iluminação com menor potência."],
  ["Elétrica", "Quando o circuito está aberto, a corrente elétrica:", "É interrompida", "Aumenta sem limite", "Vira tensão", "Passa apenas pelo piso", "Um circuito aberto não oferece um caminho completo para a corrente."],
  ["Elétrica", "Quando o circuito está fechado e alimentado, ele:", "Oferece um caminho completo para a corrente", "Impede qualquer corrente", "Remove todos os cabos", "Funciona sem fonte de energia", "O caminho fechado permite a circulação de corrente."],
  ["Iluminação", "Qual é uma vantagem de dividir a iluminação em mais de um circuito?", "Facilitar o controle e a manutenção", "Eliminar o quadro elétrico", "Dispensar condutores", "Dobrar a tensão em todas as lâmpadas", "A divisão em circuitos melhora a organização e limita os efeitos de uma falha."],
  ["Segurança elétrica", "Ao encontrar um fio desencapado, a atitude correta é:", "Não tocar, isolar a área e avisar o responsável", "Testar com a mão", "Cobrir com papel molhado", "Puxar o fio com força", "Somente uma pessoa qualificada deve intervir após o circuito ser tornado seguro."],
  ["Elétrica", "Em um circuito paralelo, se uma lâmpada queimar, as demais normalmente:", "Podem continuar acesas", "Sempre apagam", "Recebem corrente infinita", "Viram interruptores", "Em paralelo, cada lâmpada possui seu próprio caminho elétrico."],
  ["Elétrica", "Em um circuito em série simples, a corrente que passa pelos componentes é:", "A mesma", "Sempre zero", "Diferente em cada segundo", "Igual à área do fio", "Em uma única malha em série, a mesma corrente atravessa os componentes."],
  ["Segurança elétrica", "Qual dispositivo é projetado para detectar fuga de corrente e reduzir o risco de choque?", "Dispositivo diferencial residual (DR)", "Interruptor de parede", "Tomada comum", "Lâmpada piloto", "O DR compara as correntes do circuito e desliga quando identifica uma fuga."],
  ["Projeto elétrico", "Por que os pontos elétricos devem aparecer no projeto?", "Para orientar a posição de tomadas, luzes e comandos", "Para definir a resistência do concreto", "Para escolher o tipo de fundação", "Para medir o terreno", "A planta elétrica orienta a execução e a compatibilização dos pontos."],
  ["Segurança elétrica", "Quem deve realizar serviços elétricos no canteiro?", "Pessoa qualificada e autorizada", "Qualquer visitante", "Somente o fornecedor de tinta", "A primeira pessoa que chegar", "Serviços elétricos exigem capacitação, autorização e procedimentos de segurança."],
]);

const easyOhmSeeds = [
  [12, 2], [18, 3], [24, 4], [30, 5], [36, 6], [42, 7], [48, 8], [54, 9], [60, 10], [72, 12],
  [15, 3], [20, 4], [35, 5], [40, 8], [45, 9], [56, 7], [63, 9], [70, 10], [80, 16], [90, 15],
] as const;
easyOhmSeeds.forEach(([voltage, resistance], index) => {
  const current = voltage / resistance;
  addNumericQuestion(
    "Fácil",
    "Elétrica",
    `Use I = V ÷ R. No circuito ${index + 1}, a tensão é ${voltage} V e a resistência é ${resistance} Ω. Qual é a corrente?`,
    current,
    [voltage, resistance, current * 2],
    " A",
    `Pela lei de Ohm, I = V/R = ${voltage}/${resistance} = ${ptNumber(current)} A.`,
  );
});

const easyPowerSeeds = [
  [12, 2], [24, 2], [10, 3], [20, 3], [15, 4], [25, 4], [30, 5], [40, 5], [50, 2], [60, 3],
  [100, 1], [120, 2], [127, 2], [110, 3], [220, 2],
] as const;
easyPowerSeeds.forEach(([voltage, current]) => {
  const power = voltage * current;
  addNumericQuestion(
    "Fácil",
    "Elétrica",
    `Use P = V × I. Um equipamento opera com ${voltage} V e corrente de ${current} A. Qual é sua potência?`,
    power,
    [voltage + current, voltage, current * 10],
    " W",
    `A potência é P = V × I = ${voltage} × ${current} = ${power} W.`,
  );
});

const easyCivilConcepts: readonly TextQuestion[] = [
  ["Topografia", "Para que serve uma referência de nível na obra?", "Controlar alturas e cotas", "Escolher a cor da tinta", "Medir a corrente elétrica", "Guardar ferramentas", "A referência de nível permite transferir e conferir alturas do projeto."],
  ["Drenagem", "Por que pisos externos recebem caimento em direção ao ralo?", "Para conduzir a água", "Para aumentar o peso", "Para esconder a fundação", "Para reduzir a iluminação", "O caimento evita empoçamentos e direciona a água ao ponto de coleta."],
  ["Impermeabilização", "A impermeabilização de uma laje ajuda a evitar:", "Infiltrações", "Iluminação natural", "Ventilação cruzada", "Apoio das vigas", "A camada impermeável limita a entrada indesejada de água."],
  ["Estruturas", "As barras de aço dentro do concreto formam a:", "Armadura", "Pintura", "Tubulação", "Esquadria", "A armadura de aço complementa a resistência do concreto."],
  ["Concreto", "Para que servem as formas na concretagem?", "Dar forma e sustentar o concreto fresco", "Substituir a armadura", "Medir a tensão elétrica", "Pintar a superfície", "As formas contêm o concreto até que ele adquira resistência suficiente."],
  ["Materiais", "O cimento em contato com água participa de uma reação chamada:", "Hidratação", "Evaporação do aço", "Magnetização", "Ventilação", "A hidratação do cimento permite o endurecimento da pasta."],
  ["Materiais", "A areia usada no concreto é classificada como:", "Agregado miúdo", "Agregado graúdo", "Ligante metálico", "Impermeabilizante", "A areia possui grãos menores e é classificada como agregado miúdo."],
  ["Materiais", "A brita usada no concreto é classificada como:", "Agregado graúdo", "Agregado miúdo", "Tinta mineral", "Fibra elétrica", "A brita é o agregado graúdo mais comum do concreto."],
  ["Concreto", "Durante a cura, o concreto deve ser protegido principalmente contra:", "Perda rápida de água", "Entrada de luz", "Uso de capacete", "Leitura do projeto", "Evitar a secagem precoce favorece a hidratação e a resistência."],
  ["Segurança", "Qual EPI protege os olhos contra partículas?", "Óculos de segurança", "Botina", "Capacete", "Cinto de ferramentas", "Os óculos de segurança ajudam a impedir que partículas atinjam os olhos."],
  ["Segurança", "Um guarda-corpo é exemplo de:", "Proteção coletiva", "Agregado do concreto", "Ferramenta de medição", "Acabamento de pintura", "O guarda-corpo protege simultaneamente as pessoas expostas à borda."],
  ["Resíduos", "Manter caçambas identificadas ajuda a:", "Separar e destinar corretamente os resíduos", "Misturar todos os materiais", "Aumentar o retrabalho", "Dispensar limpeza", "A identificação facilita a segregação e o destino adequado dos resíduos."],
  ["Fundações", "A fundação fica entre a estrutura e:", "O solo", "A pintura", "A caixa-d'água", "O forro", "A fundação transmite ao solo as cargas recebidas da estrutura."],
  ["Estruturas", "Qual elemento horizontal costuma apoiar lajes e transferir cargas aos pilares?", "Viga", "Rodapé", "Janela", "Ralo", "A viga recebe cargas e as leva aos seus apoios."],
  ["Estruturas", "Qual elemento vertical conduz cargas até a fundação?", "Pilar", "Laje", "Telha", "Piso", "O pilar é um elemento vertical do caminho das cargas."],
  ["Estruturas", "Qual elemento forma uma superfície estrutural de piso ou cobertura?", "Laje", "Calha", "Porta", "Vergalhão isolado", "A laje recebe e distribui as cargas de uma superfície."],
  ["Alvenaria", "A função comum de uma parede de vedação é:", "Separar e fechar ambientes", "Substituir toda fundação", "Gerar energia elétrica", "Drenar o terreno", "A alvenaria de vedação fecha a edificação e divide ambientes."],
  ["Alvenaria", "A verga é colocada geralmente:", "Acima de portas e janelas", "Sob toda fundação", "Dentro da caixa-d'água", "Sobre o piso acabado", "A verga ajuda a distribuir as cargas sobre uma abertura."],
  ["Alvenaria", "A contraverga é usada geralmente:", "Abaixo de janelas", "Acima da cumeeira", "Dentro do eletroduto", "Sob uma sapata", "A contraverga ajuda a reduzir fissuras na região inferior da janela."],
  ["Revestimentos", "O chapisco ajuda principalmente a:", "Melhorar a aderência do revestimento", "Impermeabilizar qualquer piscina sozinho", "Substituir a parede", "Conduzir eletricidade", "A superfície áspera do chapisco favorece a aderência das camadas seguintes."],
  ["Revestimentos", "O reboco é aplicado para:", "Regularizar e dar acabamento à parede", "Armar pilares", "Substituir telhas", "Medir o terreno", "O reboco compõe o acabamento do revestimento da alvenaria."],
  ["Pisos", "O contrapiso serve de base para:", "O revestimento final do piso", "A cobertura do telhado", "A armadura do pilar", "O medidor de energia", "O contrapiso regulariza a base que receberá o acabamento."],
  ["Acabamentos", "O rodapé protege principalmente a parte inferior da:", "Parede", "Laje de cobertura", "Fundação profunda", "Caixa-d'água", "O rodapé protege e arremata o encontro entre piso e parede."],
  ["Coberturas", "Qual é a função principal das telhas?", "Proteger a edificação da chuva", "Transmitir cargas ao solo diretamente", "Conduzir esgoto", "Medir a área do terreno", "As telhas formam a camada externa de proteção da cobertura."],
  ["Coberturas", "A água coletada pelas calhas segue normalmente para:", "Condutores verticais", "Tomadas", "Pilares", "Interruptores", "Os condutores levam a água da calha ao sistema de drenagem."],
  ["Drenagem", "Um tubo que leva a água da calha para baixo é chamado de:", "Condutor pluvial", "Eletroduto", "Vergalhão", "Sifão de pia", "O condutor pluvial transporta a água coletada na cobertura."],
  ["Canteiro", "Organizar áreas de materiais e circulação no canteiro ajuda a:", "Reduzir riscos e deslocamentos desnecessários", "Eliminar a necessidade de projeto", "Aumentar perdas", "Substituir a sinalização", "Um bom arranjo do canteiro melhora segurança e produtividade."],
  ["Planejamento", "Um cronograma mostra principalmente:", "Quando as atividades devem ocorrer", "A cor de cada parede", "A resistência de cada lâmpada", "Somente o endereço da obra", "O cronograma organiza as atividades ao longo do tempo."],
  ["Orçamento", "Um orçamento de obra reúne estimativas de:", "Quantidades e custos", "Somente cores", "Apenas horários", "Apenas nomes da equipe", "O orçamento estima recursos e custos necessários para executar o projeto."],
  ["Acessibilidade", "Uma rampa acessível ajuda pessoas a vencer:", "Diferenças de nível", "Falta de iluminação", "Ausência de pintura", "Vazão de água", "A rampa oferece um percurso inclinado entre níveis diferentes."],
  ["Conforto", "A ventilação cruzada ocorre quando o ar pode:", "Entrar e sair por aberturas diferentes", "Circular apenas dentro de um armário", "Passar pela fundação", "Subir pelo eletroduto", "Aberturas adequadas em lados distintos favorecem a circulação de ar."],
  ["Sustentabilidade", "Um piso permeável ajuda a:", "Permitir parte da infiltração da chuva", "Bloquear toda água no terreno", "Aumentar a temperatura sempre", "Substituir a drenagem interna", "Superfícies permeáveis reduzem parte do escoamento superficial."],
  ["Sustentabilidade", "A água da chuva armazenada pode ser usada, quando tratada para esse fim, em:", "Usos não potáveis, como irrigação", "Qualquer uso potável sem controle", "Circuitos elétricos", "Mistura de tintas automaticamente", "O aproveitamento deve respeitar a qualidade exigida para cada uso."],
  ["Desenho técnico", "A planta baixa representa a edificação vista:", "De cima, após um corte horizontal", "Somente de frente", "Por baixo da fundação", "Em uma fotografia aérea obrigatória", "A planta baixa é uma representação horizontal dos ambientes."],
  ["Desenho técnico", "Um corte arquitetônico ajuda a visualizar:", "Alturas e relações verticais", "Somente o paisagismo externo", "A marca das ferramentas", "O consumo de energia", "O corte mostra o interior da edificação em um plano vertical."],
  ["Desenho técnico", "A fachada representa principalmente:", "Uma vista externa da edificação", "Uma camada do solo", "Um circuito elétrico isolado", "O interior de uma tubulação", "A fachada comunica a aparência externa de uma face do projeto."],
];
addTextQuestions("Fácil", easyCivilConcepts);

const easyAreaPairs = [
  [2, 3], [2, 4], [2, 5], [3, 3], [3, 4], [3, 5], [3, 6], [4, 4], [4, 5], [4, 6],
  [4, 7], [5, 5], [5, 6], [5, 7], [5, 8], [6, 6], [6, 7], [6, 8], [6, 9], [7, 7],
  [7, 8], [7, 9], [8, 8], [8, 9], [8, 10], [9, 9], [9, 10], [10, 10], [10, 12], [12, 15],
] as const;
easyAreaPairs.forEach(([width, height]) => {
  const area = width * height;
  addNumericQuestion("Fácil", "Matemática", `Use área = largura × comprimento. Uma superfície mede ${width} m por ${height} m. Qual é a área?`, area, [width + height, 2 * (width + height), area + width], " m²", `Área = ${width} × ${height} = ${area} m².`);
});

const easyPerimeterPairs = [
  [2, 3], [2, 6], [3, 4], [3, 7], [4, 5], [4, 8], [5, 6], [5, 9], [6, 7], [6, 10],
  [7, 8], [7, 11], [8, 9], [8, 12], [9, 10], [9, 13], [10, 11], [10, 14], [12, 15], [15, 20],
] as const;
easyPerimeterPairs.forEach(([width, length]) => {
  const perimeter = 2 * (width + length);
  addNumericQuestion("Fácil", "Matemática", `Some os quatro lados. Um cômodo mede ${width} m por ${length} m. Qual é seu perímetro?`, perimeter, [width * length, width + length, 2 * width + length], " m", `Perímetro = 2 × (${width} + ${length}) = ${perimeter} m.`);
});

const easyVolumeSeeds = [
  [2, 2, 2], [2, 2, 3], [2, 3, 3], [2, 3, 4], [2, 4, 4], [3, 3, 3], [3, 3, 4], [3, 4, 4],
  [3, 4, 5], [3, 5, 6], [4, 4, 4], [4, 4, 5], [4, 5, 6], [5, 5, 5], [5, 6, 7],
] as const;
easyVolumeSeeds.forEach(([length, width, height]) => {
  const volume = length * width * height;
  addNumericQuestion("Fácil", "Matemática", `Use volume = comprimento × largura × altura. O espaço mede ${length} m × ${width} m × ${height} m. Qual é o volume?`, volume, [length * width, 2 * (length + width), volume + height], " m³", `Volume = ${length} × ${width} × ${height} = ${volume} m³.`);
});

const conversionSeeds = [
  ...[1, 2, 3, 4, 5, 6, 8, 10].map((value) => [value, 100, "m", "cm"] as const),
  ...[1, 2, 3, 5, 8, 10].map((value) => [value, 1000, "L", "mL"] as const),
  ...[1, 2, 3, 4, 5, 10].map((value) => [value, 1000, "kg", "g"] as const),
] as const;
conversionSeeds.forEach(([value, factor, fromUnit, toUnit]) => {
  const converted = value * factor;
  addNumericQuestion("Fácil", "Unidades", `Quantos ${toUnit} correspondem a ${value} ${fromUnit}?`, converted, [value, converted / 10, converted * 10], ` ${toUnit}`, `${value} ${fromUnit} × ${factor} = ${converted} ${toUnit}.`);
});

// 96 novas questões intermediárias: aplicações, cálculos e decisões de projeto.
addTextQuestions("Intermediária", [
  ["Elétrica", "Por que a seção de um condutor deve ser dimensionada para a corrente do circuito?", "Para limitar aquecimento e operar com segurança", "Para escolher a cor da parede", "Para aumentar o consumo", "Para dispensar o disjuntor", "A seção adequada reduz aquecimento excessivo e queda de tensão."],
  ["Elétrica", "O disjuntor de um circuito deve ser compatível principalmente com:", "A capacidade dos condutores e a carga prevista", "A cor dos eletrodutos", "A altura das portas", "A marca das lâmpadas", "A proteção deve interromper sobrecorrentes antes que os condutores sejam danificados."],
  ["Elétrica", "Qual expressão calcula a potência elétrica em corrente contínua ou carga resistiva simples?", "P = V × I", "P = V + I", "P = V/I²", "P = área × altura", "A potência é o produto da tensão pela corrente nesse caso simples."],
  ["Elétrica", "Qual expressão representa a lei de Ohm?", "V = R × I", "V = R + I", "V = R/I²", "V = massa × altura", "A lei de Ohm relaciona tensão, resistência e corrente."],
  ["Projeto elétrico", "Por que circuitos de iluminação e tomadas costumam ser separados?", "Para facilitar proteção, manutenção e distribuição das cargas", "Para eliminar a tensão", "Para usar um único fio", "Para dispensar o quadro", "Separar usos permite dimensionar e proteger melhor cada conjunto de cargas."],
  ["Segurança elétrica", "O dispositivo DR substitui o disjuntor contra sobrecorrente?", "Não, eles possuem funções de proteção diferentes", "Sim, sempre", "Sim, mas apenas em lâmpadas", "Não, porque o DR não usa eletricidade", "O DR atua em fugas; o disjuntor atua em sobrecarga e curto-circuito."],
  ["Segurança elétrica", "Qual é a função de um DPS em uma instalação?", "Limitar surtos de tensão", "Medir a área construída", "Substituir o aterramento", "Aumentar permanentemente a corrente", "O dispositivo de proteção contra surtos desvia ou limita sobretensões transitórias."],
  ["Elétrica", "Uma carga resistiva ligada a uma tensão maior que a prevista tende a:", "Receber potência excessiva e aquecer mais", "Consumir sempre zero", "Diminuir a corrente para zero", "Virar um isolante", "Tensão acima da especificada pode elevar corrente e potência, danificando a carga."],
  ["Projeto elétrico", "Para que serve uma caixa de passagem?", "Facilitar conexões, inspeção e puxamento dos fios", "Armazenar água", "Apoiar uma viga", "Substituir o medidor", "Caixas de passagem dão acesso aos condutores e às conexões."],
  ["Elétrica", "O efeito Joule corresponde à transformação de energia elétrica em:", "Calor", "Massa", "Área", "Pressão hidráulica", "A passagem de corrente por uma resistência produz aquecimento."],
  ["Iluminação", "Um sensor de presença pode economizar energia porque:", "Desliga a iluminação quando não há necessidade", "Aumenta a potência das lâmpadas", "Elimina a instalação", "Mantém tudo aceso", "O comando automático reduz o tempo de funcionamento desnecessário."],
  ["Projeto elétrico", "Por que uma carga de grande potência pode precisar de circuito dedicado?", "Para receber condutores e proteção dimensionados para ela", "Para não usar tensão", "Para ficar sem aterramento", "Para substituir o quadro", "Um circuito dedicado evita compartilhar indevidamente a capacidade com outras cargas."],
  ["Elétrica", "Em resistores ligados em série, a resistência equivalente é:", "A soma das resistências", "Sempre a menor resistência", "O produto sem divisão", "Sempre zero", "Em série, as quedas se somam e a resistência equivalente é a soma."],
  ["Elétrica", "Em resistores iguais ligados em paralelo, a resistência equivalente é:", "Menor que a resistência de cada resistor", "Maior que a soma", "Sempre infinita", "Igual a zero em qualquer situação", "Os caminhos paralelos aumentam a condução e reduzem a resistência equivalente."],
  ["Elétrica", "Uma queda de tensão excessiva pode fazer um equipamento:", "Operar de forma inadequada", "Ganhar potência sem limite", "Dispensar corrente", "Virar um disjuntor", "Tensão abaixo da faixa esperada pode prejudicar desempenho e partida."],
  ["Segurança elétrica", "O aterramento deve ser usado como condutor normal de retorno da carga?", "Não, ele é destinado à proteção", "Sim, em qualquer circuito", "Sim, para economizar cabo", "Somente em lâmpadas LED", "O condutor de proteção não deve conduzir a corrente normal de funcionamento."],
  ["Eficiência energética", "A etiqueta de eficiência de um equipamento ajuda a comparar:", "Consumo e desempenho energético", "A resistência do concreto", "A área do terreno", "A pressão da água", "A etiqueta informa o desempenho energético para apoiar escolhas de menor consumo."],
  ["Projeto elétrico", "Compatibilizar o projeto elétrico com o hidráulico evita:", "Interferências entre eletrodutos, tubulações e equipamentos", "A leitura das plantas", "O uso de interruptores", "A ventilação dos ambientes", "A compatibilização antecipa conflitos antes da execução."],
  ["Segurança elétrica", "Por que emendas devem ficar acessíveis em caixas apropriadas?", "Para permitir inspeção e manutenção seguras", "Para ficarem molhadas", "Para aumentar a resistência da laje", "Para substituir os cabos", "Conexões acessíveis podem ser verificadas e reparadas sem quebrar a construção."],
  ["Elétrica", "Se a resistência permanece constante e a tensão dobra, a corrente:", "Dobra", "Cai pela metade", "Permanece sempre zero", "Não se relaciona com a tensão", "Pela lei de Ohm, I = V/R; com R constante, corrente e tensão são proporcionais."],
]);

const energySeeds = [
  [100, 2], [200, 3], [250, 4], [300, 5], [400, 2], [500, 3], [600, 4], [750, 2], [800, 5], [1000, 1],
  [1000, 3], [1200, 2], [1500, 4], [2000, 2], [2500, 3], [3000, 2], [4000, 1], [5000, 2], [6000, 3], [7500, 2],
] as const;
energySeeds.forEach(([power, hours], index) => {
  const energy = power * hours / 1000;
  addNumericQuestion("Intermediária", "Elétrica", `Use energia = potência em kW × tempo. Um equipamento de ${power} W funciona por ${hours} h. Quanto consome?`, energy, [power * hours, power / 1000, energy * 10], " kWh", `Primeiro, ${power} W = ${ptNumber(power / 1000)} kW. Depois: ${ptNumber(power / 1000)} × ${hours} = ${ptNumber(energy)} kWh.`);
});

const seriesCircuitSeeds = [
  [2, 4, 2], [3, 6, 2], [4, 8, 2], [5, 10, 2], [6, 12, 2],
  [2, 3, 4], [4, 6, 3], [5, 7, 3], [8, 12, 2], [10, 15, 2],
] as const;
seriesCircuitSeeds.forEach(([r1, r2, current]) => {
  const voltage = (r1 + r2) * current;
  addNumericQuestion("Intermediária", "Elétrica", `Some R₁ e R₂ e use I = V ÷ R. R₁ = ${r1} Ω, R₂ = ${r2} Ω e V = ${voltage} V. Qual é a corrente?`, current, [voltage / r1, voltage / r2, r1 + r2], " A", `R total = ${r1} + ${r2} = ${r1 + r2} Ω; I = ${voltage} ÷ ${r1 + r2} = ${current} A.`);
});

const scaleSeeds = [
  [50, 2], [50, 3], [50, 4], [50, 5], [75, 2], [75, 4], [100, 2], [100, 3],
  [100, 4], [100, 5], [125, 2], [125, 4], [200, 2], [200, 3], [200, 4], [250, 2],
] as const;
scaleSeeds.forEach(([scale, drawingCm]) => {
  const realMeters = scale * drawingCm / 100;
  addNumericQuestion("Intermediária", "Desenho técnico", `Na escala 1:${scale}, cada 1 cm vale ${scale} cm reais. Uma linha mede ${drawingCm} cm. Qual é o comprimento real?`, realMeters, [scale * drawingCm, drawingCm / scale, realMeters * 10], " m", `${drawingCm} cm × ${scale} = ${drawingCm * scale} cm = ${ptNumber(realMeters)} m.`);
});

const blockQuantitySeeds = [
  [8, 12], [10, 12], [12, 12], [15, 12], [18, 12], [20, 12], [9, 15], [10, 15],
  [12, 15], [14, 15], [16, 15], [18, 15], [20, 15], [22, 15], [24, 15],
] as const;
blockQuantitySeeds.forEach(([area, blocksPerSquareMeter]) => {
  const quantity = area * blocksPerSquareMeter;
  addNumericQuestion("Intermediária", "Orçamento", `Multiplique a área pelo consumo. Uma parede tem ${area} m² e usa ${blocksPerSquareMeter} blocos por m². Quantos blocos serão usados?`, quantity, [area + blocksPerSquareMeter, area * 10, quantity + blocksPerSquareMeter], " blocos", `${area} × ${blocksPerSquareMeter} = ${quantity} blocos.`);
});

addTextQuestions("Intermediária", [
  ["Concreto", "O adensamento correto do concreto ajuda a reduzir:", "Vazios e falhas de concretagem", "A necessidade de armadura em qualquer peça", "O comprimento das vigas", "A área do terreno", "O adensamento expulsa ar aprisionado e melhora o preenchimento das formas."],
  ["Estruturas", "Por que os estribos são importantes em uma viga de concreto armado?", "Ajudam a resistir ao cisalhamento e confinam as barras", "Substituem o concreto", "Servem apenas de pintura", "Conduzem água", "Estribos participam da resistência ao cisalhamento e mantêm a armadura organizada."],
  ["Fundações", "Uma sondagem do solo deve ser feita antes do projeto de fundações porque:", "Revela características das camadas do terreno", "Define a cor da fachada", "Mede o consumo elétrico", "Escolhe as telhas", "Os dados do solo orientam uma solução de fundação segura e econômica."],
  ["Impermeabilização", "Por que a impermeabilização deve subir um trecho nas paredes de uma área molhada?", "Para proteger o encontro entre piso e parede", "Para apoiar a laje", "Para substituir o reboco", "Para ventilar o esgoto", "O arremate vertical reduz infiltrações em um encontro vulnerável."],
  ["Drenagem", "O que pode ocorrer se uma calha tiver seção insuficiente?", "Transbordamento durante chuvas intensas", "Aumento da resistência do concreto", "Redução do peso da cobertura", "Geração de energia", "Uma calha pequena pode não transportar a vazão recebida."],
  ["Planejamento", "Uma atividade crítica atrasada tende a:", "Atrasar a data final se não houver folga", "Melhorar automaticamente o prazo", "Eliminar custos", "Dispensar recursos", "Atividades críticas não possuem folga suficiente para absorver atrasos."],
  ["Orçamento", "Por que se acrescenta uma perda controlada à quantidade líquida de revestimento?", "Para considerar cortes e quebras da execução", "Para duplicar qualquer compra", "Para eliminar medições", "Para evitar o projeto", "A quantidade de compra deve considerar perdas reais e justificadas."],
  ["Topografia", "Curvas de nível muito próximas indicam:", "Maior inclinação do terreno", "Terreno perfeitamente plano", "Ausência de cotas", "Maior iluminação", "Menor distância horizontal entre curvas representa maior declividade."],
  ["Estruturas", "O cobrimento insuficiente da armadura pode favorecer:", "Corrosão do aço", "Aumento da ventilação", "Economia de água", "Redução da corrente elétrica", "Pouco cobrimento expõe o aço mais facilmente à umidade e a agentes agressivos."],
  ["Materiais", "A relação água/cimento elevada tende a produzir concreto:", "Mais poroso e menos resistente", "Sempre mais resistente", "Sem necessidade de cura", "Com aço incorporado", "Água em excesso deixa mais vazios depois do endurecimento."],
  ["Qualidade", "Um revestimento aplicado sobre base com pó pode apresentar:", "Baixa aderência e descolamento", "Aumento da resistência da fundação", "Melhor condução elétrica", "Maior vazão no ralo", "Poeira e sujeira prejudicam a aderência entre as camadas."],
  ["Acessibilidade", "Por que um patamar é importante em uma rampa longa?", "Oferece descanso e melhora a segurança", "Aumenta a inclinação", "Substitui o corrimão sempre", "Bloqueia a passagem", "Patamares interrompem percursos extensos e apoiam manobras ou descanso."],
  ["Sustentabilidade", "Uma fachada sombreada em clima quente pode reduzir:", "Ganhos de calor solar", "A resistência do solo", "A vazão de esgoto", "O cobrimento da armadura", "O sombreamento controla a radiação direta sobre aberturas e superfícies."],
  ["Pavimentação", "Compactar adequadamente a base de um pavimento ajuda a:", "Distribuir cargas e reduzir deformações", "Aumentar vazios", "Eliminar a drenagem", "Substituir o revestimento", "Uma base uniforme e compactada melhora o suporte do pavimento."],
  ["Compatibilização", "Detectar uma tubulação atravessando uma viga ainda no projeto permite:", "Corrigir a interferência antes da obra", "Executar o furo sem análise", "Ignorar a estrutura", "Eliminar a tubulação", "A compatibilização reduz retrabalho e evita alterações estruturais improvisadas."],
]);

// 76 novas questões difíceis: análise técnica acessível a concluintes do ensino médio.
addTextQuestions("Difícil", [
  ["Elétrica", "Mantendo a resistência constante, a potência dissipada pode ser calculada por:", "P = V²/R", "P = V/R²", "P = V + R", "P = R/V", "Substituindo I = V/R em P = V × I, obtém-se P = V²/R."],
  ["Elétrica", "Mantendo a corrente constante, a potência dissipada em um resistor é:", "P = R × I²", "P = R/I²", "P = R + I", "P = I/R", "A combinação de P = V × I com V = R × I resulta em P = R × I²."],
  ["Elétrica", "A queda de tensão em um condutor aumenta, em geral, quando:", "O comprimento e a corrente aumentam", "O comprimento diminui e a seção aumenta", "A corrente cai a zero", "A resistência é eliminada", "Condutores mais longos e correntes maiores produzem maior queda de tensão."],
  ["Elétrica", "Aumentar a seção de um cabo, mantendo material e comprimento, tende a:", "Reduzir sua resistência elétrica", "Aumentar sua resistência", "Eliminar a tensão da fonte", "Dobrar a frequência", "Uma área de seção maior oferece menor resistência à passagem da corrente."],
  ["Elétrica", "O fator de potência é a razão entre:", "Potência ativa e potência aparente", "Tensão e comprimento", "Corrente e área", "Energia e massa", "O fator de potência relaciona a potência que realiza trabalho com a potência aparente."],
  ["Elétrica", "Em uma carga com baixo fator de potência, para a mesma potência ativa, a corrente tende a ser:", "Maior", "Menor e sempre zero", "Independente da carga", "Igual à resistência", "Baixo fator de potência exige mais corrente para entregar a mesma potência ativa."],
  ["Proteção elétrica", "Coordenação entre cabo e disjuntor busca garantir que:", "A proteção atue antes do dano térmico ao condutor", "O cabo aqueça primeiro", "O disjuntor nunca desligue", "A tensão aumente", "O dispositivo deve interromper a sobrecorrente dentro da capacidade suportada pelo cabo."],
  ["Proteção elétrica", "Se apenas o circuito mais próximo da falha desliga, há boa:", "Seletividade", "Impermeabilização", "Ventilação", "Compactação", "A seletividade limita o desligamento à menor parte possível da instalação."],
  ["Proteção elétrica", "O DR detecta uma fuga comparando principalmente:", "As correntes que entram e retornam no circuito", "As cores dos cabos", "A potência de duas lâmpadas", "A altura das tomadas", "Uma diferença entre ida e retorno indica corrente seguindo outro caminho."],
  ["Proteção elétrica", "O DPS é instalado para lidar principalmente com:", "Sobretensões transitórias", "Sobrecarga mecânica", "Falta de ventilação", "Vazamento hidráulico", "Surtos atmosféricos ou de manobra podem ser limitados pelo DPS."],
  ["Elétrica", "Em uma ligação paralela, todos os ramos ficam submetidos à mesma:", "Tensão", "Resistência", "Potência", "Corrente", "Os ramos em paralelo compartilham os mesmos dois nós e a mesma tensão."],
  ["Elétrica", "Em uma ligação em série, a tensão total é igual à:", "Soma das quedas de tensão", "Maior corrente do circuito", "Menor resistência", "Área dos cabos", "A fonte fornece a soma das quedas de tensão nos componentes em série."],
  ["Elétrica", "Agrupar muitos cabos carregados no mesmo eletroduto pode exigir correção porque:", "A dissipação de calor fica mais difícil", "A tensão deixa de existir", "O cobre vira isolante", "A corrente sempre cai a zero", "O agrupamento eleva a temperatura e pode reduzir a capacidade de condução."],
  ["Elétrica", "Um motor pode exigir atenção especial na partida porque apresenta:", "Corrente de partida elevada", "Resistência infinita permanente", "Consumo sempre nulo", "Somente potência luminosa", "Durante a aceleração, muitos motores demandam corrente superior à nominal."],
  ["Elétrica", "Harmônicas em uma instalação estão associadas a:", "Correntes ou tensões com forma de onda distorcida", "Apenas à cor do isolamento", "Pressão da água", "Resistência do concreto", "Cargas não lineares podem distorcer as formas de onda elétricas."],
  ["Elétrica", "A equipotencialização ajuda a:", "Reduzir diferenças perigosas de potencial entre partes metálicas", "Aumentar o consumo", "Substituir a iluminação", "Eliminar o quadro", "Interligar partes condutivas reduz tensões de contato em situações de falha."],
  ["Projeto elétrico", "O fator de demanda permite estimar:", "A parcela das cargas que tende a operar simultaneamente", "A área da alvenaria", "A resistência do solo", "A vazão da calha", "Nem todas as cargas atingem potência máxima ao mesmo tempo; a demanda estima essa simultaneidade."],
  ["Eficiência energética", "Para reduzir perdas por efeito Joule em um alimentador, uma medida possível é:", "Reduzir a corrente ou a resistência do condutor", "Aumentar a corrente", "Diminuir a seção", "Elevar o comprimento", "As perdas são proporcionais a I²R; reduzir I ou R diminui o aquecimento."],
]);

const equalParallelSeeds = [
  [12, 2], [18, 3], [20, 4], [24, 3], [30, 5], [36, 4],
] as const;
equalParallelSeeds.forEach(([resistance, branches], index) => {
  const equivalent = resistance / branches;
  addNumericQuestion("Difícil", "Elétrica", `Use R equivalente = R ÷ quantidade. Há ${branches} resistores iguais de ${resistance} Ω em paralelo. Qual é o resultado?`, equivalent, [resistance * branches, resistance + branches, resistance], " Ω", `R equivalente = ${resistance} ÷ ${branches} = ${ptNumber(equivalent)} Ω.`);
});

const energyCostSeeds = [
  [1, 4, 1], [1.5, 4, 1], [2, 3, 1], [2, 5, 1], [3, 4, 1], [4, 5, 1],
] as const;
energyCostSeeds.forEach(([powerKw, hours, pricePerKwh]) => {
  const cost = powerKw * hours * pricePerKwh;
  addNumericQuestion("Difícil", "Elétrica", `Use custo = potência × tempo × tarifa. Um aparelho de ${ptNumber(powerKw)} kW funciona ${hours} h, com tarifa de R$ ${ptNumber(pricePerKwh)} por kWh. Qual é o custo?`, cost, [powerKw * hours, hours * pricePerKwh, cost * 2], " reais", `Custo = ${ptNumber(powerKw)} × ${hours} × ${ptNumber(pricePerKwh)} = ${ptNumber(cost)} reais.`);
});

const voltageDropSeeds = [
  [220, 11], [220, 8.8], [220, 6.6], [127, 6.35], [127, 5.08], [127, 3.81],
] as const;
voltageDropSeeds.forEach(([sourceVoltage, drop]) => {
  const percentage = drop / sourceVoltage * 100;
  addNumericQuestion("Difícil", "Elétrica", `Use queda percentual = queda ÷ tensão × 100. A tensão é ${sourceVoltage} V e a queda é ${ptNumber(drop)} V. Qual é o percentual?`, percentage, [drop, sourceVoltage / drop, percentage * 10], "%", `(${ptNumber(drop)} ÷ ${sourceVoltage}) × 100 = ${ptNumber(percentage)}%.`, 2);
});

addTextQuestions("Difícil", [
  ["Estruturas", "Em uma viga simplesmente apoiada sob cargas verticais usuais, a região inferior central tende a ficar:", "Tracionada", "Sem esforço", "Somente torcida", "Sempre comprimida", "Na flexão positiva, a parte inferior central alonga e fica tracionada."],
  ["Estruturas", "O aumento do vão de uma viga, mantendo as demais condições, tende a:", "Aumentar esforços e deformações", "Eliminar a flexão", "Reduzir toda carga a zero", "Dispensar apoios", "Vãos maiores geralmente ampliam momentos fletores e deslocamentos."],
  ["Estruturas", "Uma laje com deformação excessiva pode prejudicar:", "Paredes, revestimentos e uso do ambiente", "Somente a cor da fachada", "A leitura do medidor", "A vazão de água potável", "Deslocamentos excessivos podem fissurar elementos não estruturais e afetar o conforto."],
  ["Estruturas", "Por que não se deve cortar uma armadura sem análise?", "Porque pode reduzir a capacidade resistente", "Porque muda apenas a cor", "Porque aumenta a ventilação", "Porque transforma concreto em madeira", "As barras fazem parte do caminho resistente previsto no projeto."],
  ["Concreto", "A segregação do concreto ocorre quando:", "Os componentes se separam e a mistura perde uniformidade", "O cimento hidrata normalmente", "A forma é limpa", "A armadura recebe cobrimento", "Lançamento inadequado ou mistura pouco coesa pode separar agregados e pasta."],
  ["Concreto", "Ninhos de concretagem indicam geralmente:", "Falhas de preenchimento ou adensamento", "Excesso de pintura", "Boa impermeabilização", "Aumento da tensão elétrica", "Vazios visíveis podem resultar de concreto pouco trabalhável ou mal adensado."],
  ["Durabilidade", "A carbonatação pode favorecer corrosão porque:", "Reduz a proteção alcalina do aço", "Aumenta o cobrimento", "Elimina a umidade", "Transforma aço em concreto", "A redução do pH pode despassivar a armadura e permitir corrosão na presença de umidade."],
  ["Durabilidade", "A entrada de cloretos no concreto é preocupante porque pode:", "Desencadear corrosão das armaduras", "Aumentar a ventilação", "Melhorar a pintura", "Reduzir a carga permanente", "Cloretos podem romper a camada protetora do aço."],
  ["Geotecnia", "Recalque diferencial significa que:", "Partes da fundação se deslocam de forma desigual", "Todo o prédio sobe igualmente", "A pintura seca mais rápido", "A tensão elétrica diminui", "Diferenças de deslocamento podem causar distorções e fissuras."],
  ["Geotecnia", "Uma fundação profunda pode ser escolhida quando:", "As camadas superficiais não oferecem suporte adequado", "A fachada precisa de nova cor", "Há muitas janelas", "A cobertura é leve", "Estacas ou elementos profundos transferem cargas a camadas mais competentes."],
  ["Geotecnia", "A presença de água no solo pode influenciar:", "Resistência, escavações e escolha da fundação", "Somente a pintura", "A quantidade de tomadas", "A orientação solar", "O nível d'água altera o comportamento do terreno e a execução."],
  ["Drenagem", "Um sistema de drenagem urbana subdimensionado pode causar:", "Alagamentos e sobrecarga das redes", "Aumento da infiltração controlada", "Redução automática das chuvas", "Melhor compactação", "A vazão superior à capacidade provoca acúmulo e extravasamento."],
  ["Hidráulica", "O golpe de aríete está relacionado a:", "Mudança rápida da velocidade da água na tubulação", "Secagem da tinta", "Compactação do solo", "Aumento da luz natural", "Fechamentos rápidos podem gerar ondas de pressão na rede."],
  ["Hidráulica", "A perda de carga em uma tubulação tende a aumentar com:", "Maior comprimento e mais conexões", "Menor percurso e menos peças", "Ausência de escoamento", "Aumento do diâmetro em qualquer caso", "Atrito ao longo do tubo e singularidades consomem energia do escoamento."],
  ["Impermeabilização", "Uma junta de movimentação precisa ser detalhada porque:", "A construção pode se deformar sem romper o sistema", "A junta deve ser preenchida com concreto rígido sempre", "Ela substitui o ralo", "Ela conduz eletricidade", "O sistema deve acompanhar movimentos e manter a estanqueidade."],
  ["Planejamento", "Se uma atividade possui folga total zero, ela é:", "Crítica para o prazo do projeto", "Irrelevante", "Sempre cancelada", "Uma atividade sem recursos", "Qualquer atraso não recuperado nessa atividade afeta a data final."],
  ["Orçamento", "Uma composição de custo unitário reúne:", "Insumos e produtividades para uma unidade de serviço", "Somente a área do terreno", "Apenas a taxa de juros", "Somente a cor do material", "A composição estima materiais, mão de obra e equipamentos por unidade executada."],
  ["Sustentabilidade", "Avaliar o ciclo de vida de um material significa considerar:", "Impactos da extração ao destino final", "Apenas o preço inicial", "Somente a cor", "Somente o transporte até a loja", "A análise acompanha produção, uso, manutenção e fim de vida."],
  ["Conforto", "Uma ponte térmica é uma região que:", "Facilita a transferência de calor pela envoltória", "Impede qualquer calor", "Aumenta a pressão da água", "Substitui a estrutura", "Materiais ou geometrias mais condutivas criam caminhos preferenciais para o calor."],
  ["Compatibilização", "Um modelo integrado pode reduzir retrabalho ao:", "Detectar interferências entre disciplinas", "Eliminar todas as decisões", "Dispensar medições", "Construir sem equipe", "A coordenação espacial antecipa conflitos entre estrutura, arquitetura e instalações."],
]);

const productivitySeeds = [
  [120, 30], [160, 40], [180, 30], [200, 40], [240, 40], [280, 40], [300, 50], [360, 60], [420, 60], [480, 80],
] as const;
productivitySeeds.forEach(([quantity, dailyProduction]) => {
  const days = quantity / dailyProduction;
  addNumericQuestion("Difícil", "Planejamento", `Use duração = quantidade ÷ produção diária. São ${quantity} m² e a equipe faz ${dailyProduction} m² por dia. Qual é a duração?`, days, [quantity - dailyProduction, quantity / 10, days + dailyProduction], " dias", `${quantity} ÷ ${dailyProduction} = ${ptNumber(days)} dias.`);
});

const runoffSeeds = [
  [20, 100, 0.8], [25, 120, 0.8], [30, 150, 0.8], [40, 200, 0.8], [50, 250, 0.8],
  [20, 150, 0.6], [25, 200, 0.6], [30, 250, 0.6], [40, 300, 0.6], [50, 400, 0.6],
] as const;
runoffSeeds.forEach(([rainfall, area, coefficient]) => {
  const volume = rainfall * area * coefficient;
  addNumericQuestion("Difícil", "Drenagem", `Use volume = chuva × área × coeficiente. Chovem ${rainfall} mm em ${area} m², com coeficiente ${ptNumber(coefficient)}. Qual volume escoa?`, volume, [rainfall * area, area * coefficient, volume / 1000], " L", `Como 1 mm em 1 m² vale 1 L: ${rainfall} × ${area} × ${ptNumber(coefficient)} = ${ptNumber(volume)} L.`);
});

const expectedNewCounts: Record<Question["level"], number> = {
  Fácil: 186,
  Intermediária: 96,
  Difícil: 76,
};

for (const level of Object.keys(expectedNewCounts) as Question["level"][]) {
  const actual = expandedQuestions.filter((question) => question.level === level).length;
  if (actual !== expectedNewCounts[level]) {
    throw new Error(`Banco expandido inválido para ${level}: esperado ${expectedNewCounts[level]}, recebido ${actual}.`);
  }
}

export const EXPANDED_QUESTIONS = expandedQuestions;
