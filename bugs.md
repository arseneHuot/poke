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

---

## Bug #8 - Professor in lab always triggers starter selection even after starter chosen
**Status:** Fixed (2026-03-28)
**Priority:** Critical
**File:** js/world-data.js, js/engine.js, js/story-data.js

**Description:** After obtaining a starter and completing the post-starter dialogue, interacting with Prof. Oliva again in the lab always re-shows the `story_lab_starters` dialogue including the starter selection screen. The player can select a second (or third…) starter, adding extra Pokemon and extra Poké Balls each time.

**Steps to reproduce:**
1. Start a new game, enter the lab, interact with Prof. Oliva
2. Select a starter and advance through the post-starter dialogue
3. Re-interact with Prof. Oliva (or press Space one extra time at end of dialogue)
4. Starter selection screen reappears; selecting a Pokemon adds it to the party again

**Expected:** After `has_starter` is set, Prof. Oliva should show a different "Bonne chance !" dialogue instead of re-triggering starter selection.
**Actual:** Party grows beyond 1 starter; bag gains +5 Poké Balls with each re-selection. `starterSelectActive` and `dialogueActive` end up both `true` simultaneously.

**Root cause:** NPC definition in `world-data.js` always uses `dialogue: 'story_lab_starters'` with no alternate for after `has_starter` is true. `interactWithNPC` in `engine.js` uses `npc.dialogue` unconditionally.

**Fix:** Added `altDialogue: 'story_prof_postgame'` and `altFlag: 'has_starter'` fields to the Prof. Oliva NPC in `world-data.js`. Added logic in `engine.js:interactWithNPC` to select `altDialogue` when `altFlag` is set. Added `story_prof_postgame` dialogue to `story-data.js`.

---

## Bug #9 - Dialogue box bleeds through menu and battle screens
**Status:** Fixed (2026-03-28)
**Priority:** Major
**File:** js/ui.js, js/main.js

**Description:** When a dialogue is pending/active and the player opens the menu or a battle starts, the dialogue box text remains visible at the bottom of the screen, overlapping the menu and battle UI.

**Steps to reproduce:**
1. Trigger the post-starter dialogue from Prof. Oliva
2. While dialogue is active, press Escape to open the menu
3. Navigate through menu tabs — dialogue text is visible behind/below all tabs

**Expected:** Dialogue box is hidden when menu or battle opens.
**Actual:** "Excellent choix ! Prends aussi ce Pokédex…" shows at the bottom of every menu tab and the battle screen.

**Fix:** `openMenu()` now force-hides and resets the dialogue box before opening the menu. `startBattle()` in `main.js` now hides the dialogue box when a battle begins.

---

## Bug #10 - Move name "Pistolet à Eau" truncated in battle move list
**Status:** Fixed (2026-03-28)
**Priority:** Minor
**File:** js/pokemon-data.js

**Description:** Aquali's move "Pistolet à Eau" displays as "Pistolet à OPP 25/25" — the name is cut off and the "PP" label is merged directly into the truncated name.

**Steps to reproduce:**
1. Enter a battle with Aquali
2. Click ATTAQUE
3. Observe the third move button

**Expected:** "Pistolet à Eau | PP 25/25"
**Actual:** "Pistolet à OPP 25/25"

**Root cause:** Move name in `pokemon-data.js` was stored as `'Pistolet à O'` (truncated). The missing " Eau" caused the PP span to visually merge.

**Fix:** Corrected move name to `'Pistolet à Eau'` in `pokemon-data.js`.

---

## Bug #11 - No visual feedback after manual save
**Status:** Fixed (2026-03-28)
**Priority:** Minor
**File:** js/ui.js (save tab)

**Description:** Clicking "Sauvegarder maintenant" produces no notification or visual confirmation that the save succeeded.

**Steps to reproduce:**
1. Open menu → Sauvegarder tab → click "Sauvegarder maintenant"

**Expected:** A brief notification "Partie sauvegardée !" appears.
**Actual:** Nothing visible happens.

**Fix:** `showNotification('Partie sauvegardee !')` was already called in the button click handler. The notification z-index (80) is above the menu overlay (60) so it renders correctly. Also fixed accent typo in save tab info text: "sauvegardee" → "sauvegardée".

---

## Bug #12 - Enemy Pokémon sprite off-screen in battle on sub-960px viewports
**Status:** Open
**Priority:** Major
**File:** js/battle.js, css/style.css

**Description:** The game canvas is fixed at 960×640px with no responsive scaling. The enemy Pokémon sprite is drawn at 70% of canvas width (x ≈ 624–720px). On any screen narrower than ~720px, the enemy sprite is entirely invisible.

**Steps to reproduce:**
1. Open the game in a browser window narrower than 960px
2. Start any battle

**Expected:** Both the player's and enemy's Pokémon are visible.
**Actual:** Only the player's Pokémon (at x ≈ 184px) is visible. The enemy sprite is off-screen to the right. The HTML HP cards (positioned with CSS) remain visible, but the canvas sprites do not.

**Found:** 2026-03-28

---

## Bug #8 - Battle party screen crashes with null party slots
**Status:** Fixed (2026-03-28)
**Priority:** High
**File:** js/battle.js

**Description:** Opening the party screen during battle crashed if any party slot was null. The game supports null party entries, but `_showParty` accessed `pkmn.currentHp` etc. without a null check.

**Root cause:** `game.state.party.forEach((pkmn, index) => { ... })` accessed properties on `pkmn` without checking if it was null first.

**Fix:** Added `if (!pkmn) return;` guard at the top of the forEach callback in `_showParty`.

---

## Bug #9 - Back button shown during forced switch after Pokemon faints
**Status:** Fixed (2026-03-28)
**Priority:** Medium
**File:** js/battle.js

**Description:** When the player's active Pokemon fainted, the party screen showed a "Back" button. Clicking it returned to the action menu without any active Pokemon, causing an inconsistent game state.

**Root cause:** `_showParty` always added the back button unconditionally, even during `forced_switch` phase.

**Fix:** Back button is now only added when `this.state.turnPhase !== 'forced_switch'`.

---

## Bug #10 - endBattle crashes with null party slots
**Status:** Fixed (2026-03-28)
**Priority:** Medium
**File:** js/battle.js

**Description:** `BattleSystem.endBattle()` iterated over the party to clean up battle flags and to heal on loss, but did not guard against null party entries.

**Root cause:** Both `forEach` loops accessed properties on `p` without null checks.

**Fix:** Added `if (!p) return;` guards in both forEach loops in `endBattle`.

---

## Bug #11 - pokemon-data.js functions crash on invalid Pokemon ID
**Status:** Fixed (2026-03-28)
**Priority:** Medium
**File:** js/pokemon-data.js

**Description:** Six functions — `recalcStats`, `checkEvolution`, `addExp`, `evolvePokemon`, `getExpPercent`, `calcExpGain` — all call `getPokemonById(id)` and immediately access properties on the result without checking for null. If an invalid or unknown Pokemon ID is passed, they all crash.

**Root cause:** Missing null guards after `getPokemonById` calls throughout the module.

**Fix:** Added `if (!data) return ...;` (with appropriate return value) at the top of each function after the `getPokemonById` call.

---

## Bug #12 - _deserializePokemon crashes on unknown Pokemon ID in save
**Status:** Fixed (2026-03-28)
**Priority:** Medium
**File:** js/save-system.js

**Description:** Loading a save file that contains a Pokemon whose ID no longer exists in POKEMON_DB caused a crash: `getPokemonById(data.id).name` throws because the result is null.

**Root cause:** No null check after `getPokemonById(data.id)` in `_deserializePokemon`.

**Fix:** Added a null check — if `getPokemonById` returns null, `_deserializePokemon` returns null instead of crashing. The load/party code already handles null party entries gracefully.
