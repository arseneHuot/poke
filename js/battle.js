// ============================================================
// POKEMON NOVARA - Battle System
// ============================================================

const BattleSystem = {
    state: {
        active: false,
        playerPokemon: null,
        enemyPokemon: null,
        isTrainer: false,
        trainerNpc: null,
        turnPhase: 'idle', // idle, selecting, executing, animating, ended
        message: '',
        animating: false,
        messageQueue: [],
        currentMessageTimer: 0,
        playerStatStages: null,
        enemyStatStages: null,
        runAttempts: 0,
        battleResult: null,
        pendingExpEvents: [],
        pendingEvolve: null,
        trainerPokemonIndex: 0,
        playerAnim: { x: 0, y: 0, alpha: 1, shake: 0 },
        enemyAnim: { x: 0, y: 0, alpha: 1, shake: 0 },
        hpAnimPlayer: 0,
        hpAnimEnemy: 0,
        catchAnim: null,
        waitingForInput: false,
    },

    // ----------------------------------------------------------
    // Initialization
    // ----------------------------------------------------------

    _resetStatStages() {
        return { atk: 0, def: 0, spatk: 0, spdef: 0, spd: 0, accuracy: 0, evasion: 0 };
    },

    _initBattle(playerPokemon, enemyPokemon) {
        this.state.active = true;
        this.state.playerPokemon = playerPokemon;
        this.state.enemyPokemon = enemyPokemon;
        this.state.turnPhase = 'idle';
        this.state.message = '';
        this.state.animating = false;
        this.state.messageQueue = [];
        this.state.currentMessageTimer = 0;
        this.state.playerStatStages = this._resetStatStages();
        this.state.enemyStatStages = this._resetStatStages();
        this.state.runAttempts = 0;
        this.state.battleResult = null;
        this.state.pendingExpEvents = [];
        this.state.pendingEvolve = null;
        this.state.trainerPokemonIndex = 0;
        this.state.waitingForInput = false;

        this.state.playerAnim = { x: 0, y: 0, alpha: 1, shake: 0 };
        this.state.enemyAnim = { x: 0, y: 0, alpha: 1, shake: 0 };
        this.state.hpAnimPlayer = playerPokemon.currentHp;
        this.state.hpAnimEnemy = enemyPokemon.currentHp;
        this.state.catchAnim = null;

        // Show battle UI
        const battleUI = document.getElementById('battle-ui');
        if (battleUI) battleUI.classList.remove('hidden');

        AudioSystem.playMusic('battle');

        this._updateUI();
        this._showActions();
        this._queueMessage(`${enemyPokemon.name} sauvage apparaît !`);
    },

    startWildBattle(wildPokemon) {
        const party = game.state.party;
        const lead = party.find(p => p && p.currentHp > 0);
        if (!lead) return;
        this.state.isTrainer = false;
        this.state.trainerNpc = null;
        this._initBattle(lead, wildPokemon);
    },

    startTrainerBattle(trainerNpc) {
        const party = game.state.party;
        const lead = party.find(p => p && p.currentHp > 0);
        if (!lead) return;

        this.state.isTrainer = true;
        this.state.trainerNpc = trainerNpc;
        this.state.trainerPokemonIndex = 0;

        // Build trainer's pokemon team from NPC data
        if (!trainerNpc.party) {
            trainerNpc.party = (trainerNpc.team || []).map(t => createPokemon(t.id, t.level, false));
        }
        const enemyPokemon = trainerNpc.party[0];
        if (!enemyPokemon) return;
        this._initBattle(lead, enemyPokemon);
        this._queueMessage(`${trainerNpc.name} veut se battre !`);
        this._queueMessage(`${trainerNpc.name} envoie ${enemyPokemon.name} !`);
    },

    // ----------------------------------------------------------
    // UI Management
    // ----------------------------------------------------------

    _updateUI() {
        const pp = this.state.playerPokemon;
        const ep = this.state.enemyPokemon;
        if (!pp || !ep) return;

        // Enemy info
        const enemyName = document.getElementById('enemy-name');
        const enemyLevel = document.getElementById('enemy-level');
        const enemyHp = document.getElementById('enemy-hp');
        if (enemyName) enemyName.textContent = ep.nickname || ep.name;
        if (enemyLevel) enemyLevel.textContent = `Nv.${ep.level}`;
        if (enemyHp) {
            const pct = Math.max(0, this.state.hpAnimEnemy / ep.stats.hp * 100);
            enemyHp.style.width = pct + '%';
            enemyHp.style.backgroundColor = pct > 50 ? '#4CAF50' : pct > 20 ? '#FF9800' : '#F44336';
        }

        // Player info
        const playerName = document.getElementById('player-pokemon-name');
        const playerLevel = document.getElementById('player-pokemon-level');
        const playerHp = document.getElementById('player-hp');
        const playerHpText = document.getElementById('player-hp-text');
        const playerXp = document.getElementById('player-xp');
        if (playerName) playerName.textContent = pp.nickname || pp.name;
        if (playerLevel) playerLevel.textContent = `Nv.${pp.level}`;
        if (playerHp) {
            const pct = Math.max(0, this.state.hpAnimPlayer / pp.stats.hp * 100);
            playerHp.style.width = pct + '%';
            playerHp.style.backgroundColor = pct > 50 ? '#4CAF50' : pct > 20 ? '#FF9800' : '#F44336';
        }
        if (playerHpText) playerHpText.textContent = `${Math.ceil(Math.max(0, this.state.hpAnimPlayer))}/${pp.stats.hp}`;
        if (playerXp) {
            const xpPct = getExpPercent(pp);
            playerXp.style.width = (xpPct * 100) + '%';
        }
    },

    _showActions() {
        const actions = document.getElementById('battle-actions');
        const moves = document.getElementById('battle-moves');
        if (actions) actions.classList.remove('hidden');
        if (moves) moves.classList.add('hidden');
        this.state.turnPhase = 'selecting';
        this.state.waitingForInput = true;

        // Bind action buttons
        const btns = document.querySelectorAll('#battle-actions .battle-btn');
        btns.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => {
                AudioSystem.playSfx('select');
                const action = newBtn.dataset.action;
                if (action === 'fight') this._showMoves();
                else if (action === 'bag') this._showBag();
                else if (action === 'pokemon') this._showParty();
                else if (action === 'run') this.tryRun();
            });
        });
    },

    _showMoves() {
        const actions = document.getElementById('battle-actions');
        const movesDiv = document.getElementById('battle-moves');
        if (actions) actions.classList.add('hidden');
        if (!movesDiv) return;

        movesDiv.classList.remove('hidden');
        movesDiv.innerHTML = '';

        const pp = this.state.playerPokemon;
        pp.moves.forEach((move, index) => {
            const moveData = MOVES_DB[move.id];
            if (!moveData) return;
            const ppLeft = (moveData.pp || 10) - (move.ppUsed || 0);
            const btn = document.createElement('button');
            btn.className = 'battle-btn move-btn';
            btn.style.borderLeft = `4px solid ${TYPE_COLORS[moveData.type] || '#888'}`;
            btn.innerHTML = `<span class="move-name">${moveData.name}</span><span class="move-pp">PP ${ppLeft}/${moveData.pp || 10}</span>`;
            btn.disabled = ppLeft <= 0;
            btn.addEventListener('click', () => {
                AudioSystem.playSfx('confirm');
                this.selectMove(index);
            });
            movesDiv.appendChild(btn);
        });

        // Back button
        const backBtn = document.createElement('button');
        backBtn.className = 'battle-btn';
        backBtn.textContent = 'RETOUR';
        backBtn.addEventListener('click', () => {
            AudioSystem.playSfx('cancel');
            this._showActions();
        });
        movesDiv.appendChild(backBtn);
    },

    _showBag() {
        if (!game.state || !game.state.bag) {
            this._showActions();
            return;
        }

        const actions = document.getElementById('battle-actions');
        const movesDiv = document.getElementById('battle-moves');
        if (actions) actions.classList.add('hidden');
        if (!movesDiv) return;

        movesDiv.classList.remove('hidden');
        movesDiv.innerHTML = '';

        const inv = game.state.bag;
        const battleItems = Object.entries(inv).filter(([id, qty]) => {
            if (qty <= 0) return false;
            const item = ITEMS[id];
            if (!item) return false;
            return item.type === 'ball' || item.type === 'heal' || item.type === 'status';
        });

        if (battleItems.length === 0) {
            const msg = document.createElement('div');
            msg.className = 'battle-msg';
            msg.textContent = 'Aucun objet utilisable !';
            movesDiv.appendChild(msg);
        } else {
            battleItems.forEach(([id, qty]) => {
                const item = ITEMS[id];
                const btn = document.createElement('button');
                btn.className = 'battle-btn';
                btn.textContent = `${item.name} x${qty}`;
                btn.addEventListener('click', () => {
                    AudioSystem.playSfx('confirm');
                    this.selectItem(id);
                });
                movesDiv.appendChild(btn);
            });
        }

        const backBtn = document.createElement('button');
        backBtn.className = 'battle-btn';
        backBtn.textContent = 'RETOUR';
        backBtn.addEventListener('click', () => {
            AudioSystem.playSfx('cancel');
            this._showActions();
        });
        movesDiv.appendChild(backBtn);
    },

    _showParty() {
        const actions = document.getElementById('battle-actions');
        const movesDiv = document.getElementById('battle-moves');
        if (actions) actions.classList.add('hidden');
        if (!movesDiv) return;

        movesDiv.classList.remove('hidden');
        movesDiv.innerHTML = '';

        game.state.party.forEach((pkmn, index) => {
            const btn = document.createElement('button');
            btn.className = 'battle-btn';
            const isCurrent = pkmn === this.state.playerPokemon;
            const fainted = pkmn.currentHp <= 0;
            btn.textContent = `${pkmn.nickname || pkmn.name} Nv.${pkmn.level} ${Math.ceil(pkmn.currentHp)}/${pkmn.stats.hp} PV`;
            btn.disabled = isCurrent || fainted;
            if (fainted) btn.style.opacity = '0.5';
            if (isCurrent) btn.style.borderColor = '#FFD700';
            btn.addEventListener('click', () => {
                AudioSystem.playSfx('confirm');
                this.switchPokemon(index);
            });
            movesDiv.appendChild(btn);
        });

        const backBtn = document.createElement('button');
        backBtn.className = 'battle-btn';
        backBtn.textContent = 'RETOUR';
        backBtn.addEventListener('click', () => {
            AudioSystem.playSfx('cancel');
            this._showActions();
        });
        movesDiv.appendChild(backBtn);
    },

    _hideMenus() {
        const actions = document.getElementById('battle-actions');
        const moves = document.getElementById('battle-moves');
        if (actions) actions.classList.add('hidden');
        if (moves) moves.classList.add('hidden');
        this.state.waitingForInput = false;
    },

    _showMessage(text) {
        this.state.message = text;
        const msgEl = document.getElementById('battle-message');
        if (msgEl) msgEl.textContent = text;
    },

    _queueMessage(text, duration) {
        this.state.messageQueue.push({ text, duration: duration || 1500 });
    },

    // ----------------------------------------------------------
    // Damage Calculation
    // ----------------------------------------------------------

    _getStatMultiplier(stages) {
        if (stages >= 0) return (2 + stages) / 2;
        return 2 / (2 - stages);
    },

    _getEffectiveStat(pokemon, statName, stages) {
        const base = pokemon.stats[statName];
        const stageMult = this._getStatMultiplier(stages[statName] || 0);
        return Math.floor(base * stageMult);
    },

    calcDamage(attacker, defender, moveData, attackerStages, defenderStages) {
        if (moveData.category === 'status') return 0;
        if (moveData.power === 0) return 0;

        const level = attacker.level;
        const power = moveData.power;

        // Use atk/def for physical, spatk/spdef for special
        const isPhysical = moveData.category === 'physical';
        const atkStat = isPhysical ? 'atk' : 'spatk';
        const defStat = isPhysical ? 'def' : 'spdef';

        const atk = this._getEffectiveStat(attacker, atkStat, attackerStages);
        const def = this._getEffectiveStat(defender, defStat, defenderStages);

        // STAB
        const attackerTypes = attacker.types || [];
        const stab = attackerTypes.includes(moveData.type) ? 1.5 : 1;

        // Type effectiveness
        const defTypes = defender.types || [];
        const typeEff = getTypeEffectiveness(moveData.type, defTypes[0], defTypes[1]);

        // Critical hit
        const critRate = moveData.critRate || 1;
        const critChance = critRate === 1 ? 6.25 : critRate === 2 ? 12.5 : critRate === 3 ? 50 : 100;
        const isCritical = Math.random() * 100 < critChance;
        const critical = isCritical ? 1.5 : 1;

        // Random factor 0.85 to 1.0
        const random = 0.85 + Math.random() * 0.15;

        // Burn halves physical attack
        const burnMod = (attacker.status === 'burn' && isPhysical) ? 0.5 : 1;

        // Main formula
        let damage = ((2 * level / 5 + 2) * power * (atk / def)) / 50 + 2;
        damage = damage * stab * typeEff * random * critical * burnMod;
        damage = Math.max(1, Math.floor(damage));

        // If immune
        if (typeEff === 0) damage = 0;

        return {
            damage,
            isCritical,
            typeEff,
            stab: stab > 1
        };
    },

    // ----------------------------------------------------------
    // Move Execution
    // ----------------------------------------------------------

    _executeMove(attacker, defender, moveId, attackerStages, defenderStages, isPlayer) {
        const moveData = MOVES_DB[moveId];
        if (!moveData) return;

        const attackerName = attacker.nickname || attacker.name;
        this._queueMessage(`${attackerName} utilise ${moveData.name} !`);

        // Accuracy check
        if (moveData.accuracy && moveData.accuracy < 100) {
            const accStages = attackerStages.accuracy || 0;
            const evaStages = defenderStages.evasion || 0;
            const accMult = this._getStatMultiplier(accStages - evaStages);
            const hitChance = moveData.accuracy * accMult;
            if (Math.random() * 100 >= hitChance) {
                this._queueMessage(`${attackerName} rate son attaque !`);
                // Deduct PP
                const moveSlot = attacker.moves.find(m => m.id === moveId);
                if (moveSlot) moveSlot.ppUsed = (moveSlot.ppUsed || 0) + 1;
                return;
            }
        }

        // Deduct PP
        const moveSlot = attacker.moves.find(m => m.id === moveId);
        if (moveSlot) moveSlot.ppUsed = (moveSlot.ppUsed || 0) + 1;

        // Status moves
        if (moveData.category === 'status') {
            this._applyMoveEffect(attacker, defender, moveData, attackerStages, defenderStages, isPlayer);
            return;
        }

        // Damage calculation
        const result = this.calcDamage(attacker, defender, moveData, attackerStages, defenderStages);

        if (result.damage === 0 && result.typeEff === 0) {
            this._queueMessage(`Ça n'affecte pas ${defender.nickname || defender.name}...`);
            return;
        }

        // Apply damage
        defender.currentHp = Math.max(0, defender.currentHp - result.damage);

        // Animation shake
        if (isPlayer) {
            this.state.enemyAnim.shake = 8;
        } else {
            this.state.playerAnim.shake = 8;
        }

        // Sound effects
        if (result.isCritical) {
            AudioSystem.playSfx('critical');
            this._queueMessage('Coup critique !');
        } else {
            AudioSystem.playSfx('hit');
        }

        if (result.typeEff > 1) {
            AudioSystem.playSfx('super_effective');
            this._queueMessage('C\'est super efficace !');
        } else if (result.typeEff < 1 && result.typeEff > 0) {
            AudioSystem.playSfx('not_effective');
            this._queueMessage('Ce n\'est pas très efficace...');
        }

        // Drain moves
        if (moveData.drain && result.damage > 0) {
            const healAmt = Math.max(1, Math.floor(result.damage * moveData.drain));
            attacker.currentHp = Math.min(attacker.stats.hp, attacker.currentHp + healAmt);
            this._queueMessage(`${attackerName} absorbe de l'énergie !`);
        }

        // Recoil moves
        if (moveData.recoil && result.damage > 0) {
            const recoilDmg = Math.max(1, Math.floor(result.damage * moveData.recoil));
            attacker.currentHp = Math.max(0, attacker.currentHp - recoilDmg);
            this._queueMessage(`${attackerName} est blessé par le contrecoup !`);
        }

        // Self KO moves
        if (moveData.selfKO) {
            attacker.currentHp = 0;
            this._queueMessage(`${attackerName} est hors de combat !`);
        }

        // Move secondary effects
        if (moveData.effect) {
            this._applyMoveEffect(attacker, defender, moveData, attackerStages, defenderStages, isPlayer);
        }
    },

    _applyMoveEffect(attacker, defender, moveData, attackerStages, defenderStages, isPlayer) {
        const effect = moveData.effect;
        if (!effect) return;

        const chance = effect.chance || 100;
        if (Math.random() * 100 >= chance) return;

        switch (effect.type) {
            case 'status': {
                if (defender.status) {
                    if (moveData.category === 'status') {
                        this._queueMessage(`Ça n'a aucun effet...`);
                    }
                    break;
                }
                // Immunity checks
                if (effect.status === 'burn' && defender.types && defender.types.includes('fire')) break;
                if (effect.status === 'paralysis' && defender.types && defender.types.includes('electric')) break;
                if (effect.status === 'poison' && defender.types && (defender.types.includes('poison') || defender.types.includes('steel'))) break;
                if (effect.status === 'badly_poisoned' && defender.types && (defender.types.includes('poison') || defender.types.includes('steel'))) break;
                if (effect.status === 'freeze' && defender.types && defender.types.includes('ice')) break;

                defender.status = effect.status;
                const statusNames = {
                    burn: 'est brûlé !',
                    paralysis: 'est paralysé !',
                    poison: 'est empoisonné !',
                    badly_poisoned: 'est gravement empoisonné !',
                    sleep: 's\'endort !',
                    freeze: 'est gelé !'
                };
                this._queueMessage(`${defender.nickname || defender.name} ${statusNames[effect.status] || 'subit un statut !'}`);
                break;
            }

            case 'stat': {
                const target = effect.target === 'self' ? attackerStages : defenderStages;
                const targetPkmn = effect.target === 'self' ? attacker : defender;
                const stat = effect.stat;
                const stages = effect.stages;
                const oldVal = target[stat] || 0;
                target[stat] = Math.max(-6, Math.min(6, oldVal + stages));
                const statNames = { atk: 'Attaque', def: 'Défense', spatk: 'Atq. Spé.', spdef: 'Déf. Spé.', spd: 'Vitesse', accuracy: 'Précision', evasion: 'Esquive' };
                const change = stages > 0 ? (stages > 1 ? 'monte beaucoup' : 'monte') : (stages < -1 ? 'baisse beaucoup' : 'baisse');
                if (target[stat] !== oldVal) {
                    this._queueMessage(`${statNames[stat] || stat} de ${targetPkmn.nickname || targetPkmn.name} ${change} !`);
                } else {
                    this._queueMessage(`Ça n'a aucun effet...`);
                }
                break;
            }

            case 'stat_self': {
                const stats = effect.stats || [];
                const stages = effect.stages;
                stats.forEach(stat => {
                    const target = attackerStages;
                    const oldVal = target[stat] || 0;
                    target[stat] = Math.max(-6, Math.min(6, oldVal + stages));
                    const statNames = { atk: 'Attaque', def: 'Défense', spatk: 'Atq. Spé.', spdef: 'Déf. Spé.', spd: 'Vitesse' };
                    const change = stages > 0 ? (stages > 1 ? 'monte beaucoup' : 'monte') : (stages < -1 ? 'baisse beaucoup' : 'baisse');
                    if (target[stat] !== oldVal) {
                        this._queueMessage(`${statNames[stat] || stat} de ${attacker.nickname || attacker.name} ${change} !`);
                    }
                });
                break;
            }

            case 'heal': {
                const pct = effect.percent || 0.5;
                const healAmt = Math.floor(attacker.stats.hp * pct);
                const old = attacker.currentHp;
                attacker.currentHp = Math.min(attacker.stats.hp, attacker.currentHp + healAmt);
                if (attacker.currentHp > old) {
                    this._queueMessage(`${attacker.nickname || attacker.name} récupère des PV !`);
                    AudioSystem.playSfx('heal');
                }
                break;
            }

            case 'flinch': {
                // Flinch is handled in turn order - only works if attacker moves first
                // Mark on the defender for this turn
                defender._flinched = true;
                break;
            }

            case 'protect': {
                attacker._protected = true;
                this._queueMessage(`${attacker.nickname || attacker.name} se protège !`);
                break;
            }

            case 'leechseed': {
                if (defender._seeded) {
                    this._queueMessage(`Ça n'a aucun effet...`);
                } else if (defender.types && defender.types.includes('grass')) {
                    this._queueMessage(`Ça n'affecte pas ${defender.nickname || defender.name}...`);
                } else {
                    defender._seeded = true;
                    this._queueMessage(`${defender.nickname || defender.name} est infecté par Vampigraine !`);
                }
                break;
            }

            case 'rest': {
                if (attacker.currentHp >= attacker.stats.hp) {
                    this._queueMessage(`${attacker.nickname || attacker.name} a déjà tous ses PV !`);
                } else {
                    attacker.currentHp = attacker.stats.hp;
                    attacker.status = 'sleep';
                    attacker._sleepTurns = 3;
                    this._queueMessage(`${attacker.nickname || attacker.name} récupère tous ses PV et s'endort !`);
                    AudioSystem.playSfx('heal');
                }
                break;
            }

            default:
                break;
        }
    },

    // ----------------------------------------------------------
    // Status Condition Processing
    // ----------------------------------------------------------

    _processStatusBeforeTurn(pokemon) {
        if (!pokemon.status) return true; // can act

        const name = pokemon.nickname || pokemon.name;

        switch (pokemon.status) {
            case 'paralysis':
                if (Math.random() < 0.25) {
                    this._queueMessage(`${name} est paralysé ! Il ne peut pas bouger !`);
                    return false;
                }
                return true;

            case 'sleep':
                pokemon._sleepTurns = (pokemon._sleepTurns || 0) - 1;
                if (pokemon._sleepTurns <= 0) {
                    pokemon.status = null;
                    pokemon._sleepTurns = 0;
                    this._queueMessage(`${name} se réveille !`);
                    return true;
                }
                this._queueMessage(`${name} dort...`);
                return false;

            case 'freeze':
                if (Math.random() < 0.2) {
                    pokemon.status = null;
                    this._queueMessage(`${name} dégèle !`);
                    return true;
                }
                this._queueMessage(`${name} est gelé !`);
                return false;

            default:
                return true;
        }
    },

    _processStatusEndTurn(pokemon) {
        if (!pokemon || pokemon.currentHp <= 0) return;
        const name = pokemon.nickname || pokemon.name;

        switch (pokemon.status) {
            case 'burn': {
                const dmg = Math.max(1, Math.floor(pokemon.stats.hp / 16));
                pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
                this._queueMessage(`${name} souffre de sa brûlure !`);
                AudioSystem.playSfx('damage');
                break;
            }
            case 'poison': {
                const dmg = Math.max(1, Math.floor(pokemon.stats.hp / 8));
                pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
                this._queueMessage(`${name} souffre du poison !`);
                AudioSystem.playSfx('damage');
                break;
            }
            case 'badly_poisoned': {
                pokemon._toxicCounter = (pokemon._toxicCounter || 1);
                const dmg = Math.max(1, Math.floor(pokemon.stats.hp * pokemon._toxicCounter / 16));
                pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
                pokemon._toxicCounter++;
                this._queueMessage(`${name} souffre gravement du poison !`);
                AudioSystem.playSfx('damage');
                break;
            }
        }

        // Leech seed
        if (pokemon._seeded && pokemon.currentHp > 0) {
            const dmg = Math.max(1, Math.floor(pokemon.stats.hp / 8));
            pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
            this._queueMessage(`Vampigraine sape les PV de ${name} !`);
        }
    },

    // ----------------------------------------------------------
    // Turn Execution
    // ----------------------------------------------------------

    selectMove(moveIndex) {
        if (this.state.turnPhase !== 'selecting') return;

        const pp = this.state.playerPokemon;
        const move = pp.moves[moveIndex];
        if (!move) return;

        const moveData = MOVES_DB[move.id];
        if (!moveData) return;

        const ppLeft = (moveData.pp || 10) - (move.ppUsed || 0);
        if (ppLeft <= 0) {
            this._queueMessage(`Plus de PP pour cette attaque !`);
            return;
        }

        this._hideMenus();
        this._executeTurn({ type: 'move', moveId: move.id, moveIndex });
    },

    selectItem(itemId) {
        if (this.state.turnPhase !== 'selecting') return;

        const item = ITEMS[itemId];
        if (!item) return;
        if (!game.state.bag[itemId] || game.state.bag[itemId] <= 0) return;

        this._hideMenus();

        if (item.type === 'ball') {
            if (this.state.isTrainer) {
                this._queueMessage(`On ne peut pas capturer le Pokémon d'un dresseur !`);
                this._processMessageQueue(() => this._showActions());
                return;
            }
            game.state.bag[itemId]--;
            this._executeCatch(itemId);
        } else if (item.type === 'heal') {
            game.state.bag[itemId]--;
            const pp = this.state.playerPokemon;
            const healAmt = item.healAmount || 20;
            const old = pp.currentHp;
            pp.currentHp = Math.min(pp.stats.hp, pp.currentHp + healAmt);
            const healed = pp.currentHp - old;
            AudioSystem.playSfx('heal');
            this._queueMessage(`${pp.nickname || pp.name} récupère ${healed} PV !`);
            this._executeTurn({ type: 'item' });
        } else if (item.type === 'status') {
            if (this.state.playerPokemon.status === item.cures) {
                game.state.bag[itemId]--;
                this.state.playerPokemon.status = null;
                AudioSystem.playSfx('heal');
                this._queueMessage(`${this.state.playerPokemon.nickname || this.state.playerPokemon.name} est soigné !`);
                this._executeTurn({ type: 'item' });
            } else {
                this._queueMessage(`Ça n'a aucun effet !`);
                game.state.bag[itemId]; // Don't consume if not effective
                this._processMessageQueue(() => this._showActions());
                return;
            }
        }
    },

    switchPokemon(partyIndex) {
        if (!this.state.active) return;

        const newPkmn = game.state.party[partyIndex];
        if (!newPkmn || newPkmn.currentHp <= 0 || newPkmn === this.state.playerPokemon) return;

        this._hideMenus();

        const oldName = this.state.playerPokemon.nickname || this.state.playerPokemon.name;
        this.state.playerPokemon = newPkmn;
        this.state.playerStatStages = this._resetStatStages();
        this.state.hpAnimPlayer = newPkmn.currentHp;
        this.state.playerAnim = { x: 0, y: 0, alpha: 1, shake: 0 };

        this._queueMessage(`${oldName}, reviens !`);
        this._queueMessage(`Go ! ${newPkmn.nickname || newPkmn.name} !`);
        this._updateUI();

        // If this is during normal turn selection, enemy gets a free hit
        if (this.state.turnPhase === 'selecting' || this.state.turnPhase === 'idle') {
            this._executeTurn({ type: 'switch' });
        } else {
            // Forced switch (after faint), no enemy turn
            this._processMessageQueue(() => {
                this._showActions();
            });
        }
    },

    tryRun() {
        if (this.state.turnPhase !== 'selecting') return;

        this._hideMenus();

        if (this.state.isTrainer) {
            this._queueMessage(`Impossible de fuir un combat de dresseur !`);
            this._processMessageQueue(() => this._showActions());
            return;
        }

        this.state.runAttempts++;
        const playerSpd = this._getEffectiveStat(this.state.playerPokemon, 'spd', this.state.playerStatStages);
        const enemySpd = this._getEffectiveStat(this.state.enemyPokemon, 'spd', this.state.enemyStatStages);

        let escapeChance;
        if (enemySpd <= 0) {
            escapeChance = 256;
        } else {
            escapeChance = Math.floor((playerSpd * 128 / enemySpd) + 30 * this.state.runAttempts);
        }

        if (escapeChance >= 256 || Math.random() * 256 < escapeChance) {
            AudioSystem.playSfx('run');
            this._queueMessage(`Vous prenez la fuite !`);
            this._processMessageQueue(() => this.endBattle('run'));
        } else {
            this._queueMessage(`Impossible de fuir !`);
            this._executeTurn({ type: 'run_fail' });
        }
    },

    // ----------------------------------------------------------
    // Turn Flow
    // ----------------------------------------------------------

    _executeTurn(playerAction) {
        this.state.turnPhase = 'executing';

        // Determine enemy action (always attacks with random move)
        const ep = this.state.enemyPokemon;
        const usableMoves = ep.moves.filter(m => {
            const md = MOVES_DB[m.id];
            return md && ((md.pp || 10) - (m.ppUsed || 0) > 0);
        });
        const enemyMove = usableMoves.length > 0
            ? usableMoves[Math.floor(Math.random() * usableMoves.length)]
            : { id: 'tackle' }; // struggle fallback

        // If player used item or switch, enemy attacks first
        if (playerAction.type === 'item' || playerAction.type === 'switch' || playerAction.type === 'run_fail') {
            this._doEnemyTurn(enemyMove.id);
            this._checkFaintsAfterTurn(playerAction);
            return;
        }

        // Determine turn order for moves
        const playerMoveData = MOVES_DB[playerAction.moveId];
        const enemyMoveData = MOVES_DB[enemyMove.id];
        const playerPriority = (playerMoveData && playerMoveData.priority) || 0;
        const enemyPriority = (enemyMoveData && enemyMoveData.priority) || 0;

        let playerFirst;
        if (playerPriority !== enemyPriority) {
            playerFirst = playerPriority > enemyPriority;
        } else {
            const playerSpd = this._getEffectiveStat(this.state.playerPokemon, 'spd', this.state.playerStatStages);
            const enemySpd = this._getEffectiveStat(this.state.enemyPokemon, 'spd', this.state.enemyStatStages);
            playerFirst = playerSpd > enemySpd ? true : (playerSpd === enemySpd ? Math.random() < 0.5 : false);
        }

        if (playerFirst) {
            // Player moves first
            this._doPlayerTurn(playerAction.moveId);

            // Check if enemy fainted
            if (this.state.enemyPokemon.currentHp <= 0) {
                this._handleEnemyFaint();
                return;
            }

            // Save flinch state before clearing it
            const enemyFlinched = this.state.enemyPokemon._flinched;
            this.state.enemyPokemon._flinched = false;

            // Enemy turn
            if (enemyFlinched) {
                this._queueMessage(`${this.state.enemyPokemon.nickname || this.state.enemyPokemon.name} a tressailli !`);
            } else {
                this._doEnemyTurn(enemyMove.id);
            }

            // Check if player fainted
            if (this.state.playerPokemon.currentHp <= 0) {
                this._handlePlayerFaint();
                return;
            }
        } else {
            // Enemy moves first
            this._doEnemyTurn(enemyMove.id);

            if (this.state.playerPokemon.currentHp <= 0) {
                this._handlePlayerFaint();
                return;
            }

            // Check flinch on player
            if (this.state.playerPokemon._flinched) {
                this._queueMessage(`${this.state.playerPokemon.nickname || this.state.playerPokemon.name} a tressailli !`);
                this.state.playerPokemon._flinched = false;
            } else {
                this._doPlayerTurn(playerAction.moveId);
            }

            if (this.state.enemyPokemon.currentHp <= 0) {
                this._handleEnemyFaint();
                return;
            }
        }

        // End of turn status damage
        this._processStatusEndTurn(this.state.playerPokemon);
        this._processStatusEndTurn(this.state.enemyPokemon);

        // Check faints after status
        this._checkFaintsAfterTurn(playerAction);
    },

    _doPlayerTurn(moveId) {
        const pp = this.state.playerPokemon;
        // Clear protect/flinch flags
        pp._protected = false;
        pp._flinched = false;

        const canAct = this._processStatusBeforeTurn(pp);
        if (!canAct) return;

        this._executeMove(pp, this.state.enemyPokemon, moveId,
            this.state.playerStatStages, this.state.enemyStatStages, true);
    },

    _doEnemyTurn(moveId) {
        const ep = this.state.enemyPokemon;
        ep._protected = false;
        ep._flinched = false;

        const canAct = this._processStatusBeforeTurn(ep);
        if (!canAct) return;

        // Check if player is protected
        if (this.state.playerPokemon._protected) {
            this._queueMessage(`${this.state.playerPokemon.nickname || this.state.playerPokemon.name} se protège de l'attaque !`);
            return;
        }

        this._executeMove(ep, this.state.playerPokemon, moveId,
            this.state.enemyStatStages, this.state.playerStatStages, false);
    },

    _checkFaintsAfterTurn(playerAction) {
        // Check enemy faint
        if (this.state.enemyPokemon.currentHp <= 0) {
            this._handleEnemyFaint();
            return;
        }

        // Check player faint
        if (this.state.playerPokemon.currentHp <= 0) {
            this._handlePlayerFaint();
            return;
        }

        // Turn complete - show actions again
        this._processMessageQueue(() => {
            this._showActions();
        });
    },

    // ----------------------------------------------------------
    // Faint Handling
    // ----------------------------------------------------------

    _handleEnemyFaint() {
        const ep = this.state.enemyPokemon;
        AudioSystem.playSfx('faint');
        this.state.enemyAnim.alpha = 0;
        this._queueMessage(`${ep.nickname || ep.name} est K.O. !`);

        // Experience gain
        const expGain = calcExpGain(ep, this.state.isTrainer);
        this._queueMessage(`${this.state.playerPokemon.nickname || this.state.playerPokemon.name} gagne ${expGain} points d'exp. !`);

        const events = addExp(this.state.playerPokemon, expGain);

        events.forEach(evt => {
            if (evt.type === 'levelup') {
                AudioSystem.playSfx('levelup');
                this._queueMessage(`${this.state.playerPokemon.nickname || this.state.playerPokemon.name} monte au niveau ${evt.level} !`);
            } else if (evt.type === 'newmove') {
                const md = MOVES_DB[evt.move];
                this._queueMessage(`${this.state.playerPokemon.nickname || this.state.playerPokemon.name} apprend ${md ? md.name : evt.move} !`);
            } else if (evt.type === 'evolve') {
                this.state.pendingEvolve = evt;
            }
        });

        // Trainer battle: check if more pokemon
        if (this.state.isTrainer && this.state.trainerNpc) {
            this.state.trainerPokemonIndex++;
            const nextPkmn = this.state.trainerNpc.party[this.state.trainerPokemonIndex];
            if (nextPkmn && nextPkmn.currentHp > 0) {
                this.state.enemyPokemon = nextPkmn;
                this.state.enemyStatStages = this._resetStatStages();
                this.state.hpAnimEnemy = nextPkmn.currentHp;
                this.state.enemyAnim = { x: 0, y: 0, alpha: 1, shake: 0 };
                this._queueMessage(`${this.state.trainerNpc.name} envoie ${nextPkmn.nickname || nextPkmn.name} !`);
                this._processMessageQueue(() => {
                    this._updateUI();
                    this._showActions();
                });
                return;
            }

            // Trainer defeated
            this._queueMessage(`Vous avez battu ${this.state.trainerNpc.name} !`);
            if (this.state.trainerNpc.reward) {
                game.state.money = (game.state.money || 0) + this.state.trainerNpc.reward;
                this._queueMessage(`Vous recevez ${this.state.trainerNpc.reward}₽ !`);
            }
        }

        // Handle pending evolution
        this._processMessageQueue(() => {
            if (this.state.pendingEvolve) {
                const evo = this.state.pendingEvolve;
                const oldName = this.state.playerPokemon.nickname || this.state.playerPokemon.name;
                AudioSystem.playSfx('evolve');
                evolvePokemon(this.state.playerPokemon, evo.to);
                const newName = this.state.playerPokemon.name;
                this._queueMessage(`${oldName} évolue en ${newName} !`);
                this.state.pendingEvolve = null;
                this._processMessageQueue(() => {
                    this.endBattle('win');
                });
            } else {
                this.endBattle('win');
            }
        });
    },

    _handlePlayerFaint() {
        const pp = this.state.playerPokemon;
        AudioSystem.playSfx('faint');
        this.state.playerAnim.alpha = 0;
        this._queueMessage(`${pp.nickname || pp.name} est K.O. !`);

        // Check for other alive pokemon
        const alivePokemon = game.state.party.filter(p => p.currentHp > 0);
        if (alivePokemon.length > 0) {
            // Force switch
            this._processMessageQueue(() => {
                this.state.turnPhase = 'forced_switch';
                this._showParty();
            });
        } else {
            // All pokemon fainted - blackout
            this._queueMessage(`Vous n'avez plus de Pokémon apte au combat !`);
            this._processMessageQueue(() => {
                this.endBattle('lose');
            });
        }
    },

    // ----------------------------------------------------------
    // Catch Mechanic
    // ----------------------------------------------------------

    _executeCatch(ballId) {
        const ball = ITEMS[ballId];
        if (!ball) return;

        const ep = this.state.enemyPokemon;
        const epData = getPokemonById(ep.id);
        const pokemonCatchRate = epData ? epData.catchRate : 45;
        const ballRate = ball.catchRate;

        // Master ball always catches
        if (ballRate >= 255) {
            this._queueMessage(`Vous lancez une ${ball.name} !`);
            AudioSystem.playSfx('catch_shake');
            this._queueMessage(`......`);
            AudioSystem.playSfx('catch_success');
            this._queueMessage(`Gotcha ! ${ep.nickname || ep.name} est capturé !`);
            this._processCatchSuccess();
            return;
        }

        // Catch rate formula
        const maxHp = ep.stats.hp;
        const currentHp = ep.currentHp;
        const statusBonus = (ep.status === 'sleep' || ep.status === 'freeze') ? 2 :
                           (ep.status === 'paralysis' || ep.status === 'burn' || ep.status === 'poison' || ep.status === 'badly_poisoned') ? 1.5 : 1;

        let catchRate = ((3 * maxHp - 2 * currentHp) * pokemonCatchRate * ballRate) / (3 * maxHp);
        catchRate *= statusBonus;
        catchRate = Math.min(255, Math.max(1, catchRate));

        // Shake check probability
        const shakeProb = Math.floor(65536 / Math.pow(255 / catchRate, 0.1875));

        this._queueMessage(`Vous lancez une ${ball.name} !`);

        let shakes = 0;
        for (let i = 0; i < 3; i++) {
            if (Math.random() * 65536 < shakeProb) {
                shakes++;
            } else {
                break;
            }
        }

        // Animate shakes
        for (let i = 0; i < shakes; i++) {
            this._queueMessage(`...`, 800);
            AudioSystem.playSfx('catch_shake');
        }

        if (shakes >= 3) {
            // Caught!
            AudioSystem.playSfx('catch_success');
            this._queueMessage(`Gotcha ! ${ep.nickname || ep.name} est capturé !`);
            this._processCatchSuccess();
        } else {
            // Broke free
            AudioSystem.playSfx('catch_fail');
            const failMsgs = [
                `Oh non ! Le Pokémon s'est libéré !`,
                `Mince ! C'était presque !`,
                `Argh ! Si près du but !`
            ];
            this._queueMessage(failMsgs[Math.min(shakes, failMsgs.length - 1)]);

            // Enemy gets a free turn after failed catch
            const ep2 = this.state.enemyPokemon;
            const usableMoves = ep2.moves.filter(m => {
                const md = MOVES_DB[m.id];
                return md && ((md.pp || 10) - (m.ppUsed || 0) > 0);
            });
            if (usableMoves.length > 0) {
                const enemyMove = usableMoves[Math.floor(Math.random() * usableMoves.length)];
                this._doEnemyTurn(enemyMove.id);
            }

            this._checkFaintsAfterTurn({ type: 'catch_fail' });
        }
    },

    _processCatchSuccess() {
        const ep = this.state.enemyPokemon;
        ep.ot = game.state.playerName || 'Player';
        ep.caughtBall = 'pokeball';

        if (game.state.party.length < 6) {
            game.state.party.push(ep);
            this._queueMessage(`${ep.nickname || ep.name} a été ajouté à l'équipe !`);
        } else {
            if (!game.state.pc) game.state.pc = [];
            game.state.pc.push(ep);
            this._queueMessage(`${ep.nickname || ep.name} a été envoyé au PC !`);
        }

        // Register in pokedex
        game.state.pokedexSeen.add(ep.id);
        game.state.pokedexCaught.add(ep.id);

        this._processMessageQueue(() => {
            this.endBattle('catch');
        });
    },

    // ----------------------------------------------------------
    // Message Queue Processing
    // ----------------------------------------------------------

    _processMessageQueue(callback) {
        if (this.state.messageQueue.length === 0) {
            if (callback) callback();
            return;
        }

        const msg = this.state.messageQueue.shift();
        this._showMessage(msg.text);

        setTimeout(() => {
            this._processMessageQueue(callback);
        }, msg.duration || 1500);
    },

    // ----------------------------------------------------------
    // Update & Render
    // ----------------------------------------------------------

    update(dt) {
        if (!this.state.active) return;

        // Animate HP bars
        const hpSpeed = 60 * dt; // HP per second
        const pp = this.state.playerPokemon;
        const ep = this.state.enemyPokemon;

        if (pp) {
            const targetHp = Math.max(0, pp.currentHp);
            if (Math.abs(this.state.hpAnimPlayer - targetHp) > 0.5) {
                this.state.hpAnimPlayer += (targetHp - this.state.hpAnimPlayer) * Math.min(1, 5 * dt);
            } else {
                this.state.hpAnimPlayer = targetHp;
            }
        }

        if (ep) {
            const targetHp = Math.max(0, ep.currentHp);
            if (Math.abs(this.state.hpAnimEnemy - targetHp) > 0.5) {
                this.state.hpAnimEnemy += (targetHp - this.state.hpAnimEnemy) * Math.min(1, 5 * dt);
            } else {
                this.state.hpAnimEnemy = targetHp;
            }
        }

        // Decay shake animations
        if (this.state.playerAnim.shake > 0) {
            this.state.playerAnim.shake *= 0.85;
            if (this.state.playerAnim.shake < 0.5) this.state.playerAnim.shake = 0;
        }
        if (this.state.enemyAnim.shake > 0) {
            this.state.enemyAnim.shake *= 0.85;
            if (this.state.enemyAnim.shake < 0.5) this.state.enemyAnim.shake = 0;
        }

        this._updateUI();
    },

    render(ctx, time) {
        if (!this.state.active) return;

        const cw = ctx.canvas.width;
        const ch = ctx.canvas.height;

        // Battle background - top half of canvas
        const battleHeight = ch * 0.55;

        // Sky gradient
        const grad = ctx.createLinearGradient(0, 0, 0, battleHeight);
        grad.addColorStop(0, '#87CEEB');
        grad.addColorStop(1, '#E8F5E9');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, battleHeight);

        // Ground
        ctx.fillStyle = '#7CB342';
        ctx.fillRect(0, battleHeight * 0.65, cw, battleHeight * 0.35);

        // Ground detail line
        ctx.fillStyle = '#558B2F';
        ctx.fillRect(0, battleHeight * 0.65, cw, 3);

        // Enemy platform (ellipse)
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath();
        ctx.ellipse(cw * 0.7, battleHeight * 0.45, 80, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#6D4C41';
        ctx.beginPath();
        ctx.ellipse(cw * 0.7, battleHeight * 0.45, 80, 20, 0, 0, Math.PI);
        ctx.fill();

        // Player platform
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath();
        ctx.ellipse(cw * 0.25, battleHeight * 0.78, 90, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#6D4C41';
        ctx.beginPath();
        ctx.ellipse(cw * 0.25, battleHeight * 0.78, 90, 22, 0, 0, Math.PI);
        ctx.fill();

        // Draw enemy pokemon
        if (this.state.enemyPokemon && this.state.enemyAnim.alpha > 0) {
            const ep = this.state.enemyPokemon;
            const shakeX = this.state.enemyAnim.shake * Math.sin(time * 30);
            ctx.save();
            ctx.globalAlpha = this.state.enemyAnim.alpha;
            const spriteSize = 96;
            const ex = cw * 0.7 - spriteSize / 2 + shakeX;
            const ey = battleHeight * 0.45 - spriteSize + 10;
            SpriteRenderer.drawPokemon(ctx, ep.id, ex, ey, spriteSize, 'front', ep.isShiny);
            ctx.restore();
        }

        // Draw player pokemon (back facing)
        if (this.state.playerPokemon && this.state.playerAnim.alpha > 0) {
            const pp = this.state.playerPokemon;
            const shakeX = this.state.playerAnim.shake * Math.sin(time * 30);
            ctx.save();
            ctx.globalAlpha = this.state.playerAnim.alpha;
            const spriteSize = 112;
            const px = cw * 0.25 - spriteSize / 2 + shakeX;
            const py = battleHeight * 0.78 - spriteSize + 10;
            SpriteRenderer.drawPokemon(ctx, pp.id, px, py, spriteSize, 'back', pp.isShiny);
            ctx.restore();
        }

        // Catch ball animation
        if (this.state.catchAnim) {
            const ca = this.state.catchAnim;
            ctx.fillStyle = '#F44336';
            ctx.beginPath();
            ctx.arc(ca.x, ca.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(ca.x, ca.y, 8, 0, Math.PI);
            ctx.fill();
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(ca.x, ca.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    // ----------------------------------------------------------
    // End Battle
    // ----------------------------------------------------------

    endBattle(result) {
        this.state.active = false;
        this.state.turnPhase = 'ended';
        this.state.battleResult = result;

        // Clean up battle-specific flags on player party
        game.state.party.forEach(p => {
            delete p._flinched;
            delete p._protected;
            delete p._seeded;
            delete p._sleepTurns;
            delete p._toxicCounter;
        });

        // Hide battle UI
        const battleUI = document.getElementById('battle-ui');
        if (battleUI) battleUI.classList.add('hidden');

        // Clear message
        const msgEl = document.getElementById('battle-message');
        if (msgEl) msgEl.textContent = '';

        // Hide submenus
        const actions = document.getElementById('battle-actions');
        const moves = document.getElementById('battle-moves');
        if (actions) actions.classList.add('hidden');
        if (moves) moves.classList.add('hidden');

        // Mark trainer as defeated
        if (result === 'win' && this.state.isTrainer && this.state.trainerNpc) {
            this.state.trainerNpc.defeated = true;
        }

        // Heal if lost (teleport to last center)
        if (result === 'lose') {
            game.state.party.forEach(p => {
                p.currentHp = p.stats.hp;
                p.status = null;
                p.moves.forEach(m => m.ppUsed = 0);
            });
        }

        // Notify the game engine
        if (typeof game !== 'undefined' && game.endBattle) {
            game.endBattle(result);
        }
    }
};
