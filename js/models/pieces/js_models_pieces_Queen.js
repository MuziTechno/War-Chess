/**
 * Queen.js
 * Třída reprezentující královnu (Commissar) - pohyb jako střelec nebo věž, revive
 */
import { ChessPiece } from './ChessPiece.js';

export class Queen extends ChessPiece {
    /**
     * @constructor
     * @param {string} type - Typ figurky
     * @param {string} color - Barva figurky
     * @param {Object} stats - Statistiky figurky (hp, maxHp, dmg)
     */
    constructor(type, color, stats) {
        super(type, color, stats);
        this.reviveUsed = false; // Schopnost oživení ještě nebyla použita
    }

    /**
     * @override
     * Královna se může pohybovat diagonálně nebo ortogonálně
     */
    canMoveTo(fromX, fromY, toX, toY, board) {
        // Buď diagonála (jako střelec) nebo ortogonálně (jako věž)
        const isDiagonal = Math.abs(toX - fromX) === Math.abs(toY - fromY);
        const isOrthogonal = (fromX === toX || fromY === toY);
        
        if (!isDiagonal && !isOrthogonal) {
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
     * Klon včetně stavu schopnosti oživení
     */
    clone() {
        const clone = super.clone();
        clone.reviveUsed = this.reviveUsed;
        return clone;
    }
}