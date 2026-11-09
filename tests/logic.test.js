import test from 'node:test';
import assert from 'node:assert/strict';
import { achievements, recipes } from '../src/data.js';
import {newSave, makeNightOrders, openNight, beginOrders,addIngredient,startExtraction,stopExtraction,setFinish,serve,nextVisitor,scoreDrink,pet,unlockAchievements,seeEnding,parseSave,serializeSave,discoverClue} from '../src/game.js';

test('campanha tem trinta noites e pedidos viáveis',()=>{
 const s=newSave();s.nightUnlocked=31;s.clues=['recibo'];
 for(let night=1;night<=30;night++){
  const orders=makeNightOrders(night,s);
  assert.ok(orders.length>=3 && orders.length<=6);
  assert.ok(orders.every(o=>recipes.some(r=>r.id===o.recipeId)));
 }
});
test('pontuação precisa de ingredientes, finalização e extração',()=>{
 const r=recipes[0];
 assert.equal(scoreDrink(r,[...r.items],3,r.finish).quality,3);
 assert.ok(scoreDrink(r,['leite'],1,'Flor').quality<3);
});
test('concluir noite salva estrelas e libera próxima',()=>{
 const s=newSave();openNight(s,1);beginOrders(s);
 for(const order of s.session.orders){
  const r=recipes.find(r=>r.id===order.recipeId);
  for(const i of r.items)addIngredient(s,i);
  startExtraction(s);stopExtraction(s,64);setFinish(s,r.finish);serve(s);nextVisitor(s);
 }
 assert.equal(s.nightUnlocked,2);
 assert.equal(s.bestStars[1],3);
 assert.equal(s.stats.served,3);
});
test('conquistas têm vinte e nove condições e platina desbloqueável',()=>{
 assert.equal(achievements.length,30);
 const s=newSave();
 s.achievements=achievements.slice(0,-1).map(a=>a.id);unlockAchievements(s);
 assert.ok(s.achievements.includes('platina'));
});
test('carinhos e pistas desbloqueiam conquistas',()=>{
 const s=newSave();s.nightUnlocked=25;
 pet(s,'dudu');pet(s,'nox');
 assert.ok(s.achievements.includes('dudu'));
 assert.ok(s.achievements.includes('nox'));
 for(const id of ['recibo','relogio','carta'])assert.equal(discoverClue(s,id),true);
 assert.ok(s.achievements.includes('pistas'));
});
test('salvamento exporta, importa e mantém créditos da platina',()=>{
 const s=newSave();s.nightUnlocked=31;seeEnding(s);
 const copy=parseSave(serializeSave(s));
 assert.equal(copy.nightUnlocked,31);
 assert.equal(copy.endingSeen,true);
 assert.equal(copy.session,null);
});
