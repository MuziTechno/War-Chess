/**
 * Bishop.js
 * Třída reprezentující střelce (Sniper Scout) - pohyb a útok po diagonálách
 */
import { ChessPiece } from './ChessPiece.js';

export class Bishop extends ChessPiece {
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
     * Střelec se může pohybovat pouze diagonálně
     */
    canMoveTo(fromX, fromY, toX, toY, board) {
        // Musí být diagonální pohyb
        if (Math.abs(toX - fromX) !== Math.abs(toY - fromY)) {
            return false;
        }
        
        // Cíl musí být prázdný
        if (board.getPieceAt(toX, toY) !== null) {
            return false;
        }
        
        // Kontrola volné cesty
        return board.isPathClear(fromX, fromY, toX, toY);
    }

    /**
     * @override
     * Střelec může útočit na libovolnou figurku na diagonále
     */
    isValidAttackPosition(fromX, fromY, toX, toY) {
        // Musí být na stejné diagonále
        return Math.abs(toX - fromX) === Math.abs(toY - fromY);
    }

    /**
     * @override
     * Útok střelce - může zaútočit na libovolnou figurku na diagonále
     */
    canAttack(fromX, fromY, toX, toY, board) {
        const target = board.getPieceAt(toX, toY);
        if (!target || target.color === this.color || !this.isValidAttackPosition(fromX, fromY, toX, toY)) {
            return false;
        }
        
        // Kontrola volné cesty k cíli
        return board.isPathClear(fromX, fromY, toX, toY);
    }
}