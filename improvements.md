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
- **Borgo Pokémon Center is a bare tile**: The Borgo PC tile (`TILE.PC` at x=8, y=17) sits alone on the path with no building frame and no nurse NPC (the other cities all have a proper Pokémon Center building). The `_healParty()` path does restore HP and PP correctly (Bug #22 fixed), but the visual presentation is inconsistent with the rest of the game. Borgo should have a proper Center building with a nurse NPC using the same `nurse_heal` dialogue.

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

- **No back/front sprite differentiation visible for player**: In battle, the player's Pokémon is drawn with `facing: 'back'` (mirrored horizontally), but for many sprite types the result looks nearly identical to the front. Distinct back-sprite designs would improve visual clarity.
- ~~**Prof. Oliva NPC visible in outdoor overworld**~~ **Done (2026-03-28)**: Added `disappearAfter: true` to outdoor Prof. Oliva NPC — she vanishes from the overworld after `met_professor` flag is set.

---

## UX / UI

- ~~**Menu cannot be closed with Escape when sub-view is active**~~ **Done (2026-03-28)**: Escape correctly closes the menu from any tab (Equipe, Sac, Pokédex, Dresseur, Sauvegarder). Bug #29 fix fully verified.
- ~~**Save confirmation UX**~~ **Done (2026-03-28)**: Notification toast renders correctly above the menu overlay (z-index:80 vs menu z-index:60). Save notification is fully visible during the menu. Bug #11 closed.
- ~~**Arrow keys don't register reliably for movement**~~ **Done (2026-03-28)**: Added `e.preventDefault()` for arrow keys and spacebar in the window keydown handler, preventing browser scrolling from stealing focus.
- ~~**Party HUD dots (top-right) not visible for badges**~~ **Done (2026-03-28)**: Unearned badge slots are now square with a faint ✦ icon; earned badges are round with gold gradient and ★ icon. Visually distinct from party HP dots.
- **No loading indicator between maps**: Map transitions use a fade to black but there is no spinner or progress indicator. This is fine for small maps but could be extended for feel.
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
