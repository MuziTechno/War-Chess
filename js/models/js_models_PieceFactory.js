/**
 * PieceFactory.js
 * Továrna pro vytváření figurek podle typu
 */
import { Pawn } from './pieces/Pawn.js';
import { Bishop } from './pieces/Bishop.js';
import { Knight } from './pieces/Knight.js';
import { Rook } from './pieces/Rook.js';
import { Queen } from './pieces/Queen.js';
import { King } from './pieces/King.js';
import { PIECE_CONFIG } from '../constants/GameConstants.js';

/**
 * Tovární třída pro vytváření figurek podle typu
 */
export class PieceFactory {
    /**
     * Vytvoří novou instanci figurky podle typu
     * @param {string} type - Typ figurky ('pesec', 'strelec', ...)
     * @param {string} color - Barva figurky ('bila', 'cerna')
     * @returns {ChessPiece} Instance figurky
     */
    static createPiece(type, color) {
        const stats = PIECE_CONFIG[type];
        if (!stats) {
            throw new Error(`Neznámý typ figurky: ${type}`);
        }
        
        // Vytvoří instanci podle typu
        switch (type) {
            case 'pesec':
                return new Pawn(type, color, stats);
            case 'strelec':
                return new Bishop(type, color, stats);
            case 'jezdec':
                return new Knight(type, color, stats);
            case 'vez':
                return new Rook(type, color, stats);
            case 'kralovna':
                return new Queen(type, color, stats);
            case 'kral':
                return new King(type, color, stats);
            default:
                throw new Error(`Neimplementovaný typ figurky: ${type}`);
        }
    }
}