# Pokémon Novara - Improvements & Suggestions

---

## Design

- ~~**Battle layout proportions**~~ **Done (2026-03-28)**: Responsive viewport scaling via `_scaleGame()` ensures the full 960px battle canvas is always visible, even on narrow displays. See Bug #12 fix.
- ~~**Battle canvas gap**~~ **Done (2026-03-28)**: Battle render now fills entire canvas with `#1a1a2e` before drawing background. See Bug #33 fix.
- ~~**Lab interior map too small**~~ **Done (2026-03-28)**: Camera now auto-zooms on small maps — calculates `camScale = max(canvasW/mapW, canvasH/mapH)` (capped at 2.5×) and applies `ctx.scale()` during render. Lab and player house now fill the screen.
- ~~**Starter selection layout**~~ **Done (2026-03-28)**: Starter cards now show base stats summary (PV, Atq, Déf, Vit) below the type label, filling the empty space.

---

## Gameplay

- ~~**No post-starter alternate dialogue for Prof. Oliva**~~ **Done (2026-03-28)**: Added `story_prof_postgame` dialogue and `altDialogue`/`altFlag` NPC fields. See Bug #8 fix.
- ~~**Catch rate feedback**~~ **Done (2026-03-28)**: Added confetti particle celebration (60 colorful particles with gravity) on successful catch, alongside the existing `catch_success` SFX.
- ~~**No "Gotcha!" catch success message**~~ **Done (2026-03-28)**: Battle system already shows `"Gotcha ! {name} est capturé !"` on successful catch.
- ~~**No experience bar animation**~~ **Done (2026-03-28)**: `.xp-fill` already has `transition: width 0.5s ease` in CSS, providing smooth XP bar animation.
- ~~**No evolution animation/sequence**~~ **Done (2026-03-28)**: Added evolution flash sequence — white screen pulses 3 times over 1.2s with "Hein ?! X évolue !" message before the transformation completes.
- ~~**Trainers need post-defeat dialogue**~~ **Done (2026-03-28)**: All 8 gym leaders now have `altDialogue` and `gym{N}_defeated` entries. Re-interacting with a defeated gym leader shows their post-defeat dialogue instead of re-triggering the battle. See Bug #26 fix.
- ~~**Borgo Pokémon Center is a bare tile**~~ **Done (2026-03-28)**: Added 6×5 building frame around the PC tile and a `nurse_borgo` NPC with `nurse_heal` dialogue, matching the pattern used by Porto and other cities.

---

## Dialogues

- ~~**Typo "sauvegardee" in Quitter tab and save notification**~~ **Done (2026-03-28)**: Fixed both remaining instances — save notification now reads `'Partie sauvegardée !'` and Quitter tab reads `'Votre partie sera sauvegardée automatiquement.'`
- ~~**Item use notification typos**~~ **Done (2026-03-28)**: Fixed all four accents in `_useItemOnPokemon`: `"a déjà tous ses PV"`, `"récupère des PV"`, `"est ranimé"`, `"est soigné"`.
- ~~**Clicking dialogue box does not advance dialogue**~~ **Done (2026-03-28)**: Added click event listener on `dialogueBox` in `UI.init()` — clicking the dialogue box now calls `advanceDialogue()`.
- ~~**Dialogue indicator pulse**~~ **Done (2026-03-28)**: Enhanced ▼ indicator with larger font, gold text-shadow glow, faster bounce (0.8s), and opacity pulse from 1→0.5.
- ~~**Player name not validated**~~ **Done (2026-03-28)**: Empty name now shows red border and placeholder "Entrez un nom !" instead of silently defaulting to "Red".

---

## Colors & Visual

- ~~**Move types displayed in English in Pokémon detail view**~~ **Done (2026-03-28)**: Added `TYPE_NAMES_FR` mapping in `ui.js`, applied to both the detail view and party list.
- ~~**Pokémon type in party list shows English**~~ **Done (2026-03-28)**: Party list now uses French type names ("Eau", "Feu", "Plante", etc.).
- ~~**Battle HP bar color**~~ **Done (2026-03-28)**: HP bar already uses green > 50%, orange 20–50%, red < 20% via `backgroundColor` in `BattleSystem._updateUI()`.
- ~~**Black bars in interior maps**~~ **Done (2026-03-28)**: Canvas clear color now uses warm dark brown `#1a100a` for indoor maps (detected via `map.music === 'indoor'`), black for outdoor maps.

---

## Characters

- ~~**No back/front sprite differentiation visible for player**~~ **Done (2026-03-28)**: Back-facing sprites now overlay dorsal markings (spine stripe + spots) and cover the face area with body color, making them visually distinct from front sprites.
- ~~**Prof. Oliva NPC visible in outdoor overworld**~~ **Done (2026-03-28)**: Added `disappearAfter: true` to outdoor Prof. Oliva NPC — she vanishes from the overworld after `met_professor` flag is set.

---

## UX / UI

- ~~**Menu cannot be closed with Escape when sub-view is active**~~ **Done (2026-03-28)**: Escape correctly closes the menu from any tab (Equipe, Sac, Pokédex, Dresseur, Sauvegarder). Bug #29 fix fully verified.
- ~~**Save confirmation UX**~~ **Done (2026-03-28)**: Notification toast renders correctly above the menu overlay (z-index:80 vs menu z-index:60). Save notification is fully visible during the menu. Bug #11 closed.
- ~~**Arrow keys don't register reliably for movement**~~ **Done (2026-03-28)**: Added `e.preventDefault()` for arrow keys and spacebar in the window keydown handler, preventing browser scrolling from stealing focus.
- ~~**Party HUD dots (top-right) not visible for badges**~~ **Done (2026-03-28)**: Unearned badge slots are now square with a faint ✦ icon; earned badges are round with gold gradient and ★ icon. Visually distinct from party HP dots.
- ~~**No loading indicator between maps**~~ **Done (2026-03-28)**: Added spinning Poké Ball indicator during warp fade (appears when fade > 80%). Red/white ball with center button rotates smoothly during map transition.
- ~~**Pokédex entries not clickable**~~ **Done (2026-03-28)**: Clicking a seen/caught Pokédex entry opens a detail panel with sprite, type badges, French description, and base stat bars with color coding. Back button returns to grid.
- ~~**Game not responsive / no mobile support**~~ **Done (2026-03-28)**: Added `_scaleGame()` in `main.js` — computes `Math.min(1, innerWidth/960, innerHeight/640)` and applies `transform: scale()` to `#game-container`. Runs on init and window resize. Fixes Bug #12.
- ~~**Party detail view shows max HP only, not current/max**~~ **Done (2026-03-28)**: HP stat now shows `"PV: 16 / 20"` (current/max) in `_showPokemonDetail`. Also fixed accent typos in stat labels: "Défense", "Atq. Spé.", "Déf. Spé.".

---

## Sound / Music

- ~~**No sound feedback on dialogue advance**~~ **Done (2026-03-28)**: Added `text_blip` SFX (1200Hz, 30ms square wave) — plays on every `advanceDialogue()` call.
- ~~**No sound on menu navigation**~~ **Done (2026-03-28)**: Menu tab clicks now play `menu_tab` SFX (600Hz, 50ms triangle wave), distinct from the general `select` sound.
- ~~**Battle music restarts on every battle**~~ **Done (2026-03-28)**: `AudioSystem.playMusic()` already checks `if (this.currentTrack === trackName) return;` — same track is not restarted.

---

## Performance

- ~~**Sprite cache LRU**~~ **Done (2026-03-28)**: Added `_cacheOrder` array and `_maxCacheSize: 200` limit — oldest entries are evicted when cache is full.
- ~~**`WorldData.init()` generates all maps at startup**~~ **Done (2026-03-28)**: Maps are now lazy-loaded on first visit via `_generators` registry. Only borgo, player_house, and prof_lab are eagerly generated at startup; all other 16 maps are deferred until `getMap()` is called.

---

## New Suggestions (2026-03-28 QA session)

### UX / UI

- ~~**In-app title screen return**~~ **Done (2026-03-28)**: Implemented `game.returnToTitle()` — stops music, resets state, rebuilds title menu with New/Continue buttons, no page reload.

- ~~**Battle move type indicator**~~ **Done (2026-03-28)**: Move buttons now show a coloured type badge (e.g., "Feu", "Eau") next to the move name using `TYPE_NAMES_FR` and `TYPE_COLORS`.

- ~~**Caught ball display in Pokédex detail**~~ **Done (2026-03-28)**: Pokédex detail now shows "Capturé avec : [ball name]" below type badges for caught Pokémon, using the `caughtBall` field.

### Gameplay

- ~~**Party HP dots colour coding**~~ **Done (2026-03-28)**: Added 6 colour-coded dots to the HUD (`#party-dots`). Green > 50% HP, orange 20–50%, red < 20%, grey for fainted, dim for empty slots. Updated every frame via `UI.updatePartyDots()`.

### Battle

- ~~**Whiteout sequence**~~ **Done (2026-03-28)**: On loss, party is healed + PP restored, player warps to last heal location after 1.5s delay, loses half money. Notification "Vous avez perdu connaissance..." shown.

- ~~**Trainer battle intro differentiation**~~ **Done (2026-03-28)**: Trainer battles now show intro messages ("X veut se battre !", "X envoie Y !") before revealing the enemy Pokémon. Enemy sprite starts hidden (alpha=0) and appears after the intro sequence. Wild battles also show their message before action buttons appear.

- ~~**Potion unusable feedback**~~ **Done (2026-03-28)**: Already implemented — notification "a déjà tous ses PV !" shown for full HP, "est K.O. ! Utilisez un Rappel." for fainted. Verified in code.

- ~~**Run button visibility in trainer battles**~~ **Done (2026-03-28)**: FUITE button is now `disabled` with `opacity: 0.4` and tooltip text in trainer battles.

### UX / Menus

- ~~**Item descriptions in bag (overworld)**~~ **Done (2026-03-28)**: Already implemented — `.item-desc` div with `itemData.desc` shown for every bag item. Verified in code + CSS.

- ~~**Pokémon detail level/nature display**~~ **Done (2026-03-28)**: Added level, type badges (colored pills), and nature to the party detail view header between the name and sprite.

---

## New Suggestions (2026-03-28 QA session #2)

### Battle

- ~~**Enemy HP numbers in battle**~~ **Done (2026-03-28)**: Added `enemy-hp-text` element and `_updateUI` logic to display current/max HP numerically below the enemy HP bar, matching the player's side.

### UX / UI

- ~~**Fainted Pokémon visual feedback in battle**~~ **Done (2026-03-28)**: Info panel now gets `fainted` CSS class on KO — turns dark red, reduces opacity to 50%, and plays a brief white flash animation. Applied to both player and enemy panels.

- ~~**XP bar in battle victory screen**~~ **Done (2026-03-28)**: XP bar fill transition slowed to 1.2s ease-out (from 0.5s) so the fill animation is clearly visible during the "gagne X points d'exp." message. XP bar height increased to 5px for better visibility.

---

## New Suggestions (2026-03-28 QA session #3 — World & Design)

### World / Cities

- ~~**City-themed building colors**~~ **Done (2026-03-28)**: Added `theme.building` color config to each city map. Buildings now render with unique palettes: Porto (teal-blue), Campoverde (forest green), Rivalta (ocean blue), Volcania (red-orange), Glacia (ice-blue), Abyssia (dark purple), Pokémon League (gold). `SpriteRenderer.drawTile` accepts optional theme parameter.

- ~~**City decorative elements**~~ **Done (2026-03-28)**: Added 3 new tile types (FOUNTAIN with animated water, BENCH, LAMPPOST with golden glow) and placed them in all 7 cities. Each city now has a fountain, bench(es), and lamppost(s) for a lived-in feel.

- ~~**City entrance signs**~~ **Done (2026-03-28)**: Added sign tiles and sign NPCs with city description dialogues to Porto, Volcania, Glacia, Abyssia, and Pokémon League entrances. Each sign shows the city name and a brief description.

- ~~**More NPCs with flavor dialogue per city**~~ **Done (2026-03-28)**: Added 14 new villager NPCs across 4 cities: Borgo (+2), Volcania (+3), Glacia (+3), Abyssia (+3). Each NPC has unique French dialogue reflecting the city's theme and lore.

### Routes / Environment

- ~~**Desert route green grass inconsistency**~~ **Done (2026-03-28)**: Added `theme.tallGrass` color config to desert maps (Route 4 and Route 5). Tall grass on sand now renders with sandy brown colors instead of green, using the theme system in `SpriteRenderer.drawTile`.

- ~~**Route environmental objects**~~ **Done (2026-03-28)**: Added scattered rocks, small ponds, and flower patches to Routes 1, 2, 3, 6, and 7. Each route now has 2-3 rock formations, a small water pond or flower patch for visual variety beyond just grass and trees.

### Buildings / Interiors

- ~~**Gym visual differentiation**~~ **Done (2026-03-28)**: Added `TILE.GYM_BUILDING` (26) tile type with red roof stripe and gold badge star. All 8 gym buildings now use this tile, making them visually distinct from regular buildings while still using the city's theme colors.

- ~~**Interior furniture and detail**~~ **Done (2026-03-28)**: Added 3 new tile types (TABLE, RUG walkable, BOOKSHELF with colored book spines). Player house now has bookshelves, dining table, and a red rug. Lab tables upgraded from WALL to TABLE tiles, bookshelves added along the back wall.

---

## New Suggestions (2026-03-28 QA session #4 — Gameplay & UX)

### Battle

- ~~**No money reward message after trainer victory**~~ **Done (2026-03-28)**: Already implemented — `battle.js` `_handleEnemyFaint` queues `"Vous recevez X₽ !"` message when `trainerNpc.reward` is set. Verified in code.

- ~~**Pokémon switch screen shows plain text, no HP bars**~~ **Done (2026-03-28)**: Each party slot in the in-battle switch screen now shows a name/level row with current/max HP, plus a color-coded HP bar (green >50%, orange >20%, red ≤20%) below it.

- ~~**Battle area blank between turns**~~ **Done (2026-03-28)**: Added subtle animated gradient panel with slow-scrolling shimmer lines in the canvas area below the battle scene. The area now has a deep blue gradient background with barely-visible scanning lines, eliminating the dead space.

### UX / Overworld

- ~~**No active Repel indicator**~~ **Done (2026-03-28)**: Added `#repel-indicator` pill in the HUD (green, between badges and party dots). Shows "🌿 Repousse : N pas" when a Repel is active; hidden otherwise. Updated every frame via `UI.updatePartyDots()`.

- ~~**Pokédex stat bars are all red**~~ **Done (2026-03-28)**: Already implemented — stat bars use color-coded backgrounds: green (`#4CAF50`) for stat ≥ 100, orange (`#FF9800`) for ≥ 70, red (`#F44336`) for < 70. Verified in `_showPokedexDetail` at ui.js line 1045.

- ~~**Nature names in English in party detail**~~ **Done (2026-03-28)**: Added `NATURE_NAMES_FR` mapping in `ui.js` (all 25 natures). `_showPokemonDetail` now shows French nature names. See Bug #61 fix.

### Menus

- ~~**Save notification obscured by menu backdrop**~~ **Done (2026-03-28)**: Notification repositioned to `top: 50%; transform: translate(-50%, -50%)` — now centered in the viewport, fully visible over the menu overlay. See Bug #60 fix.

---

## New Suggestions (2026-03-28 QA session #5 — Gameplay & UX)

### Battle

- ~~**Battle move list: show base power and accuracy**~~ **Done (2026-03-29)**: Move buttons now show `Pw: N | Préc: N%` in the move-info line alongside PP. Status moves display `Pw: —`.

### Shop / Items

- ~~**Shop: show feedback when purchase fails due to insufficient funds**~~ **Done (2026-03-29)**: Already implemented — `_renderShopBuy` in ui.js calls `this.showNotification('Pas assez d\'argent !')` when `game.state.money < itemData.price`. Verified in code.

- ~~**Escape Rope: add guard against use in towns and routes**~~ **Done (2026-03-29)**: Added `isDungeon: true` to `grotte1` and `victory_road` in `world-data.js`. Escape Rope handler in `ui.js` now checks `WorldData.getMap(currentMap).isDungeon` before use — shows "Ce n'est pas le bon endroit pour ça !" and returns early (item not consumed) when used outside a dungeon.

### Trainer Card

- ~~**Badge slots: show type silhouettes for unearned badges**~~ **Done (2026-03-29)**: Unearned badge slots in `_renderTrainerTab` now show a 3-letter type abbreviation (NOR, PLA, EAU, ELE, FEU, SOL, GLA, DRA) with the corresponding type color at low opacity as background, border, and text. Earned badges still show gold gradient with the badge number.

---

## New Suggestions (2026-03-29 QA session #6 — Items, Evolution, Exploration)

### Items / Bag

- ~~**No feedback when using item on ineligible Pokémon**~~ **Done (2026-03-29)**: Already implemented — `_useItemOnPokemon` shows `"X a déjà tous ses PV !"` for full-HP targets, `"X est K.O. ! Utilisez un Rappel."` for fainted Pokémon, and `"Cela n'aura aucun effet."` for mismatched status cures. Verified in code.

- ~~**No confirmation after manual save**~~ **Done (2026-03-29)**: `_renderSaveTab` click handler calls `this.showNotification('Partie sauvegardée !')` and changes button text to `'Sauvegarde OK !'` for 2s after a manual save. Verified in code at ui.js line 1188.

### Maps / World

- ~~**Rivalta accessible without badge_1**~~ **Done (2026-03-29)**: Fixed warp connections — Porto's north now leads to Campoverde (badge_1, Flora) instead of directly to Route 3. Campoverde gains a south exit back to Porto. Route 3's south exits now target Campoverde instead of Porto. Correct progression: Porto → Campoverde (badge_1) → Route 3 → Rivalta (badge_2/3). The cave path (Porto → Route 2 → Grotte Sombre → Campoverde east) remains as an alternative route.

---

## New Suggestions (2026-03-29 QA session #7 — Shops, Battles, Evolution, UX)

### Battle

- ~~**Guard against starting battle with fully-fainted party**~~ **Done (2026-03-29)**: `startWildBattle` and `startTrainerBattle` now call `game.endBattle('lose')` (whiteout) when no alive Pokémon found instead of returning silently. See Bug #88 fix.

- ~~**Show level-up stat changes in battle**~~ **Done (2026-03-29)**: `addExp` now includes `statGains` in the `levelup` event. Battle handler queues a "+N PV / +N Atq / ..." message after the level-up notification.

- ~~**Move PP warning colour**~~ **Done (2026-03-29)**: PP count in move buttons turns orange when ≤ 25% PP remaining, red when 0 PP. Applied via inline `color` style on the PP span in `_showMoves`.

### Shop / UX

- ~~**Quantity selector for bulk purchases**~~ **Done (2026-03-29)**: Added a ×1/×5/×10 quantity bar at the top of the buy panel. Price display updates to show total cost (e.g. "5×200 $ = 1000 $"). Acheter button purchases the full quantity at once. `shop.buyQty` state persists within the shop session and resets to 1 on re-open.

- ~~**Confirm dialog before selling**~~ **Done (2026-03-29)**: Clicking "Vendre" now shows inline confirmation buttons ("Oui" / "Non") in place of the sell button. "Oui" completes the sale and re-renders the shop; "Non" re-renders the sell list without selling.

### Overworld / UX

- ~~**Run animation / footstep sound**~~ **Done (2026-03-29)**: Added 4 terrain-specific step SFX (`step_grass`, `step_path`, `step_cave`, `step_sand`) to AudioSystem. `engine.js` plays the appropriate sound on every movement step completion based on the destination tile type (TALL_GRASS/FLOWER → rustle, CAVE_FLOOR → hollow tap, SAND → soft rustle, everything else → stone click).

- ~~**Pokémon following the player**~~ **Done (2026-03-29)**: First alive party Pokémon follows one tile behind the player in the overworld. Follower state tracked in `GameEngine` (followerX/Y, followerMoving, followerMoveProgress). Follower animates at the same speed as the player, snaps to player position on warp, and is rendered as a 32px Pokémon sprite via `SpriteRenderer.drawPokemon` in the y-sorted entity list.

---

## New Suggestions (2026-03-29 QA session #8 — Battle, Shops, Progression)

### Battle

- ~~**Struggle fallback when all PP is depleted**~~ **Done (2026-03-29)**: When all moves show 0 PP, a "Charge" button now appears in the move list. It executes a tackle-equivalent attack (Normal, Pw:40, 100% accuracy) using the existing MOVES_DB `tackle` entry. Consistent with the enemy AI fallback already at `battle.js:981`. See Bug #94 fix.

- ~~**EXP share for party**~~ **Done (2026-03-29)**: Added `exp_share` key item (2000₽, available at Volcania shop). When in bag, `_handleEnemyFaint` in `battle.js` automatically distributes 50% of earned EXP to all living bench Pokémon. Level-up and evolution events for bench Pokémon are queued as battle messages. Bag UI shows "Actif" label for key items; shop prevents buying more than one.

### Shops / Items

- ~~**Town-specific shop inventories**~~ **Done (2026-03-29)**: Each merchant NPC now has a `shopInventory` array. Porto: Poké Ball, Potion, Antidote, Repousse. Campoverde: adds Super Ball, Super Potion, Rappel. Rivalta: adds Hyper Potion, Corde Sortie. Volcania: adds Hyper Ball. Glacia: adds Rappel Max. Abyss City: adds Potion Max. `_openShopUI` reads `_currentNpc.shopInventory` if present, falls back to the full default list.

### World / Navigation

- ~~**Warp tile validation at map load**~~ **Done (2026-03-29)**: Added warp validation in `WorldData.getMap()` — after a map is generated, all its warps are checked: source tile at `(x,y)` and target tile at `(targetX,targetY)` in the destination map (if already loaded) are verified against `WALKABLE_TILES`. Non-walkable tiles log `console.warn` with map name and coordinates. Prevents future regressions like Bugs #89–93.


---

## New Suggestions (2026-03-29 QA session #9 — Items, Dialogue, Battle UX)

### Battle / Items

- ~~**Party selection for heal items in battle**~~ **Done (2026-03-29)**: Added `_showHealTarget(itemId)` — party selection panel for heal items in battle. Shows all alive party members with current/max HP. Full-HP targets show "X a déjà tous ses PV !" without consuming the item. See Bug #96 fix.

- ~~**Block menu open during active dialogue**~~ **Done (2026-03-29)**: `openMenu()` now guards against `dialogue.active`. Escape during dialogue now calls `advanceDialogue()` instead of silently doing nothing. Also fixed Bug #97 (dialogue restart loop) with `e.stopPropagation()` and `_handleInteraction` guard.

### Overworld / UX

- ~~**Antidote/status item party indicator**~~ **Done (2026-03-29)**: In `_showItemUseTarget`, each Pokémon row now checks eligibility before rendering. Ineligible Pokémon are shown at 40% opacity with no cursor and a red reason label (e.g. "PV max", "K.O.", "Aucun effet", "Nv. max"). Click handlers are only attached to eligible targets.

- ~~**Bag item use from party tab**~~ **Done (2026-03-29)**: Added "Utiliser un objet" section at the bottom of `_showPokemonDetail`. Shows buttons for all usable bag items (heal/revive/status/levelup). Ineligible items are shown at 40% opacity and non-clickable. Clicking an eligible item applies the effect inline, decrements the bag, shows a notification, and refreshes the detail view after 900ms.

---

## New Suggestions (2026-03-29 QA session #7 — Visual Polish & Gameplay Flow)

### Sprites / Visual

- ~~**Player sprite walking animation**~~ **Done (2026-03-29)**: Already implemented — `drawPlayer` uses `frame`-based `bobY`, `legOffset`, and `armSwing` for bounce, leg alternation, and arm swing. Only activates during movement (`walkFrame = this.moving ? frame : 0`). Verified in code.

- ~~**NPC facing direction visual**~~ **Done (2026-03-29)**: NPC `drawNPC` now renders direction-specific face details — front/right shows eyes+mouth, back (UP) shows hair covering the face, left shows single side-view eye. NPCs now visually face the direction they're looking.

### Gameplay Flow

- ~~**Location name popup duration too short**~~ **Done (2026-03-29)**: Already implemented — `showLocationName` uses 3-second timeout with 0.5s CSS opacity transition. Verified in code.

- **No "Continue" prompt between battle messages**: Battle messages auto-advance on a 1.5s timer. Adding a ▼ indicator and requiring Space/click to advance would give players control over battle pacing, especially for reading damage numbers and status messages.

---

## New Suggestions (2026-03-29 QA session #8 — Visual Quality Overhaul)

### Sprite Quality

- ~~**Gradient shading on Pokémon sprites**~~ **Done (2026-03-29)**: Added `_gradientRect` helper for linear gradient fills on all body parts. Biped and quadruped Pokémon now render with top-lit 3D gradient shading instead of flat colors. Bodies, heads, arms, and legs all have highlight-to-shadow gradients.

- ~~**Enhanced Pokémon eyes with iris and reflection**~~ **Done (2026-03-29)**: Added `_drawEye` helper rendering sclera, colored iris, dark pupil, and white highlight reflection dot. Applied to biped and quadruped types. Eyes now look alive and expressive.

- ~~**Body outlines for Pokémon sprites**~~ **Done (2026-03-29)**: Added `_outline` and `_strokeRoundRect` helpers for soft dark outlines around body parts. Pokémon are now clearly defined against any background. Applied to biped and quadruped types.

- ~~**Quadruped ear and nose details**~~ **Done (2026-03-29)**: Quadruped Pokémon now have pointed ears on the head and a small nose dot, making them look more animal-like and distinctive.

### Character Sprites

- ~~**Player sprite gradient shading**~~ **Done (2026-03-29)**: Player character now renders with gradient fills on jacket, hat, skin, backpack, arms, and legs. Outlines added to major body parts. Much more polished 3D appearance.

- ~~**NPC sprite gradient shading**~~ **Done (2026-03-29)**: All NPC types now render with gradient fills on shirt, pants, skin, and hair. Body outlines added. NPCs look more polished and consistent with the upgraded player sprite.

- ~~**Bird sprite gradient + radial shading**~~ **Done (2026-03-29)**: Bird body, breast, and head now use radial gradients for sphere-like 3D shading. Body and head have dark outlines. Eyes upgraded with `_drawEye` (iris + reflection).

- ~~**Aquatic sprite gradient + scale detail**~~ **Done (2026-03-29)**: Aquatic body uses radial gradient with outline. Added scale arc details on the body. Eye upgraded with `_drawEye`.

- ~~**Dragon sprite gradient + outline**~~ **Done (2026-03-29)**: Dragon body and head now use `_gradientRect` with outlines. Belly has gradient fill. Eyes upgraded with `_drawEye` for expressive dragon pupils.
