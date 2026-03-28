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
**File:** js/world-data.js, js/engine.js

**Description:** After obtaining a starter and completing the post-starter dialogue, interacting with Prof. Oliva again in the lab always re-shows the `story_lab_starters` dialogue including the starter selection screen.

**Fix:** Prof. Oliva NPC in `world-data.js` now has `altDialogue: 'story_prof_postgame'` and `altFlag: 'has_starter'`. `interactWithNPC` in `engine.js` checks `npc.altFlag` and uses `npc.altDialogue` when the flag is true. Verified: re-interacting with Prof. after getting starter shows "Tu as déjà ton Pokémon !" dialogue instead of starter selection.

---

## Bug #9 - Dialogue box bleeds through menu and battle screens
**Status:** Fixed (2026-03-28)
**Priority:** Major
**File:** js/ui.js

**Description:** When a dialogue is pending/active and the player opens the menu or a battle starts, the dialogue box text remains visible at the bottom of the screen, overlapping the menu and battle UI.

**Fix:** `openMenu()` now explicitly hides the dialogue box and resets `dialogue.active = false` before rendering the menu (ui.js lines 386–388). `startBattle()` in main.js also hides the dialogue box on entry. Additionally, the `_bindKeys` Escape handler checks `!this.dialogue.active` before calling `openMenu()`, preventing the menu from opening during an active dialogue entirely.

---

## Bug #10 - Move names and PP merged in battle move list
**Status:** Visually Fixed (2026-03-28)
**Priority:** Minor
**File:** js/ui.js (battle move rendering), js/pokemon-data.js

**Description:** In the battle ATTAQUE menu, move names and the "PP" label are concatenated without separator: "ChargePP 35/35", "RugissementPP 40/40", "Pistolet à OPP 25/25".

**Additionally:** The move "Pistolet à Eau" (Water Gun) is stored with the wrong name `'Pistolet à O'` in `pokemon-data.js:40` — "Eau" is truncated to "O".

**Fix:** `.move-btn` now uses `display: flex; flex-direction: column` so the name and PP info render on separate lines. `watergun` move name corrected to `'Pistolet à Eau'` (see Bug #20).

**Steps to reproduce:**
1. Enter a battle with Aquali
2. Click ATTAQUE
3. Observe all three move buttons

**Expected:** "Charge | PP 35/35", "Rugissement | PP 40/40", "Pistolet à Eau | PP 25/25"
**Actual:** "ChargePP 35/35", "RugissementPP 40/40", "Pistolet à OPP 25/25"

---

## Bug #11 - Save notification not visible through menu overlay
**Status:** Fixed (2026-03-28)
**Priority:** Minor
**File:** js/ui.js (save tab), css/style.css

**Description:** Clicking "Sauvegarder maintenant" shows `showNotification('Partie sauvegardee !')` and changes the button text to "Sauvegarde OK !" briefly. However the notification toast is hidden behind the menu overlay and is never seen. The button text change does work but uses the "sauvegardee" typo (missing accent).

**Steps to reproduce:**
1. Open menu → Sauvegarder tab → click "Sauvegarder maintenant"

**Expected:** A visible notification "Partie sauvegardée !" appears above the menu.
**Actual (original):** Notification renders behind the menu overlay.

**Fix:** Notification (`.notification`) has `z-index: 80`, which is higher than `#menu-overlay`'s `z-index: 60`. Both are children of `#ui-layer`. Notification renders correctly above the menu overlay. The accent typo was also fixed: `showNotification('Partie sauvegardée !')` at js/ui.js:987. Verified with persistent DOM test on 2026-03-28 — notification is fully visible above the menu panel.

---

## Bug #12 - Enemy Pokémon sprite off-screen in battle on sub-960px viewports
**Status:** Fixed (2026-03-28)
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

## Bug #13 - Battle party screen crashes with null party slots
**Status:** Fixed (2026-03-28)
**Priority:** High
**File:** js/battle.js

**Description:** Opening the party screen during battle crashed if any party slot was null. The game supports null party entries, but `_showParty` accessed `pkmn.currentHp` etc. without a null check.

**Root cause:** `game.state.party.forEach((pkmn, index) => { ... })` accessed properties on `pkmn` without checking if it was null first.

**Fix:** Added `if (!pkmn) return;` guard at the top of the forEach callback in `_showParty`.

---

## Bug #14 - Back button shown during forced switch after Pokemon faints
**Status:** Fixed (2026-03-28)
**Priority:** Medium
**File:** js/battle.js

**Description:** When the player's active Pokemon fainted, the party screen showed a "Back" button. Clicking it returned to the action menu without any active Pokemon, causing an inconsistent game state.

**Root cause:** `_showParty` always added the back button unconditionally, even during `forced_switch` phase.

**Fix:** Back button is now only added when `this.state.turnPhase !== 'forced_switch'`.

---

## Bug #15 - endBattle crashes with null party slots
**Status:** Fixed (2026-03-28)
**Priority:** Medium
**File:** js/battle.js

**Description:** `BattleSystem.endBattle()` iterated over the party to clean up battle flags and to heal on loss, but did not guard against null party entries.

**Root cause:** Both `forEach` loops accessed properties on `p` without null checks.

**Fix:** Added `if (!p) return;` guards in both forEach loops in `endBattle`.

---

## Bug #16 - pokemon-data.js functions crash on invalid Pokemon ID
**Status:** Fixed (2026-03-28)
**Priority:** Medium
**File:** js/pokemon-data.js

**Description:** Six functions — `recalcStats`, `checkEvolution`, `addExp`, `evolvePokemon`, `getExpPercent`, `calcExpGain` — all call `getPokemonById(id)` and immediately access properties on the result without checking for null. If an invalid or unknown Pokemon ID is passed, they all crash.

**Root cause:** Missing null guards after `getPokemonById` calls throughout the module.

**Fix:** Added `if (!data) return ...;` (with appropriate return value) at the top of each function after the `getPokemonById` call.

---

## Bug #17 - _deserializePokemon crashes on unknown Pokemon ID in save
**Status:** Fixed (2026-03-28)
**Priority:** Medium
**File:** js/save-system.js

**Description:** Loading a save file that contains a Pokemon whose ID no longer exists in POKEMON_DB caused a crash: `getPokemonById(data.id).name` throws because the result is null.

**Root cause:** No null check after `getPokemonById(data.id)` in `_deserializePokemon`.

**Fix:** Added a null check — if `getPokemonById` returns null, `_deserializePokemon` returns null instead of crashing. The load/party code already handles null party entries gracefully.

---

## Bug #18 - Game loop freezes permanently when tab loses visibility
**Status:** Fixed (2026-03-28)
**Priority:** Major
**File:** js/main.js

**Description:** The game loop runs via `requestAnimationFrame`, which browsers pause when the tab is hidden (`document.visibilityState === 'hidden'`). The game has no `visibilitychange` event handler to restart the loop when the tab regains focus. Once the tab loses focus and `rAF` pauses, the game freezes: `playTime` stops incrementing, movement stops, and the game becomes unresponsive even after the tab is brought back into view.

**Steps to reproduce:**
1. Start a new game
2. Switch to another tab or minimize the browser for a few seconds
3. Return to the game tab
4. Observe that the game loop has stopped (player cannot move, timer frozen)

**Expected:** Game resumes normally when the tab regains visibility.
**Actual:** Game loop is permanently frozen; only a page reload recovers it.

**Root cause:** No `document.addEventListener('visibilitychange', ...)` handler in `main.js` to re-schedule `requestAnimationFrame` when `document.visibilityState` becomes `'visible'`.

**Found:** 2026-03-28

---

## Bug #19 - Missing accents on "Pokemon", "Pokedex", "Equipe" in UI
**Status:** Fixed (2026-03-28)
**Priority:** Cosmetic
**File:** js/ui.js

**Description:** Multiple strings in the UI are missing French accents: "Pokemon" (should be "Pokémon"), "Pokedex" (should be "Pokédex"), and "Equipe" (should be "Équipe"). This affects the starter selection title, menu tabs, section headers, and the Dresseur card stats.

**Affected locations (js/ui.js):**
- Line 298: `'Choisissez votre Pokemon !'` → `'Choisissez votre Pokémon !'`
- Line 412: `label: 'Equipe'` → `label: 'Équipe'`
- Line 414: `label: 'Pokedex'` → `label: 'Pokédex'`
- Line 473: `'Aucun Pokemon dans l\'equipe.'` → `'Aucun Pokémon dans l\'équipe.'` (two issues on same line)
- Line 827: `title.textContent = 'Pokedex'` → `'Pokédex'`
- Lines 912–913: `'Pokedex (vus)'`, `'Pokedex (captures)'` → `'Pokédex (vus)'`, `'Pokédex (captures)'`

**Found:** 2026-03-28

---

## Bug #20 - Wrong move name: "Pistolet à O" instead of "Pistolet à Eau"
**Status:** Fixed (2026-03-28)
**Priority:** Minor
**File:** js/pokemon-data.js

**Description:** The Water Gun move (`watergun`) has its name stored as `'Pistolet à O'` instead of the correct `'Pistolet à Eau'`. The word "Eau" (water in French) is truncated to just "O". This appears everywhere the move name is shown: the party Pokémon detail view, the battle move list, and battle messages.

**Steps to reproduce:**
1. Obtain Aquali as starter
2. Open menu → Équipe → click Aquali → view Attaques section
3. Observe third move: "Pistolet à O | WATER | Puiss. 40 | PP 25/25"

**Expected:** `'Pistolet à Eau'`
**Actual:** `'Pistolet à O'`

**Root cause:** Data error at `js/pokemon-data.js:40`:
```js
watergun: { name: 'Pistolet à O', ... }  // should be 'Pistolet à Eau'
```

**Found:** 2026-03-28

---

## Bug #21 - `_handlePlayerFaint` crashes with null party entries
**Status:** Fixed (2026-03-28)
**Priority:** Medium
**File:** js/battle.js

**Description:** `BattleSystem._handlePlayerFaint()` calls `game.state.party.filter(p => p.currentHp > 0)` without guarding against null party entries. If the party contains a null slot (which can happen after loading a save with an unknown Pokémon ID — see Bug #17), accessing `p.currentHp` on null throws a TypeError, crashing the game mid-battle.

**Steps to reproduce:**
1. Load a save where at least one party slot is null
2. Enter a wild battle
3. Let the active Pokémon's HP drop to 0

**Expected:** The game shows the forced-switch screen or blackout message.
**Actual:** `Uncaught TypeError: Cannot read properties of null (reading 'currentHp')`

**Root cause:** Line `game.state.party.filter(p => p.currentHp > 0)` in `_handlePlayerFaint` (js/battle.js:1032) — missing null guard (should be `p && p.currentHp > 0`).

**Found:** 2026-03-28

---

## Bug #22 - PC tile healing does not restore move PP
**Status:** Fixed (2026-03-28)
**Priority:** Major
**File:** js/engine.js (`_healParty`)

**Description:** When the player interacts with a PC tile directly (without a nurse NPC in front of it, as in the Borgo Pokémon Center), `GameEngine._healParty()` is called. This method restores all Pokémon HP to full but does NOT restore PP. The PP restoration code in `_healParty` is broken: it checks `if (move.maxPp !== undefined)` (a field that never exists in the move data model) and sets `move.pp` instead of resetting `move.ppUsed = 0`.

Contrast with nurse NPC healing via `UI._healAllPokemon()`, which correctly restores PP with `m.ppUsed = 0`. This creates an inconsistency between the two healing paths.

**Steps to reproduce:**
1. Start a new game in Borgo village
2. Use some moves in battle to deplete PP
3. Walk to the PC tile in Borgo (at tile position x=8, y=17) and press Space
4. Open the menu → Équipe → check move PP

**Expected:** All Pokémon HP and PP fully restored.
**Actual:** HP restored, but ppUsed values unchanged (PP not restored).

**Root cause:** `js/engine.js:_healParty` — PP loop checks `move.maxPp !== undefined` (always false) and sets `move.pp` (wrong field). Should be `move.ppUsed = 0`.

**Found:** 2026-03-28

---

## Bug #23 - Repel items purchasable but unusable
**Status:** Fixed (2026-03-28)
**Priority:** Major
**File:** js/ui.js (`_renderBagTab`), js/engine.js (`useRepel`)

**Description:** The "Repousse" (Repel) item is sold in every Pokémart and is saved/loaded correctly. However there is no usage pathway: `_renderBagTab` only adds click handlers for items of type `'heal'`, `'revive'`, `'status'`, and `'levelup'`. Repel items (type `'repel'`) appear in the bag as unclickable rows. `GameEngine.useRepel(steps)` exists but is never called from any UI handler.

**Steps to reproduce:**
1. Go to any Pokémart and purchase a Repousse (350 $)
2. Open the menu → Sac
3. The item is listed but has no pointer cursor and cannot be clicked

**Expected:** Clicking the Repel in the bag activates it for 100 steps, preventing wild encounters.
**Actual:** Item appears in bag but is unresponsive.

**Found:** 2026-03-28

---

## Bug #24 - Escape Rope (Corde Sortie) has no usage handler
**Status:** Fixed (2026-03-28)
**Priority:** Minor
**File:** js/ui.js, js/constants.js

**Description:** The "Corde Sortie" (Escape Rope) item is defined in ITEMS with type `'escape'` but no code handles this type in either the overworld bag menu or the battle bag. The item cannot be activated. It is not sold in any shop currently, but the definition exists and could be added.

**Found:** 2026-03-28

---

## Bug #25 - Defeated trainer state not persisted between sessions
**Status:** Fixed (2026-03-28)
**Priority:** Major
**File:** js/battle.js, js/engine.js, js/save-system.js

**Description:** When a trainer is defeated, `BattleSystem.endBattle` sets `trainerNpc.defeated = true` on the in-memory NPC object. However, the `game.state.defeatedTrainers` Set — which is serialized in the save file — is **never populated**. After a page reload, `WorldData.init()` re-creates all NPC objects with `defeated: false`, resetting all trainer defeats. The saved `defeatedTrainers` Set is also never read to restore the defeated state on NPCs, making it completely unused.

**Steps to reproduce:**
1. Defeat any route trainer (e.g., "Gamin Thomas" on Route 1)
2. Save and reload the page
3. Walk back to the trainer — they challenge the player again

**Expected:** Previously defeated trainers do not re-battle; they show a post-defeat dialogue.
**Actual:** All trainers reset to undefeated state on reload.

**Root cause:** `battle.js:1339` sets `trainerNpc.defeated = true` but never calls `game.state.defeatedTrainers.add(npc.id)`. `interactWithNPC` in `engine.js` never checks `npc.defeated` or the `defeatedTrainers` Set.

**Found:** 2026-03-28

---

## Bug #26 - Re-challenging a defeated trainer starts battle with 0-HP enemy
**Status:** Fixed (2026-03-28)
**Priority:** Major
**File:** js/engine.js (`interactWithNPC`), js/world-data.js (all gym leader NPCs)

**Description:** In the same session (before a reload), a defeated trainer can be re-challenged. `interactWithNPC` has no check for `npc.defeated`, so the trainer battle dialogue fires again. `startTrainerBattle` detects that `trainerNpc.party` is already built (from the previous battle) and reuses it without checking HP. The battle starts with the trainer's Pokémon at 0 HP, causing an immediate win condition and a second reward payout.

The fix checks `if (npc.defeated && npc.altDialogue)` in `interactWithNPC`. All 8 gym leaders (`gym1_leader` through `gym8_leader`) now have `altDialogue` and `gym{N}_defeated` dialogue entries set in `world-data.js` and `story-data.js`.

**Steps to reproduce:**
1. Defeat gym leader Marco in Porto City (gym1_leader)
2. Interact with him again immediately
3. A battle starts — Marco's Pokémon has 0 HP

**Expected:** Defeated trainer shows a post-defeat dialogue ("Bien joué !") and cannot be re-battled.
**Actual (original):** Battle starts with a dead enemy; player wins instantly and may receive rewards again.

**Fix verified (2026-03-28):** gym1_leader.defeated=true after battle, re-interaction shows "Bien joué ! Tu m'as impressionné. Ton Pokémon mérite ce Badge Normalité." dialogue. All 8 gym leaders confirmed to have altDialogue properties in world-data.js.

**Found:** 2026-03-28

---

## Bug #27 - Gym badges are never awarded after defeating a gym leader
**Status:** Fixed (2026-03-28)
**Priority:** Critical
**Files:** js/battle.js, js/ui.js, js/engine.js

**Description:** Defeating a gym leader never awards the corresponding badge. `BattleSystem.endBattle` only sets `trainerNpc.defeated = true` and adds the money reward, but never updates `game.state.badges` or the `badge_N` story flags. Since subsequent gym leaders gate behind `storyReq: 'badge_N'`, they never appear — only the first gym is accessible.

**Steps to reproduce:**
1. Reach Porto City and defeat gym leader Marco
2. Open menu → Dresseur — Badges shows "0 / 8"
3. Travel to Campoverde — gym 2 leader (Flora) is invisible due to `storyReq: 'badge_0'` never being set

**Expected:** Defeating Marco awards Badge 0, sets `storyFlag.badge_0 = true`, adds `0` to `game.state.badges`, and Champion Flora appears in Campoverde.
**Actual:** No badge awarded, `badge_0` stays `false`, gym 2 leader never spawns, story progression is permanently blocked past gym 1.

**Root cause:** No code in `battle.js`, `engine.js`, or `ui.js` reads `trainerNpc.badge` and applies the badge after a gym leader victory. The `badge` property exists on gym leader NPC definitions in `world-data.js` but is never consumed.

**Found:** 2026-03-28

---

## Bug #28 - Using a heal/revive item from the overworld bag crashes with undefined `container`
**Status:** Fixed (2026-03-28)
**Priority:** Major
**File:** js/ui.js (`_showItemUseTarget`)

**Description:** Clicking a Potion, Rappel, or other usable item in the overworld Sac menu opens a "Utiliser X sur..." screen but the party list and Back button never render. The function crashes on `container.appendChild(list)` because `container` is never defined — the correct variable is `panel`.

**Steps to reproduce:**
1. Have at least one Potion (or other heal item) in the bag
2. Open menu → Sac → click the Potion
3. Screen shows "Utiliser Potion sur..." with no Pokémon listed and no Back button

**Expected:** Party list appears so player can choose which Pokémon to heal; Back button returns to the bag.
**Actual:** `ReferenceError: container is not defined` is silently swallowed; the panel shows only the title. The item is NOT consumed, so there is no permanent softlock (Escape closes the menu), but items can never be used from the overworld bag.

**Root cause:** `js/ui.js:740` — `container.appendChild(list)` should be `panel.appendChild(list)`. The variable `panel` is declared at line 685 but line 740 mistakenly uses `container`.

**Found:** 2026-03-28

---

## Bug #29 - Escape key cannot close the menu
**Status:** Fixed (2026-03-28)
**Priority:** Major
**File:** js/engine.js (`handleInput`), js/ui.js (keydown handler)

**Description:** Pressing Escape when the menu is open does not close it — the menu stays open permanently. The key only toggles the menu open when it is closed; it cannot be used to close it.

**Steps to reproduce:**
1. In the overworld, press Escape — menu opens (correct)
2. Press Escape again — menu should close, but stays open

**Expected:** Escape toggles the menu: opens it when closed, closes it when open.
**Actual:** The menu cannot be closed with the keyboard at all.

**Root cause:** Two competing keydown listeners handle Escape:
1. `document.addEventListener` in `ui.js` — correctly checks `UI.menu.open` and calls `closeMenu()` when open
2. `window.addEventListener` in `engine.js handleInput` — **unconditionally** calls `UI.openMenu()` on every Escape key press, regardless of menu state

Because `document` events fire before `window` events, the sequence on every Escape press is:
- UI listener fires → calls `closeMenu()` (menu.open = false) ✓
- Engine listener fires → calls `openMenu()` (menu.open = true) ✗

Net result: menu closes and immediately re-opens on every Escape press.

**Fix needed:** In `js/engine.js handleInput`, change the unconditional `UI.openMenu()` call to only open the menu when it is not already open (i.e., `if (!UI.menu.open) UI.openMenu()`), or remove the call entirely since `ui.js` already handles it.

```js
// Current (broken):
if (key === 'Escape' || key === 'x' || key === 'X') {
    if (typeof UI !== 'undefined' && UI.openMenu) {
        UI.openMenu();  // always fires, re-opens after ui.js closes it
    }
}

// Fix:
if (key === 'Escape' || key === 'x' || key === 'X') {
    if (typeof UI !== 'undefined' && UI.openMenu && !UI.menu.open) {
        UI.openMenu();
    }
}
```

**Found:** 2026-03-28

---

## Bug #30 - Shop buy notification missing accent: "achete" → "acheté"
**Status:** Fixed (2026-03-28)
**Priority:** Cosmetic
**File:** js/ui.js (`_renderShopBuy`, line 1244)

**Description:** After successfully buying an item in a Pokémart, the notification reads `"Poké Ball achete !"` (or `"Potion achete !"` etc.) — the past participle "acheté" is missing its accent.

**Root cause:** `js/ui.js:1244`:
```js
this.showNotification(itemData.name + ' achete !');
// Should be:
this.showNotification(itemData.name + ' acheté !');
```

**Found:** 2026-03-28

---

## Bug #32 - Additional missing accents in notification strings
**Status:** Fixed (2026-03-28)
**Priority:** Cosmetic
**File:** js/ui.js

**Description:** Two player-visible notification strings contain missing French accents, distinct from the UI label issues documented in Bug #19.

**Affected locations:**
- `js/ui.js:277` (`_healAllPokemon`): `'Vos Pokemon sont en pleine forme !'` → should be `'Vos Pokémon sont en pleine forme !'`
  - This notification fires when a nurse NPC heals the party (via the `heal_pokemon` dialogue action).
- `js/ui.js:357` (`_selectStarter`): `data.name + ' a rejoint votre equipe !'` → "equipe" should be "équipe"
  - This notification fires immediately when the player picks their starter Pokémon.

**Steps to reproduce (equipe):**
1. Start a new game
2. Enter the lab and choose a starter
3. Observe the notification toast — it reads "Flamby a rejoint votre equipe !" instead of "équipe"

**Steps to reproduce (Pokemon):**
1. Visit any Pokémon Center with a nurse NPC
2. Talk to the nurse and heal the party
3. The toast notification reads "Vos Pokemon sont en pleine forme !" instead of "Pokémon"

**Found:** 2026-03-28

---

## Bug #31 - Shop sell panel empty message missing accent: "Rien a vendre" → "Rien à vendre"
**Status:** Fixed (2026-03-28)
**Priority:** Cosmetic
**File:** js/ui.js (`_renderShopSell`, line 1264)

**Description:** When opening the "Vendre" tab in a Pokémart with an empty bag, the message reads `"Rien a vendre."` — the preposition "à" is missing its accent.

**Root cause:** `js/ui.js:1264`:
```js
empty.textContent = 'Rien a vendre.';
// Should be:
empty.textContent = 'Rien à vendre.';
```

**Found:** 2026-03-28

---

## Bug #33 - Overworld tiles bleed through the battle scene (middle canvas gap)
**Status:** Fixed (2026-03-28)
**Priority:** Major
**File:** js/battle.js (`render`), css/style.css (`#battle-menu`)

**Description:** During battle, the canvas only draws the sky and ground background in the top 55% of the canvas height (`battleHeight = ch * 0.55` = 352px of 640px). The bottom 45% of the canvas (352px–640px) is never cleared or filled by the battle renderer. The `#battle-menu` HTML overlay (action buttons) only covers `min-height: 140px` from the bottom. This leaves an approximately 148px gap between the battle background and the menu panel where the underlying overworld tile map is visible.

**Steps to reproduce:**
1. Enter any wild or trainer battle
2. Observe the area between the green battle ground and the action buttons

**Expected:** A solid, uniform area (ideally a dark battle panel or extension of the ground) separates the battle scene from the action buttons.
**Actual:** The overworld tile map shows through in the middle section of the battle screen, creating a jarring visual glitch.

**Root cause:** `js/battle.js` line 1223: `const battleHeight = ch * 0.55;` — only the top 55% of the canvas is rendered with the battle background. The canvas area from `battleHeight` (352px) to the canvas bottom is not cleared, so the previous overworld frame shows through in this gap region.

**Found:** 2026-03-28

---

## Bug #34 - HUD badge dots not updated after earning a badge in-session
**Status:** Fixed (2026-03-28)
**Priority:** Minor
**File:** js/battle.js (`endBattle`), js/main.js (`_loadGame`), js/ui.js (`updateBadges`)

**Description:** When the player defeats a gym leader and earns a badge, `game.state.badges` is correctly updated and persisted, but the HUD badge dots (`.badge-slot` elements in `#badges-display`) are not refreshed. `UI.updateBadges()` — the function that adds the `earned` class to badge slots — is only called in `_loadGame()`. After winning a gym battle in-session, the HUD still shows all badge slots as unearned until the game is saved and reloaded.

**Steps to reproduce:**
1. Defeat gym leader Marco in Porto City (gym1_leader)
2. Observe the badge slot HUD in the top-right corner
3. All 8 slots remain grey (unearned) even though badge 0 was awarded

**Expected:** Badge slot 0 lights up immediately after defeating the gym leader.
**Actual:** `game.state.badges` contains `[0]`, but `document.querySelectorAll('.badge-slot')[0]` does not have the `earned` class. HUD shows 0/8 until page reload.

**Root cause:** `battle.js` awards the badge at line 1348 (`game.state.badges.push(badgeIndex)`) but does not call `UI.updateBadges()` afterward. `updateBadges()` should be called in `endBattle` whenever a badge is awarded.

**Found:** 2026-03-28

---

## Bug #35 - Pokédex detail view removes menu tab bar; Retour doesn't restore it
**Status:** Fixed (2026-03-28)
**Priority:** Major
**File:** js/ui.js (`_showPokedexDetail`)

**Description:** Clicking any seen or caught Pokémon entry in the Pokédex tab opens a detail view. `_showPokedexDetail` does `panel.innerHTML = ''` which clears the entire panel including the `.menu-tabs` navigation bar. The detail view renders without any tab bar. The "Retour" button in the detail view calls `_renderPokedexTab(panel)` which renders the Pokédex grid directly into the panel — also without a tab bar. The player is stuck in the Pokédex with no ability to navigate to Équipe, Sac, Dresseur, or Sauvegarder without closing and reopening the menu.

**Compare with:** `_showPokemonDetail` (party detail view) — its Retour button correctly calls `this._renderMenu()` which rebuilds the full menu including the tab bar.

**Steps to reproduce:**
1. Have a seen or caught Pokémon in the Pokédex
2. Open menu → Pokédex tab
3. Click on the Pokémon entry
4. The tab bar (Équipe / Sac / Pokédex / Dresseur / Sauvegarder / Quitter) disappears
5. Click "Retour" — still no tab bar, permanently stuck in Pokédex grid

**Expected:** Clicking Retour from a Pokédex detail returns to the full menu (tabs + Pokédex grid).
**Actual:** Tab bar is gone after entering Pokédex detail; Retour renders the grid without restoring tabs.

**Root cause:** `js/ui.js:1018–1022` — the Retour button calls `_renderPokedexTab(panel)` instead of `_renderMenu()`.

**Fix:** Changed `_renderPokedexTab(panel)` to `this._renderMenu()` in the Retour click handler, matching the pattern used by `_showPokemonDetail` and `_showItemUseTarget`.

**Found:** 2026-03-28

---

## Bug #36 - Caught ball type always recorded as 'pokeball' regardless of ball used
**Status:** Fixed (2026-03-28)
**Priority:** Minor
**File:** js/battle.js (`_processCatchSuccess`)

**Description:** When a Pokémon is caught with any ball (Super Ball, Hyper Ball, Master Ball), the `caughtBall` property on the caught Pokémon is always set to `'pokeball'`. The `_executeCatch(ballId)` function receives the correct `ballId` parameter but calls `_processCatchSuccess()` without passing it. `_processCatchSuccess` has no access to `ballId` and hardcodes `ep.caughtBall = 'pokeball'`.

While `caughtBall` is currently not displayed anywhere in the UI, it is saved/loaded in the save system and could be used in future features (e.g., displaying which ball caught the Pokémon in a detail view or trainer card).

**Root cause:** `js/battle.js:1082,1120` — `this._processCatchSuccess()` is called without passing `ballId`. `_processCatchSuccess` at line 1149 hardcodes `'pokeball'` instead of the actual ball used.

**Fix needed:** Pass `ballId` to `_processCatchSuccess(ballId)` and use it: `ep.caughtBall = ballId;`

**Found:** 2026-03-28
