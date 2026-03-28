// ============================================================
// POKEMON NOVARA - UI System
// ============================================================

const TYPE_NAMES_FR = {
    normal: 'Normal', fire: 'Feu', water: 'Eau', grass: 'Plante',
    electric: 'Électrik', ice: 'Glace', fighting: 'Combat', poison: 'Poison',
    ground: 'Sol', flying: 'Vol', psychic: 'Psy', bug: 'Insecte',
    rock: 'Roche', ghost: 'Spectre', dragon: 'Dragon', dark: 'Ténèbres',
    steel: 'Acier', fairy: 'Fée',
};

const NATURE_NAMES_FR = {
    Hardy: 'Hardi', Lonely: 'Solitaire', Brave: 'Brave', Adamant: 'Rigide', Naughty: 'Coquin',
    Bold: 'Assuré', Docile: 'Docile', Relaxed: 'Relax', Impish: 'Malin', Lax: 'Lâche',
    Timid: 'Timide', Hasty: 'Hâtif', Serious: 'Sérieux', Jolly: 'Jovial', Naive: 'Naïf',
    Modest: 'Modeste', Mild: 'Doux', Quiet: 'Calme', Bashful: 'Pudique', Rash: 'Bizarre',
    Calm: 'Sage', Gentle: 'Gentil', Sassy: 'Malpoli', Careful: 'Prudent', Quirky: 'Vif',
};

const UI = {
    // DOM references
    elements: {},

    // Dialogue state
    dialogue: {
        active: false,
        lines: [],
        currentIndex: 0,
        typewriterTimer: null,
        typewriterDone: false,
        fullText: '',
        displayedChars: 0,
        charDelay: 30,
        callback: null,
    },

    // Menu state
    menu: {
        open: false,
        currentTab: 'party',
    },

    // Notification state
    notification: {
        timer: null,
    },

    // HUD state
    hud: {
        locationTimer: null,
    },

    // Shop state
    shop: {
        active: false,
        mode: 'buy',
        items: [],
        selectedIndex: 0,
    },

    // Starter selection state
    starterSelect: {
        active: false,
    },

    _eventsBound: false,

    // ----------------------------------------------------------------
    // Initialization
    // ----------------------------------------------------------------
    init() {
        this.elements = {
            dialogueBox: document.getElementById('dialogue-box'),
            dialogueName: document.getElementById('dialogue-name'),
            dialogueText: document.getElementById('dialogue-text'),
            dialogueIndicator: document.getElementById('dialogue-indicator'),
            menuOverlay: document.getElementById('menu-overlay'),
            menuPanel: document.getElementById('menu-panel'),
            hud: document.getElementById('hud'),
            locationName: document.getElementById('location-name'),
            badgesDisplay: document.getElementById('badges-display'),
        };

        this._initBadgeSlots();

        // Only bind events once to avoid duplicate listeners on game restart
        if (!this._eventsBound) {
            this._eventsBound = true;
            this._bindKeys();
            this.elements.dialogueBox.addEventListener('click', () => {
                if (this.dialogue.active) this.advanceDialogue();
            });
        }
    },

    _initBadgeSlots() {
        const display = this.elements.badgesDisplay;
        display.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const slot = document.createElement('div');
            slot.className = 'badge-slot';
            slot.dataset.index = i;
            display.appendChild(slot);
        }
    },

    _bindKeys() {
        document.addEventListener('keydown', (e) => {
            if (this.starterSelect.active) return;

            if (e.code === 'Space' || e.code === 'Enter') {
                if (this.dialogue.active) {
                    e.preventDefault();
                    this.advanceDialogue();
                }
            }

            if (e.code === 'Escape' || e.code === 'KeyX') {
                if (this.shop.active) {
                    e.preventDefault();
                    this.closeShop();
                } else if (this.menu.open) {
                    e.preventDefault();
                    this.closeMenu();
                } else if (!this.dialogue.active && game && game.state && game.state.gameMode === 'overworld') {
                    e.preventDefault();
                    this.openMenu();
                }
            }
        });
    },

    // ----------------------------------------------------------------
    // Dialogue System
    // ----------------------------------------------------------------
    showDialogue(dialogueOrId, callback) {
        const lines = Array.isArray(dialogueOrId) ? dialogueOrId : DIALOGUES[dialogueOrId];
        if (!lines || lines.length === 0) return;

        this.dialogue.active = true;
        this.dialogue.lines = lines;
        this.dialogue.currentIndex = 0;
        this.dialogue.callback = callback || null;

        if (game) game.state.gameMode = 'dialogue';

        this._showCurrentLine();
    },

    _showCurrentLine() {
        const line = this.dialogue.lines[this.dialogue.currentIndex];
        if (!line) {
            this._endDialogue();
            return;
        }

        // Handle action lines
        if (line.action) {
            this._handleDialogueAction(line.action);
            return;
        }

        // Show the dialogue box
        this.elements.dialogueBox.classList.remove('hidden');

        // Set speaker name
        if (line.name) {
            this.elements.dialogueName.textContent = line.name;
            this.elements.dialogueName.style.display = 'block';
        } else {
            this.elements.dialogueName.style.display = 'none';
        }

        // Start typewriter effect
        this.elements.dialogueText.textContent = '';
        this.elements.dialogueIndicator.style.display = 'none';
        this.dialogue.fullText = line.text || '';
        this.dialogue.displayedChars = 0;
        this.dialogue.typewriterDone = false;

        this._clearTypewriter();
        this.dialogue.typewriterTimer = setInterval(() => {
            this._typewriterTick();
        }, this.dialogue.charDelay);
    },

    _typewriterTick() {
        if (this.dialogue.displayedChars < this.dialogue.fullText.length) {
            this.dialogue.displayedChars++;
            this.elements.dialogueText.textContent =
                this.dialogue.fullText.substring(0, this.dialogue.displayedChars);
        } else {
            this._clearTypewriter();
            this.dialogue.typewriterDone = true;
            this.elements.dialogueIndicator.style.display = 'block';
        }
    },

    _clearTypewriter() {
        if (this.dialogue.typewriterTimer) {
            clearInterval(this.dialogue.typewriterTimer);
            this.dialogue.typewriterTimer = null;
        }
    },

    advanceDialogue() {
        if (!this.dialogue.active) return;
        AudioSystem.playSfx('text_blip');

        // If typewriter still going, finish it immediately
        if (!this.dialogue.typewriterDone) {
            this._clearTypewriter();
            this.dialogue.displayedChars = this.dialogue.fullText.length;
            this.elements.dialogueText.textContent = this.dialogue.fullText;
            this.dialogue.typewriterDone = true;
            this.elements.dialogueIndicator.style.display = 'block';
            return;
        }

        // Move to the next line
        this.dialogue.currentIndex++;
        if (this.dialogue.currentIndex < this.dialogue.lines.length) {
            this._showCurrentLine();
        } else {
            this._endDialogue();
        }
    },

    _endDialogue() {
        this._clearTypewriter();
        this.elements.dialogueBox.classList.add('hidden');
        this.dialogue.active = false;

        if (game && game.state) game.state.gameMode = 'overworld';

        if (this.dialogue.callback) {
            const cb = this.dialogue.callback;
            this.dialogue.callback = null;
            cb();
        }
    },

    _handleDialogueAction(action) {
        switch (action) {
            case 'choose_starter':
                this.elements.dialogueBox.classList.add('hidden');
                this._showStarterSelection();
                break;

            case 'heal_pokemon':
                this._healAllPokemon();
                // Continue to next line
                this.dialogue.currentIndex++;
                this._showCurrentLine();
                break;

            case 'open_shop':
                this.elements.dialogueBox.classList.add('hidden');
                this._openShopUI();
                break;

            case 'trainer_battle':
                this._endDialogue();
                if (game && this._currentNpc) {
                    game.startBattle('trainer', { npc: this._currentNpc });
                }
                break;

            default:
                // Unknown action, skip to next line
                this.dialogue.currentIndex++;
                this._showCurrentLine();
                break;
        }
    },

    _healAllPokemon() {
        if (!game || !game.state || !game.state.party) return;
        // Track last safe heal location for Escape Rope
        if (typeof GameEngine !== 'undefined') {
            GameEngine.lastSafeMap = game.state.currentMap;
            GameEngine.lastSafeX = Math.round(game.state.playerX);
            GameEngine.lastSafeY = Math.round(game.state.playerY);
        }
        game.state.party.forEach(pokemon => {
            if (!pokemon) return;
            recalcStats(pokemon);
            pokemon.currentHp = pokemon.stats.hp;
            pokemon.status = null;
            // Restore all move PP
            if (pokemon.moves) {
                pokemon.moves.forEach(m => { m.ppUsed = 0; });
            }
        });
        AudioSystem.playSfx('heal');
        this.showNotification('Vos Pokémon sont en pleine forme !');
    },

    // ----------------------------------------------------------------
    // Starter Selection
    // ----------------------------------------------------------------
    _showStarterSelection() {
        this.starterSelect.active = true;
        if (game) game.state.gameMode = 'dialogue';

        const starters = [
            { id: 1, name: 'Flamby', type: 'fire', typeName: 'Feu' },
            { id: 4, name: 'Aquali', type: 'water', typeName: 'Eau' },
            { id: 7, name: 'Verdant', type: 'grass', typeName: 'Plante' },
        ];

        const overlay = this.elements.menuOverlay;
        const panel = this.elements.menuPanel;

        panel.innerHTML = '';
        const title = document.createElement('h2');
        title.textContent = 'Choisissez votre Pokémon !';
        panel.appendChild(title);

        const choiceMenu = document.createElement('div');
        choiceMenu.className = 'choice-menu';

        starters.forEach(starter => {
            const option = document.createElement('div');
            option.className = 'choice-option';

            // Sprite canvas
            const spriteCanvas = document.createElement('canvas');
            spriteCanvas.width = 96;
            spriteCanvas.height = 96;
            const spriteCtx = spriteCanvas.getContext('2d');
            SpriteRenderer.drawPokemon(spriteCtx, starter.id, 0, 0, 96, 'front', false);
            option.appendChild(spriteCanvas);

            const nameDiv = document.createElement('div');
            nameDiv.className = 'choice-name';
            nameDiv.textContent = starter.name;
            option.appendChild(nameDiv);

            const typeDiv = document.createElement('div');
            typeDiv.className = 'choice-type';
            typeDiv.textContent = starter.typeName;
            typeDiv.style.color = TYPE_COLORS[starter.type] || '#aaa';
            option.appendChild(typeDiv);

            // Show base stats summary
            const pdata = getPokemonById(starter.id);
            if (pdata && pdata.baseStats) {
                const statsDiv = document.createElement('div');
                statsDiv.style.cssText = 'font-size:10px;color:#999;margin-top:6px;line-height:1.4;';
                statsDiv.innerHTML = `PV:${pdata.baseStats.hp} Atq:${pdata.baseStats.atk} Déf:${pdata.baseStats.def}<br>Vit:${pdata.baseStats.spd}`;
                option.appendChild(statsDiv);
            }

            option.addEventListener('click', () => {
                this._selectStarter(starter.id);
            });

            choiceMenu.appendChild(option);
        });

        panel.appendChild(choiceMenu);
        overlay.classList.remove('hidden');
    },

    _selectStarter(pokemonId) {
        if (!game || !game.state) return;

        const pokemon = createPokemon(pokemonId, 5, false);
        if (!pokemon) return;

        pokemon.ot = game.state.playerName || 'Joueur';

        game.state.party.push(pokemon);
        game.state.storyFlags.has_starter = true;
        game.state.storyFlags.choose_starter = true;
        game.state.pokedexSeen.add(pokemonId);
        game.state.pokedexCaught.add(pokemonId);

        // Give starter Poke Balls
        if (!game.state.bag.pokeball) game.state.bag.pokeball = 0;
        game.state.bag.pokeball += 5;

        const data = getPokemonById(pokemonId);
        this.showNotification(data.name + ' a rejoint votre équipe !');

        AudioSystem.playSfx('catch');

        // Close starter selection
        this.elements.menuOverlay.classList.add('hidden');
        this.starterSelect.active = false;

        // Continue dialogue (story_after_starter)
        this.dialogue.currentIndex++;
        if (this.dialogue.currentIndex < this.dialogue.lines.length) {
            this._showCurrentLine();
        } else {
            this._endDialogue();
            // Trigger the after-starter dialogue
            if (DIALOGUES.story_after_starter) {
                setTimeout(() => {
                    this.showDialogue('story_after_starter');
                }, 500);
            }
        }
    },

    // ----------------------------------------------------------------
    // Menu System
    // ----------------------------------------------------------------
    openMenu() {
        if (this.shop.active || this.starterSelect.active) return;
        // Always hide dialogue box when opening menu
        this._clearTypewriter();
        this.elements.dialogueBox.classList.add('hidden');
        this.dialogue.active = false;
        if (game) game.state.gameMode = 'menu';

        this.menu.open = true;
        this.menu.currentTab = 'party';
        this._renderMenu();
        this.elements.menuOverlay.classList.remove('hidden');
        AudioSystem.playSfx('select');
    },

    closeMenu() {
        this.menu.open = false;
        this.elements.menuOverlay.classList.add('hidden');
        this.elements.menuPanel.innerHTML = '';
        if (game && game.state) game.state.gameMode = 'overworld';
        AudioSystem.playSfx('select');
    },

    _renderMenu() {
        const panel = this.elements.menuPanel;
        panel.innerHTML = '';

        // Tabs
        const tabs = [
            { id: 'party', label: 'Équipe' },
            { id: 'bag', label: 'Sac' },
            { id: 'pokedex', label: 'Pokédex' },
            { id: 'trainer', label: 'Dresseur' },
            { id: 'save', label: 'Sauvegarder' },
            { id: 'quit', label: 'Quitter' },
        ];

        const tabBar = document.createElement('div');
        tabBar.className = 'menu-tabs';

        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = 'menu-tab' + (this.menu.currentTab === tab.id ? ' active' : '');
            btn.textContent = tab.label;
            btn.addEventListener('click', () => {
                this.menu.currentTab = tab.id;
                this._renderMenu();
                AudioSystem.playSfx('menu_tab');
            });
            tabBar.appendChild(btn);
        });

        panel.appendChild(tabBar);

        // Content
        const content = document.createElement('div');
        content.className = 'menu-content';

        switch (this.menu.currentTab) {
            case 'party':
                this._renderPartyTab(content);
                break;
            case 'bag':
                this._renderBagTab(content);
                break;
            case 'pokedex':
                this._renderPokedexTab(content);
                break;
            case 'trainer':
                this._renderTrainerTab(content);
                break;
            case 'save':
                this._renderSaveTab(content);
                break;
            case 'quit':
                this._renderQuitTab(content);
                break;
        }

        panel.appendChild(content);
    },

    // -- Party Tab --
    _renderPartyTab(container) {
        const title = document.createElement('h2');
        title.textContent = 'Équipe';
        container.appendChild(title);

        if (!game || !game.state || !game.state.party || game.state.party.length === 0) {
            const empty = document.createElement('p');
            empty.textContent = 'Aucun Pokémon dans l\'équipe.';
            empty.style.color = '#888';
            empty.style.textAlign = 'center';
            container.appendChild(empty);
            return;
        }

        const list = document.createElement('div');
        list.className = 'pokemon-party-list';

        game.state.party.forEach((pokemon, index) => {
            if (!pokemon) return;
            const data = getPokemonById(pokemon.id);
            if (!data) return;

            const row = document.createElement('div');
            row.className = 'party-pokemon';

            // Sprite
            const spriteContainer = document.createElement('div');
            spriteContainer.className = 'sprite-container';
            const spriteCanvas = document.createElement('canvas');
            spriteCanvas.width = 48;
            spriteCanvas.height = 48;
            const spriteCtx = spriteCanvas.getContext('2d');
            SpriteRenderer.drawPokemon(spriteCtx, pokemon.id, 0, 0, 48, 'front', pokemon.isShiny);
            spriteContainer.appendChild(spriteCanvas);
            row.appendChild(spriteContainer);

            // Info
            const info = document.createElement('div');
            info.className = 'info';

            const nameSpan = document.createElement('div');
            nameSpan.className = 'name';
            nameSpan.textContent = (pokemon.nickname || data.name);
            if (pokemon.status) {
                const statusBadge = document.createElement('span');
                statusBadge.textContent = ' [' + pokemon.status.toUpperCase() + ']';
                statusBadge.style.color = '#f44336';
                statusBadge.style.fontSize = '11px';
                nameSpan.appendChild(statusBadge);
            }
            info.appendChild(nameSpan);

            const details = document.createElement('div');
            details.className = 'details';
            const typeNames = data.types.map(t => TYPE_NAMES_FR[t] || t.charAt(0).toUpperCase() + t.slice(1)).join('/');
            details.textContent = 'Nv. ' + pokemon.level + ' | ' + typeNames;
            info.appendChild(details);

            row.appendChild(info);

            // HP bar
            const hpSection = document.createElement('div');
            hpSection.style.minWidth = '140px';

            const hpBar = document.createElement('div');
            hpBar.className = 'hp-bar';
            const hpFill = document.createElement('div');
            hpFill.className = 'hp-fill';
            const hpPercent = pokemon.stats ? (pokemon.currentHp / pokemon.stats.hp) * 100 : 100;
            hpFill.style.width = hpPercent + '%';
            if (hpPercent <= 20) {
                hpFill.classList.add('low');
            } else if (hpPercent <= 50) {
                hpFill.classList.add('medium');
            }
            hpBar.appendChild(hpFill);
            hpSection.appendChild(hpBar);

            const hpText = document.createElement('div');
            hpText.className = 'hp-text';
            hpText.textContent = pokemon.currentHp + ' / ' + (pokemon.stats ? pokemon.stats.hp : '?');
            hpSection.appendChild(hpText);

            row.appendChild(hpSection);

            // Click to show details / use item
            row.addEventListener('click', () => {
                this._showPokemonDetail(pokemon, index);
            });

            list.appendChild(row);
        });

        container.appendChild(list);
    },

    _showPokemonDetail(pokemon, index) {
        const data = getPokemonById(pokemon.id);
        if (!data) return;

        const panel = this.elements.menuPanel;
        panel.innerHTML = '';

        const title = document.createElement('h2');
        title.textContent = pokemon.nickname || data.name;
        panel.appendChild(title);

        // Level and type info
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'text-align:center;margin-bottom:10px;';
        const levelSpan = document.createElement('span');
        levelSpan.style.cssText = 'color:#aaa;font-size:14px;margin-right:10px;';
        levelSpan.textContent = 'Nv. ' + pokemon.level;
        infoDiv.appendChild(levelSpan);
        if (data.types) {
            data.types.forEach(t => {
                const badge = document.createElement('span');
                badge.style.cssText = `display:inline-block;padding:2px 8px;border-radius:8px;font-size:11px;margin:0 3px;color:#fff;background:${TYPE_COLORS[t] || '#888'};`;
                badge.textContent = (TYPE_NAMES_FR[t] || t).toUpperCase();
                infoDiv.appendChild(badge);
            });
        }
        if (pokemon.nature) {
            const natureSpan = document.createElement('span');
            natureSpan.style.cssText = 'color:#aaa;font-size:12px;margin-left:10px;';
            natureSpan.textContent = NATURE_NAMES_FR[pokemon.nature] || pokemon.nature;
            infoDiv.appendChild(natureSpan);
        }
        panel.appendChild(infoDiv);

        // Sprite
        const spriteCanvas = document.createElement('canvas');
        spriteCanvas.width = 96;
        spriteCanvas.height = 96;
        spriteCanvas.style.display = 'block';
        spriteCanvas.style.margin = '0 auto 15px';
        const spriteCtx = spriteCanvas.getContext('2d');
        SpriteRenderer.drawPokemon(spriteCtx, pokemon.id, 0, 0, 96, 'front', pokemon.isShiny);
        panel.appendChild(spriteCanvas);

        // Stats
        const statsDiv = document.createElement('div');
        statsDiv.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:15px;';

        const statLabels = { hp: 'PV', atk: 'Attaque', def: 'Défense', spatk: 'Atq. Spé.', spdef: 'Déf. Spé.', spd: 'Vitesse' };
        if (pokemon.stats) {
            Object.entries(statLabels).forEach(([key, label]) => {
                const statRow = document.createElement('div');
                statRow.style.cssText = 'font-size:12px;color:#ccc;';
                if (key === 'hp') {
                    statRow.textContent = label + ': ' + pokemon.currentHp + ' / ' + pokemon.stats[key];
                } else {
                    statRow.textContent = label + ': ' + pokemon.stats[key];
                }
                statsDiv.appendChild(statRow);
            });
        }
        panel.appendChild(statsDiv);

        // Moves
        const movesTitle = document.createElement('div');
        movesTitle.style.cssText = 'font-weight:bold;margin-bottom:8px;color:#ffd700;';
        movesTitle.textContent = 'Attaques';
        panel.appendChild(movesTitle);

        if (pokemon.moves) {
            pokemon.moves.forEach(moveObj => {
                const move = MOVES_DB[moveObj.id];
                if (!move) return;
                const ppLeft = (move.pp || 10) - (moveObj.ppUsed || 0);
                const moveDiv = document.createElement('div');
                moveDiv.style.cssText = 'font-size:12px;color:#ccc;margin-bottom:4px;padding:4px 8px;background:rgba(255,255,255,0.05);border-radius:4px;';
                moveDiv.textContent = move.name + ' | ' + (TYPE_NAMES_FR[move.type] || move.type).toUpperCase() + ' | Puiss. ' + (move.power || '-') + ' | PP ' + ppLeft + '/' + (move.pp || 10);
                panel.appendChild(moveDiv);
            });
        }

        // Back button
        const backBtn = document.createElement('button');
        backBtn.className = 'menu-tab';
        backBtn.style.marginTop = '15px';
        backBtn.textContent = 'Retour';
        backBtn.addEventListener('click', () => {
            this._renderMenu();
        });
        panel.appendChild(backBtn);
    },

    // -- Bag Tab --
    _renderBagTab(container) {
        const title = document.createElement('h2');
        title.textContent = 'Sac';
        container.appendChild(title);

        if (!game || !game.state || !game.state.bag) return;

        const bag = game.state.bag;
        const entries = Object.entries(bag).filter(([, qty]) => qty > 0);

        if (entries.length === 0) {
            const empty = document.createElement('p');
            empty.textContent = 'Votre sac est vide.';
            empty.style.color = '#888';
            empty.style.textAlign = 'center';
            container.appendChild(empty);
            return;
        }

        entries.forEach(([itemId, quantity]) => {
            const itemData = ITEMS[itemId];
            if (!itemData) return;

            const row = document.createElement('div');
            row.className = 'bag-item';

            const leftCol = document.createElement('div');
            const nameDiv = document.createElement('div');
            nameDiv.className = 'item-name';
            nameDiv.textContent = itemData.name;
            leftCol.appendChild(nameDiv);

            const descDiv = document.createElement('div');
            descDiv.className = 'item-desc';
            descDiv.textContent = itemData.desc;
            leftCol.appendChild(descDiv);

            row.appendChild(leftCol);

            const countDiv = document.createElement('div');
            countDiv.className = 'item-count';
            countDiv.textContent = 'x' + quantity;
            row.appendChild(countDiv);

            // Click to use item
            if (itemData.type === 'heal' || itemData.type === 'revive' || itemData.type === 'status' || itemData.type === 'levelup') {
                row.addEventListener('click', () => {
                    this._showItemUseTarget(itemId);
                });
                row.style.cursor = 'pointer';
            } else if (itemData.type === 'repel') {
                row.addEventListener('click', () => {
                    if (!game || !game.state) return;
                    game.state.bag[itemId]--;
                    if (game.state.bag[itemId] <= 0) delete game.state.bag[itemId];
                    GameEngine.useRepel(itemData.steps || 100);
                    AudioSystem.playSfx('select');
                    this.showNotification('Repousse activée pour ' + (itemData.steps || 100) + ' pas !');
                    this.closeMenu();
                });
                row.style.cursor = 'pointer';
            } else if (itemData.type === 'escape') {
                row.addEventListener('click', () => {
                    if (!game || !game.state) return;
                    const targetMap = GameEngine.lastSafeMap || 'borgo';
                    const targetX = GameEngine.lastSafeX || 14;
                    const targetY = GameEngine.lastSafeY || 14;
                    game.state.bag[itemId]--;
                    if (game.state.bag[itemId] <= 0) delete game.state.bag[itemId];
                    AudioSystem.playSfx('door');
                    this.showNotification('Vous êtes téléporté à la sécurité !');
                    this.closeMenu();
                    GameEngine.warping = true;
                    GameEngine.warpTarget = { map: targetMap, x: targetX, y: targetY, _arrived: false };
                    GameEngine.warpFade = 0;
                });
                row.style.cursor = 'pointer';
            }

            container.appendChild(row);
        });
    },

    _showItemUseTarget(itemId) {
        const panel = this.elements.menuPanel;
        panel.innerHTML = '';

        const itemData = ITEMS[itemId];
        if (!itemData) return;

        const title = document.createElement('h2');
        title.textContent = 'Utiliser ' + itemData.name + ' sur...';
        panel.appendChild(title);

        if (!game || !game.state || !game.state.party) return;

        const list = document.createElement('div');
        list.className = 'pokemon-party-list';

        game.state.party.forEach((pokemon, index) => {
            if (!pokemon) return;
            const data = getPokemonById(pokemon.id);
            if (!data) return;

            const row = document.createElement('div');
            row.className = 'party-pokemon';

            // Sprite
            const spriteContainer = document.createElement('div');
            spriteContainer.className = 'sprite-container';
            const spriteCanvas = document.createElement('canvas');
            spriteCanvas.width = 48;
            spriteCanvas.height = 48;
            const spriteCtx = spriteCanvas.getContext('2d');
            SpriteRenderer.drawPokemon(spriteCtx, pokemon.id, 0, 0, 48, 'front', pokemon.isShiny);
            spriteContainer.appendChild(spriteCanvas);
            row.appendChild(spriteContainer);

            const info = document.createElement('div');
            info.className = 'info';
            const nameDiv = document.createElement('div');
            nameDiv.className = 'name';
            nameDiv.textContent = (pokemon.nickname || data.name) + ' Nv.' + pokemon.level;
            info.appendChild(nameDiv);

            const hpInfo = document.createElement('div');
            hpInfo.className = 'details';
            hpInfo.textContent = 'PV: ' + pokemon.currentHp + '/' + (pokemon.stats ? pokemon.stats.hp : '?');
            info.appendChild(hpInfo);

            row.appendChild(info);

            row.addEventListener('click', () => {
                this._useItemOnPokemon(itemId, pokemon, index);
            });

            list.appendChild(row);
        });

        panel.appendChild(list);

        // Back button
        const backBtn = document.createElement('button');
        backBtn.className = 'menu-tab';
        backBtn.style.marginTop = '15px';
        backBtn.textContent = 'Retour';
        backBtn.addEventListener('click', () => {
            this._renderMenu();
        });
        panel.appendChild(backBtn);
    },

    _useItemOnPokemon(itemId, pokemon, index) {
        const itemData = ITEMS[itemId];
        if (!itemData || !game || !game.state) return;

        let used = false;
        const data = getPokemonById(pokemon.id);

        switch (itemData.type) {
            case 'heal':
                if (pokemon.currentHp <= 0) {
                    this.showNotification(data.name + ' est K.O. ! Utilisez un Rappel.');
                    return;
                }
                if (pokemon.stats && pokemon.currentHp >= pokemon.stats.hp) {
                    this.showNotification(data.name + ' a déjà tous ses PV !');
                    return;
                }
                const maxHp = pokemon.stats ? pokemon.stats.hp : 999;
                pokemon.currentHp = Math.min(maxHp, pokemon.currentHp + itemData.healAmount);
                used = true;
                this.showNotification(data.name + ' récupère des PV !');
                break;

            case 'revive':
                if (pokemon.currentHp > 0) {
                    this.showNotification(data.name + ' n\'est pas K.O. !');
                    return;
                }
                const reviveHp = Math.floor((pokemon.stats ? pokemon.stats.hp : 20) * itemData.healPercent);
                pokemon.currentHp = reviveHp;
                pokemon.status = null;
                used = true;
                this.showNotification(data.name + ' est ranimé !');
                break;

            case 'status':
                if (!pokemon.status || pokemon.status !== itemData.cures) {
                    this.showNotification('Cela n\'aura aucun effet.');
                    return;
                }
                pokemon.status = null;
                used = true;
                this.showNotification(data.name + ' est soigné !');
                break;

            case 'levelup':
                if (pokemon.currentHp <= 0) {
                    this.showNotification(data.name + ' est K.O. !');
                    return;
                }
                pokemon.level = Math.min(100, pokemon.level + 1);
                recalcStats(pokemon);
                pokemon.currentHp = pokemon.stats.hp;
                used = true;
                this.showNotification(data.name + ' passe au Nv.' + pokemon.level + ' !');
                break;
        }

        if (used) {
            game.state.bag[itemId]--;
            if (game.state.bag[itemId] <= 0) {
                delete game.state.bag[itemId];
            }
            AudioSystem.playSfx('select');
            // Refresh item target panel immediately to show updated HP values
            this._showItemUseTarget(itemId);
            setTimeout(() => {
                this._renderMenu();
            }, 800);
        }
    },

    // -- Pokedex Tab --
    _renderPokedexTab(container) {
        const title = document.createElement('h2');
        title.textContent = 'Pokédex';
        container.appendChild(title);

        if (!game || !game.state) return;

        const infoBar = document.createElement('div');
        infoBar.style.cssText = 'text-align:center;margin-bottom:15px;font-size:13px;color:#aaa;';
        infoBar.textContent = 'Vus: ' + game.state.pokedexSeen.size + ' | Captures: ' + game.state.pokedexCaught.size + ' / 150';
        container.appendChild(infoBar);

        const grid = document.createElement('div');
        grid.className = 'pokedex-grid';

        for (let id = 1; id <= 150; id++) {
            const entry = document.createElement('div');
            entry.className = 'pokedex-entry';

            const seen = game.state.pokedexSeen.has(id);
            const caught = game.state.pokedexCaught.has(id);

            if (caught) {
                entry.classList.add('caught');
            } else if (seen) {
                entry.classList.add('seen');
            }

            const numDiv = document.createElement('div');
            numDiv.className = 'dex-number';
            numDiv.textContent = '#' + String(id).padStart(3, '0');
            entry.appendChild(numDiv);

            if (seen || caught) {
                // Draw mini sprite
                const spriteCanvas = document.createElement('canvas');
                spriteCanvas.width = 32;
                spriteCanvas.height = 32;
                spriteCanvas.style.display = 'block';
                spriteCanvas.style.margin = '2px auto';
                const spriteCtx = spriteCanvas.getContext('2d');
                SpriteRenderer.drawPokemon(spriteCtx, id, 0, 0, 32, 'front', false);
                entry.appendChild(spriteCanvas);

                const nameDiv = document.createElement('div');
                nameDiv.className = 'dex-name';
                const pokemonData = getPokemonById(id);
                nameDiv.textContent = pokemonData ? pokemonData.name : '???';
                nameDiv.style.color = caught ? '#ffd700' : '#6666ff';
                entry.appendChild(nameDiv);

                // Click to show detail
                entry.style.cursor = 'pointer';
                entry.addEventListener('click', () => {
                    this._showPokedexDetail(id, container);
                });
            } else {
                const unknown = document.createElement('div');
                unknown.style.cssText = 'font-size:20px;margin:6px 0;color:#333;';
                unknown.textContent = '?';
                entry.appendChild(unknown);

                const nameDiv = document.createElement('div');
                nameDiv.className = 'dex-name';
                nameDiv.textContent = '---';
                nameDiv.style.color = '#444';
                entry.appendChild(nameDiv);
            }

            grid.appendChild(entry);
        }

        container.appendChild(grid);
    },

    _showPokedexDetail(id, container) {
        const data = getPokemonById(id);
        if (!data) return;

        const panel = this.elements.menuPanel;
        panel.innerHTML = '';

        const title = document.createElement('h2');
        title.textContent = 'Pokédex';
        panel.appendChild(title);

        const card = document.createElement('div');
        card.style.cssText = 'background:rgba(255,255,255,0.05);border:2px solid rgba(255,215,0,0.3);border-radius:12px;padding:20px;max-width:420px;margin:0 auto;';

        // Header: number + name
        const header = document.createElement('div');
        header.style.cssText = 'text-align:center;margin-bottom:15px;';
        header.innerHTML = `<span style="color:#888;font-size:14px;">#${String(id).padStart(3, '0')}</span> <span style="color:#ffd700;font-size:20px;font-weight:bold;">${data.name}</span>`;
        card.appendChild(header);

        // Sprite
        const spriteCanvas = document.createElement('canvas');
        spriteCanvas.width = 96;
        spriteCanvas.height = 96;
        spriteCanvas.style.cssText = 'display:block;margin:0 auto 15px;';
        const spriteCtx = spriteCanvas.getContext('2d');
        SpriteRenderer.drawPokemon(spriteCtx, id, 0, 0, 96, 'front', false);
        card.appendChild(spriteCanvas);

        // Types
        const typesDiv = document.createElement('div');
        typesDiv.style.cssText = 'text-align:center;margin-bottom:12px;';
        data.types.forEach(t => {
            const badge = document.createElement('span');
            badge.style.cssText = `display:inline-block;padding:3px 12px;border-radius:12px;font-size:12px;margin:0 4px;color:#fff;background:${TYPE_COLORS[t] || '#888'};`;
            badge.textContent = (TYPE_NAMES_FR[t] || t).toUpperCase();
            typesDiv.appendChild(badge);
        });
        card.appendChild(typesDiv);

        // Caught ball info
        if (game && game.state && game.state.pokedexCaught.has(id)) {
            const caughtPkmn = (game.state.party || []).concat(game.state.pc || []).find(p => p && p.id === id && p.caughtBall);
            const ballName = caughtPkmn && caughtPkmn.caughtBall && ITEMS[caughtPkmn.caughtBall] ? ITEMS[caughtPkmn.caughtBall].name : 'Poké Ball';
            const caughtDiv = document.createElement('div');
            caughtDiv.style.cssText = 'text-align:center;font-size:11px;color:#aaa;margin-bottom:10px;';
            caughtDiv.textContent = `Capturé avec : ${ballName}`;
            card.appendChild(caughtDiv);
        }

        // Description
        if (data.desc) {
            const descDiv = document.createElement('div');
            descDiv.style.cssText = 'font-size:12px;color:#ccc;text-align:center;margin-bottom:15px;font-style:italic;';
            descDiv.textContent = data.desc;
            card.appendChild(descDiv);
        }

        // Base stats
        const statsTitle = document.createElement('div');
        statsTitle.style.cssText = 'font-weight:bold;color:#ffd700;margin-bottom:8px;font-size:13px;';
        statsTitle.textContent = 'Stats de base';
        card.appendChild(statsTitle);

        const statLabels = { hp: 'PV', atk: 'Atq', def: 'Déf', spatk: 'Atq.S', spdef: 'Déf.S', spd: 'Vit' };
        const maxStat = 150;
        Object.entries(statLabels).forEach(([key, label]) => {
            const val = data.baseStats[key] || 0;
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;margin-bottom:4px;font-size:11px;';
            row.innerHTML = `<span style="width:45px;color:#aaa;">${label}</span><span style="width:30px;color:#fff;">${val}</span><div style="flex:1;height:6px;background:#222;border-radius:3px;overflow:hidden;"><div style="width:${Math.min(100, val / maxStat * 100)}%;height:100%;background:${val >= 100 ? '#4CAF50' : val >= 70 ? '#FF9800' : '#F44336'};border-radius:3px;"></div></div>`;
            card.appendChild(row);
        });

        panel.appendChild(card);

        // Back button
        const backBtn = document.createElement('button');
        backBtn.className = 'menu-tab';
        backBtn.style.cssText = 'display:block;margin:15px auto 0;padding:8px 30px;';
        backBtn.textContent = 'Retour';
        backBtn.addEventListener('click', () => {
            this._renderMenu();
        });
        panel.appendChild(backBtn);
    },

    // -- Trainer Card Tab --
    _renderTrainerTab(container) {
        const title = document.createElement('h2');
        title.textContent = 'Carte Dresseur';
        container.appendChild(title);

        if (!game || !game.state) return;

        const card = document.createElement('div');
        card.style.cssText = 'background:rgba(255,255,255,0.05);border:2px solid rgba(255,215,0,0.3);border-radius:12px;padding:25px;max-width:400px;margin:0 auto;';

        const playerName = document.createElement('div');
        playerName.style.cssText = 'font-size:20px;font-weight:bold;color:#ffd700;margin-bottom:20px;text-align:center;';
        playerName.textContent = game.state.playerName || 'Dresseur';
        card.appendChild(playerName);

        const stats = [
            { label: 'Argent', value: game.state.money + ' $' },
            { label: 'Pokédex (vus)', value: game.state.pokedexSeen.size + '' },
            { label: 'Pokédex (capturés)', value: game.state.pokedexCaught.size + '' },
            { label: 'Badges', value: game.state.badges.length + ' / 8' },
            { label: 'Temps de jeu', value: this._formatPlayTime(game.state.playTime || 0) },
        ];

        stats.forEach(stat => {
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:14px;';
            const label = document.createElement('span');
            label.style.color = '#aaa';
            label.textContent = stat.label;
            const val = document.createElement('span');
            val.style.color = '#fff';
            val.textContent = stat.value;
            row.appendChild(label);
            row.appendChild(val);
            card.appendChild(row);
        });

        // Badges display
        const badgesLabel = document.createElement('div');
        badgesLabel.style.cssText = 'margin-top:20px;font-weight:bold;color:#ffd700;margin-bottom:10px;text-align:center;';
        badgesLabel.textContent = 'Badges';
        card.appendChild(badgesLabel);

        const badgeNames = [
            'Normal', 'Plante', 'Eau', 'Electrik',
            'Feu', 'Sol', 'Glace', 'Dragon'
        ];

        const badgeRow = document.createElement('div');
        badgeRow.style.cssText = 'display:flex;justify-content:center;gap:8px;flex-wrap:wrap;';

        for (let i = 0; i < 8; i++) {
            const badge = document.createElement('div');
            const earned = game.state.badges.includes(i);
            badge.style.cssText = 'width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;text-align:center;' +
                (earned
                    ? 'background:linear-gradient(135deg,#ffd700,#ff8c00);border:2px solid #ffd700;color:#000;font-weight:bold;box-shadow:0 0 8px rgba(255,215,0,0.5);'
                    : 'background:rgba(0,0,0,0.5);border:2px solid rgba(255,255,255,0.2);color:#555;');
            badge.textContent = earned ? (i + 1) : '?';
            badge.title = badgeNames[i];
            badgeRow.appendChild(badge);
        }

        card.appendChild(badgeRow);
        container.appendChild(card);
    },

    _formatPlayTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    },

    // -- Save Tab --
    _renderSaveTab(container) {
        const title = document.createElement('h2');
        title.textContent = 'Sauvegarder';
        container.appendChild(title);

        const info = document.createElement('p');
        info.style.cssText = 'text-align:center;color:#aaa;margin-bottom:20px;';
        info.textContent = 'Votre partie est sauvegardée automatiquement. Vous pouvez aussi sauvegarder manuellement.';
        container.appendChild(info);

        const saveBtn = document.createElement('button');
        saveBtn.className = 'menu-tab active';
        saveBtn.style.cssText = 'display:block;margin:0 auto;padding:12px 40px;font-size:16px;';
        saveBtn.textContent = 'Sauvegarder maintenant';
        saveBtn.addEventListener('click', () => {
            SaveSystem.save();
            AudioSystem.playSfx('select');
            this.showNotification('Partie sauvegardée !');
            saveBtn.textContent = 'Sauvegarde OK !';
            setTimeout(() => {
                saveBtn.textContent = 'Sauvegarder maintenant';
            }, 2000);
        });
        container.appendChild(saveBtn);
    },

    // -- Quit Tab --
    _renderQuitTab(container) {
        const title = document.createElement('h2');
        title.textContent = 'Quitter';
        container.appendChild(title);

        const warning = document.createElement('p');
        warning.style.cssText = 'text-align:center;color:#f44336;margin-bottom:20px;';
        warning.textContent = 'Voulez-vous retourner au menu principal ?';
        container.appendChild(warning);

        const info = document.createElement('p');
        info.style.cssText = 'text-align:center;color:#888;margin-bottom:20px;font-size:12px;';
        info.textContent = 'Votre partie sera sauvegardée automatiquement.';
        container.appendChild(info);

        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;justify-content:center;gap:20px;';

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'menu-tab';
        confirmBtn.style.cssText = 'padding:10px 30px;border-color:#f44336;color:#f44336;';
        confirmBtn.textContent = 'Oui, quitter';
        confirmBtn.addEventListener('click', () => {
            SaveSystem.save();
            this.closeMenu();
            if (game && typeof game.returnToTitle === 'function') {
                game.returnToTitle();
            } else {
                location.reload();
            }
        });
        btnRow.appendChild(confirmBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'menu-tab';
        cancelBtn.style.cssText = 'padding:10px 30px;';
        cancelBtn.textContent = 'Non, rester';
        cancelBtn.addEventListener('click', () => {
            this.menu.currentTab = 'party';
            this._renderMenu();
        });
        btnRow.appendChild(cancelBtn);

        container.appendChild(btnRow);
    },

    // ----------------------------------------------------------------
    // Notification System
    // ----------------------------------------------------------------
    showNotification(text) {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        if (this.notification.timer) {
            clearTimeout(this.notification.timer);
            this.notification.timer = null;
        }

        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = text;

        const uiLayer = document.getElementById('ui-layer');
        uiLayer.appendChild(notif);

        this.notification.timer = setTimeout(() => {
            if (notif.parentNode) {
                notif.remove();
            }
            this.notification.timer = null;
        }, 2500);
    },

    // ----------------------------------------------------------------
    // HUD
    // ----------------------------------------------------------------
    showLocationName(name) {
        const el = this.elements.locationName;
        if (!el) return;

        el.textContent = name;
        el.classList.add('visible');

        if (this.hud.locationTimer) {
            clearTimeout(this.hud.locationTimer);
        }

        this.hud.locationTimer = setTimeout(() => {
            el.classList.remove('visible');
            this.hud.locationTimer = null;
        }, 3000);
    },

    updateBadges() {
        if (!game || !game.state || !this.elements.badgesDisplay) return;

        const slots = this.elements.badgesDisplay.querySelectorAll('.badge-slot');
        slots.forEach((slot, i) => {
            if (game.state.badges.includes(i)) {
                slot.classList.add('earned');
            } else {
                slot.classList.remove('earned');
            }
        });
    },

    updatePartyDots() {
        const container = document.getElementById('party-dots');
        if (!container || !game || !game.state) return;

        container.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            const dot = document.createElement('div');
            dot.className = 'party-dot';
            const pkmn = game.state.party[i];
            if (!pkmn) {
                dot.classList.add('empty');
            } else if (pkmn.currentHp <= 0) {
                dot.classList.add('fainted');
            } else {
                const pct = pkmn.currentHp / pkmn.stats.hp * 100;
                dot.classList.add(pct > 50 ? 'hp-green' : pct > 20 ? 'hp-orange' : 'hp-red');
            }
            container.appendChild(dot);
        }

        // Update repel indicator
        const repelEl = document.getElementById('repel-indicator');
        if (repelEl) {
            const steps = (typeof GameEngine !== 'undefined') ? GameEngine.repelSteps : 0;
            if (steps > 0) {
                repelEl.textContent = `🌿 Repousse : ${steps} pas`;
                repelEl.classList.remove('hidden');
            } else {
                repelEl.classList.add('hidden');
            }
        }
    },

    // ----------------------------------------------------------------
    // Shop System
    // ----------------------------------------------------------------
    _openShopUI() {
        this.shop.active = true;
        this.shop.mode = 'buy';
        this.shop.items = [
            'pokeball', 'superball', 'hyperball',
            'potion', 'superpotion', 'hyperpotion',
            'antidote', 'revive', 'repel'
        ];

        if (game) game.state.gameMode = 'menu';
        this._renderShop();
        this.elements.menuOverlay.classList.remove('hidden');
    },

    closeShop() {
        this.shop.active = false;
        this.elements.menuOverlay.classList.add('hidden');
        this.elements.menuPanel.innerHTML = '';

        // Resume dialogue if there are more lines
        if (this.dialogue.active) {
            this.dialogue.currentIndex++;
            if (this.dialogue.currentIndex < this.dialogue.lines.length) {
                this._showCurrentLine();
            } else {
                this._endDialogue();
            }
        } else {
            if (game && game.state) game.state.gameMode = 'overworld';
        }
    },

    _renderShop() {
        const panel = this.elements.menuPanel;
        panel.innerHTML = '';

        // Header
        const title = document.createElement('h2');
        title.textContent = 'Boutique';
        panel.appendChild(title);

        // Money display
        const moneyDiv = document.createElement('div');
        moneyDiv.style.cssText = 'text-align:right;color:#ffd700;font-size:16px;font-weight:bold;margin-bottom:15px;';
        moneyDiv.textContent = 'Argent: ' + (game && game.state ? game.state.money : 0) + ' $';
        panel.appendChild(moneyDiv);

        // Mode tabs
        const tabBar = document.createElement('div');
        tabBar.className = 'menu-tabs';

        const buyTab = document.createElement('button');
        buyTab.className = 'menu-tab' + (this.shop.mode === 'buy' ? ' active' : '');
        buyTab.textContent = 'Acheter';
        buyTab.addEventListener('click', () => {
            this.shop.mode = 'buy';
            this._renderShop();
        });
        tabBar.appendChild(buyTab);

        const sellTab = document.createElement('button');
        sellTab.className = 'menu-tab' + (this.shop.mode === 'sell' ? ' active' : '');
        sellTab.textContent = 'Vendre';
        sellTab.addEventListener('click', () => {
            this.shop.mode = 'sell';
            this._renderShop();
        });
        tabBar.appendChild(sellTab);

        const exitTab = document.createElement('button');
        exitTab.className = 'menu-tab';
        exitTab.textContent = 'Quitter';
        exitTab.addEventListener('click', () => {
            this.closeShop();
        });
        tabBar.appendChild(exitTab);

        panel.appendChild(tabBar);

        // Content
        if (this.shop.mode === 'buy') {
            this._renderShopBuy(panel);
        } else {
            this._renderShopSell(panel);
        }
    },

    _renderShopBuy(panel) {
        const list = document.createElement('div');

        this.shop.items.forEach(itemId => {
            const itemData = ITEMS[itemId];
            if (!itemData || itemData.price <= 0) return;

            const row = document.createElement('div');
            row.className = 'bag-item';

            const leftCol = document.createElement('div');
            const nameDiv = document.createElement('div');
            nameDiv.className = 'item-name';
            nameDiv.textContent = itemData.name;
            leftCol.appendChild(nameDiv);

            const descDiv = document.createElement('div');
            descDiv.className = 'item-desc';
            descDiv.textContent = itemData.desc;
            leftCol.appendChild(descDiv);

            row.appendChild(leftCol);

            const rightCol = document.createElement('div');
            rightCol.style.cssText = 'display:flex;align-items:center;gap:10px;';

            const priceSpan = document.createElement('span');
            priceSpan.style.cssText = 'color:#ffd700;font-weight:bold;white-space:nowrap;';
            priceSpan.textContent = itemData.price + ' $';
            rightCol.appendChild(priceSpan);

            const buyBtn = document.createElement('button');
            buyBtn.className = 'menu-tab';
            buyBtn.style.padding = '4px 12px';
            buyBtn.textContent = 'Acheter';
            const canAfford = game && game.state && game.state.money >= itemData.price;
            if (!canAfford) {
                buyBtn.style.opacity = '0.4';
                buyBtn.style.cursor = 'default';
            }
            buyBtn.addEventListener('click', () => {
                if (!game || !game.state) return;
                if (game.state.money < itemData.price) {
                    this.showNotification('Pas assez d\'argent !');
                    return;
                }
                game.state.money -= itemData.price;
                if (!game.state.bag[itemId]) game.state.bag[itemId] = 0;
                game.state.bag[itemId]++;
                AudioSystem.playSfx('select');
                this.showNotification(itemData.name + ' acheté !');
                this._renderShop();
            });
            rightCol.appendChild(buyBtn);

            row.appendChild(rightCol);
            list.appendChild(row);
        });

        panel.appendChild(list);
    },

    _renderShopSell(panel) {
        if (!game || !game.state || !game.state.bag) return;

        const entries = Object.entries(game.state.bag).filter(([, qty]) => qty > 0);

        if (entries.length === 0) {
            const empty = document.createElement('p');
            empty.style.cssText = 'text-align:center;color:#888;margin-top:20px;';
            empty.textContent = 'Rien à vendre.';
            panel.appendChild(empty);
            return;
        }

        const list = document.createElement('div');

        entries.forEach(([itemId, quantity]) => {
            const itemData = ITEMS[itemId];
            if (!itemData) return;

            const sellPrice = Math.floor((itemData.price || 0) / 2);
            if (sellPrice <= 0) return;

            const row = document.createElement('div');
            row.className = 'bag-item';

            const leftCol = document.createElement('div');
            const nameDiv = document.createElement('div');
            nameDiv.className = 'item-name';
            nameDiv.textContent = itemData.name + ' x' + quantity;
            leftCol.appendChild(nameDiv);

            row.appendChild(leftCol);

            const rightCol = document.createElement('div');
            rightCol.style.cssText = 'display:flex;align-items:center;gap:10px;';

            const priceSpan = document.createElement('span');
            priceSpan.style.cssText = 'color:#ffd700;white-space:nowrap;';
            priceSpan.textContent = sellPrice + ' $';
            rightCol.appendChild(priceSpan);

            const sellBtn = document.createElement('button');
            sellBtn.className = 'menu-tab';
            sellBtn.style.padding = '4px 12px';
            sellBtn.textContent = 'Vendre';
            sellBtn.addEventListener('click', () => {
                if (!game || !game.state) return;
                game.state.money += sellPrice;
                game.state.bag[itemId]--;
                if (game.state.bag[itemId] <= 0) {
                    delete game.state.bag[itemId];
                }
                AudioSystem.playSfx('select');
                this.showNotification(itemData.name + ' vendu pour ' + sellPrice + ' $ !');
                this._renderShop();
            });
            rightCol.appendChild(sellBtn);

            row.appendChild(rightCol);
            list.appendChild(row);
        });

        panel.appendChild(list);
    },

    // ----------------------------------------------------------------
    // Utility
    // ----------------------------------------------------------------
    isBlocking() {
        return this.dialogue.active || this.menu.open || this.shop.active || this.starterSelect.active;
    },
};
