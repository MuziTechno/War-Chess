/**
 * Pawn.js
 * Třída reprezentující pěšce (Servitor) - pohyb vpřed, útok vpřed a diagonálně
 */
import { ChessPiece } from './ChessPiece.js';
import { PLAYER_COLORS } from '../../constants/GameConstants.js';

export class Pawn extends ChessPiece {
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
     * Pěšec se může pohybovat o 1 pole vpřed (o 2 pokud ještě nešel)
     */
    canMoveTo(fromX, fromY, toX, toY, board) {
        // Určení směru podle barvy (bílý nahoru, černý dolů)
        const direction = (this.color === PLAYER_COLORS.WHITE) ? 1 : -1;
        
        // Pohyb vpřed o 1 pole
        if (fromX === toX && toY === fromY + direction) {
            return board.getPieceAt(toX, toY) === null;
        }
        
        // Pohyb vpřed o 2 pole (pouze pokud pěšec ještě nešel)
        if (!this.hasMoved && fromX === toX && toY === fromY + 2 * direction) {
            return board.getPieceAt(toX, toY) === null && 
                   board.getPieceAt(toX, fromY + direction) === null;
        }
        
        return false;
    }

    /**
     * @override
     * Pěšec může útočit vpřed i diagonálně
     */
    isValidAttackPosition(fromX, fromY, toX, toY) {
        const direction = (this.color === PLAYER_COLORS.WHITE) ? 1 : -1;
        
        // Útok vpřed
        if (fromX === toX && toY === fromY + direction) {
            return true;
        }
        
        // Útok diagonálně
        if (Math.abs(toX - fromX) === 1 && toY === fromY + direction) {
            return true;
        }
        
        return false;
    }
}