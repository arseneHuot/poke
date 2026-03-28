# Pokémon Novara - Improvements & Suggestions

---

## Design

- **Battle layout proportions**: The battle scene uses the full 960px canvas width, placing the enemy at 70% (x≈672) and the player at 25% (x≈240). On smaller displays the enemy is cut off. Consider scaling the positions to a fixed smaller battle area, or implement CSS `transform: scale()` to fit any viewport.
- **Lab interior map too small**: The prof's lab interior is 18×14 tiles (576×448px) inside a 960×640px canvas, leaving large black borders around the room. Interior maps should either be larger or the camera should be clamped to show a zoomed-in view that fills the screen.
- **Starter selection layout**: The starter cards only use the upper half of the screen; the lower half is empty black. Cards could be centered vertically, or more information (base stats, move preview) could fill the space.

---

## Gameplay

- ~~**No post-starter alternate dialogue for Prof. Oliva**~~ **Done (2026-03-28)**: Added `story_prof_postgame` dialogue and `altDialogue`/`altFlag` NPC fields. See Bug #8 fix.
- **Catch rate feedback**: When a Poké Ball fails, there is no message indicating how many "shakes" occurred or any hint of how close the catch was. Adding a "Oh non ! Le Pokémon s'est échappé !" or shake count message would improve clarity.
- **No experience bar animation**: After a battle, the XP bar updates instantly. A smooth fill animation would make leveling-up feel more rewarding.
- **No evolution animation/sequence**: If a Pokemon evolves after battle, consider adding a visual evolution sequence rather than a silent update.

---

## Dialogues

- ~~**Typo in save screen**~~ **Done (2026-03-28)**: Fixed "sauvegardee" → "sauvegardée" in save tab info text.
- **Clicking dialogue box does not advance dialogue**: The player must use Space or Enter. Clicking anywhere on the dialogue box should also advance it — this is standard UX for RPGs.
- **Dialogue indicator (▼) starts hidden and only shows after typewriter finishes**: This is correct behaviour, but the indicator could pulse/animate more visibly to prompt the player.
- **Player name not validated**: An empty name silently defaults to "Red" with no feedback. Consider showing a short validation hint like "Nom invalide" if the field is left blank.

---

## Colors & Visual

- ~~**Move types displayed in English in Pokémon detail view**~~ **Done (2026-03-28)**: Added `TYPE_NAMES_FR` mapping in `ui.js`, applied to both the detail view and party list.
- ~~**Pokémon type in party list shows English**~~ **Done (2026-03-28)**: Party list now uses French type names ("Eau", "Feu", "Plante", etc.).
- **Battle HP bar color**: HP bar is always green regardless of HP percentage. Standard Pokémon games use green > 50%, yellow 20–50%, red < 20%. This would add important visual clarity during battle.
- **Black bars in interior maps**: When entering small indoor maps (lab, houses), large black rectangles appear to the sides due to the fixed 960px canvas being wider than the map. Filling with a solid color, a pattern, or a decorative border would look much more polished.

---

## Characters

- **No back/front sprite differentiation visible for player**: In battle, the player's Pokémon is drawn with `facing: 'back'` (mirrored horizontally), but for many sprite types the result looks nearly identical to the front. Distinct back-sprite designs would improve visual clarity.
- **Prof. Oliva NPC visible in outdoor overworld does not match indoor lab position**: The outdoor Prof. Oliva NPC is positioned to trigger the intro dialogue, but after obtaining a starter the outdoor NPC remains, which can lead to confusion about where to find the professor.

---

## UX / UI

- **Menu cannot be closed with Escape when sub-view is active**: Pressing Escape while on the Sauvegarder tab goes back to the Equipe tab rather than closing the menu. A second Escape should close the menu entirely.
- **No save confirmation notification**: After pressing "Sauvegarder maintenant", no visual toast/notification confirms the save. Add a brief "Sauvegarde réussie !" notification (see Bug #11).
- **Arrow keys don't register reliably for movement**: Key-down/key-up events are processed in a single frame, making held-key movement unreliable unless focus is on the canvas. Clicking the game canvas before using arrow keys is required.
- **Party HUD dots (top-right) not visible for badges**: The badge slots in the HUD show 8 empty grey circles even when no badges are earned, which looks identical to the party HP indicator. Differentiate visually (e.g., star outline for empty badge, filled star for earned).
- **"Quitter" tab in menu has no confirmation**: Clicking Quitter should ask "Quitter sans sauvegarder ?" to prevent accidental data loss.
- **No loading indicator between maps**: Map transitions use a fade to black but there is no spinner or progress indicator. This is fine for small maps but could be extended for feel.
- **Game not responsive / no mobile support**: The game container is a fixed 960×640px with no `max-width`, `overflow: hidden`, or `transform: scale()`. On mobile or in small browser windows, content is clipped. Consider wrapping the container in a scaler that fits the viewport while maintaining aspect ratio.

---

## Sound / Music

- **No sound feedback on dialogue advance**: A subtle "blip" sound when advancing dialogue text (similar to classic Pokémon games) would add to the atmosphere.
- **No sound on menu navigation**: Tab clicks and button hovers could have light UI sounds.
- **Battle music restarts on every battle**: Even if the same battle music is already playing, it resets from the beginning. Preserve music state if transitioning between similar battle types.

---

## Performance

- **Sprite cache uses `document.createElement('canvas')` without size limits**: The sprite cache in `SpriteRenderer` grows indefinitely as new Pokémon are encountered. For large Pokédex sizes this could consume significant memory. Consider a max-size LRU eviction policy.
- **`WorldData.init()` generates all maps at startup**: All 17+ maps are generated synchronously at game start. For a larger game this could cause noticeable startup lag. Consider lazy-loading maps on first visit.
