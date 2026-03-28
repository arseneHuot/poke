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

---

## Bug #37 - "Quitter" uses full page reload instead of in-app navigation
**Status:** Fixed (2026-03-28)
**Priority:** Minor
**File:** js/ui.js (`_renderQuitterTab`), js/main.js

**Description:** When the player confirms "Oui, quitter" in the Quitter menu tab, the game saves and then reloads the entire page via `location.reload()`. This causes a visible browser reload rather than a smooth return to the title screen.

**Root cause:** `ui.js` checks `if (game && typeof game.returnToTitle === 'function') { game.returnToTitle(); } else { location.reload(); }`. The `game.returnToTitle` function is never defined in `main.js`, so the fallback `location.reload()` is always triggered.

The save does occur before the reload (correct behaviour), but the UX is jarring — the browser briefly shows a blank page before the title screen re-renders.

**Fix needed:** Implement `game.returnToTitle()` in `main.js` that resets game state and returns to the title screen without a full page reload (e.g., stop the game loop, hide `#game-container`, show `#title-screen`, reset `game.state`).

**Found:** 2026-03-28

---

## Bug #38 - Aquali back sprite not rendered in battle
**Status:** Fixed (2026-03-28)
**Priority:** High
**File:** js/battle.js, js/sprite-renderer.js

**Description:** When Aquali is the active player Pokémon in battle, its back sprite does not appear on the player-side platform. Only the brown mound platform is visible. Other Pokémon (e.g. Rondelet) correctly show their back sprite. The issue appears to be specific to Aquali (species id 4).

**Root cause:** Likely a missing or incorrectly keyed back-sprite entry for species id 4 in SpriteRenderer, or a rendering condition that skips drawing when the back-sprite canvas/image is undefined for that species.

**Found:** 2026-03-28

---

## Bug #39 - Using a Potion on a full-HP Pokémon silently fails with no feedback
**Status:** Fixed (2026-03-28) — Already handled: notification "a déjà tous ses PV !" at line 814
**Priority:** Medium
**File:** js/ui.js (`_useItemOnPokemon` or `_showItemUseTarget`)

**Description:** In the overworld bag menu, selecting "Potion" and then clicking a Pokémon at full HP silently does nothing — the item is not consumed, the target selector stays open, and no message or visual feedback is shown. The player has no indication of why the item did not work.

**Root cause:** The usage guard likely returns early without triggering any notification or error dialogue when `currentHp >= maxHp`.

**Found:** 2026-03-28

---

## Bug #40 - After losing a trainer battle (all Pokémon KO), player is not warped to last Pokémon Center
**Status:** Fixed (2026-03-28)
**Priority:** High
**File:** js/battle.js (battle result / whiteout handling)

**Description:** When the player's entire team faints during a trainer battle, the game heals the party (correct) and shows "Vous n'avez plus de Pokémon apte au combat !" but does NOT warp the player back to the last visited Pokémon Center. The player remains at the location where the battle took place (e.g. Route 1). In standard Pokémon games this triggers a "whiteout" that transports the player back to the nearest PC.

**Root cause:** The whiteout handler heals the party but is missing the warp-to-last-PC step. No `lastHealMap`/`lastHealX`/`lastHealY` coordinates appear to be tracked or applied.

**Found:** 2026-03-28

---

## Bug #42 - Evolved species not registered in Pokédex after evolution
**Status:** Fixed (2026-03-28)
**Priority:** Medium
**File:** js/pokemon-data.js (`evolvePokemon`), js/battle.js (evolution handling)

**Description:** When a player's Pokémon evolves during battle (e.g. Aquali Lv15 → Aquanox at Lv16), the evolved species is not added to `game.state.pokedexSeen` or `game.state.pokedexCaught`. The pre-evolution entry remains marked as seen/caught, but the new species entry (e.g. Aquanox id:5) does not appear as caught or seen in the Pokédex. In standard Pokémon games, evolution registers the new species as owned/seen automatically.

**Root cause:** `evolvePokemon()` in `pokemon-data.js` changes `pokemon.id` and `pokemon.name` but does not update `game.state.pokedexSeen` or `game.state.pokedexCaught`. The evolution handling in `battle.js` (around line 1039) calls `evolvePokemon()` but also does not add the new ID to the Pokédex sets.

**Found:** 2026-03-28

---

## Bug #43 - Aquali back sprite suspected missing (needs verification)
**Status:** Cannot Reproduce
**Priority:** Low
**File:** js/sprite-renderer.js

**Description:** Bug #38 claimed Aquali's back sprite was not rendered in battle. Further testing confirms the sprite cache entry `4_112_back_false` contains 4709 non-transparent pixels and the back-facing sprite renders correctly. The original observation may have been made during battle initialisation before the sprite was cached, or during an animation state with `playerAnim.alpha = 0`. No persistent rendering failure detected.

**Found:** 2026-03-28

---

## Bug #41 - Stale nurse dialogue (with wrong health status) re-appears after map transition
**Status:** Fixed (2026-03-28)
**Priority:** Medium
**File:** js/ui.js (dialogue state management), js/engine.js (warp handling)

**Description:** After interacting with the nurse in Borgo (which sets `inputLocked` and opens a dialogue), navigating away via a teleport or warp without properly dismissing the dialogue can cause the nurse's second message ("Vos Pokémon sont en pleine forme ! Bonne continuation !") to surface later on a different map (Route 1). This occurs even when the party Pokémon are not at full HP, so the message content is also inaccurate in that context.

**Root cause:** Dialogue state (`inputLocked`, open dialogue queue) is not cleared/reset when the player warps between maps. If the dialogue callback fires after a warp, it uses the last registered speaker/text regardless of current context.

**Found:** 2026-03-28

---

## Bug #44 - Attack menu shown for fainted Pokémon instead of forced switch
**Status:** Fixed (2026-03-28)
**Priority:** High
**File:** js/battle.js

**Description:** When the active Pokémon faints during battle (enemy attacks first and KOs it), the game briefly shows the ATTAQUE move selection menu (listing the fainted Pokémon's moves) instead of immediately forcing a switch to the next alive Pokémon. The player can see moves for a 0 HP Pokémon and must manually click RETOUR → POKÉMON to switch. The forced switch (`_handlePlayerFaint`) does eventually work if the player navigates to it, but the initial display is wrong.

**Steps to reproduce:**
1. Have 2+ Pokémon in party, with the active one at low HP
2. Enter a battle where the enemy outspeeds you
3. Select ATTAQUE and pick a move
4. Enemy attacks first and KOs your Pokémon
5. Instead of showing the switch menu, the attack move list appears

**Root cause:** Likely a race condition between `_processMessageQueue` and `_showActions()` in `_checkFaintsAfterTurn`. The faint check runs after the enemy turn, but the message queue callback may call `_showActions()` before `_handlePlayerFaint()` has had a chance to set up the forced switch UI. The `_checkFaintsAfterTurn` at line 916 may not be reached because the earlier faint check at line 884 already returned — but the message queue from `_doEnemyTurn` may still trigger `_showActions` asynchronously.

**Found:** 2026-03-28

---

## Bug #45 - Shop overlay not dismissed on map transition / teleport
**Status:** Fixed (2026-03-28)
**Priority:** High
**File:** js/ui.js, js/engine.js

**Description:** If the player has the shop open and the game triggers a map transition (warp, teleport, or any state change that moves to a different map), the shop overlay remains visible on the new map. The shop continues to function (buy/sell) even though the player is no longer near the merchant NPC. This can also cause the shop to appear on top of battle UI if a battle starts while the shop is still open.

**Steps to reproduce:**
1. Open the shop at any merchant
2. Without closing it, trigger a map change (e.g., via save/load, teleport, or code)
3. The shop overlay persists on the new map

**Root cause:** The map transition / warp logic in `engine.js` does not close the shop overlay. There is no `UI.closeShop()` call in the warp handling code. The fix should add `UI.closeShop()` to the warp/map-change handler.

**Found:** 2026-03-28

---

## Bug #46 - Defeated route trainers can be re-battled infinitely
**Status:** Fixed (2026-03-28)
**Priority:** Critical
**File:** js/engine.js (interactWithNPC), js/world.js (trainer NPC definitions)

**Description:** After defeating a route trainer (e.g., "Gamin Thomas" on Route 1), talking to them again immediately triggers a new battle instead of showing a post-defeat dialogue. The trainer IS correctly added to `game.state.defeatedTrainers` and `npc.defeated` is set to `true`, but the re-battle still happens.

**Steps to reproduce:**
1. Fight and defeat any route trainer (e.g., Gamin Thomas on Route 1)
2. Talk to the same trainer again
3. A new battle starts instead of post-defeat dialogue

**Root cause:** In `engine.js:interactWithNPC()`, line 440 checks `if (npc.defeated && npc.altDialogue)` to use the alternate dialogue. However, route trainers do NOT have an `altDialogue` field defined — only gym leaders do (Bug #26 fix only added `altDialogue` to gym leaders). When `altDialogue` is undefined, the check falls through and uses the original `trainer_battle` dialogue, re-triggering the battle.

**Fix:** Either:
1. Add a generic post-defeat dialogue for all trainers (e.g., "Tu m'as déjà battu !") and set `altDialogue` on all trainer NPCs, OR
2. Change the check in `interactWithNPC` to also guard against defeated trainers without altDialogue: `if (npc.defeated) { dialogueKey = npc.altDialogue || 'trainer_defeated_generic'; }`

**Found:** 2026-03-28

---

## Bug #47 - Lazy-loaded maps don't restore defeated trainer state on reload
**Status:** Fixed (2026-03-28)
**Priority:** Major
**File:** js/world-data.js (`getMap`)

**Description:** `game._loadGame()` restores defeated trainer flags on NPC objects by iterating `WorldData.maps`. However, only 3 maps are eagerly generated at startup (`borgo`, `player_house`, `prof_lab`). All other maps (routes, cities) are lazy-loaded on first visit. If the player saves after defeating a trainer on `route1`, reloads the game, and then visits `route1` — the map is freshly generated by `getMap('route1')` and the NPC objects have `defeated = false`. The restoration code already ran before route1 was generated, so it never patched these NPCs.

**Steps to reproduce:**
1. Defeat "Gamin Thomas" on Route 1
2. Save the game
3. Reload the page
4. Walk to Route 1
5. "Gamin Thomas" re-challenges the player despite being marked defeated in the save

**Root cause:** `WorldData.getMap()` generates the map when first accessed, but `_loadGame()` already iterated `WorldData.maps` (which didn't include route1 yet) to set `npc.defeated = true`.

**Fix:** Added defeated trainer restoration inside `WorldData.getMap()` immediately after lazy-generating a map — checks `game.state.defeatedTrainers` and sets `npc.defeated = true` on all newly created NPCs whose IDs are in the set.

---

## Bug #48 - Evolution skipped when leveling up mid-trainer-battle
**Status:** Fixed (2026-03-28)
**Priority:** High
**File:** js/battle.js (`_handleEnemyFaint`)

**Description:** If the player's Pokémon levels up and triggers an evolution while defeating a non-last Pokémon in a trainer battle, the evolution sequence never plays. The `pendingEvolve` state is set, but the code returns early to send out the trainer's next Pokémon, bypassing the evolution handling block entirely.

**Steps to reproduce:**
1. Have a Pokémon one level below its evolution threshold (e.g. Aquali at level 15, evolves at 16)
2. Fight a trainer with 2+ Pokémon
3. Defeat the trainer's first Pokémon to reach level 16
4. Evolution message never appears; battle continues normally without evolution

**Root cause:** `_handleEnemyFaint` checks `if (nextPkmn && nextPkmn.currentHp > 0)` and returns early without ever reaching the `pendingEvolve` processing block further down.

**Fix:** Extracted the "continue trainer battle or end battle" logic into a `continueAfterExp()` closure. The evolution sequence (if any) now always runs first via `_processMessageQueue`, then calls `continueAfterExp()` afterward — whether mid-trainer-battle or at the final victory.


---

## Bug #49 - Gym leaders, Elite 4, and Champion unreachable inside solid buildings
**Status:** Fixed (2026-03-28)
**Priority:** Critical
**File:** js/world-data.js

**Description:** All gym buildings and the Pokémon League buildings use solid BUILDING/GYM_BUILDING tiles for the entire interior. NPCs (gym leaders, Elite 4, Champion) are placed inside these solid tiles. The player can enter through the DOOR tile but cannot walk further inside because surrounding tiles are non-walkable. This makes all gym leaders, Elite 4 members, and the Champion unreachable through normal gameplay.

**Steps to reproduce:**
1. Enter any city gym through its door
2. Try to walk toward the gym leader
3. Movement is blocked by solid building tiles

**Root cause:** `_fillRect` fills the entire building area with BUILDING/GYM_BUILDING tiles (non-walkable), including the interior space where NPCs stand. The fix needs to carve walkable GYM_FLOOR tiles inside each building from the door to the NPCs.

**Found:** 2026-03-28

---

## Bug #50 - Duplicate event listeners accumulate when returning to title and starting a new game
**Status:** Fixed (2026-03-28)
**Priority:** Major
**Files:** js/engine.js, js/ui.js

**Description:** When the player returns to the title screen (via `game.returnToTitle()`) and then starts or continues a new game, `GameEngine.init()` and `UI.init()` are called again. Both functions add `window`/`document` event listeners for keyboard input and dialogue interaction without checking if they were already registered. After two or more restarts without a page reload, every keypress fires multiple event handlers, causing inputs to be processed 2–3× per keypress. Movement becomes erratic, dialogue advances multiple steps per click, and menu/escape toggles can fire out of sync.

**Additionally:** `GameEngine.init()` did not reset transient engine state (`warping`, `encounterActive`, `inputLocked`, `repelSteps`, `keysDown`, etc.). Stale flags from a previous game session could persist into the next game.

**Fix:** Added `_eventsBound: false` flag to both `GameEngine` and `UI`. Event listener registration is now guarded by `if (!this._eventsBound)` — only runs once per page load. Added explicit reset of all transient `GameEngine` state at the start of `init()`.

**Found:** 2026-03-28

---

## Bug #51 - No feedback when Pokémon's moveset is full and cannot learn a new move
**Status:** Fixed (2026-03-28)
**Priority:** Minor
**File:** js/battle.js (`_handleEnemyFaint`)

**Description:** When a Pokémon levels up in battle and would learn a new move but already has 4 moves, `addExp()` emits a `newmove_full` event. This event was never handled in `battle.js` — the new move was silently dropped with no notification. The player had no indication that their Pokémon tried to learn a move.

**Fix:** Added handler for `evt.type === 'newmove_full'` in `_handleEnemyFaint`. Queues message: `"X voudrait apprendre Y, mais a déjà 4 attaques !"`.

**Found:** 2026-03-28

---

## Bug #52 - Save action produces no visible confirmation feedback
**Status:** Fixed (2026-03-28) — Already handled: `_renderSaveTab` in ui.js calls `this.showNotification('Partie sauvegardée !')` and sets button text to "Sauvegarde OK !" on click. Verified in code.
**Priority:** Medium
**File:** js/ui.js

**Description:** Clicking "Sauvegarder maintenant" in the pause menu saves the game silently with no toast, message, or animation. The player has no way to know whether the save succeeded or failed.

**Found:** 2026-03-28

---

## Bug #53 - MART tile interaction does nothing — shop unreachable via tile
**Status:** Fixed (2026-03-28)
**Priority:** High
**File:** js/engine.js

**Description:** Standing in front of the MART tile at Porto (29,12) and pressing Space/Enter does nothing. The shop is only accessible by interacting with the Vendeur NPC at (29,11). Players who approach the MART entrance naturally will get no response and may not realise a merchant NPC is present.

**Root cause:** `_handleInteraction()` only looked for `sign` NPCs at the MART tile position. No sign NPC exists there; the merchant NPC is at a different coordinate. The shop action never fired from the tile.

**Fix:** Added merchant NPC lookup when a MART tile is faced: if the facing tile is TILE.MART and no sign NPC is found there, the code now searches for any `merchant` NPC in the map and calls `interactWithNPC(npc)` on it — triggering the standard shop dialogue and shop UI.

**Found:** 2026-03-28

---

## Bug #54 - Holding arrow key only advances one tile (browser key-repeat ignored)
**Status:** Fixed (2026-03-28) — Already handled: `_checkMovementKeys()` is called every frame in `GameEngine.update()` when `!this.moving && !this.inputLocked`. It samples `this.keysDown` (maintained by keydown/keyup events), so held keys produce continuous movement without relying on key-repeat events.
**Priority:** Medium
**File:** js/engine.js

**Description:** Holding an arrow key moves the player exactly one tile then stops. The player must tap the key repeatedly to continue moving. Browser key-repeat events fire while the key is held but are all dropped because the engine gates movement on `!this.moving`.

**Found:** 2026-03-28

---

## Bug #55 - No location name banner after warp transitions
**Status:** Fixed (2026-03-28) — Already handled: `_executeWarp()` in engine.js calls `UI.showLocationName(newMap.name)` after every map transition. `showLocationName` displays the banner for 3s with CSS fade. Verified in code.
**Priority:** Low
**File:** js/engine.js, js/ui.js

**Description:** Transitioning between any two maps (Borgo → Route 2, entering/exiting any building) shows no location name overlay. The player has no visual confirmation of where they have arrived.

**Found:** 2026-03-28

---

## Bug #56 - Poké Ball throw in trainer battle skips turn AND does not consume the ball
**Status:** Fixed (2026-03-28)
**Priority:** Medium
**File:** js/battle.js

**Description:** Throwing a Poké Ball at a trainer's Pokémon correctly shows "On ne peut pas capturer le Pokémon d'un dresseur !" but immediately returns to the action menu — the turn is NOT consumed and the Poké Ball quantity remains unchanged. In mainline Pokémon games the throw wastes the player's turn (enemy still attacks) and the ball is consumed.

**Fix:** Moved `game.state.bag[itemId]--` before the trainer check so the ball is always consumed. Changed the trainer-battle branch to call `this._executeTurn({ type: 'item' })` instead of `_processMessageQueue(() => _showActions())` — enemy now attacks after the failed throw.

**Steps to reproduce:**
1. Enter a trainer battle
2. Open SAC → click Poké Ball
3. Message appears, returns to action menu
4. HP unchanged (enemy did not attack), ball count unchanged

**Found:** 2026-03-28

---

## Bug #57 - Using Repousse (Repel) from bag shows no notification or feedback
**Status:** Fixed (2026-03-28) — Already handled: `_renderBagTab` repel handler at js/ui.js calls `this.showNotification('Repousse activée pour ' + (itemData.steps || 100) + ' pas !')` after activating the repel. Verified in code.
**Priority:** Low
**File:** js/ui.js

**Description:** Clicking Repousse in the overworld bag closes the menu and silently activates the 100-step repel counter with no notification. The player receives no on-screen confirmation that Repousse was used or how many steps remain.

**Found:** 2026-03-28

---

## Bug #58 - Catch celebration confetti particles persist indefinitely on overworld
**Status:** Fixed (2026-03-28)
**Priority:** Low
**File:** js/battle.js

**Description:** After a successful Pokémon catch, colored confetti particles appear on the ground. When returning to the overworld those particles remain visible on the map and do not fade or despawn — they persist indefinitely across the session.

**Steps to reproduce:**
1. Catch a Pokémon in a wild battle
2. Return to the overworld
3. Golden/pink confetti particles remain visibly on the ground near the player's position

**Fix:** `endBattle()` now immediately clears `this.state.confetti = []` and calls `clearInterval(this.state.confettiTimer)` so confetti stops as soon as the battle ends. The `confettiTimer` reference is stored on `this.state` (was a local variable before) so `endBattle` can cancel it.

**Found:** 2026-03-28

---

## Bug #59 - Badge count always 0 — two separate badge tracking systems out of sync
**Status:** Fixed (2026-03-28) — Resolved as part of Bug #27 fix. `BattleSystem.endBattle()` at js/battle.js lines 1478–1485 now sets BOTH `game.state.storyFlags['badge_N'] = true` AND `game.state.badges.push(badgeIndex)` when a gym leader is defeated. Both systems are synced. `UI.updateBadges()` is called immediately after to refresh the HUD.
**Priority:** High
**File:** js/battle.js

**Description:** The Dresseur (trainer card) tab shows "Badges: 0 / 8" and all 8 badge slots show "?" regardless of how many gyms have been defeated. The HUD badge row also never shows any earned badges. All 8 gym badge story flags (`badge_0` through `badge_7`) are correctly set in `storyFlags`, but the UI reads from a separate `game.state.badges[]` array which is never populated.

**Found:** 2026-03-28

---

## Bug #60 - Save notification hidden behind dark menu overlay backdrop
**Status:** Fixed (2026-03-28)
**Priority:** Low
**File:** css/style.css

**Description:** The "Partie sauvegardée !" notification fires correctly when clicking "Sauvegarder maintenant" (z-index:80 > menu z-index:60) and appears in the DOM, but it is rendered at `top: 50px` within `#ui-layer`, which visually falls inside the semi-transparent dark menu backdrop. The dark-on-dark placement makes the notification effectively invisible to the player while the menu is open.

**Fix:** Changed `.notification` position from `top: 50px; transform: translateX(-50%)` to `top: 50%; transform: translate(-50%, -50%)`. Notification now appears centered in the viewport, overlapping the menu panel where it is clearly visible. Animation keyframe updated to match new centered transform.

**Found:** 2026-03-28

---

## Bug #61 - Pokémon nature displayed in English in party detail view
**Status:** Fixed (2026-03-28)
**Priority:** Low
**File:** js/ui.js (_showPokemonDetail)

**Description:** The party Pokémon detail screen shows the nature in English (e.g. "Naughty") instead of French ("Coquin"). All other UI text in this view is in French.

**Fix:** Added `NATURE_NAMES_FR` mapping at the top of `ui.js` (all 25 natures translated to French). `_showPokemonDetail` now renders `NATURE_NAMES_FR[pokemon.nature] || pokemon.nature` instead of `pokemon.nature` directly.

**Found:** 2026-03-28

---

## Bug #64 - Overworld menu opens during trainer battle intro
**Status:** Fixed (2026-03-28)
**Priority:** High
**Files:** js/engine.js, js/ui.js

**Description:** When the player presses Space/Enter to interact with a trainer NPC, the in-game overworld menu (Équipe/Sac/Pokédex tabs) appears on top of the trainer battle screen. The battle starts correctly in the background, but the menu overlay is also visible, blocking the battle UI.

**Steps to reproduce:**
1. Stand adjacent to a trainer NPC (e.g. trainer_r1_1 on Route 1)
2. Press Space to interact
3. The trainer battle begins AND the menu overlay opens simultaneously

**Root cause (suspected):** The Space keydown event is handled by both `GameEngine.handleInput()` (to start the interaction) and `UI._bindKeys()` (to advance dialogue). When the interaction fires and immediately creates a trainer dialogue, `advanceDialogue()` runs in the same event tick and rapidly processes the `{action:'trainer_battle'}` step. During this rapid transition, the menu state or gameMode may briefly enter an unexpected state that causes the menu overlay to open.

**Found:** 2026-03-28

---

## Bug #67 - Rappel (Revive) not usable from battle bag
**Status:** Fixed (2026-03-28)
**Priority:** High
**File:** js/battle.js (`_showBag`, line ~268)

**Description:** The Rappel (Revive) item cannot be used during battle even when the player has them in their bag. The in-battle SAC screen only shows item types: `'ball'`, `'heal'`, and `'status'`. The Rappel has type `'revive'`, so it is silently excluded. Players cannot revive a fainted Pokémon mid-battle.

**Steps to reproduce:**
1. Have Rappel ×N in bag
2. Enter any battle and click SAC
3. Rappel does not appear in the battle bag list

**Root cause:** `_showBag()` at line 268 filters: `item.type === 'ball' || item.type === 'heal' || item.type === 'status'`. The `'revive'` type is not included. `ITEMS.revive` = `{name:'Rappel', type:'revive', healPercent:0.5, price:1500}`.

**Fix:** Add `|| item.type === 'revive'` to the filter in `_showBag()`.

**Found:** 2026-03-28

---

## Bug #65 - FUITE button permanently disabled after any trainer battle
**Status:** Fixed (2026-03-28)
**Priority:** High
**File:** js/battle.js (`_showActions`)

**Description:** After fighting a trainer battle (where FUITE is correctly disabled), every subsequent wild battle also has FUITE permanently disabled. The run button appears greyed out and unclickable for the rest of the session. Players have no way to escape from wild Pokémon using the UI button, though calling `BattleSystem.tryRun()` directly confirms the escape logic itself works correctly.

**Steps to reproduce:**
1. Fight any trainer battle (FUITE correctly greys out)
2. After winning/losing, enter a wild Pokémon battle
3. FUITE button remains disabled (opacity 0.4) despite being a wild encounter

**Root cause:** In `_showActions()` (line ~191), buttons are cloned via `btn.cloneNode(true)`. `cloneNode(true)` preserves all attributes including `disabled=true` from the previous trainer battle. The code then only sets `disabled=true` when `isTrainer=true` — it never explicitly resets `disabled=false` for wild battles. The stale disabled state from the clone persists.

**Fix:** Add an explicit reset in `_showActions()` for non-trainer battles:
```js
if (newBtn.dataset.action === 'run') {
    if (this.state.isTrainer) {
        newBtn.disabled = true;
        newBtn.style.opacity = '0.4';
    } else {
        newBtn.disabled = false;     // ← add this
        newBtn.style.opacity = '1';  // ← add this
    }
}
```

**Found:** 2026-03-28

---

## Bug #66 - Active dialogue persists into next battle (stale dialogue overlay)
**Status:** Fixed (2026-03-28)
**Priority:** Medium
**File:** js/ui.js, js/battle.js

**Description:** If a dialogue is still open (e.g., a trainer's post-defeat dialogue) when a new battle is started programmatically, the dialogue box remains visible on top of the battle screen. The text from the previous interaction continues to show in the dialogue overlay.

**Steps to reproduce:**
1. Defeat a trainer and interact with them again — get post-defeat dialogue
2. Without fully dismissing the dialogue, trigger another battle
3. The old dialogue text is visible over the battle UI

**Root cause:** Neither `game.startBattle()` nor `BattleSystem.startWildBattle()` checks if `UI.dialogue.active` is true and clears the dialogue before starting. The dialogue box is only hidden when `_handleDialogueAction('trainer_battle')` is called, not in the general battle-start path.

**Found:** 2026-03-28

---

## Bug #62 - Porto south exit unreachable — warp tiles placed on non-walkable water
**Status:** Fixed (2026-03-28)
**Priority:** Critical
**File:** js/world-data.js (porto map generation)

**Description:** Porto's south edge contains warp tiles intended to lead to Route 1, but they are placed at y=39 on water tiles (tile type 3, WATER). Water tiles are not in the WALKABLE_TILES set, so the player cannot reach them. The southernmost walkable row in Porto is y=29. Players have no way to exit Porto to the south through normal gameplay.

**Steps to reproduce:**
1. Start in Porto and try to walk south past y=29
2. Movement is blocked by water tiles
3. The warp to Route 1 at y=39 is completely unreachable on foot

**Root cause:** Porto's map generator places south-exit warp targets at y=39 but fills tiles between y=29 and y=38 with WATER (tile 3) without placing a walkable path or bridge leading to the warp.

**Workaround:** Directly call `GameEngine.warp('route1', x, y)` in the browser console.

**Found:** 2026-03-28

---

## Bug #63 - HP displays as "NaN/50" after leveling up mid-battle
**Status:** Fixed (2026-03-28)
**Priority:** Critical
**File:** js/battle.js

**Description:** During a trainer battle (Eclipse Grunt on Route 3), after Aquanox leveled up by defeating the Grunt's first Pokémon, the HP display in the player's battle status card showed "NaN/50" for the remainder of the battle. The party dot for Aquanox also turned red (critical HP), as if the HP value was numerically interpreted as NaN < threshold. The HP bar itself appeared visually correct, but the numeric HP text was broken.

**Steps to reproduce:**
1. Have Aquanox near a level-up threshold (e.g., Nv.16 → 17)
2. Fight the Eclipse Grunt on Route 3
3. Defeat the Grunt's first Pokémon, triggering a level-up
4. The HP display switches to "NaN/50" for the rest of the battle

**Root cause (suspected):** On level-up, `addExp()` recalculates `stats.hp` to a new maximum. If `currentHp` is updated to the new max but the UI reads `pokemon.currentHp` before it is set, or if the stat recalculation assigns `NaN` to `currentHp` during the HP scaling formula (e.g., dividing by zero or using an undefined ratio), the display value becomes NaN. The `_updateUI` function likely renders `pokemon.currentHp` directly without a `Number.isFinite()` guard.

**Found:** 2026-03-28
