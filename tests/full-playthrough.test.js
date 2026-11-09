import test from 'node:test';
import assert from 'node:assert/strict';
import { recipes, upgrades, decorations } from '../src/data.js';
import {newSave, openNight, beginOrders, addIngredient, startExtraction, stopExtraction, setFinish, serve, nextVisitor, leaveSession, discoverClue, pet, buyUpgrade, buyDecoration, practiceRecipe, seeEnding, unlockAchievements} from '../src/game.js';

function finishDrink(s,recipe) {
 for(const ingredient of recipe.items)assert.equal(addIngredient(s,ingredient),true);
 startExtraction(s);stopExtraction(s,64);setFinish(s,recipe.finish);
 const result=serve(s);
 assert.equal(result.quality,3);
 nextVisitor(s);
}

test('é possível jogar trinta noites e platinar sem conteúdo externo',()=>{
 const s=newSave();
 for(let night=1;night<=30;night++){
  openNight(s,night);beginOrders(s);
  while(s.session.stage!=='summary'){
   const order=s.session.orders[s.session.index];
   finishDrink(s,recipes.find(r=>r.id===order.recipeId));
  }
  assert.equal(s.bestStars[night],3);
  leaveSession(s);
  for(const clue of [{id:'recibo',at:8},{id:'relogio',at:14},{id:'carta',at:22}]){
   if(night===clue.at)assert.equal(discoverClue(s,clue.id),true);
  }
 }
 assert.equal(s.nightUnlocked,31);
 assert.ok(s.stats.served>=100);
 for(const client of ['elara','lume','ravi','cyril','vale']) assert.ok(s.affinity[client]>=5,`faltou vínculo com ${client}: ${s.affinity[client]}`);
 for(const recipe of recipes){
  if(s.stats.recipesMade[recipe.id])continue;
  practiceRecipe(s,recipe.id);
  finishDrink(s,recipe);
  leaveSession(s);
 }
 for(let i=0;i<10;i++){pet(s,'nox');pet(s,'dudu');}
 for(const x of upgrades) assert.equal(buyUpgrade(s,x.id),true,`sem moedas para melhoria ${x.id}`);
 for(const x of decorations) assert.equal(buyDecoration(s,x.id),true,`sem moedas para decoração ${x.id}`);
 seeEnding(s);unlockAchievements(s);
 assert.equal(s.achievements.length,30,`conquistas desbloqueadas: ${s.achievements.join(', ')}`);
 assert.ok(s.achievements.includes('platina'));
});
