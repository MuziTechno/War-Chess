/**
 * King.js
 * Třída reprezentující krále (Lord Solar) - pohyb o 1 pole, aura
 */
import { ChessPiece } from './ChessPiece.js';

export class King extends ChessPiece {
    /**
     * @constructor
     * @param {string} type - Typ figurky
     * @param {string} color - Barva figurky
     * @param {Object} stats - Statistiky figurky (hp, maxHp, dmg)
     */
    constructor(type, color, stats) {
        super(type, color, stats);
        this.bonusHp = 0; // Bonusové HP z aury
    }

    /**
     * @override
     * Král se může pohybovat o 1 pole ve všech směrech
     */
    canMoveTo(fromX, fromY, toX, toY, board) {
        // Pouze o 1 pole ve všech směrech
        if (Math.abs(toX - fromX) > 1 || Math.abs(toY - fromY) > 1) {
            return false;
        }
        
        // Cíl musí být prázdný
        return board.getPieceAt(toX, toY) === null;
    }

    /**
     * @override
     * Klon včetně stavu bonusových HP
     */
    clone() {
        const clone = super.clone();
        clone.bonusHp = this.bonusHp;
        return clone;
    }
}