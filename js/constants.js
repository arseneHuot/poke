// ============================================================
// POKEMON NOVARA - Constants & Type System
// ============================================================

const TILE_SIZE = 32;
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 640;
const TILES_X = Math.ceil(CANVAS_WIDTH / TILE_SIZE) + 2;
const TILES_Y = Math.ceil(CANVAS_HEIGHT / TILE_SIZE) + 2;

// Pokemon Types
const TYPES = {
    NORMAL: 'normal',
    FIRE: 'fire',
    WATER: 'water',
    GRASS: 'grass',
    ELECTRIC: 'electric',
    ICE: 'ice',
    FIGHTING: 'fighting',
    POISON: 'poison',
    GROUND: 'ground',
    FLYING: 'flying',
    PSYCHIC: 'psychic',
    BUG: 'bug',
    ROCK: 'rock',
    GHOST: 'ghost',
    DRAGON: 'dragon',
    DARK: 'dark',
    STEEL: 'steel',
    FAIRY: 'fairy'
};

const TYPE_COLORS = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
};

// Type effectiveness chart
const TYPE_CHART = {
    normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
    fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground:   { fire: 2, grass: 0.5, electric: 2, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying:   { grass: 2, electric: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
    dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

function getTypeEffectiveness(atkType, defType1, defType2) {
    let mult = 1;
    const chart = TYPE_CHART[atkType] || {};
    if (chart[defType1] !== undefined) mult *= chart[defType1];
    if (defType2 && chart[defType2] !== undefined) mult *= chart[defType2];
    return mult;
}

// Move categories
const MOVE_CATEGORY = {
    PHYSICAL: 'physical',
    SPECIAL: 'special',
    STATUS: 'status'
};

// Nature stat modifiers
const NATURES = {
    Hardy: {}, Lonely: {atk:1.1,def:0.9}, Brave: {atk:1.1,spd:0.9},
    Adamant: {atk:1.1,spatk:0.9}, Naughty: {atk:1.1,spdef:0.9},
    Bold: {def:1.1,atk:0.9}, Docile: {}, Relaxed: {def:1.1,spd:0.9},
    Impish: {def:1.1,spatk:0.9}, Lax: {def:1.1,spdef:0.9},
    Timid: {spd:1.1,atk:0.9}, Hasty: {spd:1.1,def:0.9}, Serious: {},
    Jolly: {spd:1.1,spatk:0.9}, Naive: {spd:1.1,spdef:0.9},
    Modest: {spatk:1.1,atk:0.9}, Mild: {spatk:1.1,def:0.9},
    Quiet: {spatk:1.1,spd:0.9}, Bashful: {}, Rash: {spatk:1.1,spdef:0.9},
    Calm: {spdef:1.1,atk:0.9}, Gentle: {spdef:1.1,def:0.9},
    Sassy: {spdef:1.1,spd:0.9}, Careful: {spdef:1.1,spatk:0.9}, Quirky: {}
};

// Experience groups
const EXP_GROUPS = {
    fast: (n) => Math.floor(0.8 * n * n * n),
    medium_fast: (n) => n * n * n,
    medium_slow: (n) => Math.floor(1.2 * n * n * n - 15 * n * n + 100 * n - 140),
    slow: (n) => Math.floor(1.25 * n * n * n)
};

// Items
const ITEMS = {
    pokeball: { name: 'Poké Ball', desc: 'Attrape un Pokémon sauvage.', type: 'ball', catchRate: 1, price: 200 },
    superball: { name: 'Super Ball', desc: 'Meilleur taux de capture.', type: 'ball', catchRate: 1.5, price: 600 },
    hyperball: { name: 'Hyper Ball', desc: 'Excellent taux de capture.', type: 'ball', catchRate: 2, price: 1200 },
    masterball: { name: 'Master Ball', desc: 'Capture garantie.', type: 'ball', catchRate: 255, price: 0 },
    potion: { name: 'Potion', desc: 'Restaure 20 PV.', type: 'heal', healAmount: 20, price: 300 },
    superpotion: { name: 'Super Potion', desc: 'Restaure 50 PV.', type: 'heal', healAmount: 50, price: 700 },
    hyperpotion: { name: 'Hyper Potion', desc: 'Restaure 200 PV.', type: 'heal', healAmount: 200, price: 1200 },
    maxpotion: { name: 'Potion Max', desc: 'Restaure tous les PV.', type: 'heal', healAmount: 9999, price: 2500 },
    antidote: { name: 'Antidote', desc: 'Soigne le poison.', type: 'status', cures: 'poison', price: 100 },
    revive: { name: 'Rappel', desc: 'Ranime un Pokémon KO (50% PV).', type: 'revive', healPercent: 0.5, price: 1500 },
    maxrevive: { name: 'Rappel Max', desc: 'Ranime un Pokémon KO (100% PV).', type: 'revive', healPercent: 1, price: 4000 },
    rarecandy: { name: 'Super Bonbon', desc: 'Monte d\'un niveau.', type: 'levelup', price: 0 },
    repel: { name: 'Repousse', desc: 'Éloigne les Pokémon faibles (100 pas).', type: 'repel', steps: 100, price: 350 },
    escape_rope: { name: 'Corde Sortie', desc: 'Téléporte à l\'entrée d\'une grotte.', type: 'escape', price: 550 },
};

// Tile types
const TILE = {
    GRASS: 0,
    TALL_GRASS: 1,
    PATH: 2,
    WATER: 3,
    TREE: 4,
    BUILDING: 5,
    WALL: 6,
    DOOR: 7,
    SAND: 8,
    FLOWER: 9,
    ROCK: 10,
    LEDGE: 11,
    BRIDGE: 12,
    CAVE_FLOOR: 13,
    CAVE_WALL: 14,
    ICE: 15,
    LAVA: 16,
    SIGN: 17,
    PC: 18,
    MART: 19,
    GYM_FLOOR: 20,
    STAIRS_UP: 21,
    STAIRS_DOWN: 22,
    FOUNTAIN: 23,
    BENCH: 24,
    LAMPPOST: 25,
    GYM_BUILDING: 26,
    TABLE: 27,
    RUG: 28,
    BOOKSHELF: 29
};

const WALKABLE_TILES = new Set([
    TILE.GRASS, TILE.TALL_GRASS, TILE.PATH, TILE.DOOR, TILE.SAND,
    TILE.FLOWER, TILE.BRIDGE, TILE.CAVE_FLOOR, TILE.ICE,
    TILE.SIGN, TILE.PC, TILE.MART, TILE.GYM_FLOOR,
    TILE.STAIRS_UP, TILE.STAIRS_DOWN, TILE.RUG
]);

const ENCOUNTER_TILES = new Set([TILE.TALL_GRASS, TILE.CAVE_FLOOR]);

// Directions
const DIR = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};

const DIR_OFFSET = {
    [DIR.UP]: { x: 0, y: -1 },
    [DIR.DOWN]: { x: 0, y: 1 },
    [DIR.LEFT]: { x: -1, y: 0 },
    [DIR.RIGHT]: { x: 1, y: 0 }
};
