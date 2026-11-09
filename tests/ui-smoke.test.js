import test from 'node:test';
import assert from 'node:assert/strict';

test('menus e preparo completam o ciclo de uma noite sem erros de interface',async()=>{
 const listeners={click:[],change:[]};
 const memory=new Map();
 const mount={innerHTML:'',addEventListener(type,fn){(listeners[type]||=[]).push(fn);}};
 globalThis.localStorage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,value),removeItem:key=>memory.delete(key)};
 globalThis.document={getElementById:()=>mount,querySelector:()=>null,body:{classList:{toggle(){}}}};
 globalThis.window={scrollTo(){},addEventListener(){}};
 globalThis.requestAnimationFrame=()=>1;
 globalThis.cancelAnimationFrame=()=>{};
 await import('../src/main.js');
 assert.match(mount.innerHTML,/Midnight Café/i);
 const click=(action,params={})=>{
  const target={dataset:{action,...params},disabled:false,classList:{contains(){return false;}},closest(){return this;}};
  for(const listener of listeners.click)listener({target});
 };
 for(const screen of ['cafe','nights','recipes','clients','shop','achievements','journal','settings','home']){
  click('go',{screen});
  assert.ok(mount.innerHTML.length>2000,`tela ${screen} vazia`);
 }
 click('start-next');assert.match(mount.innerHTML,/As Portas se Abrem/);
 click('begin-orders');assert.match(mount.innerHTML,/Escolha os ingredientes/);
 for(let i=0;i<3;i++){
  const state=JSON.parse(memory.get('midnight-cafe-save-v1'));
  const current=state.session.orders[state.session.index];
  const {recipes}=await import('../src/data.js');
  const recipe=recipes.find(r=>r.id===current.recipeId);
  for(const ingredient of recipe.items)click('ingredient',{id:ingredient});
  click('start-extraction');assert.match(mount.innerHTML,/O ponto de extração/);
  click('stop-extraction');
  click('finish',{id:recipe.finish});
  click('serve');assert.match(mount.innerHTML,/PEDIDO ENTREGUE/);
  click('next-visitor');
 }
 assert.match(mount.innerHTML,/NOITE 01 ENCERRADA/);
 click('leave-session');
 const saved=JSON.parse(memory.get('midnight-cafe-save-v1'));
 assert.equal(saved.nightUnlocked,2);
 click('go',{screen:'cafe'});
 click('pet',{pet:'dudu'});
 const petSave=JSON.parse(memory.get('midnight-cafe-save-v1'));
 assert.equal(petSave.stats.petDudu,1);
 click('go',{screen:'settings'});
 click('reset-confirm');assert.match(mount.innerHTML,/Recomeçar do zero/);
 click('close-modal');assert.doesNotMatch(mount.innerHTML,/Sim, recomeçar/);
});
