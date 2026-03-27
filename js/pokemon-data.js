// ============================================================
// POKEMON NOVARA - 150 Pokémon Data
// Region: Novara (Mediterranean/Volcanic themed)
// ============================================================

// All moves available in the game
const MOVES_DB = {
    // Normal
    tackle: { name: 'Charge', type: 'normal', category: 'physical', power: 40, accuracy: 100, pp: 35, desc: 'Charge physique basique.' },
    scratch: { name: 'Griffe', type: 'normal', category: 'physical', power: 40, accuracy: 100, pp: 35 },
    pound: { name: 'Ecras\'Face', type: 'normal', category: 'physical', power: 40, accuracy: 100, pp: 35 },
    quickattack: { name: 'Vive-Attaque', type: 'normal', category: 'physical', power: 40, accuracy: 100, pp: 30, priority: 1 },
    slam: { name: 'Coup d\'Boule', type: 'normal', category: 'physical', power: 80, accuracy: 75, pp: 20 },
    bodyslam: { name: 'Plaquage', type: 'normal', category: 'physical', power: 85, accuracy: 100, pp: 15, effect: { type: 'status', status: 'paralysis', chance: 30 } },
    takedown: { name: 'Bélier', type: 'normal', category: 'physical', power: 90, accuracy: 85, pp: 20, recoil: 0.25 },
    hyperbeam: { name: 'Ultralaser', type: 'normal', category: 'special', power: 150, accuracy: 90, pp: 5, recharge: true },
    explosion: { name: 'Explosion', type: 'normal', category: 'physical', power: 250, accuracy: 100, pp: 5, selfKO: true },
    growl: { name: 'Rugissement', type: 'normal', category: 'status', power: 0, accuracy: 100, pp: 40, effect: { type: 'stat', stat: 'atk', stages: -1, target: 'enemy' } },
    tailwhip: { name: 'Mimi-Queue', type: 'normal', category: 'status', power: 0, accuracy: 100, pp: 30, effect: { type: 'stat', stat: 'def', stages: -1, target: 'enemy' } },
    leer: { name: 'Groz\'Yeux', type: 'normal', category: 'status', power: 0, accuracy: 100, pp: 30, effect: { type: 'stat', stat: 'def', stages: -1, target: 'enemy' } },
    swordsdance: { name: 'Danse-Lames', type: 'normal', category: 'status', power: 0, accuracy: 100, pp: 20, effect: { type: 'stat', stat: 'atk', stages: 2, target: 'self' } },
    protect: { name: 'Abri', type: 'normal', category: 'status', power: 0, accuracy: 100, pp: 10, effect: { type: 'protect' } },
    facade: { name: 'Façade', type: 'normal', category: 'physical', power: 70, accuracy: 100, pp: 20 },
    headbutt: { name: 'Coup d\'Boule', type: 'normal', category: 'physical', power: 70, accuracy: 100, pp: 15, effect: { type: 'flinch', chance: 30 } },
    rest: { name: 'Repos', type: 'psychic', category: 'status', power: 0, accuracy: 100, pp: 10, effect: { type: 'rest' } },

    // Fire
    ember: { name: 'Flammèche', type: 'fire', category: 'special', power: 40, accuracy: 100, pp: 25, effect: { type: 'status', status: 'burn', chance: 10 } },
    firespin: { name: 'Danse Flamme', type: 'fire', category: 'special', power: 35, accuracy: 85, pp: 15, effect: { type: 'trap', turns: 4 } },
    flamethrower: { name: 'Lance-Flammes', type: 'fire', category: 'special', power: 90, accuracy: 100, pp: 15, effect: { type: 'status', status: 'burn', chance: 10 } },
    fireblast: { name: 'Déflagration', type: 'fire', category: 'special', power: 110, accuracy: 85, pp: 5, effect: { type: 'status', status: 'burn', chance: 10 } },
    firepunch: { name: 'Poing de Feu', type: 'fire', category: 'physical', power: 75, accuracy: 100, pp: 15, effect: { type: 'status', status: 'burn', chance: 10 } },
    flareblitz: { name: 'Boutefeu', type: 'fire', category: 'physical', power: 120, accuracy: 100, pp: 15, recoil: 0.33, effect: { type: 'status', status: 'burn', chance: 10 } },
    willowisp: { name: 'Feu Follet', type: 'fire', category: 'status', power: 0, accuracy: 85, pp: 15, effect: { type: 'status', status: 'burn', chance: 100 } },
    overheat: { name: 'Surchauffe', type: 'fire', category: 'special', power: 130, accuracy: 90, pp: 5, effect: { type: 'stat', stat: 'spatk', stages: -2, target: 'self' } },
    lavaplume: { name: 'Ébullition', type: 'fire', category: 'special', power: 80, accuracy: 100, pp: 15, effect: { type: 'status', status: 'burn', chance: 30 } },
    inferno: { name: 'Feu d\'Enfer', type: 'fire', category: 'special', power: 100, accuracy: 50, pp: 5, effect: { type: 'status', status: 'burn', chance: 100 } },

    // Water
    watergun: { name: 'Pistolet à O', type: 'water', category: 'special', power: 40, accuracy: 100, pp: 25 },
    bubble: { name: 'Écume', type: 'water', category: 'special', power: 40, accuracy: 100, pp: 30, effect: { type: 'stat', stat: 'spd', stages: -1, target: 'enemy', chance: 10 } },
    aquajet: { name: 'Aqua-Jet', type: 'water', category: 'physical', power: 40, accuracy: 100, pp: 20, priority: 1 },
    surf: { name: 'Surf', type: 'water', category: 'special', power: 90, accuracy: 100, pp: 15 },
    hydropump: { name: 'Hydrocanon', type: 'water', category: 'special', power: 110, accuracy: 80, pp: 5 },
    waterfall: { name: 'Cascade', type: 'water', category: 'physical', power: 80, accuracy: 100, pp: 15, effect: { type: 'flinch', chance: 20 } },
    scald: { name: 'Ébullition', type: 'water', category: 'special', power: 80, accuracy: 100, pp: 15, effect: { type: 'status', status: 'burn', chance: 30 } },
    raindance: { name: 'Danse Pluie', type: 'water', category: 'status', power: 0, accuracy: 100, pp: 5, effect: { type: 'weather', weather: 'rain', turns: 5 } },
    aquatail: { name: 'Hydro-Queue', type: 'water', category: 'physical', power: 90, accuracy: 90, pp: 10 },

    // Grass
    vinewhip: { name: 'Fouet Lianes', type: 'grass', category: 'physical', power: 45, accuracy: 100, pp: 25 },
    razorleaf: { name: 'Tranch\'Herbe', type: 'grass', category: 'physical', power: 55, accuracy: 95, pp: 25, critRate: 2 },
    absorb: { name: 'Vol-Vie', type: 'grass', category: 'special', power: 20, accuracy: 100, pp: 25, drain: 0.5 },
    megadrain: { name: 'Méga-Sangsue', type: 'grass', category: 'special', power: 40, accuracy: 100, pp: 15, drain: 0.5 },
    gigadrain: { name: 'Giga-Sangsue', type: 'grass', category: 'special', power: 75, accuracy: 100, pp: 10, drain: 0.5 },
    solarbeam: { name: 'Lance-Soleil', type: 'grass', category: 'special', power: 120, accuracy: 100, pp: 10, charge: true },
    seedbomb: { name: 'Bombe Graine', type: 'grass', category: 'physical', power: 80, accuracy: 100, pp: 15 },
    leafblade: { name: 'Lame-Feuille', type: 'grass', category: 'physical', power: 90, accuracy: 100, pp: 15, critRate: 2 },
    leechseed: { name: 'Vampigraine', type: 'grass', category: 'status', power: 0, accuracy: 90, pp: 10, effect: { type: 'leechseed' } },
    sleeppowder: { name: 'Poudre Dodo', type: 'grass', category: 'status', power: 0, accuracy: 75, pp: 15, effect: { type: 'status', status: 'sleep', chance: 100 } },
    energyball: { name: 'Éco-Sphère', type: 'grass', category: 'special', power: 90, accuracy: 100, pp: 10 },
    synthesis: { name: 'Synthèse', type: 'grass', category: 'status', power: 0, accuracy: 100, pp: 5, effect: { type: 'heal', percent: 0.5 } },
    petalblizzard: { name: 'Tempête Florale', type: 'grass', category: 'physical', power: 90, accuracy: 100, pp: 15 },

    // Electric
    thundershock: { name: 'Éclair', type: 'electric', category: 'special', power: 40, accuracy: 100, pp: 30, effect: { type: 'status', status: 'paralysis', chance: 10 } },
    thunderwave: { name: 'Cage-Éclair', type: 'electric', category: 'status', power: 0, accuracy: 90, pp: 20, effect: { type: 'status', status: 'paralysis', chance: 100 } },
    spark: { name: 'Étincelle', type: 'electric', category: 'physical', power: 65, accuracy: 100, pp: 20, effect: { type: 'status', status: 'paralysis', chance: 30 } },
    thunderbolt: { name: 'Tonnerre', type: 'electric', category: 'special', power: 90, accuracy: 100, pp: 15, effect: { type: 'status', status: 'paralysis', chance: 10 } },
    thunder: { name: 'Fatal-Foudre', type: 'electric', category: 'special', power: 110, accuracy: 70, pp: 10, effect: { type: 'status', status: 'paralysis', chance: 30 } },
    voltswitch: { name: 'Change Éclair', type: 'electric', category: 'special', power: 70, accuracy: 100, pp: 20 },
    wildcharge: { name: 'Éclair Fou', type: 'electric', category: 'physical', power: 90, accuracy: 100, pp: 15, recoil: 0.25 },

    // Ice
    icebeam: { name: 'Laser Glace', type: 'ice', category: 'special', power: 90, accuracy: 100, pp: 10, effect: { type: 'status', status: 'freeze', chance: 10 } },
    blizzard: { name: 'Blizzard', type: 'ice', category: 'special', power: 110, accuracy: 70, pp: 5, effect: { type: 'status', status: 'freeze', chance: 10 } },
    iceshard: { name: 'Éclats Glace', type: 'ice', category: 'physical', power: 40, accuracy: 100, pp: 30, priority: 1 },
    icepunch: { name: 'Poing Glace', type: 'ice', category: 'physical', power: 75, accuracy: 100, pp: 15, effect: { type: 'status', status: 'freeze', chance: 10 } },
    aurorabeam: { name: 'Onde Boréale', type: 'ice', category: 'special', power: 65, accuracy: 100, pp: 20 },
    icefang: { name: 'Crocs Givre', type: 'ice', category: 'physical', power: 65, accuracy: 95, pp: 15, effect: { type: 'status', status: 'freeze', chance: 10 } },
    hail: { name: 'Grêle', type: 'ice', category: 'status', power: 0, accuracy: 100, pp: 10, effect: { type: 'weather', weather: 'hail', turns: 5 } },
    freezedry: { name: 'Lyophilisation', type: 'ice', category: 'special', power: 70, accuracy: 100, pp: 20 },

    // Fighting
    karatechop: { name: 'Poing-Karaté', type: 'fighting', category: 'physical', power: 50, accuracy: 100, pp: 25, critRate: 2 },
    brickbreak: { name: 'Casse-Brique', type: 'fighting', category: 'physical', power: 75, accuracy: 100, pp: 15 },
    closecombat: { name: 'Close Combat', type: 'fighting', category: 'physical', power: 120, accuracy: 100, pp: 5, effect: { type: 'stat_self', stats: ['def','spdef'], stages: -1 } },
    aurasphere: { name: 'Aurasphère', type: 'fighting', category: 'special', power: 80, accuracy: 100, pp: 20 },
    drainpunch: { name: 'Poing Drainage', type: 'fighting', category: 'physical', power: 75, accuracy: 100, pp: 10, drain: 0.5 },
    machpunch: { name: 'Mach Punch', type: 'fighting', category: 'physical', power: 40, accuracy: 100, pp: 30, priority: 1 },
    bulkup: { name: 'Gonflette', type: 'fighting', category: 'status', power: 0, accuracy: 100, pp: 20, effect: { type: 'stat_self', stats: ['atk','def'], stages: 1 } },
    superpower: { name: 'Surpuissance', type: 'fighting', category: 'physical', power: 120, accuracy: 100, pp: 5, effect: { type: 'stat_self', stats: ['atk','def'], stages: -1 } },

    // Poison
    poisonsting: { name: 'Dard-Venin', type: 'poison', category: 'physical', power: 15, accuracy: 100, pp: 35, effect: { type: 'status', status: 'poison', chance: 30 } },
    sludge: { name: 'Détritus', type: 'poison', category: 'special', power: 65, accuracy: 100, pp: 20, effect: { type: 'status', status: 'poison', chance: 30 } },
    sludgebomb: { name: 'Bombe Beurk', type: 'poison', category: 'special', power: 90, accuracy: 100, pp: 10, effect: { type: 'status', status: 'poison', chance: 30 } },
    toxic: { name: 'Toxik', type: 'poison', category: 'status', power: 0, accuracy: 90, pp: 10, effect: { type: 'status', status: 'badly_poisoned', chance: 100 } },
    poisonjab: { name: 'Direct Toxik', type: 'poison', category: 'physical', power: 80, accuracy: 100, pp: 20, effect: { type: 'status', status: 'poison', chance: 30 } },
    venoshock: { name: 'Choc Venin', type: 'poison', category: 'special', power: 65, accuracy: 100, pp: 10 },
    acidspray: { name: 'Bombe Acide', type: 'poison', category: 'special', power: 40, accuracy: 100, pp: 20, effect: { type: 'stat', stat: 'spdef', stages: -2, target: 'enemy' } },

    // Ground
    mudslap: { name: 'Coud\'Boue', type: 'ground', category: 'special', power: 20, accuracy: 100, pp: 10, effect: { type: 'stat', stat: 'accuracy', stages: -1, target: 'enemy' } },
    dig: { name: 'Tunnel', type: 'ground', category: 'physical', power: 80, accuracy: 100, pp: 10, charge: true },
    earthquake: { name: 'Séisme', type: 'ground', category: 'physical', power: 100, accuracy: 100, pp: 10 },
    earthpower: { name: 'Telluriforce', type: 'ground', category: 'special', power: 90, accuracy: 100, pp: 10, effect: { type: 'stat', stat: 'spdef', stages: -1, target: 'enemy', chance: 10 } },
    mudshot: { name: 'Tir de Boue', type: 'ground', category: 'special', power: 55, accuracy: 95, pp: 15, effect: { type: 'stat', stat: 'spd', stages: -1, target: 'enemy' } },
    bulldoze: { name: 'Piétisol', type: 'ground', category: 'physical', power: 60, accuracy: 100, pp: 20, effect: { type: 'stat', stat: 'spd', stages: -1, target: 'enemy' } },

    // Flying
    gust: { name: 'Tornade', type: 'flying', category: 'special', power: 40, accuracy: 100, pp: 35 },
    wingattack: { name: 'Cru-Aile', type: 'flying', category: 'physical', power: 60, accuracy: 100, pp: 35 },
    aerialace: { name: 'Aéropique', type: 'flying', category: 'physical', power: 60, accuracy: 999, pp: 20 },
    airslash: { name: 'Lame d\'Air', type: 'flying', category: 'special', power: 75, accuracy: 95, pp: 15, effect: { type: 'flinch', chance: 30 } },
    fly: { name: 'Vol', type: 'flying', category: 'physical', power: 90, accuracy: 95, pp: 15, charge: true },
    bravebird: { name: 'Rapace', type: 'flying', category: 'physical', power: 120, accuracy: 100, pp: 15, recoil: 0.33 },
    hurricane: { name: 'Ouragan', type: 'flying', category: 'special', power: 110, accuracy: 70, pp: 10, effect: { type: 'status', status: 'confusion', chance: 30 } },
    roost: { name: 'Atterrissage', type: 'flying', category: 'status', power: 0, accuracy: 100, pp: 10, effect: { type: 'heal', percent: 0.5 } },
    defog: { name: 'Anti-Brume', type: 'flying', category: 'status', power: 0, accuracy: 100, pp: 15, effect: { type: 'clearstats', target: 'enemy' } },

    // Psychic
    confusion: { name: 'Choc Mental', type: 'psychic', category: 'special', power: 50, accuracy: 100, pp: 25, effect: { type: 'status', status: 'confusion', chance: 10 } },
    psybeam: { name: 'Psyko', type: 'psychic', category: 'special', power: 65, accuracy: 100, pp: 20, effect: { type: 'status', status: 'confusion', chance: 10 } },
    psychic: { name: 'Psyko', type: 'psychic', category: 'special', power: 90, accuracy: 100, pp: 10, effect: { type: 'stat', stat: 'spdef', stages: -1, target: 'enemy', chance: 10 } },
    psyshock: { name: 'Choc Psy', type: 'psychic', category: 'special', power: 80, accuracy: 100, pp: 10, usePhysDef: true },
    calmmind: { name: 'Plénitude', type: 'psychic', category: 'status', power: 0, accuracy: 100, pp: 20, effect: { type: 'stat_self', stats: ['spatk','spdef'], stages: 1 } },
    hypnosis: { name: 'Hypnose', type: 'psychic', category: 'status', power: 0, accuracy: 60, pp: 20, effect: { type: 'status', status: 'sleep', chance: 100 } },
    reflect: { name: 'Protection', type: 'psychic', category: 'status', power: 0, accuracy: 100, pp: 20, effect: { type: 'screen', screen: 'reflect', turns: 5 } },
    lightscreen: { name: 'Mur Lumière', type: 'psychic', category: 'status', power: 0, accuracy: 100, pp: 30, effect: { type: 'screen', screen: 'lightscreen', turns: 5 } },
    futuresight: { name: 'Prescience', type: 'psychic', category: 'special', power: 120, accuracy: 100, pp: 10 },
    zenheadbutt: { name: 'Psykoud\'Boul', type: 'psychic', category: 'physical', power: 80, accuracy: 90, pp: 15, effect: { type: 'flinch', chance: 20 } },

    // Bug
    bugbite: { name: 'Piqûre', type: 'bug', category: 'physical', power: 60, accuracy: 100, pp: 20 },
    xscissor: { name: 'Plaie-Croix', type: 'bug', category: 'physical', power: 80, accuracy: 100, pp: 15 },
    bugbuzz: { name: 'Bourdon', type: 'bug', category: 'special', power: 90, accuracy: 100, pp: 10, effect: { type: 'stat', stat: 'spdef', stages: -1, target: 'enemy', chance: 10 } },
    uturn: { name: 'Demi-Tour', type: 'bug', category: 'physical', power: 70, accuracy: 100, pp: 20 },
    stringshot: { name: 'Sécrétion', type: 'bug', category: 'status', power: 0, accuracy: 95, pp: 40, effect: { type: 'stat', stat: 'spd', stages: -2, target: 'enemy' } },
    quiverdance: { name: 'Papillodanse', type: 'bug', category: 'status', power: 0, accuracy: 100, pp: 20, effect: { type: 'stat_self', stats: ['spatk','spdef','spd'], stages: 1 } },
    signalbeam: { name: 'Signal Beam', type: 'bug', category: 'special', power: 75, accuracy: 100, pp: 15 },
    leechlife: { name: 'Vampirisme', type: 'bug', category: 'physical', power: 80, accuracy: 100, pp: 10, drain: 0.5 },

    // Rock
    rockthrow: { name: 'Jet-Pierres', type: 'rock', category: 'physical', power: 50, accuracy: 90, pp: 15 },
    rockslide: { name: 'Éboulement', type: 'rock', category: 'physical', power: 75, accuracy: 90, pp: 10, effect: { type: 'flinch', chance: 30 } },
    stoneedge: { name: 'Lame de Roc', type: 'rock', category: 'physical', power: 100, accuracy: 80, pp: 5, critRate: 2 },
    stealthrock: { name: 'Piège de Roc', type: 'rock', category: 'status', power: 0, accuracy: 100, pp: 20, effect: { type: 'hazard', hazard: 'stealthrock' } },
    sandstorm: { name: 'Tempête Sable', type: 'rock', category: 'status', power: 0, accuracy: 100, pp: 10, effect: { type: 'weather', weather: 'sandstorm', turns: 5 } },
    ancientpower: { name: 'Pouv.Antique', type: 'rock', category: 'special', power: 60, accuracy: 100, pp: 5 },
    powergem: { name: 'Rayon Gemme', type: 'rock', category: 'special', power: 80, accuracy: 100, pp: 20 },

    // Ghost
    lick: { name: 'Léchouille', type: 'ghost', category: 'physical', power: 30, accuracy: 100, pp: 30, effect: { type: 'status', status: 'paralysis', chance: 30 } },
    shadowball: { name: 'Ball\'Ombre', type: 'ghost', category: 'special', power: 80, accuracy: 100, pp: 15, effect: { type: 'stat', stat: 'spdef', stages: -1, target: 'enemy', chance: 20 } },
    shadowclaw: { name: 'Griffe Ombre', type: 'ghost', category: 'physical', power: 70, accuracy: 100, pp: 15, critRate: 2 },
    hex: { name: 'Châtiment', type: 'ghost', category: 'special', power: 65, accuracy: 100, pp: 10 },
    phantomforce: { name: 'Revenant', type: 'ghost', category: 'physical', power: 90, accuracy: 100, pp: 10, charge: true },
    curse: { name: 'Malédiction', type: 'ghost', category: 'status', power: 0, accuracy: 100, pp: 10, effect: { type: 'curse' } },
    nightshade: { name: 'Ombre Nocturne', type: 'ghost', category: 'special', power: 0, accuracy: 100, pp: 15, effect: { type: 'fixed_damage_level' } },
    confuseray: { name: 'Onde Folie', type: 'ghost', category: 'status', power: 0, accuracy: 100, pp: 10, effect: { type: 'status', status: 'confusion', chance: 100 } },

    // Dragon
    dragonbreath: { name: 'Dracosouffle', type: 'dragon', category: 'special', power: 60, accuracy: 100, pp: 20, effect: { type: 'status', status: 'paralysis', chance: 30 } },
    dragonclaw: { name: 'Dracogriffe', type: 'dragon', category: 'physical', power: 80, accuracy: 100, pp: 15 },
    dragonpulse: { name: 'Draco-Choc', type: 'dragon', category: 'special', power: 85, accuracy: 100, pp: 10 },
    outrage: { name: 'Colère', type: 'dragon', category: 'physical', power: 120, accuracy: 100, pp: 10, effect: { type: 'multi_turn', turns: 3, confuse_after: true } },
    dracometeor: { name: 'Draco Météore', type: 'dragon', category: 'special', power: 130, accuracy: 90, pp: 5, effect: { type: 'stat', stat: 'spatk', stages: -2, target: 'self' } },
    dragondance: { name: 'Danse Draco', type: 'dragon', category: 'status', power: 0, accuracy: 100, pp: 20, effect: { type: 'stat_self', stats: ['atk','spd'], stages: 1 } },

    // Dark
    bite: { name: 'Morsure', type: 'dark', category: 'physical', power: 60, accuracy: 100, pp: 25, effect: { type: 'flinch', chance: 30 } },
    crunch: { name: 'Mâchouille', type: 'dark', category: 'physical', power: 80, accuracy: 100, pp: 15, effect: { type: 'stat', stat: 'def', stages: -1, target: 'enemy', chance: 20 } },
    darkpulse: { name: 'Vibrobscur', type: 'dark', category: 'special', power: 80, accuracy: 100, pp: 15, effect: { type: 'flinch', chance: 20 } },
    suckerpunch: { name: 'Coup Bas', type: 'dark', category: 'physical', power: 70, accuracy: 100, pp: 5, priority: 1 },
    nightslash: { name: 'Tranche-Nuit', type: 'dark', category: 'physical', power: 70, accuracy: 100, pp: 15, critRate: 2 },
    pursuit: { name: 'Poursuite', type: 'dark', category: 'physical', power: 40, accuracy: 100, pp: 20 },
    nastyplot: { name: 'Machination', type: 'dark', category: 'status', power: 0, accuracy: 100, pp: 20, effect: { type: 'stat', stat: 'spatk', stages: 2, target: 'self' } },
    knockoff: { name: 'Sabotage', type: 'dark', category: 'physical', power: 65, accuracy: 100, pp: 20 },
    foulplay: { name: 'Tricherie', type: 'dark', category: 'physical', power: 95, accuracy: 100, pp: 15 },

    // Steel
    metalclaw: { name: 'Griffe Acier', type: 'steel', category: 'physical', power: 50, accuracy: 95, pp: 35, effect: { type: 'stat', stat: 'atk', stages: 1, target: 'self', chance: 10 } },
    ironhead: { name: 'Tête de Fer', type: 'steel', category: 'physical', power: 80, accuracy: 100, pp: 15, effect: { type: 'flinch', chance: 30 } },
    flashcannon: { name: 'Luminocanon', type: 'steel', category: 'special', power: 80, accuracy: 100, pp: 10, effect: { type: 'stat', stat: 'spdef', stages: -1, target: 'enemy', chance: 10 } },
    irontail: { name: 'Queue de Fer', type: 'steel', category: 'physical', power: 100, accuracy: 75, pp: 15, effect: { type: 'stat', stat: 'def', stages: -1, target: 'enemy', chance: 30 } },
    steelwing: { name: 'Aile d\'Acier', type: 'steel', category: 'physical', power: 70, accuracy: 90, pp: 25, effect: { type: 'stat', stat: 'def', stages: 1, target: 'self', chance: 10 } },
    bulletpunch: { name: 'Pisto-Poing', type: 'steel', category: 'physical', power: 40, accuracy: 100, pp: 30, priority: 1 },
    irondefense: { name: 'Mur de Fer', type: 'steel', category: 'status', power: 0, accuracy: 100, pp: 15, effect: { type: 'stat', stat: 'def', stages: 2, target: 'self' } },
    meteormash: { name: 'Poing Météore', type: 'steel', category: 'physical', power: 90, accuracy: 90, pp: 10, effect: { type: 'stat', stat: 'atk', stages: 1, target: 'self', chance: 20 } },

    // Fairy
    fairywind: { name: 'Vent Féérique', type: 'fairy', category: 'special', power: 40, accuracy: 100, pp: 30 },
    moonblast: { name: 'Pouvoir Lunaire', type: 'fairy', category: 'special', power: 95, accuracy: 100, pp: 15, effect: { type: 'stat', stat: 'spatk', stages: -1, target: 'enemy', chance: 30 } },
    dazzlinggleam: { name: 'Éclat Magique', type: 'fairy', category: 'special', power: 80, accuracy: 100, pp: 10 },
    playrough: { name: 'Câlinerie', type: 'fairy', category: 'physical', power: 90, accuracy: 90, pp: 10, effect: { type: 'stat', stat: 'atk', stages: -1, target: 'enemy', chance: 10 } },
    drainingkiss: { name: 'Bisou Draineur', type: 'fairy', category: 'special', power: 50, accuracy: 100, pp: 10, drain: 0.75 },
    charm: { name: 'Charme', type: 'fairy', category: 'status', power: 0, accuracy: 100, pp: 20, effect: { type: 'stat', stat: 'atk', stages: -2, target: 'enemy' } },
    moonlight: { name: 'Rayon Lune', type: 'fairy', category: 'status', power: 0, accuracy: 100, pp: 5, effect: { type: 'heal', percent: 0.5 } },
};

// 150 Pokemon of the Novara region
// Format: { id, name, types, baseStats:{hp,atk,def,spatk,spdef,spd}, expGroup, catchRate, evolvesTo, evolveLevel, learnset, genderRatio, eggGroups, desc }
const POKEDEX = [
    // === STARTERS (1-9) ===
    { id:1, name:'Flamby', types:['fire'], baseStats:{hp:45,atk:60,def:40,spatk:70,spdef:50,spd:65}, expGroup:'medium_slow', catchRate:45,
      evolvesTo:2, evolveLevel:16, desc:'Un petit Pokémon salamandre dont la queue brûle d\'une flamme éternelle.',
      learnset:{1:['tackle','growl'],5:['ember'],9:['smokescreen'],13:['firespin'],16:['quickattack'],20:['flamethrower'],25:['slash'],30:['fireblast']},
      colors:{ body:'#E85D3A', belly:'#F4A460', flame:'#FF6B35', eyes:'#2C1810' }
    },
    { id:2, name:'Flamberg', types:['fire'], baseStats:{hp:60,atk:78,def:58,spatk:85,spdef:65,spd:80}, expGroup:'medium_slow', catchRate:45,
      evolvesTo:3, evolveLevel:36, desc:'Sa crinière de flammes s\'intensifie quand il se bat.',
      learnset:{1:['tackle','growl','ember'],16:['firespin'],22:['flamethrower'],28:['swordsdance'],33:['lavaplume'],38:['flareblitz']},
      colors:{ body:'#C41E1E', belly:'#E8A050', flame:'#FF4500', mane:'#FF6347', eyes:'#1A0A05' }
    },
    { id:3, name:'Infernox', types:['fire','dragon'], baseStats:{hp:78,atk:100,def:72,spatk:109,spdef:78,spd:100}, expGroup:'medium_slow', catchRate:45,
      desc:'Un dragon de feu majestueux. Les légendes disent qu\'il a forgé les montagnes de Novara.',
      learnset:{1:['tackle','growl','ember','firespin'],36:['dragonbreath'],42:['flamethrower'],48:['dragonclaw'],54:['flareblitz'],60:['dracometeor'],66:['fireblast']},
      colors:{ body:'#8B0000', belly:'#DAA520', wings:'#DC143C', flame:'#FF4500', horns:'#4A3728', eyes:'#FFD700' }
    },
    { id:4, name:'Aquali', types:['water'], baseStats:{hp:50,atk:45,def:55,spatk:65,spdef:60,spd:55}, expGroup:'medium_slow', catchRate:45,
      evolvesTo:5, evolveLevel:16, desc:'Un têtard joueur qui adore nager dans les rivières de Novara.',
      learnset:{1:['tackle','growl'],5:['watergun'],9:['bubble'],13:['bite'],16:['aquajet'],20:['surf'],25:['protect'],30:['hydropump']},
      colors:{ body:'#4A90D9', belly:'#87CEEB', tail:'#357ABD', eyes:'#1A1A2E' }
    },
    { id:5, name:'Aquanox', types:['water'], baseStats:{hp:65,atk:60,def:70,spatk:82,spdef:75,spd:68}, expGroup:'medium_slow', catchRate:45,
      evolvesTo:6, evolveLevel:36, desc:'Ses nageoires sont devenues des lames tranchantes.',
      learnset:{1:['tackle','growl','watergun'],16:['aquajet'],22:['surf'],28:['iceshard'],33:['waterfall'],38:['icebeam']},
      colors:{ body:'#2E5FA1', belly:'#6BAED6', fins:'#1E3D73', eyes:'#0D0D1A' }
    },
    { id:6, name:'Maristorm', types:['water','steel'], baseStats:{hp:84,atk:86,def:98,spatk:92,spdef:88,spd:72}, expGroup:'medium_slow', catchRate:45,
      desc:'Son armure d\'acier est indestructible. Il commande les tempêtes marines.',
      learnset:{1:['tackle','growl','watergun','aquajet'],36:['ironhead'],42:['surf'],48:['flashcannon'],54:['hydropump'],60:['meteormash'],66:['icebeam']},
      colors:{ body:'#1A3A5C', armor:'#8B98A8', belly:'#5B9BD5', eyes:'#E0E0E0', crest:'#C0C0C0' }
    },
    { id:7, name:'Verdant', types:['grass'], baseStats:{hp:55,atk:49,def:63,spatk:55,spdef:65,spd:43}, expGroup:'medium_slow', catchRate:45,
      evolvesTo:8, evolveLevel:16, desc:'Une petite tortue végétale avec un bourgeon sur le dos.',
      learnset:{1:['tackle','growl'],5:['vinewhip'],9:['leechseed'],13:['razorleaf'],16:['synthesis'],20:['seedbomb'],25:['protect'],30:['solarbeam']},
      colors:{ body:'#5B8C3E', shell:'#8B6914', bud:'#FF69B4', belly:'#90EE90', eyes:'#2E1A0A' }
    },
    { id:8, name:'Verdantis', types:['grass'], baseStats:{hp:70,atk:62,def:80,spatk:72,spdef:80,spd:55}, expGroup:'medium_slow', catchRate:45,
      evolvesTo:9, evolveLevel:36, desc:'La fleur sur son dos s\'est épanouie, lui donnant plus de puissance.',
      learnset:{1:['tackle','growl','vinewhip'],16:['razorleaf'],22:['synthesis'],28:['seedbomb'],33:['energyball'],38:['leafblade']},
      colors:{ body:'#3D6B2E', shell:'#6B4E14', flower:'#FF1493', belly:'#7CCD7C', eyes:'#1A0A05' }
    },
    { id:9, name:'Floradon', types:['grass','fairy'], baseStats:{hp:90,atk:78,def:100,spatk:95,spdef:100,spd:56}, expGroup:'medium_slow', catchRate:45,
      desc:'Un titan végétal dont la forêt sur son dos abrite de nombreux Pokémon.',
      learnset:{1:['tackle','growl','vinewhip','razorleaf'],36:['moonblast'],42:['energyball'],48:['petalblizzard'],54:['synthesis'],60:['solarbeam'],66:['moonlight']},
      colors:{ body:'#2D5A1E', shell:'#5A3E0A', tree:'#228B22', flowers:'#FF69B4', belly:'#6BAF6B', eyes:'#FFD700' }
    },

    // === EARLY ROUTE POKEMON (10-25) ===
    { id:10, name:'Rondelet', types:['normal'], baseStats:{hp:40,atk:35,def:30,spatk:25,spdef:30,spd:50}, expGroup:'fast', catchRate:255,
      evolvesTo:11, evolveLevel:18, desc:'Un petit rongeur rond et doux qui vit dans les plaines.',
      learnset:{1:['tackle','tailwhip'],5:['quickattack'],10:['bite'],15:['headbutt'],20:['bodyslam']},
      colors:{ body:'#D2B48C', belly:'#FFF8DC', ears:'#C09060', eyes:'#2C1810' }
    },
    { id:11, name:'Rondalin', types:['normal','fighting'], baseStats:{hp:70,atk:75,def:60,spatk:45,spdef:55,spd:85}, expGroup:'fast', catchRate:127,
      desc:'Agile et puissant, il protège son territoire avec férocité.',
      learnset:{1:['tackle','tailwhip','quickattack'],18:['karatechop'],22:['slam'],28:['closecombat'],34:['facade']},
      colors:{ body:'#A0522D', belly:'#DEB887', muscle:'#8B4513', eyes:'#1A0A00', band:'#FF4500' }
    },
    { id:12, name:'Plumito', types:['flying'], baseStats:{hp:35,atk:40,def:30,spatk:35,spdef:30,spd:55}, expGroup:'fast', catchRate:255,
      evolvesTo:13, evolveLevel:14, desc:'Un petit oiseau coloré des plaines de Novara.',
      learnset:{1:['tackle','gust'],5:['quickattack'],10:['wingattack'],15:['aerialace']},
      colors:{ body:'#87CEEB', wings:'#4169E1', breast:'#FF6B6B', beak:'#FFD700', eyes:'#1A1A2E' }
    },
    { id:13, name:'Plumarade', types:['flying','fire'], baseStats:{hp:55,atk:60,def:50,spatk:70,spdef:50,spd:90}, expGroup:'fast', catchRate:127,
      evolvesTo:14, evolveLevel:34, desc:'Ses plumes deviennent brûlantes en vol.',
      learnset:{1:['tackle','gust','quickattack'],14:['ember'],18:['aerialace'],24:['airslash'],30:['flamethrower']},
      colors:{ body:'#FF6347', wings:'#FF4500', crest:'#FFD700', beak:'#8B4513', eyes:'#2C1810' }
    },
    { id:14, name:'Phénixar', types:['flying','fire'], baseStats:{hp:78,atk:85,def:70,spatk:100,spdef:75,spd:105}, expGroup:'fast', catchRate:45,
      desc:'Un oiseau de feu légendaire. Son chant annonce le lever du soleil.',
      learnset:{1:['tackle','gust','quickattack','ember'],34:['bravebird'],40:['fireblast'],46:['hurricane'],52:['roost'],58:['overheat']},
      colors:{ body:'#FF2400', wings:'#FFD700', tail:'#FF8C00', crest:'#FFFF00', eyes:'#000080' }
    },
    { id:15, name:'Insectyl', types:['bug'], baseStats:{hp:35,atk:45,def:30,spatk:25,spdef:25,spd:45}, expGroup:'fast', catchRate:255,
      evolvesTo:16, evolveLevel:10, desc:'Une petite chenille vorace qui dévore les feuilles.',
      learnset:{1:['tackle','stringshot'],5:['bugbite'],10:['poisonsting']},
      colors:{ body:'#32CD32', segments:'#228B22', eyes:'#FF0000', feet:'#8B4513' }
    },
    { id:16, name:'Chrysalyd', types:['bug'], baseStats:{hp:45,atk:25,def:70,spatk:25,spdef:35,spd:15}, expGroup:'fast', catchRate:120,
      evolvesTo:17, evolveLevel:20, desc:'Immobile dans sa chrysalide, il se prépare à sa transformation.',
      learnset:{1:['tackle','stringshot','bugbite'],10:['irondefense']},
      colors:{ body:'#9ACD32', shell:'#6B8E23', eyes:'#FF4500' }
    },
    { id:17, name:'Papillux', types:['bug','psychic'], baseStats:{hp:65,atk:50,def:55,spatk:90,spdef:80,spd:85}, expGroup:'fast', catchRate:45,
      desc:'Ses ailes brillantes émettent des ondes psychiques hypnotiques.',
      learnset:{1:['tackle','confusion'],20:['psybeam'],26:['bugbuzz'],32:['psychic'],38:['quiverdance'],44:['airslash']},
      colors:{ body:'#9370DB', wings:'#E6E6FA', wingPattern:'#FF69B4', eyes:'#FFD700', antennae:'#4B0082' }
    },
    { id:18, name:'Electrik', types:['electric'], baseStats:{hp:40,atk:35,def:30,spatk:55,spdef:40,spd:70}, expGroup:'medium_fast', catchRate:190,
      evolvesTo:19, evolveLevel:26, desc:'Ce petit Pokémon génère de l\'électricité statique avec sa fourrure.',
      learnset:{1:['tackle','thundershock'],6:['thunderwave'],12:['spark'],18:['quickattack'],24:['voltswitch'],30:['thunderbolt']},
      colors:{ body:'#FFD700', belly:'#FFF8DC', cheeks:'#FF4500', ears:'#DAA520', eyes:'#1A1A2E', tail:'#DAA520' }
    },
    { id:19, name:'Fulgurak', types:['electric','steel'], baseStats:{hp:65,atk:70,def:75,spatk:90,spdef:70,spd:95}, expGroup:'medium_fast', catchRate:75,
      desc:'Son corps métallique attire la foudre qu\'il convertit en énergie pure.',
      learnset:{1:['tackle','thundershock','thunderwave','spark'],26:['ironhead'],32:['thunderbolt'],38:['flashcannon'],44:['wildcharge'],50:['thunder']},
      colors:{ body:'#B8860B', armor:'#C0C0C0', spikes:'#FFD700', eyes:'#00BFFF', bolt:'#FFFF00' }
    },
    { id:20, name:'Aquamouse', types:['water'], baseStats:{hp:50,atk:40,def:45,spatk:55,spdef:50,spd:50}, expGroup:'medium_fast', catchRate:190,
      evolvesTo:21, evolveLevel:28, desc:'Une petite loutre joueuse qui nage dans les rivières.',
      learnset:{1:['tackle','watergun'],6:['bubble'],12:['quickattack'],18:['aquajet'],24:['bite'],30:['surf']},
      colors:{ body:'#4682B4', belly:'#ADD8E6', whiskers:'#1E3A5F', nose:'#FF69B4', eyes:'#2C1810', tail:'#36648B' }
    },
    { id:21, name:'Hydralout', types:['water','dark'], baseStats:{hp:75,atk:72,def:65,spatk:82,spdef:70,spd:78}, expGroup:'medium_fast', catchRate:75,
      desc:'Sournois et rapide, il attaque par surprise depuis les eaux sombres.',
      learnset:{1:['tackle','watergun','bubble','aquajet'],28:['darkpulse'],34:['surf'],40:['crunch'],46:['hydropump'],52:['nightslash']},
      colors:{ body:'#2C3E50', belly:'#5DADE2', fins:'#1A252F', eyes:'#E74C3C', claws:'#C0C0C0' }
    },
    { id:22, name:'Florina', types:['grass','fairy'], baseStats:{hp:45,atk:30,def:35,spatk:55,spdef:50,spd:45}, expGroup:'medium_fast', catchRate:190,
      evolvesTo:23, evolveLevel:24, desc:'Une petite fleur vivante qui danse au soleil.',
      learnset:{1:['absorb','fairywind'],6:['leechseed'],12:['megadrain'],18:['drainingkiss'],24:['moonblast']},
      colors:{ body:'#90EE90', petals:'#FF69B4', face:'#FFFACD', stem:'#228B22', eyes:'#8B4513' }
    },
    { id:23, name:'Rosaluna', types:['grass','fairy'], baseStats:{hp:70,atk:50,def:60,spatk:90,spdef:80,spd:70}, expGroup:'medium_fast', catchRate:75,
      desc:'Elle ne s\'épanouit que sous la lumière de la lune, libérant un parfum envoûtant.',
      learnset:{1:['absorb','fairywind','leechseed','megadrain'],24:['moonblast'],30:['gigadrain'],36:['dazzlinggleam'],42:['moonlight'],48:['solarbeam']},
      colors:{ body:'#3CB371', petals:'#FF1493', face:'#FFFFF0', crown:'#C0C0C0', glow:'#E6E6FA', eyes:'#4B0082' }
    },
    { id:24, name:'Rocheton', types:['rock'], baseStats:{hp:50,atk:60,def:70,spatk:25,spdef:40,spd:30}, expGroup:'medium_fast', catchRate:190,
      evolvesTo:25, evolveLevel:30, desc:'Un petit rocher vivant trouvé dans les grottes de Novara.',
      learnset:{1:['tackle','rockthrow'],6:['mudslap'],12:['headbutt'],18:['rockslide'],24:['irondefense'],30:['earthquake']},
      colors:{ body:'#808080', cracks:'#A0522D', eyes:'#FFD700', arms:'#696969' }
    },
    { id:25, name:'Granitor', types:['rock','ground'], baseStats:{hp:80,atk:95,def:110,spatk:40,spdef:60,spd:45}, expGroup:'medium_fast', catchRate:75,
      desc:'Un colosse de pierre. Sa peau est plus dure que le diamant.',
      learnset:{1:['tackle','rockthrow','mudslap','headbutt'],30:['earthquake'],36:['stoneedge'],42:['ironhead'],48:['explosion']},
      colors:{ body:'#5C5C5C', plates:'#8B7355', crystals:'#FFD700', eyes:'#FF4500', cracks:'#4A3728' }
    },

    // === CAVE / MOUNTAIN POKEMON (26-45) ===
    { id:26, name:'Chauvris', types:['flying','dark'], baseStats:{hp:40,atk:50,def:35,spatk:40,spdef:35,spd:65}, expGroup:'medium_fast', catchRate:190,
      evolvesTo:27, evolveLevel:28, desc:'Une chauve-souris nocturne qui chasse dans les grottes sombres.',
      learnset:{1:['tackle','bite'],6:['gust'],12:['confuseray'],18:['wingattack'],24:['darkpulse']},
      colors:{ body:'#483D8B', wings:'#6A5ACD', ears:'#9370DB', eyes:'#FF0000', fangs:'#FFFFFF' }
    },
    { id:27, name:'Noctaile', types:['flying','dark'], baseStats:{hp:70,atk:80,def:60,spatk:72,spdef:60,spd:95}, expGroup:'medium_fast', catchRate:75,
      desc:'Ses cris ultrasoniques paralysent ses proies de terreur.',
      learnset:{1:['tackle','bite','gust','confuseray'],28:['crunch'],34:['bravebird'],40:['darkpulse'],46:['airslash'],52:['nastyplot']},
      colors:{ body:'#2C1654', wings:'#4B0082', crest:'#8A2BE2', eyes:'#FF4500', fangs:'#FFFFFF' }
    },
    { id:28, name:'Cristallin', types:['rock','ice'], baseStats:{hp:55,atk:45,def:80,spatk:65,spdef:70,spd:35}, expGroup:'medium_fast', catchRate:120,
      evolvesTo:29, evolveLevel:32, desc:'Un cristal de glace vivant qui brille dans l\'obscurité des grottes.',
      learnset:{1:['tackle','iceshard'],8:['aurorabeam'],14:['rockthrow'],20:['icebeam'],26:['ancientpower'],32:['powergem']},
      colors:{ body:'#E0FFFF', crystals:'#00CED1', core:'#4169E1', facets:'#87CEFA' }
    },
    { id:29, name:'Gelicryst', types:['rock','ice'], baseStats:{hp:75,atk:60,def:110,spatk:95,spdef:90,spd:45}, expGroup:'medium_fast', catchRate:60,
      desc:'Son corps de cristal réfracte la lumière en arcs-en-ciel éblouissants.',
      learnset:{1:['tackle','iceshard','aurorabeam','rockthrow'],32:['blizzard'],38:['stoneedge'],44:['powergem'],50:['flashcannon']},
      colors:{ body:'#B0E0E6', crystals:'#00BFFF', core:'#0000CD', aurora:'#FF69B4' }
    },
    { id:30, name:'Magmor', types:['fire','rock'], baseStats:{hp:60,atk:75,def:65,spatk:60,spdef:45,spd:40}, expGroup:'medium_fast', catchRate:120,
      evolvesTo:31, evolveLevel:38, desc:'Un Pokémon né dans les volcans. Sa peau est de la lave solidifiée.',
      learnset:{1:['tackle','ember'],8:['rockthrow'],14:['firespin'],20:['lavaplume'],26:['rockslide'],32:['flamethrower']},
      colors:{ body:'#8B0000', lava:'#FF4500', crust:'#4A3728', cracks:'#FFD700', eyes:'#FFFF00' }
    },
    { id:31, name:'Volcanor', types:['fire','rock'], baseStats:{hp:90,atk:105,def:95,spatk:90,spdef:60,spd:55}, expGroup:'medium_fast', catchRate:45,
      desc:'Un titan volcanique dont les éruptions façonnent le paysage.',
      learnset:{1:['tackle','ember','rockthrow','firespin'],38:['earthquake'],44:['flareblitz'],50:['stoneedge'],56:['fireblast'],62:['explosion']},
      colors:{ body:'#5C1010', lava:'#FF2400', plates:'#3D2B1F', cracks:'#FF6600', eyes:'#FFFF00', magma:'#FF4500' }
    },
    { id:32, name:'Sablion', types:['ground'], baseStats:{hp:45,atk:55,def:50,spatk:35,spdef:40,spd:50}, expGroup:'medium_fast', catchRate:190,
      evolvesTo:33, evolveLevel:26, desc:'Il se cache sous le sable des plages et des déserts.',
      learnset:{1:['tackle','mudslap'],6:['bite'],12:['mudshot'],18:['dig'],24:['bulldoze'],30:['earthquake']},
      colors:{ body:'#C2B280', belly:'#F5DEB3', claws:'#8B7355', eyes:'#2C1810' }
    },
    { id:33, name:'Dunérak', types:['ground','dragon'], baseStats:{hp:75,atk:90,def:80,spatk:55,spdef:65,spd:80}, expGroup:'medium_fast', catchRate:75,
      desc:'Un dragon des sables qui crée des tempêtes dans le désert.',
      learnset:{1:['tackle','mudslap','bite','mudshot'],26:['dragonbreath'],32:['earthquake'],38:['dragonclaw'],44:['sandstorm'],50:['outrage']},
      colors:{ body:'#DAA520', belly:'#F4E4BC', fins:'#B8860B', wings:'#CD853F', eyes:'#FF0000', horns:'#8B7355' }
    },
    { id:34, name:'Ombrix', types:['ghost'], baseStats:{hp:40,atk:30,def:30,spatk:55,spdef:45,spd:60}, expGroup:'medium_fast', catchRate:190,
      evolvesTo:35, evolveLevel:25, desc:'Une ombre vivante qui joue des tours aux voyageurs égarés.',
      learnset:{1:['lick','confuseray'],6:['nightshade'],12:['hex'],18:['shadowball'],24:['curse']},
      colors:{ body:'#4B0082', eyes:'#FF0000', aura:'#8A2BE2', glow:'#E6E6FA' }
    },
    { id:35, name:'Spectror', types:['ghost','poison'], baseStats:{hp:60,atk:50,def:55,spatk:90,spdef:75,spd:85}, expGroup:'medium_fast', catchRate:75,
      evolvesTo:36, evolveLevel:42, desc:'Il hante les cimetières et absorbe l\'énergie vitale des imprudents.',
      learnset:{1:['lick','confuseray','nightshade','hex'],25:['sludgebomb'],30:['shadowball'],36:['toxic'],42:['darkpulse']},
      colors:{ body:'#2E0854', eyes:'#FF4500', aura:'#9400D3', wisps:'#00FF00', claws:'#800080' }
    },
    { id:36, name:'Phantasar', types:['ghost','poison'], baseStats:{hp:75,atk:65,def:70,spatk:115,spdef:90,spd:100}, expGroup:'medium_fast', catchRate:30,
      desc:'Le roi des spectres. Son regard plonge dans l\'âme de ses adversaires.',
      learnset:{1:['lick','confuseray','nightshade','hex'],42:['phantomforce'],48:['sludgebomb'],54:['shadowball'],60:['darkpulse'],66:['nastyplot']},
      colors:{ body:'#1A0033', crown:'#9400D3', eyes:'#FF0000', cloak:'#4B0082', flames:'#00FF7F', gems:'#FFD700' }
    },
    { id:37, name:'Ferrik', types:['steel'], baseStats:{hp:50,atk:65,def:75,spatk:35,spdef:45,spd:40}, expGroup:'medium_fast', catchRate:120,
      evolvesTo:38, evolveLevel:34, desc:'Son corps en métal lui permet de résister aux attaques les plus puissantes.',
      learnset:{1:['tackle','metalclaw'],8:['irondefense'],14:['headbutt'],20:['ironhead'],26:['rockslide'],32:['flashcannon']},
      colors:{ body:'#808080', plates:'#C0C0C0', rivets:'#4A4A4A', eyes:'#00BFFF' }
    },
    { id:38, name:'Forgeron', types:['steel','fire'], baseStats:{hp:75,atk:100,def:110,spatk:60,spdef:65,spd:55}, expGroup:'medium_fast', catchRate:45,
      desc:'Il forge ses propres armes avec la chaleur de son corps. Maître des métaux.',
      learnset:{1:['tackle','metalclaw','irondefense','headbutt'],34:['flamethrower'],40:['ironhead'],46:['flashcannon'],52:['meteormash'],58:['flareblitz']},
      colors:{ body:'#696969', plates:'#A9A9A9', forge:'#FF4500', sparks:'#FFD700', eyes:'#FF6347', anvil:'#2F2F2F' }
    },
    { id:39, name:'Toxipod', types:['poison'], baseStats:{hp:40,atk:35,def:45,spatk:50,spdef:40,spd:35}, expGroup:'medium_fast', catchRate:190,
      evolvesTo:40, evolveLevel:22, desc:'Un champignon toxique qui libère des spores empoisonnées.',
      learnset:{1:['tackle','poisonsting'],6:['absorb'],12:['acidspray'],18:['venoshock'],24:['sludge']},
      colors:{ body:'#9B59B6', cap:'#8E44AD', spots:'#E74C3C', stem:'#BDC3C7', eyes:'#2ECC71' }
    },
    { id:40, name:'Toxiflore', types:['poison','grass'], baseStats:{hp:65,atk:55,def:65,spatk:85,spdef:75,spd:60}, expGroup:'medium_fast', catchRate:75,
      desc:'Ses spores peuvent guérir ou empoisonner selon sa volonté.',
      learnset:{1:['tackle','poisonsting','absorb','acidspray'],22:['sludgebomb'],28:['gigadrain'],34:['toxic'],40:['energyball'],46:['sleeppowder']},
      colors:{ body:'#6C3483', cap:'#512E5F', flowers:'#E91E63', vines:'#27AE60', eyes:'#F1C40F', spores:'#E8DAEF' }
    },
    { id:41, name:'Glaçon', types:['ice'], baseStats:{hp:50,atk:40,def:55,spatk:60,spdef:55,spd:45}, expGroup:'medium_fast', catchRate:150,
      evolvesTo:42, evolveLevel:30, desc:'Un petit bonhomme de neige vivant qui joue dans les montagnes enneigées.',
      learnset:{1:['tackle','iceshard'],6:['aurorabeam'],12:['icebeam'],18:['hail'],24:['freezedry'],30:['blizzard']},
      colors:{ body:'#F0F8FF', eyes:'#1A1A2E', scarf:'#FF4500', arms:'#8B4513', nose:'#FF8C00', hat:'#4169E1' }
    },
    { id:42, name:'Avalord', types:['ice','rock'], baseStats:{hp:80,atk:70,def:90,spatk:90,spdef:80,spd:50}, expGroup:'medium_fast', catchRate:60,
      desc:'Un géant de glace ancien. Il dort dans les glaciers depuis des millénaires.',
      learnset:{1:['tackle','iceshard','aurorabeam','icebeam'],30:['stoneedge'],36:['blizzard'],42:['earthquake'],48:['ancientpower'],54:['icebeam']},
      colors:{ body:'#B0C4DE', ice:'#00CED1', rocks:'#708090', eyes:'#87CEEB', crystals:'#E0FFFF' }
    },
    { id:43, name:'Pygnoux', types:['fighting'], baseStats:{hp:45,atk:60,def:45,spatk:30,spdef:35,spd:55}, expGroup:'medium_fast', catchRate:190,
      evolvesTo:44, evolveLevel:28, desc:'Un petit lutteur fier qui s\'entraîne sans relâche.',
      learnset:{1:['tackle','karatechop'],6:['machpunch'],12:['brickbreak'],18:['bulkup'],24:['drainpunch'],30:['closecombat']},
      colors:{ body:'#E74C3C', belt:'#F1C40F', hands:'#FDEBD0', eyes:'#2C3E50', headband:'#FFFFFF' }
    },
    { id:44, name:'Champork', types:['fighting','steel'], baseStats:{hp:70,atk:95,def:80,spatk:45,spdef:60,spd:80}, expGroup:'medium_fast', catchRate:60,
      desc:'Ses poings d\'acier brisent tout. Champion invaincu des arènes.',
      learnset:{1:['tackle','karatechop','machpunch','brickbreak'],28:['ironhead'],34:['closecombat'],40:['bulletpunch'],46:['meteormash'],52:['superpower']},
      colors:{ body:'#C0392B', armor:'#BDC3C7', fists:'#95A5A6', belt:'#F39C12', eyes:'#2980B9', helmet:'#7F8C8D' }
    },
    { id:45, name:'Nocturne', types:['dark'], baseStats:{hp:55,atk:70,def:45,spatk:50,spdef:45,spd:75}, expGroup:'medium_fast', catchRate:150,
      evolvesTo:46, evolveLevel:32, desc:'Un renard sombre qui chasse la nuit grâce à ses sens aiguisés.',
      learnset:{1:['tackle','bite'],6:['pursuit'],12:['quickattack'],18:['nightslash'],24:['suckerpunch'],30:['crunch']},
      colors:{ body:'#2C3E50', muzzle:'#34495E', eyes:'#E74C3C', tail:'#1A252F', markings:'#E67E22' }
    },

    // === MID-GAME POKEMON (46-80) ===
    { id:46, name:'Noctaris', types:['dark','ghost'], baseStats:{hp:75,atk:95,def:65,spatk:80,spdef:65,spd:100}, expGroup:'medium_fast', catchRate:60,
      desc:'Un spectre-renard insaisissable. Il peut se fondre dans les ombres.',
      learnset:{1:['tackle','bite','pursuit','quickattack'],32:['shadowball'],38:['darkpulse'],44:['phantomforce'],50:['nastyplot'],56:['foulplay']},
      colors:{ body:'#1A1A2E', wisps:'#9B59B6', eyes:'#E74C3C', markings:'#8E44AD', tails:'#2C3E50', glow:'#E6E6FA' }
    },
    { id:47, name:'Coralis', types:['water','fairy'], baseStats:{hp:55,atk:40,def:60,spatk:65,spdef:70,spd:40}, expGroup:'medium_fast', catchRate:150,
      evolvesTo:48, evolveLevel:30, desc:'Un corail vivant aux couleurs chatoyantes des fonds marins.',
      learnset:{1:['tackle','bubble'],6:['fairywind'],12:['watergun'],18:['drainingkiss'],24:['surf'],30:['moonblast']},
      colors:{ body:'#FF6B6B', branches:'#FF1493', base:'#FFA07A', tips:'#FFD700', eyes:'#4169E1' }
    },
    { id:48, name:'Récifal', types:['water','fairy'], baseStats:{hp:80,atk:55,def:90,spatk:95,spdef:100,spd:45}, expGroup:'medium_fast', catchRate:60,
      desc:'Un récif corallien vivant qui abrite et protège les créatures marines.',
      learnset:{1:['tackle','bubble','fairywind','watergun'],30:['moonblast'],36:['surf'],42:['dazzlinggleam'],48:['hydropump'],54:['moonlight']},
      colors:{ body:'#E91E63', coral:'#FF69B4', base:'#FF8C00', crown:'#FFD700', aura:'#E6E6FA', eyes:'#0000CD' }
    },
    { id:49, name:'Voltapin', types:['electric','bug'], baseStats:{hp:40,atk:30,def:35,spatk:55,spdef:40,spd:65}, expGroup:'medium_fast', catchRate:190,
      evolvesTo:50, evolveLevel:24, desc:'Un petit scarabée électrique qui brille dans la nuit.',
      learnset:{1:['tackle','thundershock'],6:['stringshot'],12:['bugbite'],18:['spark'],24:['signalbeam']},
      colors:{ body:'#DAA520', shell:'#FFD700', bolts:'#FFFF00', eyes:'#00FF00', legs:'#8B7355' }
    },
    { id:50, name:'Dynabeet', types:['electric','bug'], baseStats:{hp:60,atk:50,def:55,spatk:85,spdef:65,spd:95}, expGroup:'medium_fast', catchRate:75,
      desc:'Ses ailes créent un champ électromagnétique puissant en vol.',
      learnset:{1:['tackle','thundershock','bugbite','spark'],24:['bugbuzz'],30:['thunderbolt'],36:['voltswitch'],42:['signalbeam'],48:['thunder']},
      colors:{ body:'#B8860B', shell:'#FFD700', wings:'#FFFF00', bolts:'#00BFFF', eyes:'#FF4500', antennae:'#FFA500' }
    },
    { id:51, name:'Séraphin', types:['fairy','flying'], baseStats:{hp:50,atk:35,def:45,spatk:65,spdef:60,spd:55}, expGroup:'medium_slow', catchRate:150,
      evolvesTo:52, evolveLevel:32, desc:'Un petit ange aux ailes de lumière qui apporte la joie.',
      learnset:{1:['fairywind','gust'],6:['charm'],12:['drainingkiss'],18:['airslash'],24:['dazzlinggleam'],30:['moonblast']},
      colors:{ body:'#FFF8DC', wings:'#FFD700', halo:'#FFFF00', eyes:'#4169E1', dress:'#FFFAF0' }
    },
    { id:52, name:'Archangélis', types:['fairy','flying'], baseStats:{hp:75,atk:55,def:70,spatk:100,spdef:95,spd:80}, expGroup:'medium_slow', catchRate:45,
      desc:'Un être céleste qui protège les innocents avec ses pouvoirs divins.',
      learnset:{1:['fairywind','gust','charm','drainingkiss'],32:['moonblast'],38:['airslash'],44:['dazzlinggleam'],50:['hurricane'],56:['moonlight']},
      colors:{ body:'#FFFFF0', wings:'#FFD700', halo:'#FFFF00', eyes:'#000080', armor:'#C0C0C0', glow:'#F0E68C' }
    },
    { id:53, name:'Médusyn', types:['water','poison'], baseStats:{hp:55,atk:40,def:50,spatk:70,spdef:60,spd:65}, expGroup:'medium_fast', catchRate:150,
      evolvesTo:54, evolveLevel:30, desc:'Une méduse translucide dont les tentacules sont venimeuses.',
      learnset:{1:['bubble','poisonsting'],6:['watergun'],12:['acidspray'],18:['scald'],24:['sludge'],30:['toxic']},
      colors:{ body:'#E6E6FA', bell:'#DDA0DD', tentacles:'#9370DB', glow:'#FF69B4', eyes:'#4B0082' }
    },
    { id:54, name:'Abyssine', types:['water','poison'], baseStats:{hp:80,atk:60,def:70,spatk:100,spdef:85,spd:75}, expGroup:'medium_fast', catchRate:60,
      desc:'Elle règne sur les profondeurs océaniques. Son venin est mortel.',
      learnset:{1:['bubble','poisonsting','watergun','acidspray'],30:['hydropump'],36:['sludgebomb'],42:['darkpulse'],48:['icebeam'],54:['toxic']},
      colors:{ body:'#4B0082', bell:'#8A2BE2', tentacles:'#9400D3', biolum:'#00FF7F', eyes:'#FF0000', crown:'#FFD700' }
    },
    { id:55, name:'Terracotta', types:['ground','fighting'], baseStats:{hp:65,atk:75,def:70,spatk:40,spdef:55,spd:50}, expGroup:'medium_fast', catchRate:120,
      evolvesTo:56, evolveLevel:34, desc:'Un guerrier d\'argile animé par une force mystérieuse.',
      learnset:{1:['tackle','mudslap'],8:['karatechop'],14:['mudshot'],20:['brickbreak'],26:['bulldoze'],32:['earthquake']},
      colors:{ body:'#CD853F', markings:'#8B4513', eyes:'#FFD700', belt:'#DC143C', armor:'#A0522D' }
    },
    { id:56, name:'Golemarg', types:['ground','fighting'], baseStats:{hp:95,atk:110,def:100,spatk:55,spdef:70,spd:60}, expGroup:'medium_fast', catchRate:45,
      desc:'Un golem géant. Les anciens l\'ont créé pour protéger leurs temples.',
      learnset:{1:['tackle','mudslap','karatechop','mudshot'],34:['earthquake'],40:['closecombat'],46:['stoneedge'],52:['superpower'],58:['bodyslam']},
      colors:{ body:'#B8860B', markings:'#DAA520', eyes:'#00FF00', runes:'#FFD700', fists:'#8B7355', cracks:'#4A3728' }
    },
    { id:57, name:'Lunapin', types:['psychic'], baseStats:{hp:45,atk:30,def:40,spatk:60,spdef:55,spd:55}, expGroup:'medium_fast', catchRate:150,
      evolvesTo:58, evolveLevel:28, desc:'Un lapin mystique qui tire ses pouvoirs de la lune.',
      learnset:{1:['tackle','confusion'],6:['hypnosis'],12:['psybeam'],18:['lightscreen'],24:['psychic'],30:['calmmind']},
      colors:{ body:'#E6E6FA', ears:'#DDA0DD', moon:'#FFD700', eyes:'#4B0082', tail:'#F0E68C' }
    },
    { id:58, name:'Astralop', types:['psychic','fairy'], baseStats:{hp:70,atk:45,def:60,spatk:95,spdef:90,spd:80}, expGroup:'medium_fast', catchRate:60,
      desc:'Il communique par télépathie et peut voir l\'avenir dans les étoiles.',
      learnset:{1:['tackle','confusion','hypnosis','psybeam'],28:['psychic'],34:['moonblast'],40:['calmmind'],46:['futuresight'],52:['dazzlinggleam']},
      colors:{ body:'#9370DB', ears:'#BA55D3', stars:'#FFD700', eyes:'#FF69B4', cape:'#4B0082', crescent:'#C0C0C0' }
    },
    { id:59, name:'Pyralis', types:['fire','bug'], baseStats:{hp:45,atk:35,def:40,spatk:55,spdef:45,spd:65}, expGroup:'medium_fast', catchRate:150,
      evolvesTo:60, evolveLevel:28, desc:'Une luciole de feu qui illumine les nuits de Novara.',
      learnset:{1:['tackle','ember'],6:['stringshot'],12:['bugbite'],18:['firespin'],24:['signalbeam'],30:['flamethrower']},
      colors:{ body:'#FF4500', wings:'#FF8C00', abdomen:'#FFD700', glow:'#FFFF00', eyes:'#FF0000', antennae:'#8B4513' }
    },
    { id:60, name:'Infernalis', types:['fire','bug'], baseStats:{hp:70,atk:55,def:60,spatk:90,spdef:70,spd:95}, expGroup:'medium_fast', catchRate:60,
      desc:'Un papillon de feu majestueux. Ses ailes brûlent sans se consumer.',
      learnset:{1:['tackle','ember','bugbite','firespin'],28:['bugbuzz'],34:['flamethrower'],40:['quiverdance'],46:['fireblast'],52:['hurricane']},
      colors:{ body:'#DC143C', wings:'#FF4500', patterns:'#FFD700', glow:'#FF6347', eyes:'#000080', antennae:'#FF8C00' }
    },
    { id:61, name:'Tundrak', types:['ice','ground'], baseStats:{hp:65,atk:70,def:60,spatk:50,spdef:50,spd:55}, expGroup:'medium_fast', catchRate:120,
      evolvesTo:62, evolveLevel:36, desc:'Un mammouth laineux des régions glacées du nord de Novara.',
      learnset:{1:['tackle','iceshard'],8:['mudslap'],14:['icefang'],20:['bulldoze'],26:['icebeam'],32:['earthquake']},
      colors:{ body:'#8B7355', fur:'#DEB887', tusks:'#FFFFF0', eyes:'#4169E1', feet:'#696969' }
    },
    { id:62, name:'Mammofrost', types:['ice','ground'], baseStats:{hp:100,atk:105,def:85,spatk:70,spdef:70,spd:60}, expGroup:'medium_fast', catchRate:45,
      desc:'Un colosse des neiges. Ses défenses de glace peuvent geler n\'importe quoi.',
      learnset:{1:['tackle','iceshard','mudslap','icefang'],36:['earthquake'],42:['blizzard'],48:['stoneedge'],54:['superpower'],60:['icebeam']},
      colors:{ body:'#6B4E3D', fur:'#C4A882', tusks:'#87CEEB', eyes:'#00BFFF', armor:'#B0C4DE', feet:'#4A4A4A' }
    },
    { id:63, name:'Sylvana', types:['grass'], baseStats:{hp:55,atk:50,def:50,spatk:65,spdef:60,spd:50}, expGroup:'medium_fast', catchRate:120,
      evolvesTo:64, evolveLevel:32, desc:'Un esprit de la forêt qui communique avec les arbres.',
      learnset:{1:['absorb','vinewhip'],8:['leechseed'],14:['megadrain'],20:['synthesis'],26:['seedbomb'],32:['energyball']},
      colors:{ body:'#228B22', leaves:'#32CD32', eyes:'#8B4513', bark:'#5C4033', flowers:'#FFFFFF', vines:'#006400' }
    },
    { id:64, name:'Forestia', types:['grass','ghost'], baseStats:{hp:80,atk:70,def:75,spatk:95,spdef:85,spd:65}, expGroup:'medium_fast', catchRate:45,
      desc:'L\'esprit gardien de la forêt ancienne. Il punit ceux qui détruisent la nature.',
      learnset:{1:['absorb','vinewhip','leechseed','megadrain'],32:['shadowball'],38:['energyball'],44:['phantomforce'],50:['synthesis'],56:['solarbeam']},
      colors:{ body:'#006400', mask:'#FFFFF0', eyes:'#FF0000', branches:'#8B4513', moss:'#90EE90', aura:'#9370DB' }
    },
    { id:65, name:'Drakling', types:['dragon'], baseStats:{hp:50,atk:55,def:45,spatk:55,spdef:45,spd:60}, expGroup:'slow', catchRate:75,
      evolvesTo:66, evolveLevel:30, desc:'Un bébé dragon espiègle qui crache des petites flammes.',
      learnset:{1:['tackle','dragonbreath'],8:['bite'],14:['dragonclaw'],20:['flamethrower'],26:['dragonpulse']},
      colors:{ body:'#4169E1', belly:'#87CEEB', wings:'#6495ED', eyes:'#FFD700', horns:'#DAA520' }
    },
    { id:66, name:'Drakonis', types:['dragon','flying'], baseStats:{hp:72,atk:80,def:65,spatk:80,spdef:65,spd:78}, expGroup:'slow', catchRate:45,
      evolvesTo:67, evolveLevel:50, desc:'Un dragon adolescent fougueux qui défie tous les adversaires.',
      learnset:{1:['tackle','dragonbreath','bite','dragonclaw'],30:['dragonpulse'],36:['airslash'],42:['dragondance'],48:['flamethrower']},
      colors:{ body:'#0000CD', belly:'#6495ED', wings:'#4169E1', eyes:'#FF4500', horns:'#B8860B', claws:'#C0C0C0' }
    },
    { id:67, name:'Draconarch', types:['dragon','flying'], baseStats:{hp:95,atk:120,def:90,spatk:110,spdef:85,spd:100}, expGroup:'slow', catchRate:15,
      desc:'Le roi des dragons de Novara. Son souffle peut raser des montagnes.',
      learnset:{1:['tackle','dragonbreath','bite','dragonclaw'],50:['outrage'],56:['hurricane'],62:['dracometeor'],68:['hyperbeam'],74:['fireblast']},
      colors:{ body:'#00008B', belly:'#4169E1', wings:'#191970', eyes:'#FFD700', crown:'#FFD700', claws:'#C0C0C0', aura:'#7B68EE' }
    },
    { id:68, name:'Marina', types:['water'], baseStats:{hp:50,atk:40,def:50,spatk:60,spdef:55,spd:50}, expGroup:'medium_fast', catchRate:150,
      evolvesTo:69, evolveLevel:26, desc:'Un hippocampe gracieux qui danse dans les courants marins.',
      learnset:{1:['tackle','watergun'],6:['bubble'],12:['aquajet'],18:['scald'],24:['icebeam']},
      colors:{ body:'#FF69B4', belly:'#FFB6C1', fins:'#FF1493', crown:'#FFD700', eyes:'#4B0082', tail:'#DB7093' }
    },
    { id:69, name:'Maréole', types:['water','psychic'], baseStats:{hp:75,atk:55,def:70,spatk:90,spdef:85,spd:70}, expGroup:'medium_fast', catchRate:60,
      desc:'Un dragon marin mystique qui peut prédire les tempêtes.',
      learnset:{1:['tackle','watergun','bubble','aquajet'],26:['psychic'],32:['surf'],38:['calmmind'],44:['hydropump'],50:['futuresight']},
      colors:{ body:'#4682B4', belly:'#B0E0E6', fins:'#7B68EE', orbs:'#FFD700', eyes:'#E6E6FA', mane:'#9370DB' }
    },
    { id:70, name:'Arachnor', types:['bug','dark'], baseStats:{hp:55,atk:75,def:55,spatk:60,spdef:50,spd:70}, expGroup:'medium_fast', catchRate:100,
      evolvesTo:71, evolveLevel:34, desc:'Une araignée sombre qui tisse des pièges dans les forêts obscures.',
      learnset:{1:['bugbite','bite'],8:['stringshot'],14:['pursuit'],20:['xscissor'],26:['nightslash'],32:['crunch']},
      colors:{ body:'#2C2C2C', abdomen:'#4A0E0E', legs:'#1A1A1A', eyes:'#FF0000', markings:'#8B0000', web:'#C0C0C0' }
    },
    { id:71, name:'Tarentox', types:['bug','dark'], baseStats:{hp:75,atk:100,def:70,spatk:80,spdef:65,spd:90}, expGroup:'medium_fast', catchRate:45,
      desc:'Ses morsures injectent un venin qui paralyse instantanément ses proies.',
      learnset:{1:['bugbite','bite','stringshot','pursuit'],34:['leechlife'],40:['darkpulse'],46:['xscissor'],52:['suckerpunch'],58:['toxic']},
      colors:{ body:'#1A0A0A', abdomen:'#660000', legs:'#0D0D0D', eyes:'#FF4500', markings:'#DC143C', fangs:'#C0C0C0' }
    },
    { id:72, name:'Voltaire', types:['electric','flying'], baseStats:{hp:55,atk:50,def:45,spatk:80,spdef:55,spd:90}, expGroup:'medium_fast', catchRate:100,
      evolvesTo:73, evolveLevel:36, desc:'Un oiseau-tonnerre qui vole dans les orages pour se recharger.',
      learnset:{1:['thundershock','gust'],8:['quickattack'],14:['spark'],20:['airslash'],26:['thunderbolt'],32:['voltswitch']},
      colors:{ body:'#FFD700', wings:'#DAA520', bolts:'#FFFF00', beak:'#FF8C00', eyes:'#000080', tail:'#FFA500' }
    },
    { id:73, name:'Tempestair', types:['electric','flying'], baseStats:{hp:75,atk:70,def:60,spatk:110,spdef:70,spd:115}, expGroup:'medium_fast', catchRate:45,
      desc:'Il commande les orages. Un éclair frappe là où il passe.',
      learnset:{1:['thundershock','gust','quickattack','spark'],36:['thunder'],42:['hurricane'],48:['roost'],54:['wildcharge'],60:['bravebird']},
      colors:{ body:'#B8860B', wings:'#FFD700', bolts:'#FFFF00', crest:'#FF4500', eyes:'#00BFFF', aura:'#7FFFD4' }
    },
    { id:74, name:'Mimosa', types:['grass','poison'], baseStats:{hp:50,atk:45,def:55,spatk:60,spdef:55,spd:45}, expGroup:'medium_fast', catchRate:150,
      evolvesTo:75, evolveLevel:30, desc:'Une fleur carnivore qui attire les insectes avec son parfum sucré.',
      learnset:{1:['absorb','poisonsting'],8:['vinewhip'],14:['acidspray'],20:['megadrain'],26:['sludge'],32:['seedbomb']},
      colors:{ body:'#228B22', flower:'#FF00FF', mouth:'#FF1493', stems:'#006400', spots:'#8B008B', eyes:'#FFFF00' }
    },
    { id:75, name:'Carnivora', types:['grass','poison'], baseStats:{hp:75,atk:75,def:70,spatk:90,spdef:70,spd:65}, expGroup:'medium_fast', catchRate:60,
      desc:'Une plante carnivore géante. Sa bouche peut avaler un homme entier.',
      learnset:{1:['absorb','poisonsting','vinewhip','acidspray'],30:['sludgebomb'],36:['gigadrain'],42:['energyball'],48:['toxic'],54:['solarbeam']},
      colors:{ body:'#006400', flower:'#8B008B', mouths:'#FF1493', stems:'#004D00', spots:'#FF00FF', teeth:'#FFFFF0' }
    },
    { id:76, name:'Minéral', types:['steel','rock'], baseStats:{hp:55,atk:50,def:80,spatk:50,spdef:65,spd:30}, expGroup:'medium_fast', catchRate:120,
      evolvesTo:77, evolveLevel:35, desc:'Un cristal métallique qui pousse dans les veines de minerai.',
      learnset:{1:['tackle','metalclaw'],8:['rockthrow'],14:['irondefense'],20:['flashcannon'],26:['powergem'],32:['ironhead']},
      colors:{ body:'#C0C0C0', crystals:'#4169E1', core:'#FFD700', facets:'#87CEEB', base:'#808080' }
    },
    { id:77, name:'Gemmalith', types:['steel','rock'], baseStats:{hp:80,atk:75,def:115,spatk:80,spdef:90,spd:40}, expGroup:'medium_fast', catchRate:45,
      desc:'Un géode vivante incrustée de pierres précieuses rares.',
      learnset:{1:['tackle','metalclaw','rockthrow','irondefense'],35:['stoneedge'],40:['flashcannon'],46:['earthquake'],52:['meteormash'],58:['powergem']},
      colors:{ body:'#696969', crystals:'#E6E6FA', gems:['#FF0000','#00FF00','#0000FF','#FFD700'], core:'#FF69B4', shell:'#4A4A4A' }
    },
    { id:78, name:'Sandphin', types:['ground','water'], baseStats:{hp:60,atk:55,def:60,spatk:55,spdef:55,spd:60}, expGroup:'medium_fast', catchRate:120,
      evolvesTo:79, evolveLevel:32, desc:'Un dauphin de sable qui nage sous les dunes du désert.',
      learnset:{1:['tackle','mudslap'],8:['watergun'],14:['mudshot'],20:['aquajet'],26:['surf'],32:['earthquake']},
      colors:{ body:'#DAA520', belly:'#F5DEB3', fins:'#B8860B', eyes:'#4682B4', beak:'#C2B280' }
    },
    { id:79, name:'Oasirex', types:['ground','water'], baseStats:{hp:90,atk:80,def:85,spatk:80,spdef:75,spd:70}, expGroup:'medium_fast', catchRate:45,
      desc:'Il crée des oasis dans le désert. Les voyageurs le vénèrent comme un guide.',
      learnset:{1:['tackle','mudslap','watergun','mudshot'],32:['earthquake'],38:['hydropump'],44:['earthpower'],50:['icebeam'],56:['sandstorm']},
      colors:{ body:'#CD853F', belly:'#F5DEB3', fins:'#8B7355', eyes:'#4169E1', crown:'#00BFFF', palm:'#228B22' }
    },
    { id:80, name:'Lucifly', types:['bug','fairy'], baseStats:{hp:50,atk:35,def:40,spatk:65,spdef:60,spd:70}, expGroup:'medium_fast', catchRate:120,
      evolvesTo:81, evolveLevel:30, desc:'Une luciole féérique dont la lumière guide les perdus.',
      learnset:{1:['tackle','fairywind'],6:['stringshot'],12:['bugbite'],18:['drainingkiss'],24:['signalbeam'],30:['moonblast']},
      colors:{ body:'#90EE90', wings:'#E6E6FA', glow:'#FFD700', eyes:'#FF69B4', antennae:'#DDA0DD' }
    },

    // === LATE-GAME POKEMON (81-120) ===
    { id:81, name:'Féelume', types:['bug','fairy'], baseStats:{hp:70,atk:50,def:55,spatk:95,spdef:85,spd:90}, expGroup:'medium_fast', catchRate:45,
      desc:'Sa lumière purifiante dissipe les ténèbres et guérit les blessures.',
      learnset:{1:['tackle','fairywind','bugbite','drainingkiss'],30:['moonblast'],36:['bugbuzz'],42:['dazzlinggleam'],48:['quiverdance'],54:['moonlight']},
      colors:{ body:'#7FFF00', wings:'#F0E68C', glow:'#FFD700', halo:'#FFFFFF', eyes:'#FF1493', trail:'#FFFACD' }
    },
    { id:82, name:'Pyrodon', types:['fire','fighting'], baseStats:{hp:65,atk:80,def:60,spatk:65,spdef:50,spd:70}, expGroup:'medium_fast', catchRate:100,
      evolvesTo:83, evolveLevel:36, desc:'Un lézard de combat qui maîtrise les arts martiaux du feu.',
      learnset:{1:['tackle','ember'],8:['karatechop'],14:['firepunch'],20:['brickbreak'],26:['flamethrower'],32:['bulkup']},
      colors:{ body:'#FF4500', belly:'#FFD700', fists:'#FF6347', eyes:'#2C1810', belt:'#8B0000', flame:'#FF8C00' }
    },
    { id:83, name:'Blazemartial', types:['fire','fighting'], baseStats:{hp:85,atk:110,def:78,spatk:85,spdef:65,spd:95}, expGroup:'medium_fast', catchRate:45,
      desc:'Un maître martial dont chaque coup enflamme l\'air autour de lui.',
      learnset:{1:['tackle','ember','karatechop','firepunch'],36:['closecombat'],42:['flareblitz'],48:['swordsdance'],54:['fireblast'],60:['superpower']},
      colors:{ body:'#CC0000', belly:'#FFD700', flames:'#FF4500', eyes:'#000080', belt:'#1A1A1A', aura:'#FF6347' }
    },
    { id:84, name:'Glacien', types:['ice','fairy'], baseStats:{hp:60,atk:40,def:60,spatk:75,spdef:70,spd:55}, expGroup:'medium_fast', catchRate:100,
      evolvesTo:85, evolveLevel:34, desc:'Un renard de glace aux pouvoirs féeriques des montagnes enneigées.',
      learnset:{1:['tackle','iceshard'],8:['fairywind'],14:['aurorabeam'],20:['drainingkiss'],26:['icebeam'],32:['dazzlinggleam']},
      colors:{ body:'#B0E0E6', mane:'#E0FFFF', tails:'#87CEEB', eyes:'#4169E1', nose:'#FF69B4', paws:'#F0F8FF' }
    },
    { id:85, name:'Crysélia', types:['ice','fairy'], baseStats:{hp:80,atk:55,def:80,spatk:105,spdef:95,spd:75}, expGroup:'medium_fast', catchRate:45,
      desc:'Une créature divine de glace. Elle crée des paysages de neige éternelle.',
      learnset:{1:['tackle','iceshard','fairywind','aurorabeam'],34:['blizzard'],40:['moonblast'],46:['calmmind'],52:['moonlight'],58:['dazzlinggleam']},
      colors:{ body:'#E0FFFF', mane:'#FFFFFF', tails:'#87CEEB', crown:'#C0C0C0', eyes:'#0000FF', aurora:'#FF69B4' }
    },
    { id:86, name:'Phantomask', types:['ghost','fairy'], baseStats:{hp:50,atk:40,def:50,spatk:65,spdef:55,spd:60}, expGroup:'medium_fast', catchRate:100,
      evolvesTo:87, evolveLevel:32, desc:'Un masque hanté qui flotte dans les théâtres abandonnés.',
      learnset:{1:['lick','fairywind'],8:['confuseray'],14:['hex'],20:['drainingkiss'],26:['shadowball'],32:['dazzlinggleam']},
      colors:{ body:'#FFFFFF', mask:'#FFD700', eyes:'#FF0000', ribbons:'#FF69B4', shadow:'#4B0082' }
    },
    { id:87, name:'Mascarade', types:['ghost','fairy'], baseStats:{hp:70,atk:55,def:70,spatk:100,spdef:85,spd:85}, expGroup:'medium_fast', catchRate:45,
      desc:'Il change de masque pour modifier ses émotions et ses pouvoirs.',
      learnset:{1:['lick','fairywind','confuseray','hex'],32:['shadowball'],38:['moonblast'],44:['phantomforce'],50:['calmmind'],56:['dazzlinggleam']},
      colors:{ body:'#FFFFF0', masks:['#FFD700','#FF0000','#0000FF'], cape:'#4B0082', eyes:'#FF4500', crown:'#C0C0C0' }
    },
    { id:88, name:'Serpentor', types:['poison','dragon'], baseStats:{hp:60,atk:65,def:55,spatk:70,spdef:55,spd:65}, expGroup:'medium_slow', catchRate:75,
      evolvesTo:89, evolveLevel:40, desc:'Un serpent venimeux aux écailles de dragon.',
      learnset:{1:['poisonsting','dragonbreath'],8:['bite'],14:['sludge'],20:['dragonclaw'],26:['toxic'],32:['dragonpulse']},
      colors:{ body:'#228B22', scales:'#006400', belly:'#DAA520', eyes:'#FF0000', fangs:'#FFFFFF', hood:'#8B008B' }
    },
    { id:89, name:'Basilirex', types:['poison','dragon'], baseStats:{hp:85,atk:90,def:75,spatk:100,spdef:75,spd:95}, expGroup:'medium_slow', catchRate:30,
      desc:'Le roi des serpents. Son regard pétrifie ceux qui croisent ses yeux.',
      learnset:{1:['poisonsting','dragonbreath','bite','sludge'],40:['sludgebomb'],46:['dracometeor'],52:['earthquake'],58:['outrage'],64:['toxic']},
      colors:{ body:'#006400', scales:'#004D00', hood:'#8B0000', eyes:'#FFD700', crown:'#FF4500', belly:'#DAA520', gems:'#FF0000' }
    },
    { id:90, name:'Stellux', types:['psychic','electric'], baseStats:{hp:55,atk:40,def:50,spatk:75,spdef:60,spd:70}, expGroup:'medium_fast', catchRate:100,
      evolvesTo:91, evolveLevel:36, desc:'Une étoile vivante qui pulse d\'énergie psychique et électrique.',
      learnset:{1:['confusion','thundershock'],8:['thunderwave'],14:['psybeam'],20:['spark'],26:['psychic'],32:['thunderbolt']},
      colors:{ body:'#FFD700', core:'#FFFFFF', points:'#FFA500', aura:'#E6E6FA', eyes:'#4B0082', sparks:'#FFFF00' }
    },
    { id:91, name:'Cosmogyre', types:['psychic','electric'], baseStats:{hp:75,atk:55,def:70,spatk:110,spdef:85,spd:95}, expGroup:'medium_fast', catchRate:45,
      desc:'Il navigue dans l\'espace-temps. Son corps est fait d\'énergie cosmique pure.',
      learnset:{1:['confusion','thundershock','psybeam','spark'],36:['psychic'],42:['thunderbolt'],48:['calmmind'],54:['thunder'],60:['futuresight']},
      colors:{ body:'#4B0082', rings:'#FFD700', core:'#FFFFFF', aura:'#7B68EE', eyes:'#00BFFF', nebula:'#FF69B4' }
    },
    { id:92, name:'Gardivor', types:['steel','fairy'], baseStats:{hp:55,atk:60,def:75,spatk:45,spdef:60,spd:40}, expGroup:'medium_fast', catchRate:100,
      evolvesTo:93, evolveLevel:36, desc:'Un petit gardien d\'acier qui protège les sites sacrés de Novara.',
      learnset:{1:['tackle','metalclaw'],8:['fairywind'],14:['irondefense'],20:['ironhead'],26:['dazzlinggleam'],32:['flashcannon']},
      colors:{ body:'#C0C0C0', shield:'#FFD700', eyes:'#4169E1', gem:'#FF69B4', cape:'#E6E6FA' }
    },
    { id:93, name:'Sentinox', types:['steel','fairy'], baseStats:{hp:80,atk:85,def:110,spatk:70,spdef:85,spd:50}, expGroup:'medium_fast', catchRate:45,
      desc:'Le gardien ultime. Son bouclier repousse toute attaque maléfique.',
      learnset:{1:['tackle','metalclaw','fairywind','irondefense'],36:['moonblast'],42:['flashcannon'],48:['ironhead'],54:['playrough'],60:['meteormash']},
      colors:{ body:'#A9A9A9', shield:'#FFD700', armor:'#C0C0C0', eyes:'#0000FF', gem:'#FF1493', cape:'#4B0082', sword:'#E8E8E8' }
    },
    { id:94, name:'Ventoile', types:['flying','psychic'], baseStats:{hp:55,atk:45,def:50,spatk:70,spdef:65,spd:75}, expGroup:'medium_fast', catchRate:100,
      evolvesTo:95, evolveLevel:34, desc:'Un rapace mystique qui lit les courants du vent.',
      learnset:{1:['gust','confusion'],8:['quickattack'],14:['airslash'],20:['psybeam'],26:['psychic'],32:['aerialace']},
      colors:{ body:'#9370DB', wings:'#E6E6FA', eyes:'#FFD700', beak:'#8B7355', crest:'#DDA0DD', tail:'#BA55D3' }
    },
    { id:95, name:'Zéphyrius', types:['flying','psychic'], baseStats:{hp:75,atk:60,def:65,spatk:100,spdef:90,spd:105}, expGroup:'medium_fast', catchRate:45,
      desc:'Il commande les vents avec son esprit. Les tempêtes lui obéissent.',
      learnset:{1:['gust','confusion','airslash','psybeam'],34:['psychic'],40:['hurricane'],46:['calmmind'],52:['futuresight'],58:['bravebird']},
      colors:{ body:'#7B68EE', wings:'#E6E6FA', eyes:'#FFD700', crest:'#FF69B4', aura:'#DDA0DD', tail:'#4B0082' }
    },
    { id:96, name:'Vulcain', types:['fire','ground'], baseStats:{hp:70,atk:75,def:70,spatk:75,spdef:60,spd:55}, expGroup:'medium_fast', catchRate:75,
      evolvesTo:97, evolveLevel:40, desc:'Un taureau de lave qui charge avec une force explosive.',
      learnset:{1:['tackle','ember'],8:['mudslap'],14:['firespin'],20:['bulldoze'],26:['flamethrower'],32:['earthquake'],38:['lavaplume']},
      colors:{ body:'#8B4513', lava:'#FF4500', horns:'#4A4A4A', eyes:'#FF0000', hooves:'#2F2F2F', mane:'#FF6347' }
    },
    { id:97, name:'Éruptaur', types:['fire','ground'], baseStats:{hp:100,atk:110,def:90,spatk:95,spdef:70,spd:65}, expGroup:'medium_fast', catchRate:30,
      desc:'Sa charge provoque des tremblements de terre et des éruptions volcaniques.',
      learnset:{1:['tackle','ember','mudslap','firespin'],40:['earthquake'],46:['flareblitz'],52:['stoneedge'],58:['fireblast'],64:['explosion']},
      colors:{ body:'#5C1010', lava:'#FF2400', horns:'#2F2F2F', eyes:'#FFD700', plates:'#4A3728', magma:'#FF6600' }
    },
    { id:98, name:'Protéon', types:['normal'], baseStats:{hp:55,atk:55,def:50,spatk:60,spdef:55,spd:65}, expGroup:'medium_fast', catchRate:75,
      desc:'Un Pokémon adaptable qui peut évoluer de multiples façons selon son environnement.',
      learnset:{1:['tackle','quickattack'],8:['bite'],14:['headbutt'],20:['bodyslam'],26:['facade']},
      colors:{ body:'#D2B48C', mane:'#F5DEB3', eyes:'#8B4513', ears:'#C09060', tail:'#DEB887' }
    },
    // Protéon evolutions (99-105) - Eevee-like concept
    { id:99, name:'Pyréon', types:['fire'], baseStats:{hp:65,atk:60,def:60,spatk:95,spdef:70,spd:85}, expGroup:'medium_fast', catchRate:45,
      desc:'Protéon évolué par le feu. Sa fourrure brûle d\'une flamme intérieure.',
      learnset:{1:['tackle','quickattack','ember'],20:['flamethrower'],30:['lavaplume'],40:['fireblast'],50:['overheat']},
      colors:{ body:'#FF4500', mane:'#FFD700', eyes:'#8B0000', tail:'#FF6347', flame:'#FF8C00' }
    },
    { id:100, name:'Aquéon', types:['water'], baseStats:{hp:80,atk:55,def:65,spatk:90,spdef:80,spd:65}, expGroup:'medium_fast', catchRate:45,
      desc:'Protéon évolué par l\'eau. Il peut respirer sous l\'eau indéfiniment.',
      learnset:{1:['tackle','quickattack','watergun'],20:['surf'],30:['scald'],40:['hydropump'],50:['icebeam']},
      colors:{ body:'#4682B4', mane:'#87CEEB', eyes:'#000080', tail:'#1E90FF', fins:'#5F9EA0' }
    },
    { id:101, name:'Sylvéon', types:['grass'], baseStats:{hp:70,atk:60,def:70,spatk:85,spdef:85,spd:65}, expGroup:'medium_fast', catchRate:45,
      desc:'Protéon évolué par la nature. Des fleurs poussent sur son corps.',
      learnset:{1:['tackle','quickattack','vinewhip'],20:['energyball'],30:['gigadrain'],40:['solarbeam'],50:['synthesis']},
      colors:{ body:'#228B22', mane:'#90EE90', flowers:'#FF69B4', eyes:'#8B4513', tail:'#32CD32', petals:'#FFFFFF' }
    },
    { id:102, name:'Fulgéon', types:['electric'], baseStats:{hp:65,atk:55,def:55,spatk:90,spdef:65,spd:105}, expGroup:'medium_fast', catchRate:45,
      desc:'Protéon évolué par la foudre. Son pelage crépite d\'électricité.',
      learnset:{1:['tackle','quickattack','thundershock'],20:['thunderbolt'],30:['voltswitch'],40:['thunder'],50:['wildcharge']},
      colors:{ body:'#FFD700', mane:'#FFFF00', eyes:'#2C1810', spikes:'#FFA500', tail:'#DAA520', bolts:'#FFFFFF' }
    },
    { id:103, name:'Nocéon', types:['dark'], baseStats:{hp:70,atk:85,def:65,spatk:60,spdef:70,spd:85}, expGroup:'medium_fast', catchRate:45,
      desc:'Protéon évolué dans l\'ombre. Il est invisible dans l\'obscurité.',
      learnset:{1:['tackle','quickattack','bite'],20:['crunch'],30:['darkpulse'],40:['suckerpunch'],50:['nastyplot']},
      colors:{ body:'#2C2C2C', mane:'#4A4A4A', eyes:'#FF0000', rings:'#FFD700', tail:'#1A1A1A' }
    },
    { id:104, name:'Glacéon', types:['ice'], baseStats:{hp:65,atk:50,def:70,spatk:95,spdef:75,spd:80}, expGroup:'medium_fast', catchRate:45,
      desc:'Protéon évolué par le froid. Son souffle gèle tout sur son passage.',
      learnset:{1:['tackle','quickattack','iceshard'],20:['icebeam'],30:['freezedry'],40:['blizzard'],50:['hail']},
      colors:{ body:'#ADD8E6', mane:'#E0FFFF', crystal:'#00CED1', eyes:'#0000CD', tail:'#87CEEB' }
    },
    { id:105, name:'Psyéon', types:['psychic'], baseStats:{hp:70,atk:50,def:60,spatk:95,spdef:80,spd:80}, expGroup:'medium_fast', catchRate:45,
      desc:'Protéon évolué par la méditation. Il perçoit les pensées de tous.',
      learnset:{1:['tackle','quickattack','confusion'],20:['psychic'],30:['psyshock'],40:['calmmind'],50:['futuresight']},
      colors:{ body:'#DDA0DD', mane:'#E6E6FA', gem:'#FF69B4', eyes:'#4B0082', tail:'#BA55D3', aura:'#9370DB' }
    },

    // === MORE LATE-GAME (106-140) ===
    { id:106, name:'Coralisk', types:['water','rock'], baseStats:{hp:70,atk:80,def:85,spatk:60,spdef:65,spd:50}, expGroup:'medium_fast', catchRate:75,
      desc:'Un fossile vivant ressuscité. Il date de millions d\'années.',
      learnset:{1:['tackle','watergun'],8:['rockthrow'],14:['aquajet'],20:['rockslide'],26:['surf'],32:['ancientpower'],38:['stoneedge'],44:['hydropump']},
      colors:{ body:'#708090', shell:'#B8A038', fins:'#4682B4', eyes:'#FFD700', plates:'#8B7355' }
    },
    { id:107, name:'Ptéryx', types:['rock','flying'], baseStats:{hp:65,atk:85,def:60,spatk:75,spdef:55,spd:95}, expGroup:'medium_fast', catchRate:75,
      desc:'Un ptérodactyle fossile ressuscité. Il vole avec une vitesse incroyable.',
      learnset:{1:['wingattack','rockthrow'],8:['bite'],14:['aerialace'],20:['ancientpower'],26:['rockslide'],32:['airslash'],38:['bravebird'],44:['stoneedge']},
      colors:{ body:'#9370DB', wings:'#8A2BE2', beak:'#FFD700', eyes:'#FF4500', membrane:'#BA55D3', crest:'#DDA0DD' }
    },
    { id:108, name:'Mimétik', types:['ghost'], baseStats:{hp:55,atk:80,def:60,spatk:50,spdef:80,spd:50}, expGroup:'medium_fast', catchRate:60,
      desc:'Un Pokémon qui se déguise en objets pour surprendre ses proies.',
      learnset:{1:['lick','shadowclaw'],8:['confuseray'],14:['hex'],20:['shadowball'],26:['playrough'],32:['phantomforce'],38:['swordsdance']},
      colors:{ body:'#808080', disguise:'#FFD700', eyes:'#000000', shadow:'#4B0082', rag:'#DEB887' }
    },
    { id:109, name:'Minotork', types:['fighting','ground'], baseStats:{hp:85,atk:100,def:80,spatk:45,spdef:60,spd:70}, expGroup:'medium_fast', catchRate:60,
      desc:'Un minotaure féroce qui vit dans les labyrinthes souterrains.',
      learnset:{1:['tackle','mudslap'],10:['karatechop'],16:['bulldoze'],22:['brickbreak'],28:['earthquake'],34:['closecombat'],40:['superpower'],46:['stoneedge']},
      colors:{ body:'#8B4513', horns:'#4A3728', eyes:'#FF0000', hooves:'#2F2F2F', ring:'#FFD700', belt:'#DC143C' }
    },
    { id:110, name:'Kitsura', types:['fire','psychic'], baseStats:{hp:65,atk:50,def:55,spatk:90,spdef:80,spd:85}, expGroup:'medium_slow', catchRate:60,
      desc:'Un renard mystique à neuf queues qui maîtrise le feu et l\'esprit.',
      learnset:{1:['ember','confusion'],10:['firespin'],16:['psybeam'],22:['flamethrower'],28:['psychic'],34:['calmmind'],40:['fireblast'],46:['futuresight']},
      colors:{ body:'#FF8C00', tails:['#FF4500','#FFD700','#FF6347'], eyes:'#4B0082', gems:'#FF69B4', markings:'#FFFFFF' }
    },
    { id:111, name:'Tsunamire', types:['water','dragon'], baseStats:{hp:80,atk:75,def:70,spatk:90,spdef:75,spd:80}, expGroup:'medium_slow', catchRate:45,
      desc:'Un serpent de mer qui provoque des tsunamis quand il est en colère.',
      learnset:{1:['watergun','dragonbreath'],10:['aquajet'],16:['scald'],22:['dragonpulse'],28:['surf'],34:['dragondance'],40:['hydropump'],46:['dracometeor']},
      colors:{ body:'#1E90FF', scales:'#00008B', belly:'#87CEEB', fins:'#4169E1', eyes:'#FFD700', crest:'#00CED1', whiskers:'#C0C0C0' }
    },
    { id:112, name:'Griffor', types:['flying','fighting'], baseStats:{hp:75,atk:90,def:70,spatk:60,spdef:65,spd:85}, expGroup:'medium_fast', catchRate:60,
      desc:'Un griffon majestueux, mi-aigle mi-lion, qui règne sur les cieux.',
      learnset:{1:['tackle','gust'],10:['karatechop'],16:['wingattack'],22:['aerialace'],28:['brickbreak'],34:['bravebird'],40:['closecombat'],46:['hurricane']},
      colors:{ body:'#DAA520', wings:'#8B7355', beak:'#FFD700', eyes:'#FF4500', mane:'#CD853F', talons:'#4A4A4A' }
    },
    { id:113, name:'Kraken', types:['water','dark'], baseStats:{hp:90,atk:95,def:75,spatk:85,spdef:70,spd:75}, expGroup:'medium_slow', catchRate:30,
      desc:'Un monstre des abysses dont les tentacules s\'étendent sur des kilomètres.',
      learnset:{1:['watergun','bite'],10:['aquajet'],16:['crunch'],22:['surf'],28:['darkpulse'],34:['hydropump'],40:['nightslash'],46:['hyperbeam']},
      colors:{ body:'#2C1654', tentacles:'#4B0082', suckers:'#FF4500', eyes:'#FFFF00', beak:'#1A1A1A', marks:'#8A2BE2' }
    },
    { id:114, name:'Chimarak', types:['fire','dark'], baseStats:{hp:75,atk:85,def:65,spatk:85,spdef:65,spd:90}, expGroup:'medium_slow', catchRate:45,
      desc:'Une chimère démoniaque née dans les profondeurs des volcans.',
      learnset:{1:['ember','bite'],10:['firespin'],16:['pursuit'],22:['flamethrower'],28:['crunch'],34:['darkpulse'],40:['flareblitz'],46:['nastyplot']},
      colors:{ body:'#8B0000', mane:'#FF4500', horns:'#2F2F2F', wings:'#4A0E0E', eyes:'#FFD700', tail:'#FF6347', claws:'#C0C0C0' }
    },
    { id:115, name:'Djinnix', types:['psychic','fire'], baseStats:{hp:70,atk:55,def:60,spatk:100,spdef:80,spd:95}, expGroup:'medium_slow', catchRate:45,
      desc:'Un génie du feu qui exauce les voeux avec des flammes magiques.',
      learnset:{1:['confusion','ember'],10:['firespin'],16:['psybeam'],22:['flamethrower'],28:['psychic'],34:['calmmind'],40:['fireblast'],46:['futuresight'],52:['overheat']},
      colors:{ body:'#FF4500', smoke:'#9370DB', turban:'#FFD700', eyes:'#E6E6FA', gems:'#FF0000', bracelets:'#C0C0C0' }
    },
    { id:116, name:'Pharaon', types:['ground','ghost'], baseStats:{hp:80,atk:70,def:90,spatk:85,spdef:80,spd:55}, expGroup:'medium_slow', catchRate:45,
      desc:'Le spectre d\'un ancien roi. Il hante sa pyramide pour l\'éternité.',
      learnset:{1:['mudslap','hex'],10:['confuseray'],16:['earthpower'],22:['shadowball'],28:['earthquake'],34:['curse'],40:['phantomforce'],46:['sandstorm']},
      colors:{ body:'#DAA520', wraps:'#F5DEB3', mask:'#FFD700', eyes:'#00FF00', gems:'#FF0000', scepter:'#8B7355' }
    },
    { id:117, name:'Clockwork', types:['steel','psychic'], baseStats:{hp:65,atk:55,def:80,spatk:85,spdef:80,spd:75}, expGroup:'medium_slow', catchRate:45,
      desc:'Un automate ancien qui manipule le temps avec ses engrenages.',
      learnset:{1:['metalclaw','confusion'],10:['irondefense'],16:['psybeam'],22:['flashcannon'],28:['psychic'],34:['ironhead'],40:['calmmind'],46:['futuresight']},
      colors:{ body:'#B8860B', gears:'#FFD700', core:'#4169E1', eyes:'#00BFFF', hands:'#C0C0C0', numbers:'#2F2F2F' }
    },
    { id:118, name:'Lianore', types:['grass','dragon'], baseStats:{hp:75,atk:85,def:70,spatk:80,spdef:65,spd:80}, expGroup:'medium_slow', catchRate:45,
      desc:'Un dragon végétal qui protège la forêt tropicale.',
      learnset:{1:['vinewhip','dragonbreath'],10:['razorleaf'],16:['dragonclaw'],22:['leafblade'],28:['dragonpulse'],34:['seedbomb'],40:['dragondance'],46:['solarbeam']},
      colors:{ body:'#228B22', scales:'#006400', leaves:'#32CD32', wings:'#90EE90', eyes:'#FF4500', vines:'#004D00', flowers:'#FF69B4' }
    },
    { id:119, name:'Titanik', types:['steel','water'], baseStats:{hp:85,atk:90,def:100,spatk:65,spdef:75,spd:45}, expGroup:'medium_slow', catchRate:30,
      desc:'Un cuirassé vivant qui patrouille les fonds marins.',
      learnset:{1:['metalclaw','watergun'],10:['irondefense'],16:['aquajet'],22:['ironhead'],28:['surf'],34:['flashcannon'],40:['hydropump'],46:['meteormash']},
      colors:{ body:'#4A4A4A', hull:'#696969', turrets:'#808080', porthole:'#4682B4', eyes:'#FFD700', wake:'#87CEEB' }
    },
    { id:120, name:'Nébulon', types:['dark','psychic'], baseStats:{hp:60,atk:50,def:55,spatk:90,spdef:70,spd:85}, expGroup:'medium_slow', catchRate:60,
      evolvesTo:121, evolveLevel:42, desc:'Un être de ténèbres psychiques qui altère la réalité.',
      learnset:{1:['confusion','pursuit'],10:['psybeam'],16:['darkpulse'],22:['psychic'],28:['nastyplot'],34:['shadowball'],40:['calmmind']},
      colors:{ body:'#2C1654', aura:'#9400D3', eyes:'#FF69B4', tentacles:'#4B0082', core:'#E6E6FA', void:'#000000' }
    },
    { id:121, name:'Dimensior', types:['dark','psychic'], baseStats:{hp:80,atk:65,def:70,spatk:120,spdef:90,spd:100}, expGroup:'medium_slow', catchRate:20,
      desc:'Il peut ouvrir des portails vers d\'autres dimensions avec son esprit.',
      learnset:{1:['confusion','pursuit','psybeam','darkpulse'],42:['psychic'],48:['darkpulse'],54:['futuresight'],60:['nastyplot'],66:['hyperbeam']},
      colors:{ body:'#1A0033', portals:'#9400D3', eyes:'#FF0000', crown:'#FFD700', void:'#000000', stars:'#FFFFFF' }
    },
    // Fill remaining with diverse Pokemon
    { id:122, name:'Aérocanth', types:['flying','dragon'], baseStats:{hp:70,atk:80,def:65,spatk:80,spdef:65,spd:90}, expGroup:'medium_fast', catchRate:45,
      desc:'Un dragon aérien qui plane dans la stratosphère.',
      learnset:{1:['gust','dragonbreath'],12:['wingattack'],20:['dragonpulse'],28:['airslash'],36:['dragondance'],44:['hurricane'],52:['dracometeor']},
      colors:{ body:'#87CEEB', wings:'#4169E1', scales:'#00BFFF', eyes:'#FFD700', crest:'#1E90FF' }
    },
    { id:123, name:'Nymphali', types:['fairy'], baseStats:{hp:60,atk:45,def:55,spatk:80,spdef:75,spd:60}, expGroup:'medium_fast', catchRate:100,
      evolvesTo:124, evolveLevel:30, desc:'Une fée espiègle des jardins enchantés.',
      learnset:{1:['fairywind','charm'],8:['drainingkiss'],16:['dazzlinggleam'],24:['moonblast'],32:['moonlight']},
      colors:{ body:'#FFB6C1', wings:'#FF69B4', eyes:'#4B0082', crown:'#FFD700', dress:'#FFFFF0' }
    },
    { id:124, name:'Enchantra', types:['fairy','psychic'], baseStats:{hp:80,atk:55,def:70,spatk:110,spdef:100,spd:70}, expGroup:'medium_fast', catchRate:45,
      desc:'La reine des fées. Sa magie peut transformer la réalité.',
      learnset:{1:['fairywind','charm','confusion'],30:['moonblast'],36:['psychic'],42:['calmmind'],48:['dazzlinggleam'],54:['futuresight'],60:['moonlight']},
      colors:{ body:'#FF69B4', crown:'#FFD700', wings:'#E6E6FA', eyes:'#4B0082', gown:'#DDA0DD', scepter:'#C0C0C0', gems:'#FF0000' }
    },
    { id:125, name:'Tonnark', types:['electric','dark'], baseStats:{hp:70,atk:80,def:60,spatk:80,spdef:60,spd:90}, expGroup:'medium_fast', catchRate:60,
      desc:'Un loup de foudre noire qui rôde dans les nuits d\'orage.',
      learnset:{1:['thundershock','bite'],10:['spark'],16:['pursuit'],22:['thunderbolt'],28:['crunch'],34:['wildcharge'],40:['darkpulse'],46:['thunder']},
      colors:{ body:'#2C2C2C', bolts:'#FFD700', eyes:'#FF0000', mane:'#4A4A4A', fangs:'#FFFFFF', marks:'#DAA520' }
    },
    { id:126, name:'Flocon', types:['ice','water'], baseStats:{hp:55,atk:40,def:50,spatk:65,spdef:60,spd:55}, expGroup:'medium_fast', catchRate:120,
      evolvesTo:127, evolveLevel:32, desc:'Un petit flocon de neige vivant qui danse dans le vent.',
      learnset:{1:['tackle','iceshard'],8:['watergun'],14:['aurorabeam'],20:['icebeam'],26:['surf'],32:['blizzard']},
      colors:{ body:'#E0FFFF', crystal:'#87CEEB', eyes:'#0000CD', tips:'#FFFFFF', glow:'#ADD8E6' }
    },
    { id:127, name:'Cryophare', types:['ice','water'], baseStats:{hp:80,atk:55,def:75,spatk:100,spdef:85,spd:70}, expGroup:'medium_fast', catchRate:45,
      desc:'Un phare de glace vivant qui guide les navires perdus dans la tempête.',
      learnset:{1:['tackle','iceshard','watergun','aurorabeam'],32:['hydropump'],38:['blizzard'],44:['flashcannon'],50:['icebeam'],56:['surf']},
      colors:{ body:'#B0E0E6', light:'#FFFF00', ice:'#00CED1', base:'#4682B4', eyes:'#000080', beam:'#FFD700' }
    },
    { id:128, name:'Scorpik', types:['poison','ground'], baseStats:{hp:55,atk:70,def:60,spatk:50,spdef:50,spd:65}, expGroup:'medium_fast', catchRate:100,
      evolvesTo:129, evolveLevel:34, desc:'Un scorpion du désert au dard venimeux.',
      learnset:{1:['poisonsting','mudslap'],8:['bite'],14:['mudshot'],20:['poisonjab'],26:['dig'],32:['earthquake']},
      colors:{ body:'#DAA520', pincers:'#B8860B', stinger:'#8B008B', eyes:'#FF0000', legs:'#C2B280' }
    },
    { id:129, name:'Scorpirak', types:['poison','ground'], baseStats:{hp:75,atk:100,def:80,spatk:65,spdef:65,spd:85}, expGroup:'medium_fast', catchRate:45,
      desc:'Son dard contient assez de venin pour terrasser un Maristorm.',
      learnset:{1:['poisonsting','mudslap','bite','mudshot'],34:['earthquake'],40:['poisonjab'],46:['crunch'],52:['sludgebomb'],58:['stoneedge']},
      colors:{ body:'#8B7355', pincers:'#4A3728', stinger:'#800080', armor:'#696969', eyes:'#FF4500', tail:'#6B4E3D' }
    },
    { id:130, name:'Sirènix', types:['water','fairy'], baseStats:{hp:80,atk:55,def:65,spatk:95,spdef:90,spd:75}, expGroup:'medium_slow', catchRate:45,
      desc:'Une sirène enchanteresse dont le chant ensorcelle les marins.',
      learnset:{1:['watergun','fairywind'],10:['bubble'],16:['drainingkiss'],22:['surf'],28:['moonblast'],34:['icebeam'],40:['hydropump'],46:['moonlight']},
      colors:{ body:'#FF69B4', tail:'#4682B4', hair:'#FFD700', eyes:'#4B0082', scales:'#00CED1', shell:'#FFA07A' }
    },
    { id:131, name:'Titanox', types:['steel','dragon'], baseStats:{hp:85,atk:100,def:110,spatk:80,spdef:75,spd:60}, expGroup:'slow', catchRate:25,
      desc:'Un dragon cuirassé d\'acier trempé. Sa force est légendaire.',
      learnset:{1:['metalclaw','dragonbreath'],12:['ironhead'],20:['dragonclaw'],28:['flashcannon'],36:['dragonpulse'],44:['meteormash'],52:['outrage'],60:['hyperbeam']},
      colors:{ body:'#4A4A4A', armor:'#C0C0C0', scales:'#708090', eyes:'#FF4500', wings:'#696969', claws:'#DAA520' }
    },
    { id:132, name:'Ombragon', types:['dragon','ghost'], baseStats:{hp:75,atk:85,def:70,spatk:95,spdef:75,spd:95}, expGroup:'slow', catchRate:25,
      desc:'Un dragon des ombres qui existe entre le monde des vivants et des morts.',
      learnset:{1:['dragonbreath','lick'],12:['shadowclaw'],20:['dragonpulse'],28:['phantomforce'],36:['shadowball'],44:['outrage'],52:['dracometeor'],60:['destiny_bond']},
      colors:{ body:'#2C1654', smoke:'#4B0082', eyes:'#FF0000', wings:'#1A0033', claws:'#C0C0C0', aura:'#8A2BE2' }
    },
    { id:133, name:'Oroboa', types:['ground','dark'], baseStats:{hp:80,atk:90,def:75,spatk:55,spdef:65,spd:75}, expGroup:'medium_fast', catchRate:60,
      desc:'Un serpent colossal qui vit dans les profondeurs de la terre.',
      learnset:{1:['bite','mudslap'],10:['crunch'],18:['dig'],24:['earthquake'],30:['darkpulse'],36:['ironhead'],42:['outrage'],48:['stoneedge']},
      colors:{ body:'#8B7355', belly:'#DAA520', scales:'#4A3728', eyes:'#FFD700', fangs:'#FFFFFF', markings:'#2C1810' }
    },
    { id:134, name:'Luméra', types:['electric','fairy'], baseStats:{hp:65,atk:50,def:55,spatk:90,spdef:80,spd:90}, expGroup:'medium_fast', catchRate:60,
      desc:'Un être de lumière pure qui éclaire les nuits les plus sombres.',
      learnset:{1:['thundershock','fairywind'],10:['spark'],16:['drainingkiss'],22:['thunderbolt'],28:['dazzlinggleam'],34:['moonblast'],40:['thunder'],46:['moonlight']},
      colors:{ body:'#FFD700', wings:'#FFFFFF', aura:'#FFFF00', eyes:'#4B0082', core:'#FFF8DC', halo:'#F0E68C' }
    },
    { id:135, name:'Mécanox', types:['steel','electric'], baseStats:{hp:70,atk:80,def:90,spatk:80,spdef:70,spd:70}, expGroup:'medium_fast', catchRate:45,
      desc:'Un robot ancien réactivé par la foudre. Loyal et puissant.',
      learnset:{1:['metalclaw','thundershock'],10:['irondefense'],16:['spark'],22:['flashcannon'],28:['thunderbolt'],34:['ironhead'],40:['wildcharge'],46:['meteormash']},
      colors:{ body:'#808080', plates:'#C0C0C0', core:'#00BFFF', eyes:'#FF4500', bolts:'#FFD700', sparks:'#FFFF00' }
    },

    // === PSEUDO-LEGENDARIES (136-140) ===
    { id:136, name:'Wyvernox', types:['dragon','dark'], baseStats:{hp:90,atk:110,def:80,spatk:100,spdef:80,spd:95}, expGroup:'slow', catchRate:15,
      desc:'Une wyverne sombre dont la seule présence fait fuir les autres Pokémon.',
      learnset:{1:['bite','dragonbreath'],14:['dragonclaw'],22:['crunch'],30:['darkpulse'],38:['dragonpulse'],46:['dragondance'],54:['outrage'],62:['dracometeor']},
      colors:{ body:'#2C1654', wings:'#4B0082', belly:'#696969', eyes:'#FF0000', claws:'#C0C0C0', horns:'#4A4A4A', aura:'#8A2BE2' }
    },
    { id:137, name:'Leviathan', types:['water','dragon'], baseStats:{hp:95,atk:105,def:90,spatk:100,spdef:85,spd:80}, expGroup:'slow', catchRate:15,
      desc:'Un monstre marin gigantesque. Les anciennes civilisations le vénéraient comme un dieu.',
      learnset:{1:['watergun','dragonbreath'],14:['aquajet'],22:['dragonpulse'],30:['surf'],38:['dragondance'],46:['hydropump'],54:['outrage'],62:['dracometeor']},
      colors:{ body:'#00008B', scales:'#0000CD', belly:'#4682B4', fins:'#1E3A5F', eyes:'#FFD700', whiskers:'#C0C0C0', crest:'#00CED1' }
    },
    { id:138, name:'Phoenixia', types:['fire','fairy'], baseStats:{hp:85,atk:80,def:75,spatk:110,spdef:90,spd:105}, expGroup:'slow', catchRate:15,
      desc:'Un phénix sacré qui renaît de ses cendres. Symbole d\'espoir pour Novara.',
      learnset:{1:['ember','fairywind'],14:['flamethrower'],22:['dazzlinggleam'],30:['moonblast'],38:['fireblast'],46:['roost'],54:['overheat'],62:['moonlight']},
      colors:{ body:'#FF4500', wings:'#FFD700', tail:'#FF8C00', crest:'#FFFF00', eyes:'#4B0082', aura:'#FF69B4', feathers:'#FF6347' }
    },
    { id:139, name:'Gargantor', types:['rock','steel'], baseStats:{hp:100,atk:110,def:120,spatk:60,spdef:80,spd:50}, expGroup:'slow', catchRate:15,
      desc:'Un titan de pierre et d\'acier. Il est le gardien des montagnes de Novara.',
      learnset:{1:['rockthrow','metalclaw'],14:['ironhead'],22:['rockslide'],30:['earthquake'],38:['irondefense'],46:['stoneedge'],54:['meteormash'],62:['hyperbeam']},
      colors:{ body:'#696969', armor:'#A9A9A9', crystals:'#FFD700', eyes:'#00FF00', runes:'#4169E1', fists:'#4A4A4A' }
    },
    { id:140, name:'Psydragon', types:['dragon','psychic'], baseStats:{hp:88,atk:95,def:80,spatk:110,spdef:85,spd:100}, expGroup:'slow', catchRate:15,
      desc:'Un dragon cosmique qui voyage entre les dimensions par la pensée.',
      learnset:{1:['confusion','dragonbreath'],14:['psybeam'],22:['dragonclaw'],30:['psychic'],38:['dragonpulse'],46:['calmmind'],54:['dracometeor'],62:['futuresight']},
      colors:{ body:'#7B68EE', scales:'#9370DB', eyes:'#FF69B4', gems:'#FFD700', wings:'#E6E6FA', aura:'#4B0082', horns:'#C0C0C0' }
    },

    // === LEGENDARIES (141-150) ===
    { id:141, name:'Solarkos', types:['fire','psychic'], baseStats:{hp:100,atk:90,def:90,spatk:130,spdef:100,spd:110}, expGroup:'slow', catchRate:3,
      desc:'Le Pokémon du Soleil. Il a créé la lumière de Novara selon les légendes.',
      learnset:{1:['ember','confusion'],20:['flamethrower'],30:['psychic'],40:['fireblast'],50:['calmmind'],60:['overheat'],70:['futuresight'],80:['hyperbeam']},
      colors:{ body:'#FFD700', mane:'#FF4500', wings:'#FF8C00', eyes:'#FF0000', core:'#FFFFFF', aura:'#FFFF00', crown:'#FF6347' }
    },
    { id:142, name:'Lunarkos', types:['dark','fairy'], baseStats:{hp:100,atk:90,def:90,spatk:130,spdef:110,spd:100}, expGroup:'slow', catchRate:3,
      desc:'Le Pokémon de la Lune. Il a tissé les rêves des habitants de Novara.',
      learnset:{1:['bite','fairywind'],20:['darkpulse'],30:['moonblast'],40:['calmmind'],50:['nastyplot'],60:['dazzlinggleam'],70:['phantomforce'],80:['hyperbeam']},
      colors:{ body:'#191970', crescent:'#C0C0C0', wings:'#4B0082', eyes:'#FF69B4', aura:'#E6E6FA', stars:'#FFD700', crown:'#9370DB' }
    },
    { id:143, name:'Terrakos', types:['ground','steel'], baseStats:{hp:110,atk:120,def:120,spatk:80,spdef:90,spd:80}, expGroup:'slow', catchRate:3,
      desc:'Le Pokémon de la Terre. Il a sculpté les montagnes et les vallées de Novara.',
      learnset:{1:['tackle','mudslap'],20:['earthquake'],30:['ironhead'],40:['stoneedge'],50:['irondefense'],60:['flashcannon'],70:['superpower'],80:['hyperbeam']},
      colors:{ body:'#8B4513', armor:'#B8860B', crystals:'#FFD700', eyes:'#00FF00', runes:'#FF4500', plates:'#696969', core:'#FF8C00' }
    },
    { id:144, name:'Aérokos', types:['flying','electric'], baseStats:{hp:90,atk:100,def:80,spatk:110,spdef:90,spd:130}, expGroup:'slow', catchRate:3,
      desc:'Le Pokémon du Ciel. Il contrôle les vents et les tempêtes de Novara.',
      learnset:{1:['gust','thundershock'],20:['thunderbolt'],30:['hurricane'],40:['thunder'],50:['roost'],60:['bravebird'],70:['wildcharge'],80:['hyperbeam']},
      colors:{ body:'#87CEEB', wings:'#FFD700', bolts:'#FFFF00', crest:'#00BFFF', eyes:'#FF4500', tail:'#4169E1', aura:'#E0FFFF' }
    },
    { id:145, name:'Aquakos', types:['water','ice'], baseStats:{hp:100,atk:90,def:100,spatk:120,spdef:100,spd:90}, expGroup:'slow', catchRate:3,
      desc:'Le Pokémon des Océans. Il commande les marées et les courants de Novara.',
      learnset:{1:['watergun','iceshard'],20:['surf'],30:['icebeam'],40:['hydropump'],50:['calmmind'],60:['blizzard'],70:['aquatail'],80:['hyperbeam']},
      colors:{ body:'#1E90FF', fins:'#00CED1', ice:'#E0FFFF', eyes:'#FFD700', crown:'#87CEEB', belly:'#4682B4', aura:'#00BFFF' }
    },
    { id:146, name:'Chronokos', types:['psychic','steel'], baseStats:{hp:100,atk:80,def:100,spatk:120,spdef:110,spd:90}, expGroup:'slow', catchRate:3,
      desc:'Le maître du temps. Il peut voyager entre le passé et le futur.',
      learnset:{1:['confusion','metalclaw'],20:['psychic'],30:['flashcannon'],40:['futuresight'],50:['calmmind'],60:['ironhead'],70:['meteormash'],80:['hyperbeam']},
      colors:{ body:'#4169E1', gears:'#FFD700', eyes:'#FF69B4', armor:'#C0C0C0', core:'#00BFFF', runes:'#E6E6FA', clock:'#B8860B' }
    },
    { id:147, name:'Créatix', types:['dragon','fairy'], baseStats:{hp:120,atk:100,def:100,spatk:120,spdef:100,spd:100}, expGroup:'slow', catchRate:3,
      desc:'Le Créateur de Novara. On dit qu\'il a donné naissance à toute la région.',
      learnset:{1:['dragonbreath','fairywind'],20:['dragonpulse'],30:['moonblast'],40:['dracometeor'],50:['calmmind'],60:['outrage'],70:['dazzlinggleam'],80:['hyperbeam']},
      colors:{ body:'#FFFFFF', wings:'#FFD700', scales:'#E6E6FA', eyes:'#FF0000', gems:['#FF0000','#0000FF','#00FF00'], aura:'#F0E68C', crown:'#FFD700' }
    },
    { id:148, name:'Néantis', types:['dark','ghost'], baseStats:{hp:100,atk:120,def:80,spatk:120,spdef:80,spd:100}, expGroup:'slow', catchRate:3,
      desc:'Le Destructeur. Il représente le vide et le néant absolu.',
      learnset:{1:['bite','lick'],20:['darkpulse'],30:['shadowball'],40:['phantomforce'],50:['nastyplot'],60:['crunch'],70:['outrage'],80:['hyperbeam']},
      colors:{ body:'#000000', aura:'#4B0082', eyes:'#FF0000', cracks:'#8A2BE2', void:'#1A0033', claws:'#C0C0C0', crown:'#9400D3' }
    },
    { id:149, name:'Mythora', types:['fairy','psychic'], baseStats:{hp:100,atk:60,def:80,spatk:135,spdef:120,spd:105}, expGroup:'slow', catchRate:3,
      desc:'Le Pokémon des Mythes. Il transforme les rêves en réalité.',
      learnset:{1:['fairywind','confusion'],20:['moonblast'],30:['psychic'],40:['calmmind'],50:['dazzlinggleam'],60:['futuresight'],70:['moonlight'],80:['hyperbeam']},
      colors:{ body:'#FF69B4', wings:'#E6E6FA', crown:'#FFD700', eyes:'#4B0082', gems:'#00BFFF', tail:'#DDA0DD', aura:'#FFFACD' }
    },
    { id:150, name:'Eternax', types:['dragon','steel'], baseStats:{hp:110,atk:110,def:110,spatk:110,spdef:110,spd:110}, expGroup:'slow', catchRate:3,
      desc:'Le Pokémon Éternel. Ni créé ni détruit, il existe depuis toujours.',
      learnset:{1:['metalclaw','dragonbreath'],20:['ironhead'],30:['dragonpulse'],40:['flashcannon'],50:['dragondance'],60:['dracometeor'],70:['meteormash'],80:['hyperbeam']},
      colors:{ body:'#C0C0C0', scales:'#FFD700', wings:'#4169E1', eyes:'#FF0000', core:'#FFFFFF', armor:'#808080', aura:'#7B68EE', runes:'#FF8C00' }
    }
];

// Helper to get Pokemon by ID
function getPokemonById(id) {
    return POKEDEX.find(p => p.id === id);
}

// Get moves a Pokemon knows at a given level
function getMovesAtLevel(pokemonData, level) {
    const moves = [];
    const learnset = pokemonData.learnset;
    for (const [lvl, moveList] of Object.entries(learnset)) {
        if (parseInt(lvl) <= level) {
            for (const move of moveList) {
                if (!moves.includes(move)) {
                    moves.push(move);
                }
            }
        }
    }
    // Keep only last 4 moves (most recent)
    return moves.slice(-4);
}

// Create a Pokemon instance
function createPokemon(id, level, isWild = true) {
    const data = getPokemonById(id);
    if (!data) return null;

    const natureNames = Object.keys(NATURES);
    const nature = natureNames[Math.floor(Math.random() * natureNames.length)];
    const ivs = {
        hp: Math.floor(Math.random() * 32),
        atk: Math.floor(Math.random() * 32),
        def: Math.floor(Math.random() * 32),
        spatk: Math.floor(Math.random() * 32),
        spdef: Math.floor(Math.random() * 32),
        spd: Math.floor(Math.random() * 32)
    };

    const moves = getMovesAtLevel(data, level);
    const expGroup = EXP_GROUPS[data.expGroup] || EXP_GROUPS.medium_fast;
    const totalExp = expGroup(level);

    const pokemon = {
        id: data.id,
        name: data.name,
        nickname: null,
        level: level,
        nature: nature,
        ivs: ivs,
        evs: { hp: 0, atk: 0, def: 0, spatk: 0, spdef: 0, spd: 0 },
        moves: moves.map(m => ({ id: m, ppUsed: 0 })),
        exp: totalExp,
        friendship: isWild ? 70 : 70,
        status: null,
        isShiny: Math.random() < 1/4096,
        caughtBall: 'pokeball',
        ot: isWild ? null : 'Player'
    };

    // Calculate stats
    recalcStats(pokemon);
    pokemon.currentHp = pokemon.stats.hp;

    return pokemon;
}

function recalcStats(pokemon) {
    const data = getPokemonById(pokemon.id);
    const base = data.baseStats;
    const iv = pokemon.ivs;
    const ev = pokemon.evs;
    const level = pokemon.level;
    const nature = NATURES[pokemon.nature] || {};

    const calcStat = (stat, baseStat) => {
        if (stat === 'hp') {
            return Math.floor(((2 * baseStat + iv.hp + Math.floor(ev.hp / 4)) * level) / 100) + level + 10;
        }
        const natMod = nature[stat] || 1;
        return Math.floor((Math.floor(((2 * baseStat + iv[stat] + Math.floor(ev[stat] / 4)) * level) / 100) + 5) * natMod);
    };

    pokemon.stats = {
        hp: calcStat('hp', base.hp),
        atk: calcStat('atk', base.atk),
        def: calcStat('def', base.def),
        spatk: calcStat('spatk', base.spatk),
        spdef: calcStat('spdef', base.spdef),
        spd: calcStat('spd', base.spd)
    };

    pokemon.types = data.types;
}

// Check evolution
function checkEvolution(pokemon) {
    const data = getPokemonById(pokemon.id);
    if (data.evolvesTo && data.evolveLevel && pokemon.level >= data.evolveLevel) {
        return data.evolvesTo;
    }
    return null;
}

// Level up
function addExp(pokemon, amount) {
    pokemon.exp += amount;
    const data = getPokemonById(pokemon.id);
    const expGroup = EXP_GROUPS[data.expGroup] || EXP_GROUPS.medium_fast;
    const events = [];

    while (pokemon.level < 100) {
        const nextLevelExp = expGroup(pokemon.level + 1);
        if (pokemon.exp >= nextLevelExp) {
            const oldHp = pokemon.stats.hp;
            pokemon.level++;
            recalcStats(pokemon);
            const hpGain = pokemon.stats.hp - oldHp;
            pokemon.currentHp = Math.min(pokemon.currentHp + hpGain, pokemon.stats.hp);

            events.push({ type: 'levelup', level: pokemon.level });

            // Check for new moves
            const learnset = data.learnset;
            if (learnset[pokemon.level]) {
                for (const moveId of learnset[pokemon.level]) {
                    if (!pokemon.moves.find(m => m.id === moveId)) {
                        if (pokemon.moves.length < 4) {
                            pokemon.moves.push({ id: moveId, ppUsed: 0 });
                            events.push({ type: 'newmove', move: moveId });
                        } else {
                            events.push({ type: 'newmove_full', move: moveId });
                        }
                    }
                }
            }

            // Check evolution
            const evoId = checkEvolution(pokemon);
            if (evoId) {
                events.push({ type: 'evolve', from: pokemon.id, to: evoId });
            }
        } else {
            break;
        }
    }

    return events;
}

function evolvePokemon(pokemon, newId) {
    const oldName = pokemon.name;
    const newData = getPokemonById(newId);
    pokemon.id = newId;
    pokemon.name = newData.name;
    if (!pokemon.nickname || pokemon.nickname === oldName) {
        pokemon.nickname = null;
    }
    recalcStats(pokemon);
    pokemon.currentHp = Math.min(pokemon.currentHp, pokemon.stats.hp);
}

function getExpPercent(pokemon) {
    const data = getPokemonById(pokemon.id);
    const expGroup = EXP_GROUPS[data.expGroup] || EXP_GROUPS.medium_fast;
    const currLevelExp = expGroup(pokemon.level);
    const nextLevelExp = expGroup(pokemon.level + 1);
    return (pokemon.exp - currLevelExp) / (nextLevelExp - currLevelExp);
}

function calcExpGain(defeatedPokemon, isTrainer = false) {
    const data = getPokemonById(defeatedPokemon.id);
    const base = Object.values(data.baseStats).reduce((a, b) => a + b, 0) / 6;
    const trainerBonus = isTrainer ? 1.5 : 1;
    return Math.floor((base * defeatedPokemon.level * trainerBonus) / 7);
}
