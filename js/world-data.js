// ============================================================
// POKEMON NOVARA - World Data (Maps, Towns, Routes)
// ============================================================

// Map generator - creates tile maps procedurally with controlled randomness
const WorldData = {
    maps: {},
    _generators: null,

    init() {
        // Register lazy generators — maps are built on first access
        this._generators = {
            borgo: () => this._createBorgoVillage(),
            route1: () => this._createRoute1(),
            porto: () => this._createPortoCity(),
            route2: () => this._createRoute2(),
            grotte1: () => this._createGrotte1(),
            campoverde: () => this._createCampoverde(),
            route3: () => this._createRoute3(),
            rivalta: () => this._createRivalta(),
            route4: () => this._createRoute4(),
            desert_route: () => this._createDesertRoute(),
            volcan_city: () => this._createVolcanCity(),
            route6: () => this._createRoute6(),
            glacia_city: () => this._createGlaciaCity(),
            route7: () => this._createRoute7(),
            abyss_city: () => this._createAbyssCity(),
            victory_road: () => this._createVictoryRoad(),
            pokemon_league: () => this._createPokemonLeague(),
            prof_lab: () => this._createProfLab(),
            player_house: () => this._createPlayerHouse(),
        };
        // Eagerly generate starting area for instant boot
        this._generators.borgo();
        this._generators.player_house();
        this._generators.prof_lab();
    },

    getMap(mapId) {
        if (!this.maps[mapId] && this._generators && this._generators[mapId]) {
            this._generators[mapId]();
            // Restore defeated trainer flags on newly lazy-loaded NPCs
            if (typeof game !== 'undefined' && game.state && game.state.defeatedTrainers && game.state.defeatedTrainers.size > 0) {
                const newMap = this.maps[mapId];
                if (newMap && newMap.npcs) {
                    for (const npc of newMap.npcs) {
                        if (npc.id && game.state.defeatedTrainers.has(npc.id)) {
                            npc.defeated = true;
                        }
                    }
                }
            }
        }
        return this.maps[mapId];
    },

    _createEmptyMap(width, height, fillTile = TILE.GRASS) {
        const tiles = [];
        for (let y = 0; y < height; y++) {
            tiles[y] = [];
            for (let x = 0; x < width; x++) {
                tiles[y][x] = fillTile;
            }
        }
        return tiles;
    },

    _fillRect(tiles, x, y, w, h, tile) {
        for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) {
                if (tiles[y + dy] && tiles[y + dy][x + dx] !== undefined) {
                    tiles[y + dy][x + dx] = tile;
                }
            }
        }
    },

    _createBorgoVillage() {
        const w = 40, h = 35;
        const tiles = this._createEmptyMap(w, h);

        // Paths
        this._fillRect(tiles, 18, 0, 4, 35, TILE.PATH); // Main vertical path
        this._fillRect(tiles, 6, 15, 28, 3, TILE.PATH); // Horizontal path
        this._fillRect(tiles, 6, 25, 28, 3, TILE.PATH); // Lower horizontal

        // Trees border
        for (let x = 0; x < w; x++) {
            tiles[0][x] = TILE.TREE;
            if (x < 17 || x > 21) tiles[0][x] = TILE.TREE;
        }
        for (let y = 0; y < h; y++) {
            tiles[y][0] = TILE.TREE;
            tiles[y][w-1] = TILE.TREE;
        }
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) tiles[h-1][x] = TILE.TREE;
        }

        // Player house area
        this._fillRect(tiles, 6, 8, 6, 5, TILE.BUILDING);
        tiles[12][9] = TILE.DOOR; // Door

        // Professor's lab
        this._fillRect(tiles, 24, 8, 8, 6, TILE.BUILDING);
        tiles[13][28] = TILE.DOOR;

        // Pokémon Center building
        this._fillRect(tiles, 5, 14, 6, 5, TILE.BUILDING);
        tiles[18][8] = TILE.PC;

        // Flowers
        this._fillRect(tiles, 10, 20, 5, 3, TILE.FLOWER);
        this._fillRect(tiles, 26, 20, 5, 3, TILE.FLOWER);

        // Rival's house
        this._fillRect(tiles, 28, 18, 5, 5, TILE.BUILDING);
        tiles[22][30] = TILE.DOOR;

        // Water pond
        this._fillRect(tiles, 4, 28, 6, 4, TILE.WATER);

        // Sign
        tiles[14][19] = TILE.SIGN;

        // Decorations
        tiles[16][15] = TILE.FOUNTAIN;
        tiles[20][22] = TILE.BENCH;
        tiles[14][25] = TILE.LAMPPOST;

        this.maps['borgo'] = {
            id: 'borgo',
            name: 'Village de Borgo',
            width: w, height: h,
            tiles: tiles,
            music: 'town',
            theme: { building: { border: '#B8860B', fill: '#8B6914' } },
            encounters: [],
            npcs: [
                { id: 'prof_oliva', type: 'professor', x: 28, y: 12, dir: DIR.DOWN, name: 'Prof. Oliva',
                  dialogue: 'story_professor_intro', storyFlag: 'met_professor', disappearAfter: true },
                { id: 'mom', type: 'villager', x: 9, y: 10, dir: DIR.DOWN, name: 'Maman',
                  dialogue: 'mom_dialogue' },
                { id: 'rival', type: 'rival', x: 30, y: 21, dir: DIR.DOWN, name: 'Kaël',
                  dialogue: 'story_rival_intro', storyFlag: 'met_rival' },
                { id: 'nurse_borgo', type: 'nurse', x: 8, y: 17, dir: DIR.DOWN, name: 'Infirmière',
                  dialogue: 'nurse_heal' },
                { id: 'sign1', type: 'sign', x: 19, y: 14,
                  dialogue: 'sign_borgo' },
                { id: 'villager1', type: 'villager', x: 14, y: 20, dir: DIR.LEFT, name: 'Habitant',
                  dialogue: 'villager_borgo1' },
                { id: 'villager_borgo2', type: 'villager', x: 25, y: 18, dir: DIR.DOWN, name: 'Vieille dame',
                  dialogue: 'villager_borgo2' },
                { id: 'villager_borgo3', type: 'villager', x: 12, y: 26, dir: DIR.RIGHT, name: 'Garçon',
                  dialogue: 'villager_borgo3' },
            ],
            warps: [
                { x: 20, y: 0, targetMap: 'route1', targetX: 20, targetY: 38 },
                { x: 19, y: 0, targetMap: 'route1', targetX: 19, targetY: 38 },
                { x: 9, y: 12, targetMap: 'player_house', targetX: 5, targetY: 8 },
                { x: 28, y: 13, targetMap: 'prof_lab', targetX: 8, targetY: 12 },
            ]
        };
    },

    _createPlayerHouse() {
        const w = 12, h = 10;
        const tiles = this._createEmptyMap(w, h, TILE.GYM_FLOOR);
        // Walls
        for (let x = 0; x < w; x++) { tiles[0][x] = TILE.WALL; tiles[h-1][x] = TILE.WALL; }
        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.WALL; tiles[y][w-1] = TILE.WALL; }
        tiles[h-1][5] = TILE.DOOR;
        // Furniture
        tiles[1][2] = TILE.BOOKSHELF;
        tiles[1][3] = TILE.BOOKSHELF;
        tiles[4][7] = TILE.TABLE;
        tiles[4][8] = TILE.TABLE;
        tiles[5][4] = TILE.RUG;
        tiles[5][5] = TILE.RUG;
        tiles[6][4] = TILE.RUG;
        tiles[6][5] = TILE.RUG;

        this.maps['player_house'] = {
            id: 'player_house', name: 'Maison', width: w, height: h, tiles,
            music: 'indoor', encounters: [],
            npcs: [
                { id: 'mom_house', type: 'villager', x: 3, y: 4, dir: DIR.DOWN, name: 'Maman',
                  dialogue: 'mom_house_dialogue' }
            ],
            warps: [{ x: 5, y: h-1, targetMap: 'borgo', targetX: 9, targetY: 13 }]
        };
    },

    _createProfLab() {
        const w = 18, h = 14;
        const tiles = this._createEmptyMap(w, h, TILE.GYM_FLOOR);
        for (let x = 0; x < w; x++) { tiles[0][x] = TILE.WALL; tiles[h-1][x] = TILE.WALL; }
        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.WALL; tiles[y][w-1] = TILE.WALL; }
        tiles[h-1][8] = TILE.DOOR;

        // Lab equipment
        this._fillRect(tiles, 3, 2, 4, 2, TILE.TABLE);
        this._fillRect(tiles, 11, 2, 4, 2, TILE.TABLE);
        // Bookshelves along back wall
        tiles[1][2] = TILE.BOOKSHELF;
        tiles[1][8] = TILE.BOOKSHELF;
        tiles[1][9] = TILE.BOOKSHELF;
        tiles[1][15] = TILE.BOOKSHELF;

        this.maps['prof_lab'] = {
            id: 'prof_lab', name: 'Laboratoire du Prof. Oliva', width: w, height: h, tiles,
            music: 'indoor', encounters: [],
            npcs: [
                { id: 'prof_lab', type: 'professor', x: 9, y: 5, dir: DIR.DOWN, name: 'Prof. Oliva',
                  dialogue: 'story_lab_starters', storyFlag: 'choose_starter', storyReq: 'met_professor',
                  altDialogue: 'story_prof_postgame', altFlag: 'has_starter' },
                { id: 'assistant', type: 'trainer', x: 14, y: 6, dir: DIR.LEFT, name: 'Assistant',
                  dialogue: 'lab_assistant' }
            ],
            warps: [{ x: 8, y: h-1, targetMap: 'borgo', targetX: 28, targetY: 14 }]
        };
    },

    _createRoute1() {
        const w = 40, h = 40;
        const tiles = this._createEmptyMap(w, h);

        // Main path
        this._fillRect(tiles, 18, 0, 4, 40, TILE.PATH);

        // Tall grass patches
        this._fillRect(tiles, 8, 5, 8, 6, TILE.TALL_GRASS);
        this._fillRect(tiles, 24, 10, 8, 5, TILE.TALL_GRASS);
        this._fillRect(tiles, 6, 18, 10, 5, TILE.TALL_GRASS);
        this._fillRect(tiles, 25, 22, 7, 6, TILE.TALL_GRASS);
        this._fillRect(tiles, 10, 30, 6, 5, TILE.TALL_GRASS);

        // Trees
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < 4; x++) tiles[y][x] = TILE.TREE;
            for (let x = w-4; x < w; x++) tiles[y][x] = TILE.TREE;
        }
        // Random trees
        const treePosns = [[6,3],[8,12],[30,6],[32,15],[7,26],[34,30],[12,36],[28,35]];
        treePosns.forEach(([tx,ty]) => { if(tiles[ty]) tiles[ty][tx] = TILE.TREE; });

        // Flowers
        this._fillRect(tiles, 14, 14, 3, 3, TILE.FLOWER);

        // Signs
        tiles[35][19] = TILE.SIGN;
        tiles[10][19] = TILE.SIGN;

        // Border openings
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) { tiles[0][x] = TILE.TREE; tiles[h-1][x] = TILE.TREE; }
        }

        // Environmental variety
        tiles[20][8] = TILE.ROCK; tiles[20][9] = TILE.ROCK;
        tiles[28][30] = TILE.ROCK;
        this._fillRect(tiles, 30, 22, 3, 2, TILE.WATER); // small pond

        this.maps['route1'] = {
            id: 'route1', name: 'Route 1', width: w, height: h, tiles,
            music: 'route', encounters: [
                { id: 10, minLevel: 3, maxLevel: 5, rate: 30 },
                { id: 12, minLevel: 3, maxLevel: 5, rate: 30 },
                { id: 15, minLevel: 2, maxLevel: 4, rate: 25 },
                { id: 22, minLevel: 3, maxLevel: 5, rate: 15 },
            ],
            npcs: [
                { id: 'trainer_r1_1', type: 'trainer', x: 12, y: 8, dir: DIR.RIGHT, name: 'Gamin Thomas',
                  dialogue: 'trainer_battle', team: [{ id: 10, level: 5 }], defeated: false, reward: 200 },
                { id: 'trainer_r1_2', type: 'trainer', x: 28, y: 14, dir: DIR.LEFT, name: 'Fillette Marie',
                  dialogue: 'trainer_battle', team: [{ id: 12, level: 5 }], defeated: false, reward: 200 },
                { id: 'sign_r1_south', type: 'sign', x: 19, y: 35, dialogue: 'sign_route1' },
                { id: 'sign_r1_north', type: 'sign', x: 19, y: 10, dialogue: 'sign_route1' },
            ],
            warps: [
                { x: 20, y: h-1, targetMap: 'borgo', targetX: 20, targetY: 1 },
                { x: 19, y: h-1, targetMap: 'borgo', targetX: 19, targetY: 1 },
                { x: 20, y: 0, targetMap: 'porto', targetX: 20, targetY: 38 },
                { x: 19, y: 0, targetMap: 'porto', targetX: 19, targetY: 38 },
            ]
        };
    },

    _createPortoCity() {
        const w = 50, h = 40;
        const tiles = this._createEmptyMap(w, h);

        // Main paths
        this._fillRect(tiles, 18, 0, 4, 40, TILE.PATH);
        this._fillRect(tiles, 8, 18, 34, 3, TILE.PATH);
        this._fillRect(tiles, 0, 18, 10, 3, TILE.PATH);

        // Pokemon Center
        this._fillRect(tiles, 10, 8, 6, 5, TILE.BUILDING);
        tiles[12][13] = TILE.PC;

        // Pokemart
        this._fillRect(tiles, 26, 8, 6, 5, TILE.BUILDING);
        tiles[12][29] = TILE.MART;

        // GYM 1 - Normal type
        this._fillRect(tiles, 34, 14, 8, 8, TILE.GYM_BUILDING);
        this._fillRect(tiles, 35, 15, 6, 6, TILE.GYM_FLOOR);
        tiles[21][38] = TILE.DOOR;

        // Houses
        this._fillRect(tiles, 8, 24, 5, 4, TILE.BUILDING);
        tiles[27][10] = TILE.DOOR;
        this._fillRect(tiles, 32, 24, 5, 4, TILE.BUILDING);
        tiles[27][34] = TILE.DOOR;

        // Water (port)
        this._fillRect(tiles, 0, 30, 50, 10, TILE.WATER);
        this._fillRect(tiles, 10, 28, 30, 2, TILE.PATH); // Dock
        this._fillRect(tiles, 18, 30, 4, 10, TILE.PATH); // Pier leading south to Route 1 warp

        // Trees border
        for (let y = 0; y < h; y++) {
            tiles[y][0] = y >= 18 && y <= 20 ? TILE.PATH : TILE.TREE;
            tiles[y][w-1] = TILE.TREE;
        }
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) tiles[0][x] = TILE.TREE;
            if (x < 17 || x > 21) tiles[h-1][x] = TILE.WATER;
        }

        // City entrance sign
        tiles[26][18] = TILE.SIGN;

        // Decorations
        tiles[17][20] = TILE.FOUNTAIN;
        tiles[22][12] = TILE.BENCH;
        tiles[22][28] = TILE.BENCH;
        tiles[15][18] = TILE.LAMPPOST;
        tiles[20][25] = TILE.LAMPPOST;

        this.maps['porto'] = {
            id: 'porto', name: 'Porto City', width: w, height: h, tiles,
            music: 'city',
            theme: { building: { border: '#6B8E9B', fill: '#4A6E7B', window: '#B0E0FF' } },
            encounters: [],
            npcs: [
                { id: 'nurse_porto', type: 'nurse', x: 13, y: 11, dir: DIR.DOWN, name: 'Infirmière',
                  dialogue: 'nurse_heal' },
                { id: 'merchant_porto', type: 'merchant', x: 29, y: 11, dir: DIR.DOWN, name: 'Vendeur',
                  dialogue: 'merchant_shop' },
                { id: 'gym1_leader', type: 'gymleader', x: 38, y: 18, dir: DIR.DOWN, name: 'Champion Marco',
                  dialogue: 'gym1_dialogue', altDialogue: 'gym1_defeated', team: [
                    { id: 10, level: 12 }, { id: 11, level: 14 }
                  ], defeated: false, reward: 1800, badge: 0, storyReq: 'has_starter' },
                { id: 'villager_porto1', type: 'villager', x: 24, y: 20, dir: DIR.LEFT, name: 'Marin',
                  dialogue: 'porto_marin' },
                { id: 'villager_porto2', type: 'villager', x: 15, y: 25, dir: DIR.DOWN, name: 'Pêcheur',
                  dialogue: 'porto_pescatore' },
                { id: 'villager_porto3', type: 'villager', x: 35, y: 27, dir: DIR.LEFT, name: 'Vieux marin',
                  dialogue: 'porto_vieux_marin' },
                { id: 'villager_porto4', type: 'villager', x: 8, y: 22, dir: DIR.RIGHT, name: 'Enfant',
                  dialogue: 'porto_enfant' },
                { id: 'villager_porto5', type: 'villager', x: 30, y: 15, dir: DIR.DOWN, name: 'Dame',
                  dialogue: 'porto_dame' },
                { id: 'sign_porto', type: 'sign', x: 18, y: 26, dialogue: 'sign_porto' },
            ],
            warps: [
                { x: 20, y: h-1, targetMap: 'route1', targetX: 20, targetY: 1 },
                { x: 19, y: h-1, targetMap: 'route1', targetX: 19, targetY: 1 },
                { x: 0, y: 19, targetMap: 'route2', targetX: 48, targetY: 19 },
                { x: 20, y: 0, targetMap: 'campoverde', targetX: 20, targetY: 33 },
                { x: 19, y: 0, targetMap: 'campoverde', targetX: 19, targetY: 33 },
            ]
        };
    },

    _createRoute2() {
        const w = 50, h = 40;
        const tiles = this._createEmptyMap(w, h);

        this._fillRect(tiles, 0, 18, 50, 3, TILE.PATH);

        this._fillRect(tiles, 5, 6, 10, 8, TILE.TALL_GRASS);
        this._fillRect(tiles, 20, 24, 12, 6, TILE.TALL_GRASS);
        this._fillRect(tiles, 35, 8, 8, 7, TILE.TALL_GRASS);

        // Water
        this._fillRect(tiles, 8, 30, 8, 6, TILE.WATER);

        // Trees border
        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.TREE; tiles[y][w-1] = TILE.TREE; }
        for (let x = 0; x < w; x++) { tiles[0][x] = TILE.TREE; tiles[h-1][x] = TILE.TREE; }

        // Cave entrance
        tiles[19][0] = TILE.DOOR;

        // Signs
        tiles[19][w-3] = TILE.SIGN;
        tiles[19][3] = TILE.SIGN;

        // Environmental variety
        tiles[10][25] = TILE.ROCK; tiles[10][26] = TILE.ROCK;
        tiles[25][15] = TILE.ROCK;
        this._fillRect(tiles, 35, 10, 2, 3, TILE.WATER); // small pond

        this.maps['route2'] = {
            id: 'route2', name: 'Route 2', width: w, height: h, tiles,
            music: 'route',
            encounters: [
                { id: 18, minLevel: 8, maxLevel: 11, rate: 25 },
                { id: 20, minLevel: 8, maxLevel: 11, rate: 20 },
                { id: 24, minLevel: 9, maxLevel: 12, rate: 20 },
                { id: 32, minLevel: 8, maxLevel: 10, rate: 15 },
                { id: 39, minLevel: 9, maxLevel: 11, rate: 20 },
            ],
            npcs: [
                { id: 'trainer_r2_1', type: 'trainer', x: 15, y: 10, dir: DIR.DOWN, name: 'Randonneur Paul',
                  dialogue: 'trainer_battle', team: [{ id: 24, level: 10 }, { id: 15, level: 10 }], defeated: false, reward: 400 },
                { id: 'trainer_r2_2', type: 'trainer', x: 38, y: 12, dir: DIR.LEFT, name: 'Dresseuse Luna',
                  dialogue: 'trainer_battle', team: [{ id: 18, level: 11 }, { id: 22, level: 11 }], defeated: false, reward: 440 },
                { id: 'sign_r2_east', type: 'sign', x: w-3, y: 19, dialogue: 'sign_route2' },
                { id: 'sign_r2_west', type: 'sign', x: 3, y: 19, dialogue: 'sign_route2' },
            ],
            warps: [
                { x: w-1, y: 19, targetMap: 'porto', targetX: 1, targetY: 19 },
                { x: 0, y: 19, targetMap: 'grotte1', targetX: 28, targetY: 18 },
            ]
        };
    },

    _createGrotte1() {
        const w = 30, h = 25;
        const tiles = this._createEmptyMap(w, h, TILE.CAVE_WALL);

        // Carve cave paths
        this._fillRect(tiles, 2, 8, 27, 4, TILE.CAVE_FLOOR);
        this._fillRect(tiles, 10, 4, 4, 8, TILE.CAVE_FLOOR);
        this._fillRect(tiles, 18, 8, 4, 10, TILE.CAVE_FLOOR);
        this._fillRect(tiles, 4, 14, 18, 4, TILE.CAVE_FLOOR);
        this._fillRect(tiles, 4, 14, 4, 6, TILE.CAVE_FLOOR);

        tiles[10][w-1] = TILE.STAIRS_UP;
        tiles[18][4] = TILE.STAIRS_UP;

        this.maps['grotte1'] = {
            id: 'grotte1', name: 'Grotte Sombre', width: w, height: h, tiles,
            music: 'cave', isDungeon: true,
            encounters: [
                { id: 24, minLevel: 10, maxLevel: 13, rate: 30 },
                { id: 26, minLevel: 10, maxLevel: 12, rate: 25 },
                { id: 34, minLevel: 11, maxLevel: 13, rate: 20 },
                { id: 37, minLevel: 10, maxLevel: 12, rate: 25 },
            ],
            npcs: [
                { id: 'trainer_cave1', type: 'trainer', x: 14, y: 10, dir: DIR.DOWN, name: 'Spéléologue Marc',
                  dialogue: 'trainer_battle', team: [{ id: 24, level: 12 }, { id: 37, level: 12 }], defeated: false, reward: 480 },
            ],
            warps: [
                { x: w-1, y: 10, targetMap: 'route2', targetX: 1, targetY: 19 },
                { x: 4, y: 18, targetMap: 'campoverde', targetX: 38, targetY: 19 },
            ]
        };
    },

    _createCampoverde() {
        const w = 45, h = 35;
        const tiles = this._createEmptyMap(w, h);

        this._fillRect(tiles, 18, 0, 4, 35, TILE.PATH);
        this._fillRect(tiles, 8, 16, 30, 3, TILE.PATH);

        // Pokémon Center
        this._fillRect(tiles, 10, 6, 6, 5, TILE.BUILDING);
        tiles[10][13] = TILE.PC;

        // Mart
        this._fillRect(tiles, 26, 6, 6, 5, TILE.BUILDING);
        tiles[10][29] = TILE.MART;

        // GYM 2 - Grass type
        this._fillRect(tiles, 6, 20, 8, 8, TILE.GYM_BUILDING);
        this._fillRect(tiles, 7, 21, 6, 6, TILE.GYM_FLOOR);
        tiles[27][10] = TILE.DOOR;

        // Lots of flowers and trees
        this._fillRect(tiles, 24, 22, 8, 5, TILE.FLOWER);
        this._fillRect(tiles, 34, 10, 6, 6, TILE.FLOWER);
        this._fillRect(tiles, 14, 28, 4, 3, TILE.FLOWER);

        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.TREE; tiles[y][w-1] = TILE.TREE; }
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) { tiles[0][x] = TILE.TREE; tiles[h-1][x] = TILE.TREE; }
        }

        // Sign
        tiles[16][22] = TILE.SIGN;
        tiles[18][15] = TILE.FOUNTAIN;
        tiles[22][25] = TILE.BENCH;
        tiles[14][30] = TILE.LAMPPOST;

        this.maps['campoverde'] = {
            id: 'campoverde', name: 'Campoverde', width: w, height: h, tiles,
            music: 'town',
            theme: { building: { border: '#5A8A3A', fill: '#3D6B28', window: '#C8E6A0' } },
            encounters: [],
            npcs: [
                { id: 'nurse_campo', type: 'nurse', x: 13, y: 9, dir: DIR.DOWN, name: 'Infirmière',
                  dialogue: 'nurse_heal' },
                { id: 'merchant_campo', type: 'merchant', x: 29, y: 9, dir: DIR.DOWN, name: 'Vendeuse',
                  dialogue: 'merchant_shop' },
                { id: 'gym2_leader', type: 'gymleader', x: 10, y: 24, dir: DIR.DOWN, name: 'Championne Flora',
                  dialogue: 'gym2_dialogue', altDialogue: 'gym2_defeated', team: [
                    { id: 22, level: 18 }, { id: 63, level: 19 }, { id: 40, level: 21 }
                  ], defeated: false, reward: 2400, badge: 1, storyReq: 'badge_0' },
                { id: 'villager_campo1', type: 'villager', x: 32, y: 24, dir: DIR.LEFT, name: 'Botaniste',
                  dialogue: 'campo_botaniste' },
                { id: 'villager_campo2', type: 'villager', x: 38, y: 14, dir: DIR.DOWN, name: 'Fillette',
                  dialogue: 'campo_enfant' },
                { id: 'villager_campo3', type: 'villager', x: 20, y: 26, dir: DIR.UP, name: 'Herboriste',
                  dialogue: 'campo_herboriste' },
                { id: 'villager_campo4', type: 'villager', x: 14, y: 20, dir: DIR.RIGHT, name: 'Ancien',
                  dialogue: 'campo_vieux' },
                { id: 'sign_campo', type: 'sign', x: 22, y: 16, dialogue: 'sign_campoverde' },
            ],
            warps: [
                { x: w-1, y: 19, targetMap: 'grotte1', targetX: 5, targetY: 18 },
                { x: 20, y: 0, targetMap: 'route3', targetX: 20, targetY: 38 },
                { x: 20, y: h-1, targetMap: 'porto', targetX: 20, targetY: 1 },
                { x: 19, y: h-1, targetMap: 'porto', targetX: 19, targetY: 1 },
            ]
        };
    },

    _createRoute3() {
        const w = 40, h = 40;
        const tiles = this._createEmptyMap(w, h);

        this._fillRect(tiles, 18, 0, 4, 40, TILE.PATH);

        this._fillRect(tiles, 6, 5, 10, 6, TILE.TALL_GRASS);
        this._fillRect(tiles, 24, 15, 10, 5, TILE.TALL_GRASS);
        this._fillRect(tiles, 8, 25, 8, 6, TILE.TALL_GRASS);
        this._fillRect(tiles, 26, 28, 8, 5, TILE.TALL_GRASS);

        this._fillRect(tiles, 28, 6, 6, 6, TILE.WATER);

        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.TREE; tiles[y][w-1] = TILE.TREE; }
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) { tiles[0][x] = TILE.TREE; tiles[h-1][x] = TILE.TREE; }
        }

        // Signs
        tiles[35][19] = TILE.SIGN;
        tiles[5][19] = TILE.SIGN;

        // Environmental variety
        tiles[18][10] = TILE.ROCK; tiles[18][11] = TILE.ROCK;
        tiles[32][30] = TILE.ROCK; tiles[33][30] = TILE.ROCK;
        this._fillRect(tiles, 6, 14, 2, 2, TILE.FLOWER); // flower patch

        this.maps['route3'] = {
            id: 'route3', name: 'Route 3', width: w, height: h, tiles,
            music: 'route',
            encounters: [
                { id: 43, minLevel: 16, maxLevel: 19, rate: 20 },
                { id: 45, minLevel: 16, maxLevel: 18, rate: 20 },
                { id: 49, minLevel: 15, maxLevel: 18, rate: 20 },
                { id: 53, minLevel: 16, maxLevel: 19, rate: 15 },
                { id: 57, minLevel: 15, maxLevel: 18, rate: 15 },
                { id: 59, minLevel: 16, maxLevel: 18, rate: 10 },
            ],
            npcs: [
                { id: 'trainer_r3_1', type: 'trainer', x: 12, y: 8, dir: DIR.RIGHT, name: 'Dresseur Alex',
                  dialogue: 'trainer_battle', team: [
                    { id: 13, level: 18 }, { id: 45, level: 18 }
                  ], defeated: false, reward: 720 },
                { id: 'trainer_r3_2', type: 'trainer', x: 28, y: 20, dir: DIR.LEFT, name: 'Dresseuse Léa',
                  dialogue: 'trainer_battle', team: [
                    { id: 57, level: 19 }, { id: 49, level: 19 }
                  ], defeated: false, reward: 760 },
                { id: 'eclipse_grunt1', type: 'eclipse', x: 20, y: 12, dir: DIR.DOWN, name: 'Sbire Éclipse',
                  dialogue: 'story_eclipse_encounter', team: [
                    { id: 45, level: 17 }, { id: 34, level: 18 }
                  ], defeated: false, reward: 720, storyReq: 'badge_1' },
                { id: 'sign_r3_south', type: 'sign', x: 19, y: 35, dialogue: 'sign_route3' },
                { id: 'sign_r3_north', type: 'sign', x: 19, y: 5, dialogue: 'sign_route3' },
            ],
            warps: [
                { x: 20, y: h-1, targetMap: 'campoverde', targetX: 20, targetY: 33 },
                { x: 19, y: h-1, targetMap: 'campoverde', targetX: 19, targetY: 33 },
                { x: 20, y: 0, targetMap: 'rivalta', targetX: 20, targetY: 38 },
            ]
        };
    },

    _createRivalta() {
        const w = 45, h = 40;
        const tiles = this._createEmptyMap(w, h);

        this._fillRect(tiles, 18, 0, 4, 40, TILE.PATH);
        this._fillRect(tiles, 6, 18, 34, 3, TILE.PATH);

        // Pokémon Center
        this._fillRect(tiles, 8, 8, 6, 5, TILE.BUILDING);
        tiles[12][11] = TILE.PC;

        // Mart
        this._fillRect(tiles, 28, 8, 6, 5, TILE.BUILDING);
        tiles[12][31] = TILE.MART;

        // GYM 3 - Water type
        this._fillRect(tiles, 30, 22, 8, 8, TILE.GYM_BUILDING);
        this._fillRect(tiles, 31, 23, 6, 6, TILE.GYM_FLOOR);
        tiles[29][34] = TILE.DOOR;

        // GYM 4 - Electric type
        this._fillRect(tiles, 6, 24, 8, 8, TILE.GYM_BUILDING);
        this._fillRect(tiles, 7, 25, 6, 6, TILE.GYM_FLOOR);
        tiles[31][10] = TILE.DOOR;

        // Water features
        this._fillRect(tiles, 16, 26, 10, 6, TILE.WATER);

        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.TREE; tiles[y][w-1] = TILE.TREE; }
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) { tiles[0][x] = TILE.TREE; tiles[h-1][x] = TILE.TREE; }
        }
        tiles[18][20] = TILE.FOUNTAIN;
        tiles[22][12] = TILE.BENCH;
        tiles[15][28] = TILE.LAMPPOST;

        this.maps['rivalta'] = {
            id: 'rivalta', name: 'Rivalta', width: w, height: h, tiles,
            music: 'city',
            theme: { building: { border: '#4A7DAA', fill: '#355D8A', window: '#A0D4FF' } },
            encounters: [],
            npcs: [
                { id: 'nurse_rivalta', type: 'nurse', x: 11, y: 11, dir: DIR.DOWN, name: 'Infirmière',
                  dialogue: 'nurse_heal' },
                { id: 'merchant_rivalta', type: 'merchant', x: 31, y: 11, dir: DIR.DOWN, name: 'Vendeur',
                  dialogue: 'merchant_shop' },
                { id: 'gym3_leader', type: 'gymleader', x: 34, y: 26, dir: DIR.DOWN, name: 'Champion Ondine',
                  dialogue: 'gym3_dialogue', altDialogue: 'gym3_defeated', team: [
                    { id: 20, level: 24 }, { id: 47, level: 25 }, { id: 68, level: 27 }
                  ], defeated: false, reward: 3200, badge: 2, storyReq: 'badge_1' },
                { id: 'gym4_leader', type: 'gymleader', x: 10, y: 28, dir: DIR.DOWN, name: 'Champion Voltaire',
                  dialogue: 'gym4_dialogue', altDialogue: 'gym4_defeated', team: [
                    { id: 18, level: 27 }, { id: 49, level: 28 }, { id: 19, level: 30 }
                  ], defeated: false, reward: 3600, badge: 3, storyReq: 'badge_2' },
                { id: 'villager_rivalta1', type: 'villager', x: 22, y: 22, dir: DIR.RIGHT, name: 'Chercheur',
                  dialogue: 'rivalta_chercheur' },
                { id: 'villager_rivalta2', type: 'villager', x: 22, y: 30, dir: DIR.UP, name: 'Nageur',
                  dialogue: 'rivalta_nageur' },
                { id: 'villager_rivalta3', type: 'villager', x: 14, y: 14, dir: DIR.DOWN, name: 'Ingénieur',
                  dialogue: 'rivalta_ingenieur' },
                { id: 'villager_rivalta4', type: 'villager', x: 38, y: 10, dir: DIR.LEFT, name: 'Vieille dame',
                  dialogue: 'rivalta_ancienne' },
                { id: 'sign_rivalta', type: 'sign', x: 22, y: 16, dialogue: 'sign_rivalta' },
            ],
            warps: [
                { x: 20, y: h-1, targetMap: 'route3', targetX: 20, targetY: 1 },
                { x: 20, y: 0, targetMap: 'route4', targetX: 20, targetY: 38 },
            ]
        };
    },

    _createRoute4() {
        const w = 40, h = 40;
        const tiles = this._createEmptyMap(w, h, TILE.SAND);

        this._fillRect(tiles, 18, 0, 4, 40, TILE.PATH);

        this._fillRect(tiles, 6, 6, 10, 6, TILE.TALL_GRASS);
        this._fillRect(tiles, 26, 14, 8, 6, TILE.TALL_GRASS);
        this._fillRect(tiles, 8, 28, 8, 5, TILE.TALL_GRASS);

        // Rocks
        const rocks = [[5,14],[8,20],[28,8],[34,24],[12,34]];
        rocks.forEach(([rx,ry]) => { if(tiles[ry]) tiles[ry][rx] = TILE.ROCK; });

        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.ROCK; tiles[y][w-1] = TILE.ROCK; }
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) { tiles[0][x] = TILE.ROCK; tiles[h-1][x] = TILE.ROCK; }
        }

        // Signs
        tiles[35][19] = TILE.SIGN;
        tiles[5][19] = TILE.SIGN;

        this.maps['route4'] = {
            id: 'route4', name: 'Route 4 - Chemin du Désert', width: w, height: h, tiles,
            music: 'route',
            theme: { tallGrass: { bg: '#D4C090', blade: '#A08050' } },
            encounters: [
                { id: 32, minLevel: 22, maxLevel: 25, rate: 25 },
                { id: 55, minLevel: 22, maxLevel: 26, rate: 20 },
                { id: 78, minLevel: 22, maxLevel: 25, rate: 15 },
                { id: 82, minLevel: 23, maxLevel: 26, rate: 15 },
                { id: 88, minLevel: 24, maxLevel: 26, rate: 10 },
                { id: 96, minLevel: 24, maxLevel: 27, rate: 10 },
                { id: 128, minLevel: 23, maxLevel: 26, rate: 5 },
            ],
            npcs: [
                { id: 'trainer_r4_1', type: 'trainer', x: 10, y: 10, dir: DIR.RIGHT, name: 'Aventurier Rico',
                  dialogue: 'trainer_battle', team: [
                    { id: 32, level: 25 }, { id: 82, level: 26 }
                  ], defeated: false, reward: 1040 },
                { id: 'sign_r4_south', type: 'sign', x: 19, y: 35, dialogue: 'sign_route4' },
                { id: 'sign_r4_north', type: 'sign', x: 19, y: 5, dialogue: 'sign_route4' },
            ],
            warps: [
                { x: 20, y: h-1, targetMap: 'rivalta', targetX: 20, targetY: 1 },
                { x: 20, y: 0, targetMap: 'desert_route', targetX: 20, targetY: 38 },
            ]
        };
    },

    _createDesertRoute() {
        const w = 40, h = 40;
        const tiles = this._createEmptyMap(w, h, TILE.SAND);
        this._fillRect(tiles, 18, 0, 4, 40, TILE.PATH);

        this._fillRect(tiles, 6, 8, 8, 6, TILE.TALL_GRASS);
        this._fillRect(tiles, 28, 18, 8, 6, TILE.TALL_GRASS);

        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.ROCK; tiles[y][w-1] = TILE.ROCK; }
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) { tiles[0][x] = TILE.ROCK; tiles[h-1][x] = TILE.ROCK; }
        }

        this.maps['desert_route'] = {
            id: 'desert_route', name: 'Route 5 - Désert Ardent', width: w, height: h, tiles,
            music: 'route',
            theme: { tallGrass: { bg: '#D4C090', blade: '#A08050' } },
            encounters: [
                { id: 33, minLevel: 28, maxLevel: 32, rate: 20 },
                { id: 30, minLevel: 28, maxLevel: 30, rate: 25 },
                { id: 55, minLevel: 28, maxLevel: 31, rate: 20 },
                { id: 96, minLevel: 29, maxLevel: 32, rate: 15 },
                { id: 109, minLevel: 30, maxLevel: 33, rate: 10 },
                { id: 128, minLevel: 28, maxLevel: 31, rate: 10 },
            ],
            npcs: [
                { id: 'eclipse_admin1', type: 'eclipse', x: 20, y: 18, dir: DIR.DOWN, name: 'Admin Éclipse Nox',
                  dialogue: 'story_eclipse_admin', team: [
                    { id: 46, level: 32 }, { id: 35, level: 33 }, { id: 114, level: 34 }
                  ], defeated: false, reward: 2000, storyReq: 'badge_3' },
            ],
            warps: [
                { x: 20, y: h-1, targetMap: 'route4', targetX: 20, targetY: 1 },
                { x: 20, y: 0, targetMap: 'volcan_city', targetX: 20, targetY: 38 },
            ]
        };
    },

    _createVolcanCity() {
        const w = 45, h = 35;
        const tiles = this._createEmptyMap(w, h, TILE.SAND);

        this._fillRect(tiles, 18, 0, 4, 35, TILE.PATH);
        this._fillRect(tiles, 6, 16, 34, 3, TILE.PATH);

        this._fillRect(tiles, 10, 6, 6, 5, TILE.BUILDING);
        tiles[10][13] = TILE.PC;
        this._fillRect(tiles, 28, 6, 6, 5, TILE.BUILDING);
        tiles[10][31] = TILE.MART;

        // GYM 5 - Fire
        this._fillRect(tiles, 6, 22, 8, 8, TILE.GYM_BUILDING);
        this._fillRect(tiles, 7, 23, 6, 6, TILE.GYM_FLOOR);
        tiles[29][10] = TILE.DOOR;

        // GYM 6 - Ground
        this._fillRect(tiles, 32, 22, 8, 8, TILE.GYM_BUILDING);
        this._fillRect(tiles, 33, 23, 6, 6, TILE.GYM_FLOOR);
        tiles[29][36] = TILE.DOOR;

        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.ROCK; tiles[y][w-1] = TILE.ROCK; }
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) { tiles[0][x] = TILE.ROCK; tiles[h-1][x] = TILE.ROCK; }
        }
        tiles[26][18] = TILE.SIGN;
        tiles[18][20] = TILE.FOUNTAIN;
        tiles[22][12] = TILE.BENCH;
        tiles[15][28] = TILE.LAMPPOST;

        this.maps['volcan_city'] = {
            id: 'volcan_city', name: 'Volcania', width: w, height: h, tiles,
            music: 'city',
            theme: { building: { border: '#C04030', fill: '#8B2A1A', window: '#FFB060' } },
            encounters: [],
            npcs: [
                { id: 'nurse_volcan', type: 'nurse', x: 13, y: 9, dir: DIR.DOWN, name: 'Infirmière', dialogue: 'nurse_heal' },
                { id: 'merchant_volcan', type: 'merchant', x: 31, y: 9, dir: DIR.DOWN, name: 'Vendeur', dialogue: 'merchant_shop' },
                { id: 'gym5_leader', type: 'gymleader', x: 10, y: 26, dir: DIR.DOWN, name: 'Champion Blaze',
                  dialogue: 'gym5_dialogue', altDialogue: 'gym5_defeated', team: [
                    { id: 30, level: 34 }, { id: 82, level: 35 }, { id: 59, level: 35 }, { id: 31, level: 37 }
                  ], defeated: false, reward: 4400, badge: 4, storyReq: 'badge_3' },
                { id: 'gym6_leader', type: 'gymleader', x: 36, y: 26, dir: DIR.DOWN, name: 'Champion Terra',
                  dialogue: 'gym6_dialogue', altDialogue: 'gym6_defeated', team: [
                    { id: 33, level: 37 }, { id: 55, level: 37 }, { id: 25, level: 38 }, { id: 56, level: 40 }
                  ], defeated: false, reward: 4800, badge: 5, storyReq: 'badge_4' },
                { id: 'sign_volcan', type: 'sign', x: 18, y: 26, dialogue: 'sign_volcan' },
                { id: 'villager_volcan1', type: 'villager', x: 24, y: 20, dir: DIR.LEFT, name: 'Forgeron',
                  dialogue: 'villager_volcan1' },
                { id: 'villager_volcan2', type: 'villager', x: 14, y: 14, dir: DIR.DOWN, name: 'Randonneur',
                  dialogue: 'villager_volcan2' },
                { id: 'villager_volcan3', type: 'villager', x: 30, y: 26, dir: DIR.UP, name: 'Fillette',
                  dialogue: 'villager_volcan3' },
            ],
            warps: [
                { x: 20, y: h-1, targetMap: 'desert_route', targetX: 20, targetY: 1 },
                { x: 20, y: 0, targetMap: 'route6', targetX: 20, targetY: 38 },
            ]
        };
    },

    _createRoute6() {
        const w = 40, h = 40;
        const tiles = this._createEmptyMap(w, h);
        this._fillRect(tiles, 18, 0, 4, 40, TILE.PATH);
        this._fillRect(tiles, 6, 6, 10, 8, TILE.TALL_GRASS);
        this._fillRect(tiles, 26, 20, 8, 6, TILE.TALL_GRASS);
        this._fillRect(tiles, 10, 30, 8, 5, TILE.TALL_GRASS);
        this._fillRect(tiles, 28, 32, 6, 4, TILE.WATER);

        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.TREE; tiles[y][w-1] = TILE.TREE; }
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) { tiles[0][x] = TILE.TREE; tiles[h-1][x] = TILE.TREE; }
        }
        // Environmental variety
        tiles[12][8] = TILE.ROCK; tiles[12][9] = TILE.ROCK;
        tiles[30][28] = TILE.ROCK;
        this._fillRect(tiles, 28, 18, 3, 2, TILE.WATER);

        this.maps['route6'] = {
            id: 'route6', name: 'Route 6', width: w, height: h, tiles,
            music: 'route',
            encounters: [
                { id: 63, minLevel: 32, maxLevel: 36, rate: 15 },
                { id: 70, minLevel: 33, maxLevel: 36, rate: 15 },
                { id: 74, minLevel: 32, maxLevel: 35, rate: 15 },
                { id: 80, minLevel: 33, maxLevel: 36, rate: 15 },
                { id: 84, minLevel: 33, maxLevel: 36, rate: 10 },
                { id: 90, minLevel: 34, maxLevel: 36, rate: 10 },
                { id: 98, minLevel: 32, maxLevel: 35, rate: 10 },
                { id: 65, minLevel: 30, maxLevel: 34, rate: 10 },
            ],
            npcs: [
                { id: 'trainer_r6_1', type: 'trainer', x: 10, y: 10, dir: DIR.RIGHT, name: 'Montagnard Eric',
                  dialogue: 'trainer_battle', team: [
                    { id: 25, level: 36 }, { id: 44, level: 37 }
                  ], defeated: false, reward: 1480 },
                { id: 'trainer_r6_2', type: 'trainer', x: 30, y: 24, dir: DIR.LEFT, name: 'Dresseuse Nina',
                  dialogue: 'trainer_battle', team: [
                    { id: 58, level: 36 }, { id: 84, level: 37 }, { id: 48, level: 37 }
                  ], defeated: false, reward: 1480 },
            ],
            warps: [
                { x: 20, y: h-1, targetMap: 'volcan_city', targetX: 20, targetY: 1 },
                { x: 20, y: 0, targetMap: 'glacia_city', targetX: 20, targetY: 38 },
            ]
        };
    },

    _createGlaciaCity() {
        const w = 45, h = 35;
        const tiles = this._createEmptyMap(w, h, TILE.ICE);

        this._fillRect(tiles, 18, 0, 4, 35, TILE.PATH);
        this._fillRect(tiles, 6, 16, 34, 3, TILE.PATH);

        this._fillRect(tiles, 10, 6, 6, 5, TILE.BUILDING);
        tiles[10][13] = TILE.PC;
        this._fillRect(tiles, 28, 6, 6, 5, TILE.BUILDING);
        tiles[10][31] = TILE.MART;

        // GYM 7 - Ice
        this._fillRect(tiles, 16, 22, 8, 8, TILE.GYM_BUILDING);
        this._fillRect(tiles, 17, 23, 6, 6, TILE.GYM_FLOOR);
        tiles[29][20] = TILE.DOOR;

        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.ROCK; tiles[y][w-1] = TILE.ROCK; }
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) { tiles[0][x] = TILE.ROCK; tiles[h-1][x] = TILE.ROCK; }
        }
        tiles[26][18] = TILE.SIGN;
        tiles[18][20] = TILE.FOUNTAIN;
        tiles[22][12] = TILE.BENCH;
        tiles[15][28] = TILE.LAMPPOST;

        this.maps['glacia_city'] = {
            id: 'glacia_city', name: 'Glacia', width: w, height: h, tiles,
            music: 'city',
            theme: { building: { border: '#7AB0C8', fill: '#5090A8', window: '#D0F0FF' } },
            encounters: [],
            npcs: [
                { id: 'nurse_glacia', type: 'nurse', x: 13, y: 9, dir: DIR.DOWN, name: 'Infirmière', dialogue: 'nurse_heal' },
                { id: 'merchant_glacia', type: 'merchant', x: 31, y: 9, dir: DIR.DOWN, name: 'Vendeur', dialogue: 'merchant_shop' },
                { id: 'gym7_leader', type: 'gymleader', x: 20, y: 26, dir: DIR.DOWN, name: 'Championne Crysta',
                  dialogue: 'gym7_dialogue', altDialogue: 'gym7_defeated', team: [
                    { id: 41, level: 40 }, { id: 84, level: 41 }, { id: 28, level: 42 }, { id: 42, level: 44 }
                  ], defeated: false, reward: 5200, badge: 6, storyReq: 'badge_5' },
                { id: 'sign_glacia', type: 'sign', x: 18, y: 26, dialogue: 'sign_glacia' },
                { id: 'villager_glacia1', type: 'villager', x: 28, y: 20, dir: DIR.LEFT, name: 'Patineuse',
                  dialogue: 'villager_glacia1' },
                { id: 'villager_glacia2', type: 'villager', x: 12, y: 16, dir: DIR.RIGHT, name: 'Scientifique',
                  dialogue: 'villager_glacia2' },
                { id: 'villager_glacia3', type: 'villager', x: 24, y: 28, dir: DIR.UP, name: 'Enfant',
                  dialogue: 'villager_glacia3' },
            ],
            warps: [
                { x: 20, y: h-1, targetMap: 'route6', targetX: 20, targetY: 1 },
                { x: 20, y: 0, targetMap: 'route7', targetX: 20, targetY: 38 },
            ]
        };
    },

    _createRoute7() {
        const w = 40, h = 40;
        const tiles = this._createEmptyMap(w, h);
        this._fillRect(tiles, 18, 0, 4, 40, TILE.PATH);
        this._fillRect(tiles, 6, 6, 10, 6, TILE.TALL_GRASS);
        this._fillRect(tiles, 26, 18, 8, 6, TILE.TALL_GRASS);
        this._fillRect(tiles, 8, 28, 8, 6, TILE.TALL_GRASS);

        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.TREE; tiles[y][w-1] = TILE.TREE; }
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) { tiles[0][x] = TILE.TREE; tiles[h-1][x] = TILE.TREE; }
        }
        // Environmental variety
        tiles[15][10] = TILE.ROCK; tiles[16][10] = TILE.ROCK;
        tiles[24][32] = TILE.ROCK;
        this._fillRect(tiles, 30, 8, 2, 3, TILE.WATER);
        this._fillRect(tiles, 8, 16, 3, 2, TILE.FLOWER);

        this.maps['route7'] = {
            id: 'route7', name: 'Route 7', width: w, height: h, tiles,
            music: 'route',
            encounters: [
                { id: 86, minLevel: 38, maxLevel: 42, rate: 15 },
                { id: 88, minLevel: 38, maxLevel: 42, rate: 10 },
                { id: 92, minLevel: 38, maxLevel: 42, rate: 15 },
                { id: 94, minLevel: 38, maxLevel: 42, rate: 10 },
                { id: 110, minLevel: 40, maxLevel: 43, rate: 10 },
                { id: 120, minLevel: 40, maxLevel: 43, rate: 10 },
                { id: 123, minLevel: 38, maxLevel: 42, rate: 10 },
                { id: 125, minLevel: 39, maxLevel: 42, rate: 10 },
                { id: 66, minLevel: 38, maxLevel: 42, rate: 10 },
            ],
            npcs: [
                { id: 'trainer_r7_1', type: 'trainer', x: 10, y: 10, dir: DIR.RIGHT, name: 'Karatéka Jin',
                  dialogue: 'trainer_battle', team: [
                    { id: 44, level: 42 }, { id: 83, level: 43 }, { id: 109, level: 43 }
                  ], defeated: false, reward: 1720 },
                { id: 'rival_battle2', type: 'rival', x: 20, y: 20, dir: DIR.DOWN, name: 'Kaël',
                  dialogue: 'story_rival_route7', team: null, storyReq: 'badge_6' },
            ],
            warps: [
                { x: 20, y: h-1, targetMap: 'glacia_city', targetX: 20, targetY: 1 },
                { x: 20, y: 0, targetMap: 'abyss_city', targetX: 20, targetY: 38 },
            ]
        };
    },

    _createAbyssCity() {
        const w = 50, h = 40;
        const tiles = this._createEmptyMap(w, h);

        this._fillRect(tiles, 18, 0, 4, 40, TILE.PATH);
        this._fillRect(tiles, 6, 18, 38, 3, TILE.PATH);

        this._fillRect(tiles, 10, 6, 6, 5, TILE.BUILDING);
        tiles[10][13] = TILE.PC;
        this._fillRect(tiles, 30, 6, 6, 5, TILE.BUILDING);
        tiles[10][33] = TILE.MART;

        // GYM 8 - Dragon
        this._fillRect(tiles, 18, 24, 10, 10, TILE.GYM_BUILDING);
        this._fillRect(tiles, 19, 25, 8, 8, TILE.GYM_FLOOR);
        tiles[33][23] = TILE.DOOR;

        this._fillRect(tiles, 4, 28, 10, 8, TILE.WATER);
        this._fillRect(tiles, 36, 28, 10, 8, TILE.WATER);

        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.TREE; tiles[y][w-1] = TILE.TREE; }
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) { tiles[0][x] = TILE.TREE; tiles[h-1][x] = TILE.TREE; }
        }
        tiles[26][18] = TILE.SIGN;
        tiles[18][20] = TILE.FOUNTAIN;
        tiles[22][12] = TILE.BENCH;
        tiles[15][28] = TILE.LAMPPOST;

        this.maps['abyss_city'] = {
            id: 'abyss_city', name: 'Abyssia', width: w, height: h, tiles,
            music: 'city',
            theme: { building: { border: '#6A4B8A', fill: '#4A2D6A', window: '#C8A0E8' } },
            encounters: [],
            npcs: [
                { id: 'nurse_abyss', type: 'nurse', x: 13, y: 9, dir: DIR.DOWN, name: 'Infirmière', dialogue: 'nurse_heal' },
                { id: 'merchant_abyss', type: 'merchant', x: 33, y: 9, dir: DIR.DOWN, name: 'Vendeur', dialogue: 'merchant_shop' },
                { id: 'gym8_leader', type: 'gymleader', x: 23, y: 28, dir: DIR.DOWN, name: 'Champion Drake',
                  dialogue: 'gym8_dialogue', altDialogue: 'gym8_defeated', team: [
                    { id: 66, level: 46 }, { id: 111, level: 47 }, { id: 89, level: 48 }, { id: 136, level: 48 }, { id: 67, level: 50 }
                  ], defeated: false, reward: 6000, badge: 7, storyReq: 'badge_6' },
                { id: 'sign_abyss', type: 'sign', x: 18, y: 26, dialogue: 'sign_abyss' },
                { id: 'villager_abyss1', type: 'villager', x: 26, y: 18, dir: DIR.DOWN, name: 'Mystique',
                  dialogue: 'villager_abyss1' },
                { id: 'villager_abyss2', type: 'villager', x: 14, y: 24, dir: DIR.RIGHT, name: 'Garde',
                  dialogue: 'villager_abyss2' },
                { id: 'villager_abyss3', type: 'villager', x: 30, y: 28, dir: DIR.LEFT, name: 'Vieux sage',
                  dialogue: 'villager_abyss3' },
            ],
            warps: [
                { x: 20, y: h-1, targetMap: 'route7', targetX: 20, targetY: 1 },
                { x: 20, y: 0, targetMap: 'victory_road', targetX: 20, targetY: 38 },
            ]
        };
    },

    _createVictoryRoad() {
        const w = 40, h = 40;
        const tiles = this._createEmptyMap(w, h, TILE.CAVE_WALL);

        // Carve a winding path
        this._fillRect(tiles, 18, 34, 4, 6, TILE.CAVE_FLOOR);
        this._fillRect(tiles, 10, 30, 12, 4, TILE.CAVE_FLOOR);
        this._fillRect(tiles, 10, 22, 4, 10, TILE.CAVE_FLOOR);
        this._fillRect(tiles, 10, 22, 20, 4, TILE.CAVE_FLOOR);
        this._fillRect(tiles, 26, 14, 4, 12, TILE.CAVE_FLOOR);
        this._fillRect(tiles, 12, 14, 18, 4, TILE.CAVE_FLOOR);
        this._fillRect(tiles, 12, 6, 4, 12, TILE.CAVE_FLOOR);
        this._fillRect(tiles, 12, 6, 12, 4, TILE.CAVE_FLOOR);
        this._fillRect(tiles, 18, 0, 4, 10, TILE.CAVE_FLOOR);

        this.maps['victory_road'] = {
            id: 'victory_road', name: 'Route Victoire', width: w, height: h, tiles,
            music: 'cave', isDungeon: true,
            encounters: [
                { id: 65, minLevel: 42, maxLevel: 46, rate: 10 },
                { id: 88, minLevel: 42, maxLevel: 46, rate: 10 },
                { id: 109, minLevel: 43, maxLevel: 46, rate: 10 },
                { id: 113, minLevel: 43, maxLevel: 47, rate: 10 },
                { id: 131, minLevel: 44, maxLevel: 48, rate: 10 },
                { id: 132, minLevel: 44, maxLevel: 48, rate: 10 },
                { id: 133, minLevel: 43, maxLevel: 47, rate: 10 },
                { id: 136, minLevel: 44, maxLevel: 48, rate: 10 },
                { id: 139, minLevel: 44, maxLevel: 48, rate: 5 },
                { id: 140, minLevel: 44, maxLevel: 48, rate: 5 },
            ],
            npcs: [
                { id: 'trainer_vr_1', type: 'trainer', x: 12, y: 28, dir: DIR.RIGHT, name: 'Vétéran Karl',
                  dialogue: 'trainer_battle', team: [
                    { id: 67, level: 48 }, { id: 31, level: 48 }, { id: 91, level: 49 }
                  ], defeated: false, reward: 3000 },
                { id: 'trainer_vr_2', type: 'trainer', x: 24, y: 18, dir: DIR.DOWN, name: 'Vétérane Sophia',
                  dialogue: 'trainer_battle', team: [
                    { id: 85, level: 48 }, { id: 95, level: 49 }, { id: 124, level: 49 }
                  ], defeated: false, reward: 3000 },
                { id: 'trainer_vr_3', type: 'trainer', x: 14, y: 10, dir: DIR.RIGHT, name: 'Vétéran Marcus',
                  dialogue: 'trainer_battle', team: [
                    { id: 38, level: 49 }, { id: 83, level: 49 }, { id: 93, level: 50 }, { id: 131, level: 50 }
                  ], defeated: false, reward: 3200 },
            ],
            warps: [
                { x: 20, y: h-1, targetMap: 'abyss_city', targetX: 20, targetY: 1 },
                { x: 20, y: 0, targetMap: 'pokemon_league', targetX: 20, targetY: 38 },
            ]
        };
    },

    _createPokemonLeague() {
        const w = 45, h = 40;
        const tiles = this._createEmptyMap(w, h, TILE.GYM_FLOOR);

        this._fillRect(tiles, 18, 0, 4, 40, TILE.PATH);
        this._fillRect(tiles, 8, 18, 30, 3, TILE.PATH);

        // Elite Four chambers represented as buildings
        this._fillRect(tiles, 8, 6, 6, 5, TILE.BUILDING);
        tiles[10][11] = TILE.PC;

        // Elite Four
        this._fillRect(tiles, 30, 8, 8, 6, TILE.BUILDING);
        this._fillRect(tiles, 31, 9, 6, 4, TILE.GYM_FLOOR);
        tiles[13][34] = TILE.DOOR;

        // Champion room
        this._fillRect(tiles, 16, 2, 12, 8, TILE.BUILDING);
        this._fillRect(tiles, 17, 3, 10, 6, TILE.GYM_FLOOR);
        tiles[9][22] = TILE.DOOR;

        for (let y = 0; y < h; y++) { tiles[y][0] = TILE.WALL; tiles[y][w-1] = TILE.WALL; }
        for (let x = 0; x < w; x++) { tiles[0][x] = TILE.WALL; }
        for (let x = 0; x < w; x++) {
            if (x < 17 || x > 21) tiles[h-1][x] = TILE.WALL;
        }
        tiles[35][18] = TILE.SIGN;

        this.maps['pokemon_league'] = {
            id: 'pokemon_league', name: 'Ligue Pokémon de Novara', width: w, height: h, tiles,
            music: 'league',
            theme: { building: { border: '#C8A830', fill: '#A08820', window: '#FFF8D0' } },
            encounters: [],
            npcs: [
                { id: 'nurse_league', type: 'nurse', x: 11, y: 9, dir: DIR.DOWN, name: 'Infirmière', dialogue: 'nurse_heal' },
                { id: 'elite1', type: 'elite', x: 34, y: 11, dir: DIR.DOWN, name: 'Conseil 4 - Umbra',
                  dialogue: 'elite1_dialogue', team: [
                    { id: 46, level: 52 }, { id: 36, level: 53 }, { id: 121, level: 54 }, { id: 148, level: 55 }
                  ], defeated: false, reward: 8000, storyReq: 'badge_7' },
                { id: 'elite2', type: 'elite', x: 34, y: 12, dir: DIR.DOWN, name: 'Conseil 4 - Aquaria',
                  dialogue: 'elite2_dialogue', team: [
                    { id: 54, level: 53 }, { id: 127, level: 54 }, { id: 111, level: 55 }, { id: 137, level: 56 }
                  ], defeated: false, reward: 8000 },
                { id: 'elite3', type: 'elite', x: 34, y: 13, dir: DIR.DOWN, name: 'Conseil 4 - Pyrus',
                  dialogue: 'elite3_dialogue', team: [
                    { id: 60, level: 54 }, { id: 97, level: 55 }, { id: 83, level: 55 }, { id: 138, level: 57 }
                  ], defeated: false, reward: 8000 },
                { id: 'elite4', type: 'elite', x: 34, y: 14, dir: DIR.DOWN, name: 'Conseil 4 - Drakon',
                  dialogue: 'elite4_dialogue', team: [
                    { id: 89, level: 55 }, { id: 131, level: 56 }, { id: 140, level: 57 }, { id: 67, level: 58 }
                  ], defeated: false, reward: 8000 },
                { id: 'champion', type: 'champion', x: 22, y: 5, dir: DIR.DOWN, name: 'Maître Aurion',
                  dialogue: 'champion_dialogue', team: [
                    { id: 138, level: 58 }, { id: 93, level: 58 }, { id: 67, level: 59 }, { id: 85, level: 59 }, { id: 91, level: 60 }, { id: 147, level: 62 }
                  ], defeated: false, reward: 20000 },
                { id: 'sign_league', type: 'sign', x: 18, y: 35, dialogue: 'sign_league' },
            ],
            warps: [
                { x: 20, y: h-1, targetMap: 'victory_road', targetX: 20, targetY: 1 },
            ]
        };
    },
};
