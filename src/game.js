import { achievements, availableRecipes, chapterForNight, chapters, clients, clientById, decorations, finishes, ingredients, clues, recipes, recipeById, upgrades } from './data.js';

const STORAGE_KEY = 'midnight-cafe-save-v1';
const emptyStats = () => ({served:0, excellent:0, flawlessNights:0, recipesMade:{}, clientOrders:{}, petDudu:0, petNox:0, nightsPlayed:0, earnings:0});
export const newSave = () => ({
  version:1, nightUnlocked:1, bestStars:{}, coins:90, affinity:{}, upgrades:[], decor:[], clues:[],
  achievements:[], stats:emptyStats(), endingSeen:false, session:null,
  options:{music:false, sound:true, relaxed:true, reducedMotion:false},
});

export function normalizeSave(raw) {
  const base=newSave();
  if(!raw || typeof raw!=='object' || raw.version!==1) return base;
  const merged={...base,...raw, stats:{...base.stats,...raw.stats}, options:{...base.options,...raw.options}};
  for(const key of ['upgrades','decor','clues','achievements']) if(!Array.isArray(merged[key])) merged[key]=[];
  if(!merged.affinity || typeof merged.affinity!=='object') merged.affinity={};
  if(!merged.bestStars || typeof merged.bestStars!=='object') merged.bestStars={};
  if(!merged.stats.recipesMade || typeof merged.stats.recipesMade!=='object') merged.stats.recipesMade={};
  if(!merged.stats.clientOrders || typeof merged.stats.clientOrders!=='object') merged.stats.clientOrders={};
  merged.nightUnlocked=Math.max(1,Math.min(31,Number(merged.nightUnlocked)||1));
  merged.coins=Math.max(0,Number(merged.coins)||0);
  return merged;
}

export function readSave() {
  try {return normalizeSave(JSON.parse(localStorage.getItem(STORAGE_KEY)));}
  catch {return newSave();}
}
export function writeSave(state) {try {localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true;} catch {return false;}}
export function clearSave() {try {localStorage.removeItem(STORAGE_KEY);} catch { /* Ignorar bloqueio de armazenamento. */ }}
export function serializeSave(state){return JSON.stringify({...state,session:null},null,2);}
export function parseSave(value){const raw=JSON.parse(value);if(raw?.version!==1 || typeof raw.nightUnlocked!=='number')throw new Error('Arquivo de progresso inválido.');return normalizeSave(raw);}

export function unlockAchievements(s){
  const newly=[];
  for(const award of achievements.slice(0,-1)) {
    if(!s.achievements.includes(award.id) && award.condition(s)) {s.achievements.push(award.id);newly.push(award);}
  }
  const platinum=achievements[achievements.length-1];
  if(!s.achievements.includes(platinum.id) && platinum.condition(s)){s.achievements.push(platinum.id);newly.push(platinum);}
  return newly;
}

const guestPool=night=>night<3?clients.slice(0,2):night<8?clients.slice(0,4):clients;
const visitorsFor = night => night<=3?3:night<=12?4:night<=24?5:6;
const hash = (a,b,c=0) => (a*47+b*19+c*11+17) >>> 0;
export function makeNightOrders(night,s) {
  const pool=guestPool(night), available=availableRecipes(night,s);
  const count=visitorsFor(night);
  return Array.from({length:count},(_,i)=>{
    const client=pool[(night*3+i*7)%pool.length];
    const favorites=client.favorites.map(recipeById).filter(r=>available.some(x=>x.id===r.id));
    const recipe=(i===0 && favorites.length>0 && night%2===0)
      ?favorites[hash(night,i)%favorites.length]:available[hash(night,i,3)%available.length];
    return {clientId:client.id,recipeId:recipe.id,uid:`${night}-${i}`};
  });
}
export function openNight(s,night) {
  if(s.session)throw new Error('Conclua ou abandone a noite atual antes de iniciar outra.');
  if(night>s.nightUnlocked || night<1 || night>30)throw new Error('Esta noite ainda está bloqueada.');
  s.session={mode:'campaign',night,orders:makeNightOrders(night,s),index:0,stage:'intro',items:[],heat:null,finish:null,results:[],settled:false};
  return s.session;
}
export function practiceRecipe(s,recipeId){
  if(s.session)throw new Error('Termine ou abandone o atendimento em andamento.');
  const recipe=recipeById(recipeId);
  if(!recipe || !availableRecipes(Math.min(30,s.nightUnlocked),s).some(r=>r.id===recipeId))throw new Error('Receita ainda não descoberta.');
  s.session={mode:'practice',night:Math.min(s.nightUnlocked,30),orders:[{clientId:'elara',recipeId,uid:`practice-${recipeId}`}],index:0,stage:'ingredients',items:[],heat:null,finish:null,results:[],settled:false};
  return s.session;
}
export const currentOrder = s => s.session?.orders[s.session.index]||null;
export function beginOrders(s){if(!s.session || s.session.stage!=='intro')return; s.session.stage='ingredients';}
export function addIngredient(s,id){
  const q=s.session; if(!q || q.stage!=='ingredients')return false;
  if(!ingredients.some(i=>i.id===id) || q.items.length>=5)return false;
  q.items.push(id);return true;
}
export function removeIngredient(s,index){
  const q=s.session;if(!q || q.stage!=='ingredients' || index<0 || index>=q.items.length)return false;
  q.items.splice(index,1);return true;
}
export function startExtraction(s){
  if(!s.session || s.session.stage!=='ingredients' || s.session.items.length===0)throw new Error('Adicione ingredientes antes de preparar.');
  s.session.stage='extraction';s.session.heat=null;
}
export function stopExtraction(s,position){
  if(!s.session || s.session.stage!=='extraction')return;
  const p=Math.max(0,Math.min(100,Number(position)||0));
  const center=64, extra=(s.upgrades.includes('moedor')?9:0)+(s.upgrades.includes('relogio')?5:0);
  s.session.heat=Math.abs(center-p)<=10+extra?3:Math.abs(center-p)<=24+extra?2:1;
  s.session.stage='finish';
}
function countMap(arr){return arr.reduce((counts,id)=>{counts[id]=(counts[id]||0)+1;return counts;},{});}
export function scoreDrink(recipe,items,heat,finish){
  const wanted=countMap(recipe.items),actual=countMap(items);
  const ingredientsExact=Object.keys({...wanted,...actual}).every(id=>wanted[id]===actual[id]);
  const errors=Object.keys({...wanted,...actual}).reduce((a,id)=>a+Math.abs((wanted[id]||0)-(actual[id]||0)),0);
  const finishing=finish===recipe.finish;
  const score=Math.max(1, Math.min(3,3-(ingredientsExact?0:Math.min(2,errors))-(heat===3?0:heat===2?0.5:1)-(finishing?0:0.5)));
  const quality=score>=2.8?3:score>=1.8?2:1;
  return {quality, ingredientsExact, finishing, heat, errors};
}
export function serve(s){
  const q=s.session; if(!q||q.stage!=='finish'||!q.finish)throw new Error('Escolha a finalização da bebida.');
  const order=currentOrder(s),recipe=recipeById(order.recipeId);
  const score=scoreDrink(recipe,q.items,q.heat,q.finish);
  const client=clientById(order.clientId);
  const reward=q.mode==='practice'?0:Math.round(recipe.price*(score.quality===3?1:score.quality===2?.75:.5))+
    (score.quality===3?8:score.quality===2?3:0)+(s.upgrades.includes('bancada')?4:0)+(s.upgrades.includes('xicara')&&score.quality===3?5:0);
  s.coins+=reward;s.stats.earnings+=reward;s.stats.served++;
  s.stats.recipesMade[recipe.id]=(s.stats.recipesMade[recipe.id]||0)+1;
  if(q.mode!=='practice') {
    s.stats.clientOrders[client.id]=(s.stats.clientOrders[client.id]||0)+1;
    s.affinity[client.id]=Math.min(12,(s.affinity[client.id]||0)+(score.quality===3?2:score.quality===2?1:0));
  }
  if(score.quality===3)s.stats.excellent++;
  q.results.push({recipeId:recipe.id,clientId:client.id,quality:score.quality,reward,...score});
  q.stage='result';unlockAchievements(s);return q.results[q.results.length-1];
}
export function nextVisitor(s){
  const q=s.session;if(!q||q.stage!=='result')return;
  q.index++;
  if(q.index>=q.orders.length){q.stage='summary';if(q.mode==='campaign')settleNight(s);return;}
  q.stage='ingredients';q.items=[];q.heat=null;q.finish=null;
}
export function settleNight(s){
  const q=s.session;
  if(!q || q.settled || q.mode!=='campaign')return null;
  const average=q.results.reduce((sum,r)=>sum+r.quality,0)/Math.max(1,q.results.length);
  const stars=average>=2.85?3:average>=1.85?2:1;
  const prior=Number(s.bestStars[q.night]||0);
  s.bestStars[q.night]=Math.max(prior,stars);
  s.nightUnlocked=Math.max(s.nightUnlocked,Math.min(31,q.night+1));
  s.stats.nightsPlayed++;
  if(q.results.length&&q.results.every(r=>r.quality===3))s.stats.flawlessNights++;
  const firstTime=prior===0;
  const bonus=firstTime?18+chapterForNight(q.night)*9:0;
  s.coins+=bonus;s.stats.earnings+=bonus;
  q.stars=stars;q.bonus=bonus;q.settled=true;q.firstTime=firstTime;
  unlockAchievements(s);return q;
}
export function leaveSession(s){s.session=null;}
export function setFinish(s,finish){if(s.session?.stage==='finish'&&finishes.includes(finish)){s.session.finish=finish;return true;}return false;}
export function buyUpgrade(s,id){const p=upgrades.find(x=>x.id===id);if(!p||s.upgrades.includes(id)||s.coins<p.cost)return false;s.coins-=p.cost;s.upgrades.push(id);unlockAchievements(s);return true;}
export function buyDecoration(s,id){const p=decorations.find(x=>x.id===id);if(!p||s.decor.includes(id)||s.coins<p.cost)return false;s.coins-=p.cost;s.decor.push(id);unlockAchievements(s);return true;}
export function pet(s,animal){if(animal==='dudu')s.stats.petDudu++;else if(animal==='nox')s.stats.petNox++;else return false;unlockAchievements(s);return true;}
export function discoverClue(s,id){const clue=clues.find(c=>c.id===id);if(!clue || s.nightUnlocked<=clue.minNight || s.clues.includes(id))return false;s.clues.push(id);unlockAchievements(s);return true;}
export function seeEnding(s){if(s.nightUnlocked<31)return false;s.endingSeen=true;unlockAchievements(s);return true;}
export function completion(s){return {awards:s.achievements.length,allAwards:achievements.length,stars:Object.values(s.bestStars).reduce((x,n)=>x+n,0),maxStars:90,chapters:Math.min(5,Math.floor((s.nightUnlocked-1)/6)),recipes:Object.keys(s.stats.recipesMade).length};}
