// ============================================================
// POKEMON NOVARA - Main Entry Point
// ============================================================

const game = {
    canvas: null,
    ctx: null,
    state: null,
    lastFrameTime: 0,

    // --------------------------------------------------------
    // Initialization
    // --------------------------------------------------------
    init() {
        this.canvas = document.getElementById('game-canvas');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        // Initialize world data
        WorldData.init();

        // Title screen buttons
        this._initTitleScreen();

        // Start the loop
        this.lastFrameTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));

        // Restart loop if tab regains visibility after browser paused rAF
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.lastFrameTime = performance.now();
                requestAnimationFrame((t) => this.loop(t));
            }
        });

        // Responsive viewport scaling
        this._scaleGame();
        window.addEventListener('resize', () => this._scaleGame());
    },

    _scaleGame() {
        const container = document.getElementById('game-container');
        const scaleX = window.innerWidth / 960;
        const scaleY = window.innerHeight / 640;
        const scale = Math.min(1, scaleX, scaleY);
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = 'center center';
    },

    // --------------------------------------------------------
    // Title Screen
    // --------------------------------------------------------
    _initTitleScreen() {
        const btnNew = document.getElementById('btn-new-game');
        const btnContinue = document.getElementById('btn-continue');

        if (SaveSystem.hasSave()) {
            btnContinue.classList.remove('hidden');
        }

        btnNew.addEventListener('click', () => {
            this._showNameInput();
        });

        btnContinue.addEventListener('click', () => {
            const loaded = SaveSystem.load();
            if (!loaded) {
                alert('Sauvegarde corrompue.');
                return;
            }
            this._loadGame(loaded);
            document.getElementById('title-screen').classList.add('hidden');
        });
    },

    _showNameInput() {
        const titleScreen = document.getElementById('title-screen');
        const menu = document.getElementById('title-menu');
        menu.innerHTML = `
            <div style="text-align:center;color:#fff;margin-bottom:20px;font-size:18px;">Quel est ton nom, Dresseur ?</div>
            <input type="text" id="name-input" value="Red" maxlength="12"
                style="display:block;margin:0 auto 15px;padding:12px 20px;font-size:18px;
                font-family:'Courier New',monospace;background:rgba(255,255,255,0.1);
                border:2px solid rgba(255,215,0,0.5);border-radius:8px;color:#fff;
                text-align:center;width:200px;outline:none;" />
            <button id="btn-confirm-name"
                style="display:block;margin:0 auto;background:linear-gradient(180deg,rgba(255,215,0,0.3),rgba(255,215,0,0.1));
                border:2px solid #ffd700;color:#fff;padding:12px 40px;font-size:16px;
                font-family:'Courier New',monospace;cursor:pointer;border-radius:8px;letter-spacing:2px;">
                C'est parti !</button>
        `;
        const input = document.getElementById('name-input');
        input.focus();
        input.select();

        const confirmName = () => {
            const raw = input.value.trim();
            if (!raw) {
                input.style.borderColor = '#f44336';
                input.setAttribute('placeholder', 'Entrez un nom !');
                input.value = '';
                return;
            }
            this._newGame(raw);
            titleScreen.classList.add('hidden');
        };

        document.getElementById('btn-confirm-name').addEventListener('click', confirmName);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') confirmName();
        });
    },

    // --------------------------------------------------------
    // New Game State
    // --------------------------------------------------------
    _newGame(playerName) {
        this.state = {
            playerName: playerName,
            playerX: 20,
            playerY: 16,
            playerDir: DIR.DOWN,
            currentMap: 'borgo',
            party: [],
            pc: [],
            bag: {},
            money: 3000,
            badges: [],
            storyFlags: { ...STORY_FLAGS_INIT },
            pokedexSeen: new Set(),
            pokedexCaught: new Set(),
            defeatedTrainers: new Set(),
            playTime: 0,
            stepsCount: 0,
            repelSteps: 0,
            gameMode: 'overworld',
        };

        // Initialize subsystems
        AudioSystem.init();
        SaveSystem.init(this);
        GameEngine.init(this.canvas, this);
        GameEngine.snapCamera();
        UI.init();

        // Play town music
        AudioSystem.playMusic('town');

        // Show location name
        UI.showLocationName('Village de Borgo');

        // Show professor intro dialogue
        this.state.gameMode = 'dialogue';
        GameEngine.inputLocked = true;
        UI.showDialogue(DIALOGUES.story_professor_intro, () => {
            this.state.storyFlags.met_professor = true;
            this.state.gameMode = 'overworld';
            GameEngine.inputLocked = false;
        });
    },

    // --------------------------------------------------------
    // Load Game State
    // --------------------------------------------------------
    _loadGame(saveData) {
        this.state = {
            playerName: saveData.playerName,
            playerX: saveData.playerX,
            playerY: saveData.playerY,
            playerDir: saveData.playerDir,
            currentMap: saveData.currentMap,
            party: saveData.party,
            pc: saveData.pc,
            bag: saveData.bag,
            money: saveData.money,
            badges: saveData.badges,
            storyFlags: saveData.storyFlags,
            pokedexSeen: saveData.pokedexSeen,
            pokedexCaught: saveData.pokedexCaught,
            defeatedTrainers: saveData.defeatedTrainers,
            playTime: saveData.playTime || 0,
            stepsCount: saveData.stepsCount || 0,
            repelSteps: 0,
            gameMode: 'overworld',
        };

        AudioSystem.init();
        SaveSystem.init(this);
        GameEngine.init(this.canvas, this);
        GameEngine.snapCamera();
        UI.init();

        // Play current map music
        const map = WorldData.getMap(this.state.currentMap);
        if (map) {
            AudioSystem.playMusic(map.music || 'town');
            UI.showLocationName(map.name);
        }

        // Restore defeated state on NPC objects from persisted set
        if (this.state.defeatedTrainers && this.state.defeatedTrainers.size > 0) {
            for (const mapId in WorldData.maps) {
                const map = WorldData.maps[mapId];
                if (map && map.npcs) {
                    for (const npc of map.npcs) {
                        if (npc.id && this.state.defeatedTrainers.has(npc.id)) {
                            npc.defeated = true;
                        }
                    }
                }
            }
        }

        // Update badge display
        UI.updateBadges();
    },

    // --------------------------------------------------------
    // Main Loop
    // --------------------------------------------------------
    loop(timestamp) {
        const dt = Math.min((timestamp - this.lastFrameTime) / 1000, 0.1);
        this.lastFrameTime = timestamp;

        this.update(dt);
        this.render(timestamp);

        requestAnimationFrame((t) => this.loop(t));
    },

    update(dt) {
        if (!this.state) return;

        // Engine handles overworld updates (movement, warps, encounters)
        if (this.state.gameMode === 'overworld' || this.state.gameMode === 'dialogue') {
            GameEngine.update(dt);
        }

        // Battle updates
        if (this.state.gameMode === 'battle') {
            BattleSystem.update(dt);
        }

        // Update party HP dots in HUD
        if (typeof UI !== 'undefined' && UI.updatePartyDots) {
            UI.updatePartyDots();
        }
    },

    render(timestamp) {
        if (!this.state) return;

        // Engine renders overworld (including during dialogue/menu - they overlay)
        if (this.state.gameMode !== 'battle') {
            GameEngine.render(timestamp);
        }

        // Battle renders itself
        if (this.state.gameMode === 'battle') {
            BattleSystem.render(this.ctx, timestamp);
        }
    },

    // --------------------------------------------------------
    // Battle Start / End (called from engine/battle)
    // --------------------------------------------------------
    startBattle(type, data) {
        this.state.gameMode = 'battle';
        // Hide dialogue box if it was left visible
        if (typeof UI !== 'undefined' && UI.elements && UI.elements.dialogueBox) {
            UI.elements.dialogueBox.classList.add('hidden');
            UI.dialogue.active = false;
        }
        if (type === 'wild') {
            const wildPokemon = createPokemon(data.pokemonId, data.level, true);
            if (wildPokemon) {
                this.state.pokedexSeen.add(wildPokemon.id);
                BattleSystem.startWildBattle(wildPokemon);
            }
        } else if (type === 'trainer') {
            BattleSystem.startTrainerBattle(data.npc);
        }
    },

    endBattle(result) {
        this.state.gameMode = 'overworld';
        GameEngine.inputLocked = false;

        // Hide battle UI
        const battleUI = document.getElementById('battle-ui');
        if (battleUI) battleUI.classList.add('hidden');

        // Restore overworld music
        const map = WorldData.getMap(this.state.currentMap);
        if (map) AudioSystem.playMusic(map.music || 'town');

        // Handle result
        if (result === 'lose') {
            // Heal party
            this.state.party.forEach(p => {
                if (p) {
                    p.currentHp = p.stats.hp;
                    p.status = null;
                    if (p.moves) p.moves.forEach(m => { m.ppUsed = 0; });
                }
            });

            // Whiteout: warp to last heal location
            const healMap = GameEngine.lastSafeMap || 'borgo';
            const healX = GameEngine.lastSafeX || 20;
            const healY = GameEngine.lastSafeY || 16;

            UI.showNotification('Vous avez perdu connaissance...');

            // Brief delay then warp
            setTimeout(() => {
                this.state.currentMap = healMap;
                this.state.playerX = healX;
                this.state.playerY = healY;
                this.state.playerDir = DIR.DOWN;
                GameEngine.snapCamera();
                const newMap = WorldData.getMap(healMap);
                if (newMap) {
                    AudioSystem.playMusic(newMap.music || 'town');
                    UI.showLocationName(newMap.name);
                }
                // Lose half money
                this.state.money = Math.floor(this.state.money / 2);
            }, 1500);
        }

        SaveSystem.save();
    },

    // --------------------------------------------------------
    // Helpers
    // --------------------------------------------------------
    returnToTitle() {
        // Stop music
        AudioSystem.stopMusic();

        // Reset game state
        this.state = null;

        // Hide game elements, show title screen
        const battleUI = document.getElementById('battle-ui');
        if (battleUI) battleUI.classList.add('hidden');
        if (UI.elements.dialogueBox) UI.elements.dialogueBox.classList.add('hidden');
        if (UI.elements.menuOverlay) UI.elements.menuOverlay.classList.add('hidden');

        // Reset title menu to original buttons
        const titleScreen = document.getElementById('title-screen');
        const menu = document.getElementById('title-menu');
        menu.innerHTML = '';

        const btnNew = document.createElement('button');
        btnNew.id = 'btn-new-game';
        btnNew.className = 'title-btn';
        btnNew.textContent = 'Nouvelle Partie';
        btnNew.addEventListener('click', () => this._showNameInput());
        menu.appendChild(btnNew);

        if (SaveSystem.hasSave()) {
            const btnContinue = document.createElement('button');
            btnContinue.id = 'btn-continue';
            btnContinue.className = 'title-btn';
            btnContinue.textContent = 'Continuer';
            btnContinue.addEventListener('click', () => {
                const loaded = SaveSystem.load();
                if (!loaded) { alert('Sauvegarde corrompue.'); return; }
                this._loadGame(loaded);
                titleScreen.classList.add('hidden');
            });
            menu.appendChild(btnContinue);
        }

        titleScreen.classList.remove('hidden');
    },

    getFormattedPlayTime() {
        const total = Math.floor(this.state.playTime);
        const hours = Math.floor(total / 3600);
        const mins = Math.floor((total % 3600) / 60);
        const secs = total % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },
};

// ============================================================
// Boot on DOM ready
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    game.init();
});
