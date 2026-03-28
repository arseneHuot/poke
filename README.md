# Pokémon Novara

A complete Pokémon fan game built entirely with vanilla JavaScript and HTML5 Canvas — no frameworks, no dependencies.

## Play

```bash
# Serve locally
python3 -m http.server 8080
# Open http://localhost:8080
```

## Features

- **137 Pokémon** with procedurally generated pixel sprites, unique stats, abilities, and evolution chains
- **19 maps** — villages, cities, routes, caves, a desert, and the Pokémon League
- **Full battle system** — type matchups, status effects, stat stages, critical hits, priority moves, multi-hit attacks
- **8 gym badges** with distinct leaders and teams
- **Catching mechanics** — Poké Ball, Super Ball, Hyper Ball, Master Ball with animated shake sequences and confetti celebration
- **Evolution** with white-flash animation sequence
- **Shopping** — buy/sell items at PokéMarts (potions, balls, repels, escape ropes)
- **Pokémon Center** healing with nurse NPCs
- **Full Pokédex** with detail panels, base stats, type badges, and caught ball display
- **Save/Load** via LocalStorage with auto-save
- **Procedural music** — 7 tracks (town, route, city, battle, cave, indoor, league) generated with Web Audio API
- **Sound effects** — dialogue blips, menu sounds, battle hits, catch animations, evolution fanfare, level-up jingles
- **Responsive** — auto-scales to any screen size
- **Lazy map loading** — only starting maps generated at boot, others built on first visit
- **Party HUD** — color-coded HP dots (green/orange/red) in the overworld
- **French localization** — all dialogue, moves, items, and UI in French

## Tech Stack

| Layer | Tech |
|-------|------|
| Rendering | HTML5 Canvas 2D |
| Audio | Web Audio API (oscillator-based) |
| Sprites | Procedural pixel art (no image assets) |
| Persistence | LocalStorage |
| Language | Vanilla ES6+ JavaScript |
| Styling | CSS3 |

Zero external dependencies. Everything runs in a single `index.html`.

## Project Structure

```
├── index.html              # Entry point
├── css/style.css           # All styles
├── js/
│   ├── constants.js        # Tile types, directions, type colors
│   ├── pokemon-data.js     # Pokédex, moves DB, type chart, items
│   ├── world-data.js       # Map generation (19 maps, lazy-loaded)
│   ├── story-data.js       # Dialogues, story flags, NPC scripts
│   ├── sprite-renderer.js  # Canvas sprite drawing (LRU cached)
│   ├── save-system.js      # LocalStorage save/load
│   ├── audio.js            # Music tracks & SFX
│   ├── engine.js           # Game loop, camera, input, warps
│   ├── battle.js           # Turn-based battle system
│   ├── ui.js               # Menus, dialogue, HUD, Pokédex
│   └── main.js             # Init, title screen, game state
├── bugs.md                 # Bug tracker
└── improvements.md         # Feature suggestions & done log
```

## Controls

| Key | Action |
|-----|--------|
| Arrow keys / WASD / ZQSD | Move |
| Space / Enter | Interact / Advance dialogue |
| Escape | Open/close menu |
| X | Cancel / Back |

## License

Fan project for educational purposes. Pokémon is a trademark of Nintendo/Game Freak/Creatures Inc.
