// ============================================================
// POKEMON NOVARA - Game Engine
// ============================================================

const GameEngine = {
    canvas: null,
    ctx: null,
    game: null,
    animFrame: 0,
    lastTime: 0,
    _eventsBound: false,

    // Movement state
    moving: false,
    moveStartX: 0,
    moveStartY: 0,
    moveTargetX: 0,
    moveTargetY: 0,
    moveProgress: 0,
    moveSpeed: 4, // tiles per second

    // Input state
    keysDown: {},
    inputLocked: false,

    // Camera
    cameraX: 0,
    cameraY: 0,

    // Warp / transition
    warping: false,
    warpFade: 0,
    warpTarget: null,

    // Encounter flash
    encounterFlash: 0,
    encounterActive: false,

    // Repel tracking
    repelSteps: 0,

    init(canvas, game) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.game = game;

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        this.ctx.imageSmoothingEnabled = false;

        // Reset transient state between games
        this.moving = false;
        this.inputLocked = false;
        this.warping = false;
        this.warpFade = 0;
        this.warpTarget = null;
        this.encounterFlash = 0;
        this.encounterActive = false;
        this.repelSteps = 0;
        this.keysDown = {};
        this.lastSafeMap = null;
        this.lastSafeX = null;
        this.lastSafeY = null;

        // Input handling — only bind once to avoid duplicate listeners on restart
        if (!this._eventsBound) {
            this._eventsBound = true;
            const gameKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ']);
            window.addEventListener('keydown', (e) => {
                if (gameKeys.has(e.key)) e.preventDefault();
                this.keysDown[e.key] = true;
                this.handleInput(e.key, e);
            });
            window.addEventListener('keyup', (e) => {
                this.keysDown[e.key] = false;
            });
        }

        // Initialize camera to player position
        this._updateCamera();
    },

    // ---- UPDATE ----

    update(dt) {
        const state = this.game.state;
        if (!state) return;

        // Warp fade transition
        if (this.warping) {
            this._updateWarpTransition(dt);
            return;
        }

        // Encounter flash transition
        if (this.encounterActive) {
            this._updateEncounterTransition(dt);
            return;
        }

        // Smooth movement interpolation
        if (this.moving) {
            this.moveProgress += this.moveSpeed * dt;
            if (this.moveProgress >= 1) {
                // Movement complete - snap to target
                state.playerX = this.moveTargetX;
                state.playerY = this.moveTargetY;
                this.moving = false;
                this.moveProgress = 0;

                // Increment step counter
                state.stepsCount = (state.stepsCount || 0) + 1;

                // Check repel
                if (this.repelSteps > 0) {
                    this.repelSteps--;
                }

                // Check for warps at new position
                if (this._checkWarps()) return;

                // Check for wild encounters
                this._checkEncounter();
            } else {
                // Interpolate position for rendering
                state.playerX = this.moveStartX + (this.moveTargetX - this.moveStartX) * this.moveProgress;
                state.playerY = this.moveStartY + (this.moveTargetY - this.moveStartY) * this.moveProgress;
            }
        }

        // If not moving, check for held movement keys
        if (!this.moving && !this.inputLocked) {
            this._checkMovementKeys();
        }

        // Update camera smoothly
        this._updateCamera();

        // Track play time
        state.playTime = (state.playTime || 0) + dt;
    },

    // ---- RENDER ----

    render(time) {
        const state = this.game.state;
        if (!state) return;

        const ctx = this.ctx;
        const map = WorldData.getMap(state.currentMap);
        if (!map) return;

        // Clear canvas — use warm brown for indoor maps, black for outdoor
        ctx.fillStyle = (map.music === 'indoor') ? '#1a100a' : '#000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.save();

        // Zoom in for small interior maps so they fill the screen
        const mapPixelW = map.width * TILE_SIZE;
        const mapPixelH = map.height * TILE_SIZE;
        let camScale = 1;
        if (mapPixelW < CANVAS_WIDTH || mapPixelH < CANVAS_HEIGHT) {
            camScale = Math.max(CANVAS_WIDTH / mapPixelW, CANVAS_HEIGHT / mapPixelH);
            camScale = Math.min(camScale, 2.5); // cap zoom
        }

        // Apply camera transform with optional zoom
        if (camScale > 1) {
            ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            ctx.scale(camScale, camScale);
            ctx.translate(-this.cameraX, -this.cameraY);
        } else {
            const camOffX = -this.cameraX + CANVAS_WIDTH / 2;
            const camOffY = -this.cameraY + CANVAS_HEIGHT / 2;
            ctx.translate(Math.round(camOffX), Math.round(camOffY));
        }

        // Determine visible tile range (account for zoom)
        const visibleTilesX = Math.ceil(CANVAS_WIDTH / (TILE_SIZE * camScale));
        const visibleTilesY = Math.ceil(CANVAS_HEIGHT / (TILE_SIZE * camScale));
        const startTileX = Math.max(0, Math.floor(this.cameraX / TILE_SIZE - visibleTilesX / 2) - 1);
        const startTileY = Math.max(0, Math.floor(this.cameraY / TILE_SIZE - visibleTilesY / 2) - 1);
        const endTileX = Math.min(map.width, startTileX + visibleTilesX + 3);
        const endTileY = Math.min(map.height, startTileY + visibleTilesY + 3);

        // Draw tiles
        const mapTheme = map.theme || null;
        for (let ty = startTileY; ty < endTileY; ty++) {
            for (let tx = startTileX; tx < endTileX; tx++) {
                const tileType = map.tiles[ty] && map.tiles[ty][tx];
                if (tileType !== undefined) {
                    SpriteRenderer.drawTile(ctx, tileType, tx * TILE_SIZE, ty * TILE_SIZE, time, mapTheme);
                }
            }
        }

        // Collect all entities for y-sort rendering
        const entities = [];

        // NPCs
        if (map.npcs) {
            for (const npc of map.npcs) {
                // Skip signs for entity rendering (they are part of tile layer)
                if (npc.type === 'sign') continue;
                // Check story requirements
                if (npc.storyReq && !state.storyFlags[npc.storyReq]) continue;
                // Skip if story flag already set and NPC should disappear
                if (npc.storyFlag && npc.disappearAfter && state.storyFlags[npc.storyFlag]) continue;

                entities.push({
                    type: 'npc',
                    npc: npc,
                    x: npc.x * TILE_SIZE,
                    y: npc.y * TILE_SIZE,
                    sortY: npc.y
                });
            }
        }

        // Player entity
        entities.push({
            type: 'player',
            x: state.playerX * TILE_SIZE,
            y: state.playerY * TILE_SIZE,
            sortY: state.playerY
        });

        // Sort by y position for depth ordering
        entities.sort((a, b) => a.sortY - b.sortY);

        // Render entities
        const frame = this.animFrame;
        for (const entity of entities) {
            if (entity.type === 'npc') {
                const npc = entity.npc;
                SpriteRenderer.drawNPC(
                    ctx,
                    entity.x, entity.y,
                    npc.type,
                    npc.dir !== undefined ? npc.dir : DIR.DOWN,
                    frame
                );
            } else if (entity.type === 'player') {
                const walkFrame = this.moving ? frame : 0;
                SpriteRenderer.drawPlayer(
                    ctx,
                    entity.x, entity.y,
                    state.playerDir,
                    walkFrame
                );
            }
        }

        ctx.restore();

        // Warp fade overlay with spinning Poké Ball indicator
        if (this.warping && this.warpFade > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${this.warpFade})`;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            // Draw spinning Poké Ball when fully faded
            if (this.warpFade > 0.8) {
                const cx = CANVAS_WIDTH / 2;
                const cy = CANVAS_HEIGHT / 2;
                const r = 16;
                const angle = (this.animFrame * 3) % (Math.PI * 2);
                ctx.save();
                ctx.globalAlpha = Math.min(1, (this.warpFade - 0.8) * 5);
                ctx.translate(cx, cy);
                ctx.rotate(angle);
                // Top half red
                ctx.fillStyle = '#F44336';
                ctx.beginPath();
                ctx.arc(0, 0, r, Math.PI, 0);
                ctx.fill();
                // Bottom half white
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI);
                ctx.fill();
                // Center line
                ctx.fillStyle = '#333';
                ctx.fillRect(-r, -1.5, r * 2, 3);
                // Center button
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.arc(0, 0, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#333';
                ctx.beginPath();
                ctx.arc(0, 0, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Encounter flash overlay
        if (this.encounterActive && this.encounterFlash > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.encounterFlash})`;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // Increment animation frame
        this.animFrame += 0.15;
    },

    // ---- INPUT ----

    handleInput(key, event) {
        if (this.inputLocked || this.warping || this.encounterActive) return;

        const state = this.game.state;
        if (!state) return;

        // Interaction keys
        if (key === ' ' || key === 'Enter') {
            if (event) event.preventDefault();
            this._handleInteraction();
            return;
        }

        // Menu key (Escape or X) — handled entirely by ui.js keydown listener
        if (key === 'Escape' || key === 'x' || key === 'X') {
            if (event) event.preventDefault();
            return;
        }
    },

    _checkMovementKeys() {
        let dir = null;

        if (this.keysDown['ArrowUp'] || this.keysDown['w'] || this.keysDown['W'] || this.keysDown['z'] || this.keysDown['Z']) {
            dir = DIR.UP;
        } else if (this.keysDown['ArrowDown'] || this.keysDown['s'] || this.keysDown['S']) {
            dir = DIR.DOWN;
        } else if (this.keysDown['ArrowLeft'] || this.keysDown['a'] || this.keysDown['A'] || this.keysDown['q'] || this.keysDown['Q']) {
            dir = DIR.LEFT;
        } else if (this.keysDown['ArrowRight'] || this.keysDown['d'] || this.keysDown['D']) {
            dir = DIR.RIGHT;
        }

        if (dir !== null) {
            this._tryMove(dir);
        }
    },

    _tryMove(dir) {
        const state = this.game.state;

        // Update facing direction
        state.playerDir = dir;

        const offset = DIR_OFFSET[dir];
        const targetX = Math.round(state.playerX) + offset.x;
        const targetY = Math.round(state.playerY) + offset.y;

        // Check collision
        if (!this._canWalkTo(targetX, targetY)) {
            if (typeof AudioSystem !== 'undefined') {
                AudioSystem.playSfx('bump');
            }
            return;
        }

        // Start smooth movement
        this.moving = true;
        this.moveStartX = Math.round(state.playerX);
        this.moveStartY = Math.round(state.playerY);
        this.moveTargetX = targetX;
        this.moveTargetY = targetY;
        this.moveProgress = 0;
    },

    _canWalkTo(x, y) {
        const state = this.game.state;
        const map = WorldData.getMap(state.currentMap);
        if (!map) return false;

        // Bounds check
        if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;

        // Tile walkability
        const tile = map.tiles[y] && map.tiles[y][x];
        if (tile === undefined) return false;
        if (!WALKABLE_TILES.has(tile)) return false;

        // NPC collision
        if (map.npcs) {
            for (const npc of map.npcs) {
                if (npc.type === 'sign') continue;
                if (npc.storyReq && !state.storyFlags[npc.storyReq]) continue;
                if (npc.storyFlag && npc.disappearAfter && state.storyFlags[npc.storyFlag]) continue;
                if (Math.round(npc.x) === x && Math.round(npc.y) === y) return false;
            }
        }

        return true;
    },

    // ---- INTERACTIONS ----

    _handleInteraction() {
        const state = this.game.state;
        if (this.moving) return;

        const offset = DIR_OFFSET[state.playerDir];
        const checkX = Math.round(state.playerX) + offset.x;
        const checkY = Math.round(state.playerY) + offset.y;

        const map = WorldData.getMap(state.currentMap);
        if (!map || !map.npcs) return;

        // Check for NPC at the facing tile
        for (const npc of map.npcs) {
            if (Math.round(npc.x) === checkX && Math.round(npc.y) === checkY) {
                this.interactWithNPC(npc);
                return;
            }
        }

        // Check for sign on the player's tile or facing tile
        const tile = map.tiles[checkY] && map.tiles[checkY][checkX];
        if (tile === TILE.SIGN || tile === TILE.PC || tile === TILE.MART) {
            // Find sign/PC/mart NPC data
            for (const npc of map.npcs) {
                if (npc.type === 'sign' && Math.round(npc.x) === checkX && Math.round(npc.y) === checkY) {
                    this.interactWithNPC(npc);
                    return;
                }
            }
            // PC healing without NPC
            if (tile === TILE.PC) {
                this._healParty();
            }
        }
    },

    interactWithNPC(npc) {
        const state = this.game.state;

        // Turn NPC to face the player
        if (npc.dir !== undefined && npc.type !== 'sign') {
            const dx = Math.round(state.playerX) - Math.round(npc.x);
            const dy = Math.round(state.playerY) - Math.round(npc.y);
            if (Math.abs(dx) > Math.abs(dy)) {
                npc.dir = dx > 0 ? DIR.RIGHT : DIR.LEFT;
            } else {
                npc.dir = dy > 0 ? DIR.DOWN : DIR.UP;
            }
        }

        if (typeof AudioSystem !== 'undefined') {
            AudioSystem.playSfx('confirm');
        }

        // Resolve dialogue key — defeated trainers use altDialogue or generic; otherwise check altFlag
        let dialogueKey = npc.dialogue;
        if (npc.defeated) {
            dialogueKey = npc.altDialogue || 'trainer_defeated_generic';
        } else if (npc.altDialogue && npc.altFlag && state.storyFlags[npc.altFlag]) {
            dialogueKey = npc.altDialogue;
        }
        if (!dialogueKey) return;

        const dialogue = DIALOGUES[dialogueKey];
        if (!dialogue) return;

        // Set story flag if applicable
        if (npc.storyFlag && !state.storyFlags[npc.storyFlag]) {
            state.storyFlags[npc.storyFlag] = true;
        }

        // Show dialogue via UI system
        if (typeof UI !== 'undefined' && UI.showDialogue) {
            this.inputLocked = true;
            UI._currentNpc = npc;
            UI.showDialogue(dialogue, () => {
                this.inputLocked = false;
            });
        }
    },

    _healParty() {
        const state = this.game.state;
        if (!state.party || state.party.length === 0) return;

        // Track last safe heal location for Escape Rope
        this.lastSafeMap = state.currentMap;
        this.lastSafeX = Math.round(state.playerX);
        this.lastSafeY = Math.round(state.playerY);

        if (typeof AudioSystem !== 'undefined') {
            AudioSystem.playSfx('heal');
        }

        for (const pokemon of state.party) {
            if (pokemon && pokemon.stats) {
                pokemon.currentHp = pokemon.stats.hp;
                pokemon.status = null;
                // Restore PP
                if (pokemon.moves) {
                    for (const move of pokemon.moves) {
                        move.ppUsed = 0;
                    }
                }
            }
        }

        if (typeof UI !== 'undefined' && UI.showDialogue) {
            this.inputLocked = true;
            UI.showDialogue(DIALOGUES.nurse_heal || [
                { name: 'Centre', text: 'Vos Pokemon sont soignes !' }
            ], () => {
                this.inputLocked = false;
            });
        }
    },

    // ---- WARPS ----

    _checkWarps() {
        const state = this.game.state;
        const map = WorldData.getMap(state.currentMap);
        if (!map || !map.warps) return false;

        const px = Math.round(state.playerX);
        const py = Math.round(state.playerY);

        for (const warp of map.warps) {
            if (warp.x === px && warp.y === py) {
                this.warp(warp.targetMap, warp.targetX, warp.targetY);
                return true;
            }
        }

        // Also check door tiles
        const tile = map.tiles[py] && map.tiles[py][px];
        if (tile === TILE.DOOR) {
            for (const warp of map.warps) {
                if (warp.x === px && warp.y === py) {
                    this.warp(warp.targetMap, warp.targetX, warp.targetY);
                    return true;
                }
            }
        }

        return false;
    },

    warp(targetMap, x, y) {
        if (this.warping) return;

        this.warping = true;
        this.warpFade = 0;
        this.warpTarget = { map: targetMap, x: x, y: y };

        if (typeof AudioSystem !== 'undefined') {
            AudioSystem.playSfx('door');
        }
    },

    _updateWarpTransition(dt) {
        const fadeSpeed = 3;

        if (!this.warpTarget._arrived) {
            // Fade out
            this.warpFade = Math.min(1, this.warpFade + fadeSpeed * dt);
            if (this.warpFade >= 1) {
                // Execute the map transition
                this._executeWarp();
                this.warpTarget._arrived = true;
            }
        } else {
            // Fade in
            this.warpFade = Math.max(0, this.warpFade - fadeSpeed * dt);
            if (this.warpFade <= 0) {
                this.warping = false;
                this.warpTarget = null;
                this.warpFade = 0;
            }
        }
    },

    _executeWarp() {
        const state = this.game.state;
        const target = this.warpTarget;

        // Clear any stale dialogue/input/shop state before map transition
        if (typeof UI !== 'undefined') {
            if (UI.dialogue && UI.dialogue.active) {
                UI.dialogue.active = false;
                if (UI.dialogue.typewriterTimer) {
                    clearInterval(UI.dialogue.typewriterTimer);
                    UI.dialogue.typewriterTimer = null;
                }
                if (UI.elements && UI.elements.dialogueBox) {
                    UI.elements.dialogueBox.classList.add('hidden');
                }
            }
            if (UI.shop && UI.shop.active && typeof UI.closeShop === 'function') {
                UI.closeShop();
            }
            if (UI.menu && UI.menu.open && typeof UI.closeMenu === 'function') {
                UI.closeMenu();
            }
        }
        this.inputLocked = false;
        if (state) state.gameMode = 'overworld';

        state.currentMap = target.map;
        state.playerX = target.x;
        state.playerY = target.y;

        this.moving = false;
        this.moveProgress = 0;

        // Update camera immediately to new position
        this.cameraX = target.x * TILE_SIZE + TILE_SIZE / 2;
        this.cameraY = target.y * TILE_SIZE + TILE_SIZE / 2;

        // Play map music
        const newMap = WorldData.getMap(target.map);
        if (newMap && typeof AudioSystem !== 'undefined') {
            AudioSystem.playMusic(newMap.music || 'town');
        }

        // Update HUD location name
        if (newMap && typeof UI !== 'undefined' && UI.showLocationName) {
            UI.showLocationName(newMap.name);
        }
    },

    // ---- ENCOUNTERS ----

    _checkEncounter() {
        const state = this.game.state;
        const map = WorldData.getMap(state.currentMap);
        if (!map || !map.encounters || map.encounters.length === 0) return;

        // Check repel
        if (this.repelSteps > 0) return;

        const px = Math.round(state.playerX);
        const py = Math.round(state.playerY);
        const tile = map.tiles[py] && map.tiles[py][px];

        if (!ENCOUNTER_TILES.has(tile)) return;

        // 6% chance per step
        if (Math.random() > 0.06) return;

        this.startEncounter();
    },

    startEncounter() {
        const state = this.game.state;
        const map = WorldData.getMap(state.currentMap);
        if (!map || !map.encounters || map.encounters.length === 0) return;

        // Select a wild pokemon based on encounter rates
        const encounter = this._selectEncounter(map.encounters);
        if (!encounter) return;

        // Determine level
        const level = encounter.minLevel + Math.floor(
            Math.random() * (encounter.maxLevel - encounter.minLevel + 1)
        );

        if (typeof AudioSystem !== 'undefined') {
            AudioSystem.playSfx('encounter');
        }

        // Start encounter flash animation
        this.encounterActive = true;
        this.encounterFlash = 0;
        this._encounterData = { pokemonId: encounter.id, level: level };
        this._encounterPhase = 0;
        this._encounterTimer = 0;
    },

    _selectEncounter(encounters) {
        const totalRate = encounters.reduce((sum, e) => sum + (e.rate || 10), 0);
        let roll = Math.random() * totalRate;

        for (const enc of encounters) {
            roll -= (enc.rate || 10);
            if (roll <= 0) return enc;
        }

        return encounters[0];
    },

    _updateEncounterTransition(dt) {
        this._encounterTimer += dt;

        // Flash white three times, then transition to battle
        const flashDuration = 0.12;
        const gapDuration = 0.08;
        const cycleDuration = flashDuration + gapDuration;
        const totalFlashes = 3;
        const totalDuration = cycleDuration * totalFlashes + 0.3;

        if (this._encounterTimer < cycleDuration * totalFlashes) {
            const cyclePos = this._encounterTimer % cycleDuration;
            this.encounterFlash = cyclePos < flashDuration ? 1 : 0;
        } else if (this._encounterTimer < totalDuration) {
            // Final fade to black
            const t = (this._encounterTimer - cycleDuration * totalFlashes) / 0.3;
            this.encounterFlash = 0;
            // Draw black overlay in render
            this.warpFade = Math.min(1, t);
        } else {
            // Launch battle
            this.encounterActive = false;
            this.encounterFlash = 0;
            this.warpFade = 0;
            this._encounterTimer = 0;

            if (this._encounterData) {
                game.startBattle('wild', this._encounterData);
            }

            this._encounterData = null;
        }
    },

    // ---- CAMERA ----

    _updateCamera() {
        const state = this.game.state;
        if (!state) return;

        const targetCamX = state.playerX * TILE_SIZE + TILE_SIZE / 2;
        const targetCamY = state.playerY * TILE_SIZE + TILE_SIZE / 2;

        // Smooth camera follow with lerp
        const lerpFactor = 0.15;
        this.cameraX += (targetCamX - this.cameraX) * lerpFactor;
        this.cameraY += (targetCamY - this.cameraY) * lerpFactor;

        // Clamp camera to map bounds
        const map = WorldData.getMap(state.currentMap);
        if (map) {
            const halfW = CANVAS_WIDTH / 2;
            const halfH = CANVAS_HEIGHT / 2;
            const mapPixelW = map.width * TILE_SIZE;
            const mapPixelH = map.height * TILE_SIZE;

            if (mapPixelW > CANVAS_WIDTH) {
                this.cameraX = Math.max(halfW, Math.min(mapPixelW - halfW, this.cameraX));
            } else {
                this.cameraX = mapPixelW / 2;
            }

            if (mapPixelH > CANVAS_HEIGHT) {
                this.cameraY = Math.max(halfH, Math.min(mapPixelH - halfH, this.cameraY));
            } else {
                this.cameraY = mapPixelH / 2;
            }
        }
    },

    // ---- UTILITIES ----

    lockInput() {
        this.inputLocked = true;
    },

    unlockInput() {
        this.inputLocked = false;
    },

    useRepel(steps) {
        this.repelSteps = steps;
    },

    // Get the tile at a world position
    getTileAt(x, y) {
        const state = this.game.state;
        const map = WorldData.getMap(state.currentMap);
        if (!map) return -1;
        if (y < 0 || y >= map.height || x < 0 || x >= map.width) return -1;
        return map.tiles[y][x];
    },

    // Get NPC at tile position
    getNPCAt(x, y) {
        const state = this.game.state;
        const map = WorldData.getMap(state.currentMap);
        if (!map || !map.npcs) return null;

        for (const npc of map.npcs) {
            if (Math.round(npc.x) === x && Math.round(npc.y) === y) return npc;
        }
        return null;
    },

    // Snap camera immediately (useful after loading a save)
    snapCamera() {
        const state = this.game.state;
        if (!state) return;
        this.cameraX = state.playerX * TILE_SIZE + TILE_SIZE / 2;
        this.cameraY = state.playerY * TILE_SIZE + TILE_SIZE / 2;
    }
};
