// ============================================================
// POKEMON NOVARA - Auto-Save System (localStorage)
// ============================================================

const SaveSystem = {
    SAVE_KEY: 'pokemon_novara_save',
    AUTO_SAVE_INTERVAL: 10000, // 10 seconds
    _timer: null,

    init(game) {
        this.game = game;
        this._startAutoSave();
    },

    _startAutoSave() {
        this._timer = setInterval(() => {
            this.save();
        }, this.AUTO_SAVE_INTERVAL);
    },

    save() {
        if (!this.game || !this.game.state) return;
        const state = this.game.state;

        const saveData = {
            version: 2,
            timestamp: Date.now(),
            player: {
                name: state.playerName,
                x: state.playerX,
                y: state.playerY,
                direction: state.playerDir,
                mapId: state.currentMap,
                money: state.money,
                badges: state.badges,
                playTime: state.playTime,
                stepsCount: state.stepsCount,
            },
            party: state.party.map(p => this._serializePokemon(p)),
            pc: state.pc.map(p => this._serializePokemon(p)),
            bag: { ...state.bag },
            pokedex: {
                seen: Array.from(state.pokedexSeen),
                caught: Array.from(state.pokedexCaught),
            },
            storyFlags: { ...state.storyFlags },
            defeatedTrainers: Array.from(state.defeatedTrainers),
        };

        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
        } catch (e) {
            console.warn('Save failed:', e);
        }
    },

    load() {
        try {
            const raw = localStorage.getItem(this.SAVE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || !data.version) return null;

            return {
                playerName: data.player.name,
                playerX: data.player.x,
                playerY: data.player.y,
                playerDir: data.player.direction,
                currentMap: data.player.mapId,
                money: data.player.money,
                badges: data.player.badges || [],
                playTime: data.player.playTime || 0,
                stepsCount: data.player.stepsCount || 0,
                party: data.party.map(p => this._deserializePokemon(p)),
                pc: (data.pc || []).map(p => this._deserializePokemon(p)),
                bag: data.bag || {},
                pokedexSeen: new Set(data.pokedex.seen),
                pokedexCaught: new Set(data.pokedex.caught),
                storyFlags: { ...STORY_FLAGS_INIT, ...data.storyFlags },
                defeatedTrainers: new Set(data.defeatedTrainers || []),
            };
        } catch (e) {
            console.warn('Load failed:', e);
            return null;
        }
    },

    hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    },

    deleteSave() {
        localStorage.removeItem(this.SAVE_KEY);
    },

    _serializePokemon(pokemon) {
        if (!pokemon) return null;
        return {
            id: pokemon.id,
            nickname: pokemon.nickname,
            level: pokemon.level,
            exp: pokemon.exp,
            nature: pokemon.nature,
            ivs: pokemon.ivs,
            evs: pokemon.evs,
            moves: pokemon.moves,
            currentHp: pokemon.currentHp,
            status: pokemon.status,
            friendship: pokemon.friendship,
            isShiny: pokemon.isShiny,
            caughtBall: pokemon.caughtBall,
            ot: pokemon.ot,
        };
    },

    _deserializePokemon(data) {
        if (!data) return null;
        const pokemon = {
            id: data.id,
            name: getPokemonById(data.id).name,
            nickname: data.nickname,
            level: data.level,
            exp: data.exp,
            nature: data.nature,
            ivs: data.ivs,
            evs: data.evs || { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, spd: 0 },
            moves: data.moves,
            currentHp: data.currentHp,
            status: data.status,
            friendship: data.friendship || 70,
            isShiny: data.isShiny || false,
            caughtBall: data.caughtBall || 'pokeball',
            ot: data.ot,
        };
        recalcStats(pokemon);
        pokemon.currentHp = Math.min(data.currentHp, pokemon.stats.hp);
        return pokemon;
    },

    destroy() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }
};
