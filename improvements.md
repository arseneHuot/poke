# Pokémon Novara - Improvements & Suggestions

---

## Design

- **Battle layout proportions**: The battle scene uses the full 960px canvas width, placing the enemy at 70% (x≈672) and the player at 25% (x≈240). On smaller displays the enemy is cut off. Consider scaling the positions to a fixed smaller battle area, or implement CSS `transform: scale()` to fit any viewport.
- ~~**Battle canvas gap**~~ **Done (2026-03-28)**: Battle render now fills entire canvas with `#1a1a2e` before drawing background. See Bug #33 fix.
- **Lab interior map too small**: The prof's lab interior is 18×14 tiles (576×448px) inside a 960×640px canvas, leaving large black borders around the room. Interior maps should either be larger or the camera should be clamped to show a zoomed-in view that fills the screen.
- **Starter selection layout**: The starter cards only use the upper half of the screen; the lower half is empty black. Cards could be centered vertically, or more information (base stats, move preview) could fill the space.

---

## Gameplay

- ~~**No post-starter alternate dialogue for Prof. Oliva**~~ **Done (2026-03-28)**: Added `story_prof_postgame` dialogue and `altDialogue`/`altFlag` NPC fields. See Bug #8 fix.
- **Catch rate feedback**: When a Poké Ball fails, the shake-count messages do exist ("Oh non ! Le Pokémon s'est libéré !", "Mince ! C'était presque !", "Argh ! Si près du but !"), but there is no success fanfare or confetti effect when a catch succeeds — just a silent party addition message. A visual/audio celebration would improve the feel.
- ~~**No "Gotcha!" catch success message**~~ **Done (2026-03-28)**: Battle system already shows `"Gotcha ! {name} est capturé !"` on successful catch.
- **No experience bar animation**: After a battle, the XP bar updates instantly. A smooth fill animation would make leveling-up feel more rewarding.
- **No evolution animation/sequence**: If a Pokemon evolves after battle, consider adding a visual evolution sequence rather than a silent update.
- ~~**Trainers need post-defeat dialogue**~~ **Done (2026-03-28)**: All 8 gym leaders now have `altDialogue` and `gym{N}_defeated` entries. Re-interacting with a defeated gym leader shows their post-defeat dialogue instead of re-triggering the battle. See Bug #26 fix.
- **Borgo Pokémon Center is a bare tile**: The Borgo PC tile (`TILE.PC` at x=8, y=17) sits alone on the path with no building frame and no nurse NPC (the other cities all have a proper Pokémon Center building). The `_healParty()` path does restore HP and PP correctly (Bug #22 fixed), but the visual presentation is inconsistent with the rest of the game. Borgo should have a proper Center building with a nurse NPC using the same `nurse_heal` dialogue.

---

## Dialogues

- ~~**Typo "sauvegardee" in Quitter tab and save notification**~~ **Done (2026-03-28)**: Fixed both remaining instances — save notification now reads `'Partie sauvegardée !'` and Quitter tab reads `'Votre partie sera sauvegardée automatiquement.'`
- ~~**Item use notification typos**~~ **Done (2026-03-28)**: Fixed all four accents in `_useItemOnPokemon`: `"a déjà tous ses PV"`, `"récupère des PV"`, `"est ranimé"`, `"est soigné"`.
- ~~**Clicking dialogue box does not advance dialogue**~~ **Done (2026-03-28)**: Added click event listener on `dialogueBox` in `UI.init()` — clicking the dialogue box now calls `advanceDialogue()`.
- **Dialogue indicator (▼) starts hidden and only shows after typewriter finishes**: This is correct behaviour, but the indicator could pulse/animate more visibly to prompt the player.
- **Player name not validated**: An empty name silently defaults to "Red" with no feedback. Consider showing a short validation hint like "Nom invalide" if the field is left blank.

---

## Colors & Visual

- ~~**Move types displayed in English in Pokémon detail view**~~ **Done (2026-03-28)**: Added `TYPE_NAMES_FR` mapping in `ui.js`, applied to both the detail view and party list.
- ~~**Pokémon type in party list shows English**~~ **Done (2026-03-28)**: Party list now uses French type names ("Eau", "Feu", "Plante", etc.).
- ~~**Battle HP bar color**~~ **Done (2026-03-28)**: HP bar already uses green > 50%, orange 20–50%, red < 20% via `backgroundColor` in `BattleSystem._updateUI()`.
- **Black bars in interior maps**: When entering small indoor maps (lab, houses), large black rectangles appear to the sides due to the fixed 960px canvas being wider than the map. Filling with a solid color, a pattern, or a decorative border would look much more polished.

---

## Characters

- **No back/front sprite differentiation visible for player**: In battle, the player's Pokémon is drawn with `facing: 'back'` (mirrored horizontally), but for many sprite types the result looks nearly identical to the front. Distinct back-sprite designs would improve visual clarity.
- **Prof. Oliva NPC visible in outdoor overworld does not match indoor lab position**: The outdoor Prof. Oliva NPC is positioned to trigger the intro dialogue, but after obtaining a starter the outdoor NPC remains, which can lead to confusion about where to find the professor.

---

## UX / UI

- ~~**Menu cannot be closed with Escape when sub-view is active**~~ **Done (2026-03-28)**: Escape correctly closes the menu from any tab (Equipe, Sac, Pokédex, Dresseur, Sauvegarder). Bug #29 fix fully verified.
- ~~**Save confirmation UX**~~ **Done (2026-03-28)**: Notification toast renders correctly above the menu overlay (z-index:80 vs menu z-index:60). Save notification is fully visible during the menu. Bug #11 closed.
- **Arrow keys don't register reliably for movement**: Key-down/key-up events are processed in a single frame, making held-key movement unreliable unless focus is on the canvas. Clicking the game canvas before using arrow keys is required.
- **Party HUD dots (top-right) not visible for badges**: The badge slots in the HUD show 8 empty grey circles even when no badges are earned, which looks identical to the party HP indicator. Differentiate visually (e.g., star outline for empty badge, filled star for earned).
- **No loading indicator between maps**: Map transitions use a fade to black but there is no spinner or progress indicator. This is fine for small maps but could be extended for feel.
- **Pokédex entries not clickable**: Clicking a seen or caught Pokémon in the Pokédex grid does nothing. A detail panel showing the Pokémon's type, base stats, and a short description would be a natural addition.
- ~~**Game not responsive / no mobile support**~~ **Done (2026-03-28)**: Added `_scaleGame()` in `main.js` — computes `Math.min(1, innerWidth/960, innerHeight/640)` and applies `transform: scale()` to `#game-container`. Runs on init and window resize. Fixes Bug #12.
- ~~**Party detail view shows max HP only, not current/max**~~ **Done (2026-03-28)**: HP stat now shows `"PV: 16 / 20"` (current/max) in `_showPokemonDetail`. Also fixed accent typos in stat labels: "Défense", "Atq. Spé.", "Déf. Spé.".

---

## Sound / Music

- **No sound feedback on dialogue advance**: A subtle "blip" sound when advancing dialogue text (similar to classic Pokémon games) would add to the atmosphere.
- **No sound on menu navigation**: Tab clicks and button hovers could have light UI sounds.
- **Battle music restarts on every battle**: Even if the same battle music is already playing, it resets from the beginning. Preserve music state if transitioning between similar battle types.

---

## Performance

- **Sprite cache uses `document.createElement('canvas')` without size limits**: The sprite cache in `SpriteRenderer` grows indefinitely as new Pokémon are encountered. For large Pokédex sizes this could consume significant memory. Consider a max-size LRU eviction policy.
- **`WorldData.init()` generates all maps at startup**: All 17+ maps are generated synchronously at game start. For a larger game this could cause noticeable startup lag. Consider lazy-loading maps on first visit.
