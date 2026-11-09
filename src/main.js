import { ingredients, recipes, finishes, clients, chapters, nightNotes, upgrades, decorations, clues, achievements, art, chapterForNight, chapterByNumber, availableRecipes, recipeById, clientById, ingredientById } from './data.js';
import { newSave, readSave, writeSave, clearSave, serializeSave, parseSave, unlockAchievements, makeNightOrders, openNight, practiceRecipe, currentOrder, beginOrders, addIngredient, removeIngredient, startExtraction, stopExtraction, setFinish, serve, nextVisitor, leaveSession, buyUpgrade, buyDecoration, pet, discoverClue, seeEnding, completion } from './game.js';
import { playTone, syncMusic } from './audio.js';

const mount=document.getElementById('app');
let save=readSave();
let screen='home';
let modal=null;
let toast=null;
let toastTimer=null;
let meterFrame=null;
let meterPosition=0;
let chapterTab=1;
let lastPet='';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=(n)=>({moon:'☾',cup:'☕',star:'✦',paw:'🐾',book:'▤',secret:'⌕',coin:'◈',close:'×',sound:'♫'}[n]||n);
const stars=n=>`<span class="stars" aria-label="${n} de 3 estrelas">${'★'.repeat(n)}<span>${'☆'.repeat(3-n)}</span></span>`;
const currency=n=>`${Math.floor(n).toLocaleString('pt-BR')} ✦`;
const btn=(label,action,cls='',attrs='')=>`<button type="button" class="btn ${cls}" data-action="${action}" ${attrs}>${label}</button>`;
const src=name=>art(name);
function notification(message){
 toast=message;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast=null;document.querySelector('.toast')?.remove();},4000);
}
function sound(type='tap'){playTone(type,save.options.sound);}
function commit(before=[]){
 const newly=unlockAchievements(save).filter(a=>!before.includes(a.id));
 writeSave(save);
 if(newly.length) {sound('achievement');notification(newly.at(-1).id==='platina'?'🏆 PLATINA! A Última Xícara da Noite':`✦ Conquista desbloqueada: ${newly.at(-1).title}${newly.length>1?` (+${newly.length-1})`:''}`);}
 render();
}
function mutate(callback,signal='tap'){
 const before=[...save.achievements];
 try{const result=callback();if(result===false){sound('bad');render();return;}sound(signal);commit(before);}catch(err){notification(err.message||'Algo não deu certo.');sound('bad');render();}
}
function go(s){screen=s;modal=null;sound();render();window.scrollTo({top:0,behavior:save.options.reducedMotion?'instant':'smooth'});}
function render(){
 cancelAnimationFrame(meterFrame);meterFrame=null;
 mount.innerHTML=`${header()}<main class="app-main">${page()}</main>${footer()}${modal?modalHtml():''}${toast?`<div class="toast" role="status">${e(toast)}</div>`:''}`;
 if(save.session?.stage==='extraction'&&screen==='service')startMeter();
 document.body.classList.toggle('reduced-motion',save.options.reducedMotion);
 syncMusic(save.options.music);
}
function header(){
 const links=[['home','Início'],['cafe','O café'],['nights','Capítulos'],['recipes','Receitas'],['clients','Clientes'],['shop','Decoração'],['achievements','Conquistas']];
 return `<header class="header"><div class="header-inner"><button class="wordmark" data-action="go" data-screen="home" aria-label="Midnight Café — início"><span class="brand-moon">☾</span><span>MIDNIGHT <b>CAFÉ</b></span></button><nav class="nav" aria-label="Navegação principal">${links.map(([s,label])=>`<button data-action="go" data-screen="${s}" class="${screen===s?'active':''}">${label}</button>`).join('')}</nav><div class="header-right"><span class="money" title="Moedas de âmbar">◈ ${Math.floor(save.coins)}</span>${save.session?`<button class="resume" data-action="go" data-screen="service">↗ Pedido aberto</button>`:''}<button class="icon-button" data-action="go" data-screen="settings" title="Configurações" aria-label="Configurações">⚙</button></div></div></header>`;
}
function footer(){return `<footer class="footer"><div class="footer-inner"><div class="footbrand">☾ MIDNIGHT CAFÉ <small>Algumas histórias só são contadas depois da meia-noite.</small></div><div class="footlinks"><span>Desenvolvido por Luana Figueiredo</span><a href="mailto:luanafigueiredo.dev@gmail.com">E-mail</a><a href="https://github.com/luanafigdev" target="_blank" rel="noopener noreferrer">GitHub</a></div></div></footer>`;}
function page(){switch(screen){case 'home':return home();case 'cafe':return cafe();case 'nights':return nights();case 'service':return service();case 'recipes':return recipeBook();case 'clients':return clientBook();case 'shop':return shop();case 'achievements':return awards();case 'journal':return journal();case 'settings':return settings();case 'ending':return ending();default:return home();}}
function sectionTitle(kicker,title,desc){return `<div class="section-header"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${desc}</p></div><div class="ornament">☾ ✧</div></div>`;}
function home(){
 const next=Math.min(30,save.nightUnlocked),total=completion(save);
 return `<section class="hero"><div class="hero-content"><div class="eyebrow light">✦ A HISTÓRIA DE UM CAFÉ QUE NÃO DORME</div><h1>Midnight<br/><em>Café</em><span class="tiny-star"> ✧</span></h1><p class="hero-tag">Algumas histórias só são contadas<br>depois da meia-noite.</p><p class="hero-description">Entre o aroma de café, a chuva e os segredos da madrugada, Nora encontrou um lugar para quem precisa de abrigo.</p><div class="hero-buttons">${btn(save.session?'Continuar atendimento →':save.nightUnlocked>1?'Continuar jornada →':'Começar jornada →',save.session?'resume':'start-next','primary')}${btn('Explorar o café','go','ghost','data-screen="cafe"')}</div><div class="hero-scroll">✧ &nbsp; Prepare. Acolha. Descubra. &nbsp; ✧</div></div><div class="hero-art"><img src="${src('facade')}" alt="Fachada iluminada do Midnight Café numa noite chuvosa"><div class="hero-label">ABERTO DAS 00H ÀS 06H <span>◈</span></div></div><div class="hero-portrait"><img src="${src('nora')}" alt="Nora, Nox e Dudu juntos no balcão"></div></section>
 <section class="below-hero"><div class="intro-card"><div class="eyebrow">✧ BEM-VINDA À MADRUGADA</div><h2>Um café para quem ainda<br><em>não encontrou seu lugar.</em></h2><p>Nora herdou o antigo café de sua tia-avó Violet. Nox conhece todos os cantos da casa; Dudu recebe cada visitante com alegria. E um relógio parado às 3h13 guarda uma história que ninguém quer contar.</p><div class="progress-summary"><div><strong>${Math.min(30,save.nightUnlocked-1)}<small>/30</small></strong><span>Noites descobertas</span></div><div><strong>${total.recipes}<small>/20</small></strong><span>Receitas preparadas</span></div><div><strong>${total.awards}<small>/30</small></strong><span>Conquistas</span></div></div>${btn('Abrir o diário de Nora','go','text','data-screen="journal"')}</div>
 <div class="feature-cards"><button class="feature-card" data-action="go" data-screen="recipes"><div class="feature-icon">☕</div><h3>Receitas encantadas</h3><p>Descubra combinações, prepare bebidas de verdade e ganhe a confiança dos visitantes.</p><span>Ver o livro →</span></button><button class="feature-card" data-action="go" data-screen="clients"><div class="feature-icon">✉</div><h3>Histórias para contar</h3><p>Conheça estrelas, fantasmas, bruxas e um cliente que parece desafiar o tempo.</p><span>Conhecer clientes →</span></button><button class="feature-card" data-action="go" data-screen="achievements"><div class="feature-icon">🏆</div><h3>A última xícara</h3><p>Trinta conquistas e uma platina esperam quem desvendar todos os segredos.</p><span>Ver conquistas →</span></button></div></section>
 <section class="pets-ribbon"><div><div class="eyebrow">OS MASCOTES DO CAFÉ</div><h2>Companhia para todas as noites.</h2><p>Os pequenos guardiões do café também têm seu lugar na história.</p></div><div class="pet-mini"><img src="${src('pet-nox')}" alt="Nox, o gato preto"><div><strong>Nox</strong><small>Guardião dos segredos</small></div>${btn('Fazer carinho ♡','pet','small','data-pet="nox"')}</div><div class="pet-mini"><img src="${src('pet-dudu')}" alt="Dudu, um shih-tzu preto e branco"><div><strong>Dudu</strong><small>Alegria de quatro patas</small></div>${btn('Fazer carinho ♡','pet','small','data-pet="dudu"')}</div></section>`;
}
function decorInRoom(){
 const views=[['poltrona','🛋','poltrona'],['luminaria','✦','luminaria'],['vaso','🪴','vaso'],['estante','📚','estante'],['tapete','✧','tapete'],['cama','🐾','cama']];
 return `<div class="scene-decorations" aria-label="Decorações adquiridas">${views.filter(v=>save.decor.includes(v[0])).map(v=>`<span class="decor-${v[2]}" title="${decorations.find(d=>d.id===v[0]).name}">${v[1]}</span>`).join('')}</div>`;
}
function cafe(){const next=Math.min(30,save.nightUnlocked);return `<div class="page-wrap">${sectionTitle('☾ O CORAÇÃO DO MIDNIGHT CAFÉ','Onde toda história começa','O balcão está preparado. A chuva lá fora continua, e o primeiro cliente pode chegar a qualquer momento.')}
 <div class="cafe-layout"><div class="cafe-panel"><div class="cafe-image"><img src="${src('cafe')}" alt="Interior aconchegante do café, com Nora atrás do balcão">${decorInRoom()}<div class="cafe-floating">${save.nightUnlocked>=31?'A história principal foi concluída':`Próxima noite · ${String(next).padStart(2,'0')}/30`}</div></div><div class="cafe-body"><div class="eyebrow">NO BALCÃO</div><h2>“Mais uma noite no Midnight Café...”</h2><p>A chaleira está quente, as luzes estão acesas e há espaço para mais uma história.</p><div class="button-row">${btn(save.session?'Retomar pedido →':save.nightUnlocked>=31?'Revisitar a noite 30':'Abrir o café →',save.session?'resume':'start-next','primary')}${btn('Escolher uma noite','go','ghost','data-screen="nights"')}</div></div></div>
 <aside class="cafe-aside"><div class="paper-panel"><h3>✧ Os companheiros de Nora</h3>${petRow('nox','Nox','O silencioso observador da madrugada.')}${petRow('dudu','Dudu','Um shih-tzu preto e branco que recebe todo mundo com alegria.')}<p class="panel-note">Dica: interaja com os mascotes para descobrir uma conquista especial.</p></div><div class="paper-panel hints-panel"><h3>⌕ Segredos do café</h3><p>Violet deixou pistas entre objetos comuns. Alguns só revelam algo depois de certas noites.</p>${clues.map(c=>`<button class="clue-button ${save.clues.includes(c.id)?'found':''}" data-action="clue" data-id="${c.id}"><span>${c.icon}</span><span><strong>${c.location}</strong><small>${save.clues.includes(c.id)?'Pista descoberta':`Investigar · ${c.hint}`}</small></span><span>↗</span></button>`).join('')}</div></aside></div></div>`;}
function petRow(id,name,desc){return `<div class="pet-row ${lastPet===id?'petted':''}"><img src="${src(id==='nox'?'pet-nox':'pet-dudu')}" alt="${name}"><div><strong>${name}</strong><p>${desc}</p></div><button class="small-heart" data-action="pet" data-pet="${id}" title="Fazer carinho no ${name}" aria-label="Fazer carinho no ${name}">♡</button></div>`;}
function nights(){return `<div class="page-wrap">${sectionTitle('☾ DIÁRIO DAS MADRUGADAS','Trinta noites, uma história','Revise qualquer noite já aberta para melhorar suas estrelas. Capítulos novos se abrem conforme você joga.')}
 <div class="chapter-tabs">${chapters.map(ch=>`<button class="chapter-tab ${chapterTab===ch.number?'on':''}" data-action="chapter-tab" data-chapter="${ch.number}"><span>${String(ch.number).padStart(2,'0')}</span>${e(ch.title)}${save.nightUnlocked<(ch.number-1)*6+1?'<small>🔒</small>':''}</button>`).join('')}</div>
 ${chapters.filter(c=>c.number===chapterTab).map(c=>`<section class="chapter-detail"><div class="chapter-heading"><div class="eyebrow">CAPÍTULO ${c.number} · ${c.span.toUpperCase()}</div><h2>${e(c.title)}</h2><p>${e(c.tagline)}</p><blockquote>“${e(c.opening)}”</blockquote></div><div class="night-grid">${Array.from({length:6},(_,i)=>(c.number-1)*6+i+1).map(n=>`<button class="night-card ${n>save.nightUnlocked?'locked':save.bestStars[n]?'finished':'next'}" data-action="start-night" data-night="${n}" ${n>save.nightUnlocked?'disabled':''}><span class="night-card-top">${n>save.nightUnlocked?'🔒':save.bestStars[n]?'✧':'☾'} <small>NOITE ${String(n).padStart(2,'0')}</small></span><strong>${e(nightNotes[n-1].split(' ').slice(0,5).join(' '))}…</strong>${save.bestStars[n]?stars(save.bestStars[n]):`<span class="small-label">${n>save.nightUnlocked?'Bloqueada':'Começar →'}</span>`}</button>`).join('')}</div></section>`).join('')}
 <div class="inline-callout">✦ Cada noite tem seus próprios pedidos. Se quiser tentar novamente por três estrelas, escolha a noite no mapa e jogue outra vez.</div></div>`;}
function service(){const q=save.session;if(!q)return `<div class="page-wrap empty-state"><div class="eyebrow">SEM PEDIDOS ABERTOS</div><h1>O balcão está descansando.</h1>${btn('Voltar ao café','go','primary','data-screen="cafe"')}</div>`;
 const order=currentOrder(save),recipe=order?recipeById(order.recipeId):null,client=order?clientById(order.clientId):null;
 if(q.stage==='intro')return `<div class="story-screen"><div class="story-backdrop"></div><div class="story-paper"><div class="eyebrow">${q.mode==='practice'?'LIVRO DE RECEITAS':`NOITE ${String(q.night).padStart(2,'0')} · CAPÍTULO ${chapterForNight(q.night)}`}</div><h1>${q.mode==='practice'?'Um momento de prática':e(chapterByNumber(chapterForNight(q.night)).title)}</h1><div class="story-line">${q.night===1?'A chave girou na fechadura. Nox observava da janela. Dudu estava dormindo no tapete, completamente alheio ao mistério.':e(nightNotes[q.night-1])}</div><p>${e(chapterByNumber(chapterForNight(q.night)).opening)}</p><p class="dialogue-em">Nora: “Certo... Uma xícara de cada vez.”</p>${btn('Abrir as portas do café →','begin-orders','primary')}</div></div>`;
 if(q.stage==='summary')return summary();
 const stepIndex={ingredients:1,extraction:2,finish:3,result:4}[q.stage]||1;
 return `<div class="page-wrap service-page"><div class="service-top"><div><div class="eyebrow">${q.mode==='practice'?'ATELIÊ DE BEBIDAS':`NOITE ${String(q.night).padStart(2,'0')} · PEDIDO ${q.index+1} DE ${q.orders.length}`}</div><h1>${q.mode==='practice'?'Praticando receitas':'Preparando um pedido'}</h1></div><div class="progress-dots">${[1,2,3,4].map((num)=>`<span class="${stepIndex===num?'current':stepIndex>num?'done':''}" title="Etapa ${num}">${num}</span>`).join('')}</div></div><div class="service-grid"><div class="service-story"><div class="service-scene"><img src="${src('cafe')}" alt="Balcão do Midnight Café"><span class="scene-clock">☾ 00:${String((q.index*9+14)%60).padStart(2,'0')}</span></div><div class="visitor-card"><img src="${src(client.image)}" alt="${e(client.name)}"><div><span class="eyebrow">CLIENTE DA MADRUGADA</span><h2>${e(client.name)}</h2><p>“${e(q.stage==='result'?(q.results.at(-1)?.quality===3?'Está perfeito. Era exatamente o que eu precisava.':q.results.at(-1)?.quality===2?'Que gentileza. Acho que da próxima vez podemos ajustar um detalhe.':'Obrigada por tentar. Talvez possamos experimentar outra combinação.') :client.line)}”</p><small>${e(client.role)}</small></div></div><div class="order-ticket"><div><span>✦ BILHETE DO BALCÃO</span><strong>${e(recipe.name)}</strong><small>${e(recipe.text)}</small></div><button data-action="recipe-details" data-id="${recipe.id}" title="Ver ficha da receita">▤ Receita ↗</button></div><div class="served-count">${q.results.length?`${q.results.length} pedido(s) servido(s) nesta noite · ${q.results.reduce((a,b)=>a+b.reward,0)} moedas`: 'A próxima história começa com a bebida certa.'}</div></div><div class="station-panel">${serviceStep(q,recipe)}</div></div></div>`;
}
function serviceStep(q,recipe){
 if(q.stage==='ingredients')return `<div class="station-heading"><div class="eyebrow">ETAPA 1 DE 3</div><h2>Escolha os ingredientes</h2><p>Use o livro para conferir a receita. Toque nos ingredientes para adicioná-los à xícara.</p></div><div class="cup-workspace"><div class="cup-icon">☕<span>✦</span></div><div><small>NA XÍCARA</small><div class="chosen-ingredients">${q.items.map((id,i)=>`<button data-action="remove-ingredient" data-index="${i}" title="Remover ${e(ingredientById(id).name)}">${ingredientById(id).icon} ${e(ingredientById(id).name)} <span>×</span></button>`).join('')||'<em>Nenhum ingrediente ainda...</em>'}</div></div></div>${save.upgrades.includes('prateleira')?`<div class="ingredient-tip">✧ Prateleira de especiarias: ${recipe.items.map(id=>ingredientById(id).name).join(' + ')}</div>`:''}<div class="ingredient-grid">${ingredients.map(item=>`<button class="ingredient" data-action="ingredient" data-id="${item.id}" ${q.items.length>=5?'disabled':''}><span>${item.icon}</span><strong>${e(item.name)}</strong></button>`).join('')}</div><div class="station-footer">${btn('Abrir a receita','recipe-details','ghost','data-id="'+recipe.id+'"')}${btn('Preparar a bebida →','start-extraction','primary',q.items.length?'':'disabled')}</div>`;
 if(q.stage==='extraction')return `<div class="station-heading"><div class="eyebrow">ETAPA 2 DE 3</div><h2>O ponto de extração</h2><p>O marcador se move. Pare quando chegar à faixa dourada para conseguir a extração perfeita.</p></div><div class="extraction-visual"><img src="${src('cup')}" alt="Xícara de cappuccino com arte de leite"><div class="steam steam1">∿</div><div class="steam steam2">∿</div></div><div class="heat-panel"><div class="heat-labels"><span>Suave</span><strong>Extração</strong><span>Forte</span></div><div class="heat-track" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(meterPosition)}"><span class="heat-perfect"></span><i id="heat-marker" style="left:${meterPosition}%"></i></div><p class="panel-note">${save.options.relaxed?'Modo tranquilo · movimento mais lento':'Modo clássico · atenção ao ponto de preparo'}</p></div><div class="station-footer">${btn('Parar no ponto certo!','stop-extraction','primary block')}</div>`;
 if(q.stage==='finish')return `<div class="station-heading"><div class="eyebrow">ETAPA 3 DE 3</div><h2>O toque final</h2><p>Uma bebida bonita também pode contar uma história. Escolha a finalização.</p></div><div class="finish-preview"><img src="${src('cup')}" alt="Bebida quente recém-preparada"><div><span>☾</span><strong>${e(recipe.name)}</strong><small>${q.heat===3?'Extração no ponto certo':q.heat===2?'Extração equilibrada':'Extração intensa'}</small></div></div><div class="finish-grid">${finishes.map(item=>`<button class="finish-choice ${q.finish===item?'selected':''}" data-action="finish" data-id="${e(item)}">${item==='Sem cobertura'?'◌':'✧'} ${e(item)}</button>`).join('')}</div><div class="station-footer">${btn('Servir a bebida ☕','serve','primary block',q.finish?'':'disabled')}</div>`;
 if(q.stage==='result'){const last=q.results.at(-1);return `<div class="result-screen"><div class="result-symbol">${last.quality===3?'✦':last.quality===2?'☾':'♡'}</div><div class="eyebrow">PEDIDO ENTREGUE</div><h2>${last.quality===3?'Uma bebida perfeita!':last.quality===2?'Uma boa xícara!':'Um gesto de carinho!'}</h2>${stars(last.quality)}<p>${last.quality===3?'O sabor, o tempo e o cuidado estavam em perfeita harmonia.':last.quality===2?'Seu cliente gostou, mas alguns detalhes poderiam melhorar.':'Todo barista aprende experimentando. A próxima xícara pode ser ainda melhor.'}</p><div class="result-details"><span>Ingredientes ${last.ingredientsExact?'✓':'—'}</span><span>Extração ${last.heat===3?'✓':'~'}</span><span>Finalização ${last.finishing?'✓':'—'}</span></div><div class="result-coins">${q.mode==='practice'?'Receita registrada no seu livro':`+ ${last.reward} moedas de âmbar`}</div>${btn(q.index+1>=q.orders.length?'Ver resultado da noite →':'Próximo cliente →','next-visitor','primary block')}</div>`;}
 return '';
}
function summary(){const q=save.session,chapter=chapterByNumber(chapterForNight(q.night));return `<div class="page-wrap recap"><div class="recap-card"><div class="eyebrow">${q.mode==='practice'?'PRÁTICA CONCLUÍDA':`NOITE ${String(q.night).padStart(2,'0')} ENCERRADA`}</div><div class="recap-icon">✧</div><h1>${q.mode==='practice'?'Uma nova receita praticada':'As luzes continuam acesas'}</h1><p>${q.mode==='practice'?'Uma boa receita começa com curiosidade e prática.':e(nightNotes[q.night-1])}</p>${q.mode==='campaign'?`<div class="recap-stars">${stars(q.stars)}</div><div class="recap-stats"><div><strong>${q.results.length}</strong><span>Pedidos servidos</span></div><div><strong>${q.results.reduce((x,r)=>x+r.reward,0)}</strong><span>Moedas ganhas</span></div><div><strong>+${q.bonus}</strong><span>Bônus da noite</span></div></div><blockquote>“${e(q.night%6===0?chapter.closing:chapter.tagline)}”</blockquote>`:''}<div class="button-row center">${btn(q.mode==='practice'?'Voltar ao café':'Voltar ao café','leave-session','primary')}${q.night===30&&q.mode==='campaign'?btn('Ver o epílogo','open-ending','ghost'):''}</div></div></div>`;}
function recipeBook(){const all=availableRecipes(Math.min(save.nightUnlocked,30),save),discovered=new Set(all.map(r=>r.id));return `<div class="page-wrap">${sectionTitle('☾ O LIVRO DE VIOLET','Receitas para noites extraordinárias','Cada nova página abre com a história. Prepare bebidas no modo de prática para descobrir suas combinações.')}
 <div class="book-banner"><div class="eyebrow">LIVRO DE RECEITAS</div><h2>${Object.keys(save.stats.recipesMade).length} de ${recipes.length} receitas preparadas</h2><p>Quando estiver em dúvida durante um pedido, consulte esta coleção. A receita Nº 13 permanece escondida até encontrar a primeira pista.</p></div><div class="recipe-grid">${recipes.map(r=>{
 const unlocked=discovered.has(r.id);const made=save.stats.recipesMade[r.id]||0;
 return `<article class="recipe-card ${!unlocked?'locked':''}"><div class="recipe-top"><span class="recipe-number">Nº ${String(r.number).padStart(2,'0')}</span><span class="recipe-icon">${unlocked?'☕':'🔒'}</span><span class="recipe-status">${made?'✓ Preparada':unlocked?'Disponível':'Bloqueada'}</span></div><h3>${unlocked?e(r.name):'Receita desconhecida'}</h3><p>${unlocked?e(r.text):r.secret?'Encontre o recibo de 1953 para revelar esta receita.':`Disponível no capítulo ${r.chapter}.`}</p>${unlocked?`<div class="recipe-ingredients">${r.items.map(id=>`<span>${ingredientById(id).icon} ${e(ingredientById(id).name)}</span>`).join('')}</div><div class="recipe-base">Finalização: <strong>${e(r.finish)}</strong></div><div class="recipe-actions">${btn('Ver detalhes','recipe-details','small ghost','data-id="'+r.id+'"')}${btn('Praticar ↗','practice','small','data-id="'+r.id+'" '+(save.session?'disabled':''))}</div>`:`<div class="small-label">✧ Uma descoberta ainda por vir</div>`}</article>`;}).join('')}</div></div>`;}
function clientBook(){return `<div class="page-wrap">${sectionTitle('☾ QUEM PASSA POR AQUI','Os visitantes da madrugada','Cada um traz uma história. Sirva suas bebidas preferidas para conquistar confiança e descobrir mais sobre sua vida.')}
 <div class="client-grid">${clients.map(c=>{const friendship=save.affinity[c.id]||0, met=(save.stats.clientOrders[c.id]||0)>0;return `<article class="client-profile"><div class="client-portrait"><img src="${src(c.image)}" alt="Retrato de ${e(c.name)}"></div><div class="client-info"><div class="eyebrow">${met?'VISITANTE CONHECIDO':'VISITANTE A DESCOBRIR'}</div><h2>${e(c.name)}</h2><small>${e(c.role)}</small><p>${met?e(c.intro):'Uma nova história espera no balcão.'}</p><div class="affinity-label"><span>Vínculo</span><span>${Math.min(5,friendship)} / 5 ${friendship>=5?'♥':''}</span></div><div class="affinity-track"><i style="width:${Math.min(100,friendship*20)}%"></i></div>${friendship>=5?`<blockquote>${e(c.bond)}</blockquote>`:`<div class="client-hint">${met?'Continue servindo com carinho para descobrir a história.':'Você conhecerá esta pessoa durante as próximas noites.'}</div>`}</div></article>`;}).join('')}</div><div class="mascots-page"><h2>Os dois que nunca faltam</h2><div class="mascot-pair">${petRow('nox','Nox','Um gato preto e silencioso. Conhece todos os segredos do café.')} ${petRow('dudu','Dudu','Shih-tzu preto e branco. Nora sabe que uma madrugada melhora com ele por perto.')}</div></div></div>`;}
function shop(){return `<div class="page-wrap">${sectionTitle('☾ DÊ SUA CARA AO CAFÉ','Melhorias & decoração','Use as moedas ganhas servindo bebidas para renovar os equipamentos e deixar o café ainda mais acolhedor.')}
 <div class="shop-feature"><img src="${src('lounge')}" alt="Sala aconchegante do café, decorada com poltronas de veludo"><div><div class="eyebrow">O CANTINHO FAVORITO DE NORA</div><h2>Pequenos detalhes fazem um lugar virar lar.</h2><div class="owned-decor">${save.decor.length?save.decor.map(id=>decorations.find(d=>d.id===id)?.icon||'✧').join('　'):'Ainda sem novas decorações — escolha a primeira abaixo.'}</div><div class="big-money">◈ ${Math.floor(save.coins)} moedas</div></div></div><div class="shop-heading"><h2>Equipamentos</h2><span>${save.upgrades.length}/${upgrades.length} adquiridos</span></div><div class="shop-grid">${upgrades.map(x=>shopItem(x,'upgrade',save.upgrades.includes(x.id))).join('')}</div><div class="shop-heading"><h2>Decoração</h2><span>${save.decor.length}/${decorations.length} adquiridas</span></div><div class="shop-grid">${decorations.map(x=>shopItem(x,'decor',save.decor.includes(x.id))).join('')}</div></div>`;}
function shopItem(x,kind,owned){return `<article class="shop-item"><span class="shop-icon">${x.icon}</span><h3>${e(x.name)}</h3><p>${e(x.detail)}</p>${btn(owned?'✓ Adquirido':`◈ ${x.cost} · Comprar`,'buy',owned?'owned small':'small',`data-type="${kind}" data-id="${x.id}" ${owned||save.coins<x.cost?'disabled':''}`)}</article>`;}
function awards(){const total=completion(save);return `<div class="page-wrap">${sectionTitle('✦ CONSTELAÇÕES DA MADRUGADA','Conquistas do Midnight Café','Cada xícara, visita e segredo aproxima Nora da última conquista: a platina.')}
 <div class="awards-feature"><div class="award-medal">🏆</div><div><div class="eyebrow">A CONQUISTA FINAL</div><h2>A Última Xícara da Noite</h2><p>Desbloqueie as outras 29 conquistas. A platina aparece automaticamente, sem desafios secretos impossíveis.</p><div class="award-progress"><div><i style="width:${total.awards/30*100}%"></i></div><span>${total.awards} / 30</span></div></div></div>
 <div class="awards-grid">${achievements.map(a=>{const done=save.achievements.includes(a.id);return `<article class="award ${done?'unlocked':''} ${a.id==='platina'?'platinum':''}"><div class="award-icon">${done?a.symbol:'✧'}</div><div><h3>${e(a.title)}</h3><p>${e(a.desc)}</p><span>${done?'✓ Conquistada':'Por desbloquear'}</span></div></article>`;}).join('')}</div></div>`;}
function journal(){return `<div class="page-wrap">${sectionTitle('☾ RECORTES E MEMÓRIAS','O diário de Nora','Uma coleção de acontecimentos, cartas e segredos que ficaram no café depois que os clientes foram embora.')}
 <div class="journal-layout"><div class="journal-main"><div class="eyebrow">A HISTÓRIA DE VIOLET</div><h2>“Deixe uma xícara pronta para quem ainda procura a porta.”</h2>${chapters.map(ch=>{const done=save.nightUnlocked>ch.number*6;const active=save.nightUnlocked>=(ch.number-1)*6+1;return `<div class="journal-chapter"><span>${done?'✦':active?'☾':'🔒'}</span><div><h3>Capítulo ${ch.number} · ${e(ch.title)}</h3><p>${active?e(ch.opening):'Este capítulo ainda não foi descoberto.'}</p>${done?`<blockquote>${e(ch.closing)}</blockquote>`:''}</div></div>`;}).join('')}</div><aside class="journal-aside"><h2>Arquivo de pistas</h2><p>Objetos encontrados nas madrugadas. Algumas pistas talvez levem a outra história...</p>${clues.map(c=>`<article class="journal-clue"><span>${c.icon}</span><div><strong>${save.clues.includes(c.id)?e(c.name):'Pista ainda escondida'}</strong><p>${save.clues.includes(c.id)?e(c.text):e(c.hint)}</p></div></article>`).join('')}${save.endingSeen?`<div class="journal-ending">✧ A história principal foi concluída. Mas o café continuará abrindo suas portas.</div>`:''}</aside></div></div>`;}
function settings(){return `<div class="page-wrap narrow-page">${sectionTitle('☾ UM MOMENTO DE CALMA','Configurações & créditos','Ajuste o ritmo do café e cuide dos seus dados de progresso.')}
 <div class="settings-panel"><h2>Como você quer jogar?</h2>${toggle('relaxed','Modo tranquilo','Marcador de extração mais lento, sem limite de tempo.')}${toggle('sound','Efeitos sonoros','Sons suaves de preparo, interações e conquistas.')}${toggle('music','Música ambiente','Melodia instrumental gerada pelo navegador.')}${toggle('reducedMotion','Reduzir animações','Menos movimentos de fundo e extração acessível.')}</div>
 <div class="settings-panel"><h2>Seu progresso</h2><p>O jogo salva automaticamente neste navegador. Exporte um arquivo para guardar ou transferir suas conquistas para outro computador.</p><div class="button-row">${btn('↓ Exportar progresso','export','ghost')}${btn('↑ Importar progresso','trigger-import','ghost')}<input type="file" id="import-save" accept="application/json,.json" hidden></div><div class="settings-danger">${btn('Recomeçar do zero','reset-confirm','danger')}</div></div>
 <div class="settings-panel credits"><h2>Créditos</h2><p>Midnight Café é uma história sobre acolhimento, escolhas e tudo que pode acontecer quando o mundo desacelera.</p><strong>Desenvolvimento: Luana Figueiredo</strong><p><a href="mailto:luanafigueiredo.dev@gmail.com">luanafigueiredo.dev@gmail.com</a> · <a target="_blank" rel="noopener noreferrer" href="https://github.com/luanafigdev">GitHub</a></p><p class="fine-print">Nora, Dudu, Nox e todos os visitantes fazem parte do universo original de Midnight Café.</p></div></div>`;}
function toggle(key,title,desc){return `<label class="toggle-row"><span><strong>${title}</strong><small>${desc}</small></span><input type="checkbox" data-setting="${key}" ${save.options[key]?'checked':''}><span class="toggle-switch" aria-hidden="true"></span></label>`;}
function ending(){const finished=save.nightUnlocked>=31;return `<div class="story-screen ending-scene"><div class="story-backdrop"></div><div class="story-paper"><div class="eyebrow">EPÍLOGO · A ÚLTIMA XÍCARA</div><h1>O café permanece.</h1><p>O relógio marcou 3h13. Ninguém desapareceu. Elara deixou o chapéu sobre a cadeira; Cyril agradeceu com um aceno; Ravi guardou o violino; Lume acendeu uma pequena estrela na janela.</p><p>Nora serviu uma última xícara para o lugar vazio que Violet costumava ocupar. Dudu adormeceu aos seus pés. Nox, pela primeira vez, pareceu satisfeito.</p><p class="dialogue-em">“Algumas histórias não terminam quando amanhece. Elas apenas encontram outro lugar para florescer.”</p><p>Do lado de fora, a chuva continuava. Na caixa registradora, restava um recibo que não combinava com nenhum pedido: <strong>ARQUIVO 13 — MESA RESERVADA.</strong></p>${finished?btn('Guardar essa memória ♡','finish-ending','primary'):btn('Voltar ao menu','go','primary','data-screen="home"')}</div></div>`;}
function modalHtml(){return `<div class="modal-shade" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-label="${e(modal.title)}"><button class="modal-close" data-action="close-modal" aria-label="Fechar">×</button><div class="eyebrow">MIDNIGHT CAFÉ · NOTAS</div><h2>${e(modal.title)}</h2><div class="modal-text">${modal.body}</div>${modal.actions||btn('Fechar','close-modal','primary')}</section></div>`;}
function showRecipe(id){const r=recipeById(id);if(!r)return;modal={title:r.name,body:`<p>${e(r.text)}</p><div class="recipe-note"><strong>Ingredientes</strong>${r.items.map(id=>`<span>${ingredientById(id).icon} ${e(ingredientById(id).name)}</span>`).join('')}<strong>Finalização</strong><span>${e(r.finish)}</span></div><p class="panel-note">Pare a extração quando o marcador estiver dentro da faixa dourada.</p>`};render();}
function startMeter(){
 const slowed=save.upgrades.includes('chaleira')||save.upgrades.includes('relogio');
 const speed=save.options.relaxed ? 0.95 : 1.55;
 const animate=(now)=>{
  if(screen!=='service'||save.session?.stage!=='extraction')return;
  const t=now/1000*(slowed?speed*.8:speed);meterPosition=save.options.reducedMotion?64:50+48*Math.sin(t);
  const marker=document.getElementById('heat-marker');if(marker)marker.style.left=`${meterPosition}%`;
  const track=document.querySelector('.heat-track');if(track)track.setAttribute('aria-valuenow',String(Math.round(meterPosition)));
  meterFrame=requestAnimationFrame(animate);
 };
 meterFrame=requestAnimationFrame(animate);
}
function downloadSave(){
 const blob=new Blob([serializeSave(save)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download='midnight-cafe-progresso.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function doAction(el){const action=el.dataset.action;if(!action)return;
 const id=el.dataset.id;
 switch(action){
  case 'go':go(el.dataset.screen);break;
  case 'resume':go('service');break;
  case 'start-next':{
   if(save.session){go('service');break;}
   mutate(()=>openNight(save,Math.min(save.nightUnlocked,30)),'bell');screen='service';render();break;
  }
  case 'start-night':if(!save.session){mutate(()=>openNight(save,Number(el.dataset.night)),'bell');screen='service';render();}else{notification('Conclua ou abandone o pedido aberto antes de começar outra noite.');render();}break;
  case 'chapter-tab':chapterTab=Number(el.dataset.chapter);render();break;
  case 'begin-orders':mutate(()=>beginOrders(save),'bell');break;
  case 'ingredient':mutate(()=>addIngredient(save,id),'pour');break;
  case 'remove-ingredient':mutate(()=>removeIngredient(save,Number(el.dataset.index)));break;
  case 'start-extraction':mutate(()=>startExtraction(save),'pour');break;
  case 'stop-extraction':mutate(()=>stopExtraction(save,meterPosition),'bell');break;
  case 'finish':mutate(()=>setFinish(save,id));break;
  case 'serve':mutate(()=>serve(save),'serve');break;
  case 'next-visitor':mutate(()=>nextVisitor(save),'bell');break;
  case 'leave-session':mutate(()=>leaveSession(save));go('cafe');break;
  case 'open-ending':mutate(()=>leaveSession(save));go('ending');break;
  case 'finish-ending':mutate(()=>seeEnding(save),'achievement');go('home');break;
  case 'recipe-details':showRecipe(id);break;
  case 'close-modal':modal=null;render();break;
  case 'practice':mutate(()=>practiceRecipe(save,id),'bell');screen='service';render();break;
  case 'pet':lastPet=el.dataset.pet;mutate(()=>pet(save,el.dataset.pet),'pet');notification(el.dataset.pet==='dudu'?'Dudu abanou o rabinho! 🐾':'Nox fingiu não gostar. ♡');render();break;
  case 'buy':{
   const p=el.dataset.type==='upgrade'?upgrades.find(x=>x.id===id):decorations.find(x=>x.id===id);
   mutate(()=>el.dataset.type==='upgrade'?buyUpgrade(save,id):buyDecoration(save,id),'serve');
   if(p&&save.upgrades.includes(id)||p&&save.decor.includes(id)){notification(`${p.name} já faz parte do café!`);render();}break;
  }
  case 'clue':{
   const c=clues.find(x=>x.id===id);if(!c)return;
   if(save.clues.includes(id)){modal={title:c.name,body:`<p>${e(c.text)}</p>`};render();return;}
   if(save.nightUnlocked<=c.minNight){modal={title:c.location,body:`<p>${e(c.hint)}</p>`};render();return;}
   mutate(()=>discoverClue(save,id),'bell');modal={title:'✦ '+c.name,body:`<p>${e(c.text)}</p><p class="panel-note">Nova pista guardada no Diário de Nora.</p>`};render();break;
  }
  case 'export':downloadSave();notification('Seu progresso foi exportado.');render();break;
  case 'trigger-import':document.getElementById('import-save')?.click();break;
  case 'reset-confirm':modal={title:'Recomeçar do zero?',body:'<p>Esta ação apaga o progresso salvo neste navegador: noites, compras, histórias e conquistas. Antes de continuar, recomendamos exportar seu progresso.</p>',actions:`<div class="button-row">${btn('Cancelar','close-modal','ghost')}${btn('Sim, recomeçar','reset','danger')}</div>`};render();break;
  case 'reset':clearSave();save=newSave();modal=null;screen='home';render();break;
 }
}
mount.addEventListener('click',event=>{
 const target=event.target.closest('[data-action]');if(!target||target.disabled)return;
 if(target.classList.contains('modal-shade') && event.target!==target)return;
 doAction(target);
});
mount.addEventListener('change',async event=>{
 const target=event.target;
 if(target.dataset.setting){save.options[target.dataset.setting]=target.checked;sound();writeSave(save);render();return;}
 if(target.id==='import-save'&&target.files?.[0]){
  try{const text=await target.files[0].text();const incoming=parseSave(text);
   modal={title:'Importar progresso?',body:`<p>O arquivo contém progresso até a noite ${Math.min(30,incoming.nightUnlocked-1)}. Isso substituirá o salvamento atual neste navegador.</p>`,actions:`<div class="button-row">${btn('Cancelar','close-modal','ghost')}${btn('Confirmar importação','import-confirm','primary')}</div>`};
   pendingImport=incoming;render();
  }catch{notification('Não foi possível ler este arquivo.');render();}
 }
});
let pendingImport=null;
function finishImport(){if(!pendingImport)return;save=pendingImport;pendingImport=null;writeSave(save);modal=null;screen='home';notification('Progresso importado com sucesso.');render();}
mount.addEventListener('click',event=>{if(event.target.closest('[data-action="import-confirm"]'))finishImport();});
window.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&modal){modal=null;render();}
 if(event.code==='Space'&&!event.repeat&&save.session?.stage==='extraction'&&screen==='service'){
  event.preventDefault();mutate(()=>stopExtraction(save,meterPosition),'bell');
 }
});
render();
