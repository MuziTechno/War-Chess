/**
 * Knight.js
 * Třída reprezentující jezdce (Knight Armiger) - pohyb do L, útok a léčení
 */
import { ChessPiece } from './ChessPiece.js';

export class Knight extends ChessPiece {
    /**
     * @constructor
     * @param {string} type - Typ figurky
     * @param {string} color - Barva figurky
     * @param {Object} stats - Statistiky figurky (hp, maxHp, dmg)
     */
    constructor(type, color, stats) {
        super(type, color, stats);
    }

    /**
     * @override
     * Jezdec se pohybuje do L (2+1)
     */
    canMoveTo(fromX, fromY, toX, toY, board) {
        // Pohyb do L (2 v jednom směru a 1 v kolmém směru)
        const dx = Math.abs(toX - fromX);
        const dy = Math.abs(toY - fromY);
        
        if (!((dx === 2 && dy === 1) || (dx === 1 && dy === 2))) {
            return false;
        }
        
        // Cíl musí být prázdný
        return board.getPieceAt(toX, toY) === null;
    }

    /**
     * @override
     * Jezdec může útočit pouze na sousední pole (klasická implementace)
     */
    isValidAttackPosition(fromX, fromY, toX, toY) {
        return Math.abs(toX - fromX) <= 1 && Math.abs(toY - fromY) <= 1;
    }

    /**
     * Kontroluje, zda může jezdec léčit figurku na dané pozici
     * @param {number} fromX - Počáteční X souřadnice
     * @param {number} fromY - Počáteční Y souřadnice
     * @param {number} toX - Cílová X souřadnice
     * @param {number} toY - Cílová Y souřadnice
     * @param {BoardModel} board - Šachovnice
     * @returns {boolean} Může jezdec léčit?
     */
    canHeal(fromX, fromY, toX, toY, board) {
        const target = board.getPieceAt(toX, toY);
        
        // Cíl musí být spojenecká figurka s méně než maximálním HP
        return target && target.color === this.color && target.hp < target.maxHp && 
               this.isValidAttackPosition(fromX, fromY, toX, toY);
    }
}