export const ingredients = [
  { id: 'cafe', name: 'Café', icon: '☕', tint: '#aa7655' },
  { id: 'agua', name: 'Água', icon: '💧', tint: '#8dd3e4' },
  { id: 'leite', name: 'Leite', icon: '🥛', tint: '#f7e4c6' },
  { id: 'cacau', name: 'Cacau', icon: '🍫', tint: '#a27761' },
  { id: 'cha', name: 'Chá', icon: '🍃', tint: '#96b493' },
  { id: 'mel', name: 'Mel', icon: '🍯', tint: '#f4c775' },
  { id: 'lavanda', name: 'Lavanda', icon: '🪻', tint: '#b69ad8' },
  { id: 'canela', name: 'Canela', icon: '🌿', tint: '#dd9d70' },
  { id: 'hortela', name: 'Hortelã', icon: '🌱', tint: '#a3cf9f' },
  { id: 'baunilha', name: 'Baunilha', icon: '🌼', tint: '#f1dcb2' },
  { id: 'acafrao', name: 'Açafrão', icon: '✨', tint: '#e4b05a' },
  { id: 'poeira', name: 'Pó de estrela', icon: '✦', tint: '#c5aaf3' },
  { id: 'cereja', name: 'Cereja', icon: '🍒', tint: '#e58da1' },
];

const r = (id, name, chapter, items, finish, price, text) => ({ id, name, chapter, items, finish, price, text });
export const recipes = [
  r('espresso', 'Espresso da Meia-Noite', 1, ['cafe','agua'], 'Sem cobertura', 16, 'Um começo quente para uma noite longa.'),
  r('chocolate', 'Abraço de Cacau', 1, ['leite','cacau','mel'], 'Cacau', 19, 'Conforto para quem precisa de companhia.'),
  r('lavanda', 'Chá da Janela', 1, ['cha','lavanda','mel'], 'Flor', 20, 'Um jardim inteiro dentro de uma xícara.'),
  r('capuccino', 'Cappuccino de Canela', 1, ['cafe','leite','canela'], 'Canela', 22, 'Espuma macia para noites de chuva.'),
  r('mocha', 'Mocha da Chuva', 2, ['cafe','leite','cacau'], 'Cacau', 24, 'O aroma que faz os relógios esquecerem a hora.'),
  r('chai', 'Chai de Outono', 2, ['cha','leite','canela'], 'Canela', 23, 'Uma despedida que não precisa ser triste.'),
  r('dourado', 'Leite Dourado', 2, ['leite','mel','acafrao'], 'Mel', 25, 'A cor do amanhecer em plena madrugada.'),
  r('hortela', 'Orvalho de Hortelã', 2, ['cha','hortela','mel'], 'Folha', 23, 'Frescor de um bosque que ninguém consegue encontrar.'),
  r('baunilha', 'Noite de Baunilha', 3, ['cafe','leite','baunilha'], 'Estrela', 27, 'Para aqueles que precisam de uma segunda chance.'),
  r('violeta', 'Lua de Violeta', 3, ['leite','lavanda','baunilha'], 'Flor', 28, 'A receita favorita de Violet.'),
  r('estrela', 'Estrela Cadente', 3, ['cha','mel','poeira'], 'Estrela', 30, 'Brilha suavemente antes de desaparecer.'),
  r('bruma', 'Bruma de Inverno', 3, ['cafe','canela','hortela'], 'Folha', 27, 'Um contraste inesperado para almas inquietas.'),
  r('ambar', 'Âmbar Quente', 4, ['cafe','mel','canela'], 'Canela', 29, 'Uma lembrança guardada entre páginas antigas.'),
  r('cereja', 'Cereja Noturna', 4, ['cacau','leite','cereja'], 'Cereja', 30, 'Doce sem esconder seus mistérios.'),
  r('especiarias', 'Segredo do Bosque', 4, ['cha','acafrao','canela'], 'Estrela', 31, 'Nem todos os caminhos aparecem durante o dia.'),
  r('nuvem', 'Nuvem de Baunilha', 4, ['leite','baunilha','mel'], 'Mel', 29, 'Leve como a promessa de uma nova visita.'),
  r('memoria', 'Memória de Violet', 5, ['cafe','lavanda','poeira'], 'Flor', 33, 'A receita escrita na última página.'),
  r('solsticio', 'Solstício Secreto', 5, ['cha','poeira','cereja'], 'Cereja', 34, 'Entre a noite mais longa e o primeiro raio de luz.'),
  r('meianoite', 'Coração da Meia-Noite', 5, ['cafe','poeira','baunilha'], 'Estrela', 36, 'A bebida que faz o sino ficar em silêncio.'),
  r('treze', 'Xícara Nº 13', 5, ['cafe','poeira','cereja','canela'], 'Estrela', 40, 'Uma receita sem assinatura encontrada num recibo de 1953.', true),
].map((item, i) => ({...item, secret: item.id === 'treze', number: i + 1}));

export const finishes = ['Sem cobertura','Canela','Cacau','Flor','Mel','Folha','Estrela','Cereja'];
export const clients = [
  { id:'elara', name:'Elara', role:'A bruxa que nunca descansa', image:'portrait-elara', color:'#d8a2e4', intro:'Entre poções, prazos e estrelas, Elara esqueceu de descansar.', favorites:['capuccino','chai','especiarias','violeta'], line:'Um pouco de calma, por favor. E talvez duas colheres de coragem.', bond:'Elara admite que o café é o único lugar onde não precisa provar nada a ninguém.' },
  { id:'lume', name:'Lume', role:'A estrela que caiu do céu', image:'portrait-lume', color:'#f6d9a4', intro:'Lume está aprendendo que viver na Terra é mais difícil do que cair das estrelas.', favorites:['chocolate','dourado','estrela','nuvem'], line:'Eu costumava brilhar sozinha. Aqui parece menos necessário.', bond:'Lume decide ficar para aprender o nome das pequenas coisas que brilham.' },
  { id:'ravi', name:'Ravi', role:'O violinista da madrugada', image:'portrait-ravi', color:'#d2a17c', intro:'Ravi guarda canções incompletas e toca para quem não consegue dormir.', favorites:['espresso','mocha','bruma','ambar'], line:'Uma boa melodia sempre começa com um pouco de silêncio.', bond:'Ravi termina a composição que prometeu tocar para alguém querido.' },
  { id:'cyril', name:'Cyril', role:'Um fantasma muito educado', image:'portrait-cyril', color:'#bcd7ee', intro:'Cyril volta todas as noites para conversar sobre livros que leu há muitos anos.', favorites:['lavanda','hortela','baunilha','solsticio'], line:'É reconfortante ser lembrado, mesmo que seja só pelo pedido de sempre.', bond:'Cyril descobre que algumas lembranças continuam vivas quando são compartilhadas.' },
  { id:'vale', name:'Sr. Vale', role:'O cliente de sempre', image:'portrait-vale', color:'#bca6cf', intro:'O homem do chapéu aparece nas fotografias do café desde 1953.', favorites:['espresso','violeta','memoria','treze'], line:'Curioso. Ainda fazem esta bebida exatamente como antigamente.', bond:'Vale conta que ajudou Violet a proteger a porta entre duas madrugadas.' },
];

export const chapters = [
  {number:1, title:'As Portas se Abrem', tagline:'Toda madrugada começa com uma xícara.', span:'Noites 1–6', opening:'A chave do café era antiga, mas girou com facilidade. No primeiro bilhete de Violet, Nora encontrou apenas um aviso: “Acenda as luzes à meia-noite. Confie em Nox. E nunca deixe o relógio tocar às 3h13.”', closing:'Quando a sexta madrugada termina, uma estrela desenhada aparece no vidro da janela. Nora reconhece o mesmo símbolo em uma fotografia de Violet.'},
  {number:2, title:'Visitantes Impossíveis', tagline:'Nem todo mundo chega pela porta.', span:'Noites 7–12', opening:'O café parece maior a cada noite. As mesas mudam de posição, a chuva nunca entra e um homem de chapéu pede um café que não aparece no cardápio.', closing:'Dentro da caixa registradora, Nora encontra a cópia de uma conta datada de 1953. O nome do cliente foi apagado.'},
  {number:3, title:'A Hora Suspensa', tagline:'Um relógio parado pode guardar um segredo.', span:'Noites 13–18', opening:'O relógio antigo marca 3h12 há três dias. Nox se recusa a chegar perto dele, enquanto Dudu insiste em dormir exatamente sob o pêndulo.', closing:'Nora descobre que o café protege quem perdeu o caminho de volta. Violet fazia isso há muito mais tempo do que qualquer fotografia poderia explicar.'},
  {number:4, title:'As Cartas de Violet', tagline:'Há verdades que esperam a hora certa.', span:'Noites 19–24', opening:'Uma carta escrita por Violet chega sem remetente. Ela fala de uma porta, um acordo e alguém conhecido apenas como “o décimo terceiro visitante”.', closing:'O Sr. Vale revela que o café nunca pertenceu inteiramente a Violet. Ele existe enquanto alguém se dispõe a acolher os visitantes da madrugada.'},
  {number:5, title:'A Última Xícara', tagline:'O amanhecer não precisa ser uma despedida.', span:'Noites 25–30', opening:'A luz das luminárias começa a enfraquecer. Para manter o café aberto, Nora precisa servir uma última receita, reunir as histórias dos visitantes e escolher continuar a tradição.', closing:'O relógio finalmente alcança 3h13. Nada desaparece. Nora coloca uma xícara na mesa vazia, e uma nova porta se abre para a rua molhada. O Midnight Café encontrou uma nova guardiã.'},
];

export const nightNotes = [
 'Nox observou Nora encontrar o primeiro grão de café num pote etiquetado à mão.',
 'Dudu dormiu sobre o avental que deveria ter sido lavado.',
 'Uma cliente deixou um desenho de lua no guardanapo.',
 'O perfume de lavanda permaneceu muito depois que a última cadeira ficou vazia.',
 'Ravi tocou uma melodia que parecia conhecer o nome de Nora.',
 'Uma estrela apareceu no vidro, mesmo com as cortinas fechadas.',
 'Havia uma pegada molhada no chão, mas a porta estava trancada.',
 'O homem do chapéu chegou antes de Nora acender as luzes.',
 'Elara trouxe uma receita que só podia ser lida à meia-noite.',
 'Dudu encontrou um envelope sob a mesa perto da janela.',
 'O café ganhou uma luminária que ninguém se lembra de ter comprado.',
 'Um recibo de 1953 apareceu na caixa registradora.',
 'Às 3h12, todos os relógios fizeram silêncio ao mesmo tempo.',
 'Cyril reconheceu a letra de Violet no livro de receitas.',
 'Nox ficou parado diante do relógio, com o pelo eriçado.',
 'Lume jurou ter visto uma constelação dentro da xícara.',
 'Uma cadeira estava quente, embora ninguém tivesse se sentado nela.',
 'O ponteiro avançou pela primeira vez em muitos anos.',
 'Ravi encontrou uma partitura escondida sob o piano antigo.',
 'O cheiro de baunilha trouxe uma lembrança de infância para Nora.',
 'O Sr. Vale deixou uma flor prensada entre duas páginas.',
 'Uma carta de Violet chegou sem carimbo e sem endereço.',
 'Dudu acompanhou uma sombra até a estante do fundo.',
 'Os visitantes brindaram a uma ausência que ainda se parecia com presença.',
 'O lampião do café se acendeu antes de meia-noite.',
 'Elara disse que até os feitiços precisam de descanso.',
 'Cyril encontrou seu próprio nome em uma lista esquecida.',
 'Lume prometeu mostrar a Nora uma estrela que tem cheiro de canela.',
 'A última página do livro amanheceu preenchida por uma receita nova.',
 'O relógio marcou 3h13. Pela primeira vez, Nora não teve medo do som.'
];

export const upgrades = [
 {id:'moedor',name:'Moedor de precisão',icon:'⚙',cost:55,detail:'Torna o ponto ideal de extração mais generoso.'},
 {id:'chaleira',name:'Chaleira encantada',icon:'♨',cost:85,detail:'Diminui a velocidade do medidor de preparo.'},
 {id:'bancada',name:'Bancada ampliada',icon:'✧',cost:115,detail:'Aumenta as gorjetas recebidas.'},
 {id:'prateleira',name:'Prateleira de especiarias',icon:'❋',cost:145,detail:'Mostra uma dica extra sobre a receita atual.'},
 {id:'xicara',name:'Louça de porcelana',icon:'☕',cost:175,detail:'Melhora a recompensa dos pedidos excelentes.'},
 {id:'relogio',name:'Relógio restaurado',icon:'◷',cost:215,detail:'O preparo fica mais tranquilo nas noites avançadas.'},
];
export const decorations = [
 {id:'poltrona',name:'Poltrona de veludo',icon:'🛋',cost:45,detail:'Um lugar perfeito para histórias longas.'},
 {id:'luminaria',name:'Luminária âmbar',icon:'✦',cost:70,detail:'Uma luz acolhedora para quem chega da chuva.'},
 {id:'vaso',name:'Jardim de bolso',icon:'🪴',cost:95,detail:'O verde que faltava perto da janela.'},
 {id:'estante',name:'Estante de memórias',icon:'📚',cost:125,detail:'Livros para visitantes de todas as épocas.'},
 {id:'tapete',name:'Tapete de constelações',icon:'✧',cost:160,detail:'Um pequeno céu sob os pés dos clientes.'},
 {id:'cama',name:'Caminha do Dudu',icon:'🐾',cost:195,detail:'A melhor vista do café para um cochilo.'},
];

export const clues = [
 {id:'recibo',name:'O recibo de 1953',icon:'🧾',minNight:8,location:'Caixa registradora',hint:'Volte à caixa depois da oitava noite.',text:'MIDNIGHT CAFÉ · MESA 13 · UMA XÍCARA, SEM NOME · 03:13. No verso, um carimbo quase apagado: ARQUIVO 13.'},
 {id:'relogio',name:'O ponteiro imóvel',icon:'🕰',minNight:14,location:'Relógio antigo',hint:'Observe o relógio depois da décima quarta noite.',text:'Atrás do mostrador, uma pequena gravação: “O tempo não é inimigo de quem encontra abrigo.”'},
 {id:'carta',name:'A última carta de Violet',icon:'✉',minNight:22,location:'Estante de Violet',hint:'Procure entre os livros depois da vigésima segunda noite.',text:'“Nora, se estiver lendo isto, encontrou as pessoas que eu esperava. Não guarde a luz para si. Deixe uma xícara pronta para quem ainda procura a porta.”'},
];

const a = (id, title, desc, symbol, condition) => ({id,title,desc,symbol,condition});
export const achievements = [
 a('primeira-xicara','Primeira xícara','Sirva sua primeira bebida.','☕',s=>s.stats.served>=1),
 a('portas-abertas','Portas abertas','Conclua a primeira noite.','☾',s=>s.nightUnlocked>=2),
 a('cinco-madrugadas','Hábito noturno','Conclua cinco noites.','✧',s=>s.nightUnlocked>=6),
 a('quinze-madrugadas','A casa nunca dorme','Conclua quinze noites.','✦',s=>s.nightUnlocked>=16),
 a('trinta-madrugadas','Uma casa para todos','Conclua as trinta noites.','♜',s=>s.nightUnlocked>=31),
 a('primeira-perfeita','Serviço impecável','Receba três estrelas em uma noite.','★',s=>Object.values(s.bestStars).some(x=>x===3)),
 a('dez-perfeitas','Noites de ouro','Consiga três estrelas em dez noites.','✯',s=>Object.values(s.bestStars).filter(x=>x===3).length>=10),
 a('todas-perfeitas','Céu de trinta estrelas','Obtenha três estrelas nas trinta noites.','✵',s=>Object.values(s.bestStars).filter(x=>x===3).length>=30),
 a('trinta-pedidos','Balcão movimentado','Sirva trinta bebidas.','♨',s=>s.stats.served>=30),
 a('cem-pedidos','Mãos de barista','Sirva cem bebidas.','✿',s=>s.stats.served>=100),
 a('dez-sem-erros','Doce precisão','Conclua dez noites sem errar pedidos.','❀',s=>s.stats.flawlessNights>=10),
 a('cinco-receitas','Primeiras páginas','Prepare cinco receitas diferentes.','▤',s=>Object.keys(s.stats.recipesMade).length>=5),
 a('todas-receitas','Livro completo','Prepare todas as vinte receitas.','📖',s=>recipes.every(r=>s.stats.recipesMade[r.id])),
 a('receita-treze','A xícara esquecida','Prepare a receita secreta Nº 13.','13',s=>!!s.stats.recipesMade.treze),
 a('primeiro-amigo','Pode ficar mais um pouco','Alcance amizade com um cliente.','♡',s=>clients.some(c=>(s.affinity[c.id]||0)>=5)),
 a('todos-amigos','A mesa de sempre','Faça amizade com os cinco clientes.','♥',s=>clients.every(c=>(s.affinity[c.id]||0)>=5)),
 a('dudu','Amigo de quatro patas','Faça carinho no Dudu.','🐾',s=>s.stats.petDudu>=1),
 a('nox','Olhos de âmbar','Faça carinho no Nox.','🐈',s=>s.stats.petNox>=1),
 a('carinhos','Patinhas da madrugada','Faça carinho dez vezes em cada mascote.','♣',s=>s.stats.petDudu>=10&&s.stats.petNox>=10),
 a('melhoria','Pequeno investimento','Compre sua primeira melhoria.','⚙',s=>s.upgrades.length>=1),
 a('melhorias','Café dos sonhos','Compre todas as melhorias.','✪',s=>s.upgrades.length===upgrades.length),
 a('decoracao','Toque pessoal','Compre sua primeira decoração.','❁',s=>s.decor.length>=1),
 a('decoracoes','De portas abertas','Complete a coleção de decoração.','♧',s=>s.decor.length===decorations.length),
 a('recibo','Conta antiga','Encontre o recibo de 1953.','⌕',s=>s.clues.includes('recibo')),
 a('ponteiro','Três e treze','Descubra a inscrição do relógio.','◷',s=>s.clues.includes('relogio')),
 a('violet','Querida Nora','Encontre a última carta de Violet.','✉',s=>s.clues.includes('carta')),
 a('pistas','Arquivo aberto','Descubra as três pistas secretas.','⌘',s=>s.clues.length===clues.length),
 a('visitas','Todo mundo conhece Nora','Atenda todos os cinco clientes diferentes.','♙',s=>clients.every(c=>(s.stats.clientOrders[c.id]||0)>0)),
 a('final','O café permanece','Assista ao final da história.','☼',s=>s.endingSeen),
 a('platina','A Última Xícara da Noite','Desbloqueie todas as outras conquistas.','🏆',s=>achievements.slice(0,-1).every(item=>s.achievements.includes(item.id))),
];

export const art = name => `/art/${name}.webp`;
export const chapterForNight = night => Math.min(5, Math.max(1, Math.ceil(night/6)));
export const availableRecipes = (night, state) => recipes.filter(recipe => recipe.chapter<=chapterForNight(night) && (!recipe.secret || state.clues.includes('recibo')));
export const recipeById = id => recipes.find(recipe=>recipe.id===id);
export const clientById = id => clients.find(client=>client.id===id);
export const ingredientById = id => ingredients.find(item=>item.id===id);
export const chapterByNumber = n => chapters[n-1];
