/**
 * GameConstants.js
 * Obsahuje veškeré konstanty a konfiguraci hry
 */

// Velikost šachovnice
export const BOARD_SIZE = 8;

// Typy speciálních akcí
export const SPECIAL_ACTIONS = {
    REVIVE: 'revive',
    HEAL: 'heal',
    ARMOR: 'armor',
    AURA: 'aura'
};

// Barvy hráčů
export const PLAYER_COLORS = {
    WHITE: 'bila',
    BLACK: 'cerna'
};

// Konfigurace figurek (typy, jména, symboly, statistiky)
export const PIECE_CONFIG = {
    pesec: { 
        name: "Servitor", 
        symbol: { bila: "🤖", cerna: "💀" }, 
        hp: 6,  
        dmg: 1,
        description: "Útok vpřed i diagonálně"
    },
    strelec: { 
        name: "Sniper Scout", 
        symbol: { bila: "🎯", cerna: "🔫" }, 
        hp: 8,  
        dmg: 2,
        description: "Útok na libovolnou diagonálu"
    },
    jezdec: { 
        name: "Knight Armiger", 
        symbol: { bila: "🐎", cerna: "🐴" }, 
        hp: 10, 
        dmg: 2,
        description: "Léčí spojence, pohyb do L"
    },
    vez: { 
        name: "Tank", 
        symbol: { bila: "🛡️", cerna: "🧱" }, 
        hp: 14, 
        dmg: 2,
        description: "Pancíř, pohyb ortogonálně"
    },
    kralovna: { 
        name: "Commissar", 
        symbol: { bila: "👑", cerna: "👹" }, 
        hp: 12, 
        dmg: 3,
        description: "Revival pěšce"
    },
    kral: { 
        name: "Lord Solar", 
        symbol: { bila: "⚡", cerna: "🔥" }, 
        hp: 16, 
        dmg: 2,
        description: "Aura v ohrožení"
    }
};

// Herní fáze
export const GAME_PHASES = {
    SELECTION: 'selection',
    MOVEMENT: 'movement',
    ACTION: 'action',
    SPECIAL: 'special',
    GAME_OVER: 'gameOver'
};

// CSS třídy pro zvýraznění
export const CSS_CLASSES = {
    SELECTED: 'selected',
    TANK_ARMOR: 'tank-armor',
    KING_AURA: 'king-aura',
    REVIVE_TARGET: 'revive-target',
    REVIVE_READY: 'revive-ready',
    BONUS: 'bonus'
};

// Směry na šachovnici
export const DIRECTIONS = {
    ORTHOGONAL: [
        [0, 1], [1, 0], [0, -1], [-1, 0] // Nahoru, vpravo, dolů, vlevo
    ],
    DIAGONAL: [
        [1, 1], [1, -1], [-1, -1], [-1, 1] // Diagonály
    ],
    KNIGHT: [
        [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2], [2, -1] // Jezdcovy tahy
    ],
    ALL: [
        [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1] // Všechny směry od krále
    ]
};