# Pokemon Novara - Bug Tracker

---

## Bug #1 - Flinch never triggers for enemy Pokemon
**Status:** Fixed
**Priority:** Critical
**File:** js/battle.js

**Description:** When the player attacks first and causes a flinch, the enemy should skip its turn. Instead, the enemy always attacked normally — flinch had no effect.

**Root cause:** The `_flinched` flag was cleared on line 853 (`this.state.enemyPokemon._flinched = false`) just before being checked on line 856 (`if (this.state.enemyPokemon._flinched)`). The condition was always false.

**Fix:** Save the flinch value into a local variable before clearing it, then use that variable in the check.
```js
// Before (broken):
this.state.enemyPokemon._flinched = false;
if (this.state.enemyPokemon._flinched) { ... }  // always false

// After (fixed):
const enemyFlinched = this.state.enemyPokemon._flinched;
this.state.enemyPokemon._flinched = false;
if (enemyFlinched) { ... }
```

---

## Bug #2 - Pokemon detail view shows no moves
**Status:** Fixed
**Priority:** High
**File:** js/ui.js

**Description:** Opening a Pokemon's detail screen in the party menu showed no moves.

**Root cause:** In `_showPokemonDetail`, `pokemon.moves.forEach(moveId => { const move = MOVES_DB[moveId]; ... })` treated each move as a plain string key. But moves are stored as `{id, ppUsed}` objects, so `MOVES_DB[moveId]` returned `undefined` for every move, causing them all to be skipped.

**Fix:** Use `moveObj.id` to look up the move data, and also display current PP correctly.
```js
// Before: pokemon.moves.forEach(moveId => { const move = MOVES_DB[moveId]; ... })
// After:  pokemon.moves.forEach(moveObj => { const move = MOVES_DB[moveObj.id]; ... })
```

---

## Bug #3 - Trainer battles from dialogue never start
**Status:** Fixed
**Priority:** High
**Files:** js/ui.js, js/engine.js

**Description:** Dialogues that trigger trainer battles (gym leaders, Team Eclipse grunts, rival, etc.) would end the dialogue but never start a battle. The game returned silently to the overworld.

**Root cause:** In `ui.js:_handleDialogueAction`, the `trainer_battle` case called `game.startTrainerBattle()` which does not exist on the `game` object. The correct method is `game.startBattle('trainer', { npc })`. Additionally, the NPC object (needed to build the trainer's team) was never passed to the UI system.

**Fix:**
1. In `engine.js:interactWithNPC`, store the NPC reference on UI before showing dialogue: `UI._currentNpc = npc;`
2. In `ui.js:_handleDialogueAction`, use `game.startBattle('trainer', { npc: this._currentNpc })` instead of the non-existent `game.startTrainerBattle()`.

---

## Bug #4 - Speed tie always favors the player
**Status:** Fixed
**Priority:** Medium
**File:** js/battle.js

**Description:** When the player's Pokemon and the enemy had the same Speed stat, the player always moved first. It should be a 50/50 coin flip.

**Root cause:** The ternary `playerSpd >= enemySpd ? true : (playerSpd === enemySpd ? Math.random() < 0.5 : false)` — the `playerSpd === enemySpd` branch in the second part can never be reached because the first condition (`>=`) already handles the equal case and returns `true`.

**Fix:** Change `>=` to `>` so equal speeds fall through to the coin-flip branch.
```js
// Before: playerSpd >= enemySpd ? true : (playerSpd === enemySpd ? Math.random() < 0.5 : false)
// After:  playerSpd >  enemySpd ? true : (playerSpd === enemySpd ? Math.random() < 0.5 : false)
```

---

## Bug #5 - Battle actions menu shown instead of hidden after battle ends
**Status:** Fixed
**Priority:** High
**File:** js/battle.js

**Description:** After any battle ended (win, lose, catch, run), the battle action buttons remained visible on screen when returning to the overworld, overlapping the world view.

**Root cause:** In `BattleSystem.endBattle()`, the line cleaning up the UI read `actions.classList.remove('hidden')` — removing the `hidden` class — which is the opposite of the intended behavior. The actions should be hidden when the battle ends.

**Fix:** Changed `actions.classList.remove('hidden')` to `actions.classList.add('hidden')` in `endBattle()`.

---

## Bug #6 - Losing a battle never triggers healing / blackout message
**Status:** Fixed
**Priority:** High
**File:** js/main.js

**Description:** When all the player's Pokémon fainted, `BattleSystem` called `game.endBattle('lose')`, but `game.endBattle` checked `result === 'blackout'`. The condition never matched, so the party was never healed and the "Vous avez perdu connaissance..." notification was never shown.

**Root cause:** String mismatch — `BattleSystem` passes `'lose'` but `game.endBattle` expected `'blackout'`.

**Fix:** Changed `if (result === 'blackout')` to `if (result === 'lose')` in `game.endBattle()`.

---

## Bug #7 - Rival battle on Route 7 never starts
**Status:** Fixed
**Priority:** High
**File:** js/story-data.js

**Description:** The `story_rival_route7` dialogue ended without starting a battle. The rival would say his lines and then nothing happened.

**Root cause:** The dialogue action was `{ action: 'rival_battle_r7' }`, an undefined action key. `UI._handleDialogueAction` only handles the `'trainer_battle'` action for trainer battles; `'rival_battle_r7'` fell through to the `default` case which simply advanced the dialogue index, skipping the battle entirely.

**Fix:** Changed `{ action: 'rival_battle_r7' }` to `{ action: 'trainer_battle' }` in `story-data.js`.
