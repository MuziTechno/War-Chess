/**
 * ChessPiece.js
 * Základní abstraktní třída pro všechny šachové figurky
 */
export class ChessPiece {
    /**
     * @constructor
     * @param {string} type - Typ figurky
     * @param {string} color - Barva figurky ('bila', 'cerna')
     * @param {Object} stats - Statistiky figurky (hp, maxHp, dmg)
     */
    constructor(type, color, stats) {
        this.type = type;
        this.color = color;
        this.hp = stats.hp;
        this.maxHp = stats.hp;
        this.dmg = stats.dmg;
        this.hasMoved = false;
        this.ap = 0;
    }

    /**
     * Kontroluje, zda se figurka může pohnout na danou pozici
     * @param {number} fromX - Počáteční X souřadnice
     * @param {number} fromY - Počáteční Y souřadnice
     * @param {number} toX - Cílová X souřadnice
     * @param {number} toY - Cílová Y souřadnice
     * @param {BoardModel} board - Šachovnice
     * @returns {boolean} Může se figurka pohnout?
     */
    canMoveTo(fromX, fromY, toX, toY, board) {
        // Musí být implementováno v podtřídách
        throw new Error('Metoda canMoveTo musí být implementována v podtřídě');
    }

    /**
     * Kontroluje, zda figurka může zaútočit na danou pozici
     * @param {number} fromX - Počáteční X souřadnice
     * @param {number} fromY - Počáteční Y souřadnice
     * @param {number} toX - Cílová X souřadnice
     * @param {number} toY - Cílová Y souřadnice
     * @param {BoardModel} board - Šachovnice
     * @returns {boolean} Může figurka zaútočit?
     */
    canAttack(fromX, fromY, toX, toY, board) {
        // Výchozí implementace, může být přepsána v podtřídách
        const target = board.getPieceAt(toX, toY);
        return target && target.color !== this.color && this.isValidAttackPosition(fromX, fromY, toX, toY);
    }

    /**
     * Kontroluje, zda je útok na danou pozici platný
     * @param {number} fromX - Počáteční X souřadnice
     * @param {number} fromY - Počáteční Y souřadnice
     * @param {number} toX - Cílová X souřadnice
     * @param {number} toY - Cílová Y souřadnice
     * @returns {boolean} Je útok platný?
     */
    isValidAttackPosition(fromX, fromY, toX, toY) {
        // Výchozí implementace pro útok na sousední pole
        return Math.abs(toX - fromX) <= 1 && Math.abs(toY - fromY) <= 1;
    }

    /**
     * Získá pole sousedící s danou pozicí
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     * @param {number} boardSize - Velikost šachovnice
     * @returns {Array} Pole souřadnic [x, y]
     */
    getAdjacentSquares(x, y, boardSize = 8) {
        const squares = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue; 
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
                    squares.push([nx, ny]);
                }
            }
        }
        return squares;
    }

    /**
     * Vytvoří kopii figurky
     * @returns {ChessPiece} Kopie figurky
     */
    clone() {
        const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        return clone;
    }

    /**
     * Vrátí textovou reprezentaci figurky
     * @returns {string} Textová reprezentace
     */
    toString() {
        return `${this.constructor.name}(${this.color}) HP:${this.hp}/${this.maxHp} DMG:${this.dmg}`;
    }
}