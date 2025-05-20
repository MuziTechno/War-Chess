/**
 * Rook.js
 * Třída reprezentující věž (Tank) - pohyb po řadách a sloupcích, pancíř
 */
import { ChessPiece } from './ChessPiece.js';

export class Rook extends ChessPiece {
    /**
     * @constructor
     * @param {string} type - Typ figurky
     * @param {string} color - Barva figurky
     * @param {Object} stats - Statistiky figurky (hp, maxHp, dmg)
     */
    constructor(type, color, stats) {
        super(type, color, stats);
        this.armorActive = true; // Pancíř je zpočátku aktivní
    }

    /**
     * @override
     * Věž se může pohybovat pouze ortogonálně
     */
    canMoveTo(fromX, fromY, toX, toY, board) {
        // Musí být na stejné řadě nebo sloupci
        if (fromX !== toX && fromY !== toY) {
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
     * Věž může útočit na sousední pole (klasická implementace)
     */
    isValidAttackPosition(fromX, fromY, toX, toY) {
        return Math.abs(toX - fromX) <= 1 && Math.abs(toY - fromY) <= 1;
    }

    /**
     * @override
     * Klon včetně stavu pancíře
     */
    clone() {
        const clone = super.clone();
        clone.armorActive = this.armorActive;
        return clone;
    }
}