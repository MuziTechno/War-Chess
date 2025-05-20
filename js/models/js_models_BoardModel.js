/**
 * BoardModel.js
 * Model reprezentující šachovnici
 */
import { BOARD_SIZE } from '../constants/GameConstants.js';

export class BoardModel {
    /**
     * @constructor
     * @param {number} size - Velikost šachovnice (standardně 8x8)
     */
    constructor(size = BOARD_SIZE) {
        this.size = size;
        this.board = Array.from({ length: size }, () => Array(size).fill(null));
    }

    /**
     * Vyčistí šachovnici
     */
    clear() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.board[y][x] = null;
            }
        }
    }

    /**
     * Vrátí figurku na dané pozici
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     * @returns {ChessPiece|null} Figurka nebo null
     */
    getPieceAt(x, y) {
        return this.isValidPosition(x, y) ? this.board[y][x] : null;
    }

    /**
     * Umístí figurku na danou pozici
     * @param {ChessPiece} piece - Figurka
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     * @returns {boolean} Úspěch umístění
     */
    placePiece(piece, x, y) {
        if (this.isValidPosition(x, y)) {
            this.board[y][x] = piece;
            return true;
        }
        return false;
    }

    /**
     * Odstraní figurku z dané pozice
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     * @returns {ChessPiece|null} Odstraněná figurka nebo null
     */
    removePiece(x, y) {
        if (this.isValidPosition(x, y)) {
            const piece = this.board[y][x];
            this.board[y][x] = null;
            return piece;
        }
        return null;
    }

    /**
     * Přesune figurku z jedné pozice na druhou
     * @param {number} fromX - Původní X souřadnice
     * @param {number} fromY - Původní Y souřadnice
     * @param {number} toX - Cílová X souřadnice
     * @param {number} toY - Cílová Y souřadnice
     * @returns {boolean} Úspěch přesunu
     */
    movePiece(fromX, fromY, toX, toY) {
        if (!this.isValidPosition(fromX, fromY) || !this.isValidPosition(toX, toY)) {
            return false;
        }
        
        const piece = this.board[fromY][fromX];
        if (!piece) return false;
        
        this.board[toY][toX] = piece;
        this.board[fromY][fromX] = null;
        
        return true;
    }

    /**
     * Kontroluje, zda je pozice na šachovnici
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     * @returns {boolean} Je pozice platná?
     */
    isValidPosition(x, y) {
        return x >= 0 && x < this.size && y >= 0 && y < this.size;
    }

    /**
     * Kontroluje, zda je cesta mezi dvěma body volná
     * @param {number} fromX - Počáteční X souřadnice
     * @param {number} fromY - Počáteční Y souřadnice
     * @param {number} toX - Cílová X souřadnice
     * @param {number} toY - Cílová Y souřadnice
     * @returns {boolean} Je cesta volná?
     */
    isPathClear(fromX, fromY, toX, toY) {
        const dx = Math.sign(toX - fromX);
        const dy = Math.sign(toY - fromY);
        
        let x = fromX + dx;
        let y = fromY + dy;
        
        while (x !== toX || y !== toY) {
            if (this.getPieceAt(x, y) !== null) {
                return false;
            }
            x += dx;
            y += dy;
        }
        
        return true;
    }

    /**
     * Provede operaci pro každou figurku na šachovnici
     * @param {Function} callback - Funkce (piece, x, y)
     */
    forEachPiece(callback) {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const piece = this.board[y][x];
                if (piece) {
                    callback(piece, x, y);
                }
            }
        }
    }

    /**
     * Vytvoří kopii šachovnice (pro simulaci tahů)
     * @returns {BoardModel} Kopie šachovnice
     */
    clone() {
        const newBoard = new BoardModel(this.size);
        this.forEachPiece((piece, x, y) => {
            newBoard.placePiece(piece.clone(), x, y);
        });
        return newBoard;
    }
}