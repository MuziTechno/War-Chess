/**
 * ChessboardView.js
 * Pohled pro šachovnici - zobrazuje stav šachovnice a figurky
 */
import { BOARD_SIZE, PIECE_CONFIG, CSS_CLASSES } from '../constants/GameConstants.js';

export class ChessboardView {
    /**
     * @constructor
     * @param {HTMLElement} element - Element šachovnice
     */
    constructor(element) {
        this.element = element;
        this.squares = [];
        this.gameModel = null;
        this.clickHandler = null;
        this.highlightedSquares = new Map();
    }

    /**
     * Nastaví model hry pro aktualizaci pohledu
     * @param {GameModel} model - Model hry
     */
    setModel(model) {
        this.gameModel = model;
    }

    /**
     * Nastaví handler pro kliknutí na pole
     * @param {Function} handler - Funkce (x, y)
     */
    setClickHandler(handler) {
        this.clickHandler = handler;
    }

    /**
     * Vykreslí prázdnou šachovnici a nastaví event listenery
     */
    renderBoard() {
        this.element.innerHTML = '';
        this.squares = [];
        this.highlightedSquares.clear();
        
        for (let y = BOARD_SIZE - 1; y >= 0; y--) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                const square = document.createElement('div');
                square.className = 'square';
                square.dataset.x = x;
                square.dataset.y = y;
                
                // Event listener pro kliknutí
                square.addEventListener('click', () => {
                    if (this.clickHandler) {
                        this.clickHandler(parseInt(square.dataset.x), parseInt(square.dataset.y));
                    }
                });
                
                this.element.appendChild(square);
                this.squares.push(square);
                
                // Přidat figurku, pokud existuje
                if (this.gameModel) {
                    const piece = this.gameModel.getPieceAt(x, y);
                    if (piece) {
                        this.renderPiece(square, piece);
                    }
                }
            }
        }
    }

    /**
     * Vykreslí figurku na pole
     * @param {HTMLElement} square - Element pole
     * @param {ChessPiece} piece - Figurka
     */
    renderPiece(square, piece) {
        const stats = PIECE_CONFIG[piece.type];
        if (!stats) return;
        
        // Zvýraznění pole podle barvy figurky
        square.classList.add(piece.color);
        
        // Speciální efekty pro figurky se schopnostmi
        if (piece.type === 'vez' && piece.armorActive) {
            square.classList.add(CSS_CLASSES.TANK_ARMOR);
        }
        if (piece.type === 'kral' && piece.bonusHp > 0) {
            square.classList.add(CSS_CLASSES.KING_AURA);
        }
        if (piece.type === 'kralovna' && !piece.reviveUsed) {
            square.classList.add(CSS_CLASSES.REVIVE_READY);
        }
        
        // Vytvoření symbolů a atributů figurky
        const symbol = document.createElement('span');
        symbol.className = 'piece-symbol';
        symbol.textContent = stats.symbol[piece.color];
        square.appendChild(symbol);
        
        const dmg = document.createElement('span');
        dmg.className = 'piece-dmg';
        dmg.textContent = piece.dmg;
        square.appendChild(dmg);
        
        const hp = document.createElement('span');
        hp.className = `piece-hp${piece.bonusHp > 0 ? ' ' + CSS_CLASSES.BONUS : ''}`;
        hp.textContent = piece.hp;
        square.appendChild(hp);
        
        // Tooltip s informacemi
        square.title = this.getPieceTooltip(piece);
    }

    /**
     * Generuje tooltip pro figurku
     * @param {ChessPiece} piece - Figurka
     * @returns {string} Tooltip text
     */
    getPieceTooltip(piece) {
        const stats = PIECE_CONFIG[piece.type];
        if (!stats) return '';
        
        return `${stats.name} (${piece.color.toUpperCase()})
HP: ${piece.hp}/${piece.maxHp}${piece.bonusHp > 0 ? ` (+${piece.bonusHp})` : ''}
DMG: ${piece.dmg}
${stats.description}`;
    }

    /**
     * Najde HTML element pole na daných souřadnicích
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     * @returns {HTMLElement} Element pole
     */
    getSquareElement(x, y) {
        return this.squares.find(square => 
            parseInt(square.dataset.x) === x && parseInt(square.dataset.y) === y
        );
    }

    /**
     * Zvýrazní pole na daných souřadnicích
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     * @param {string} cssClass - CSS třída pro zvýraznění
     */
    highlightSquare(x, y, cssClass) {
        const square = this.getSquareElement(x, y);
        if (square) {
            square.classList.add(cssClass);
            
            // Uložení zvýraznění pro pozdější odstranění
            const key = `${x},${y}`;
            if (!this.highlightedSquares.has(key)) {
                this.highlightedSquares.set(key, []);
            }
            this.highlightedSquares.get(key).push(cssClass);
        }
    }

    /**
     * Zkontroluje, zda je pole zvýrazněné danou CSS třídou
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     * @param {string} cssClass - CSS třída pro zvýraznění
     * @returns {boolean} Je pole zvýrazněné?
     */
    isHighlighted(x, y, cssClass) {
        const key = `${x},${y}`;
        return this.highlightedSquares.has(key) && 
               this.highlightedSquares.get(key).includes(cssClass);
    }

    /**
     * Zvýrazní cíle pro oživení pěšce
     * @param {Array} targets - Seznam souřadnic [x, y]
     */
    highlightReviveTargets(targets) {
        targets.forEach(([x, y]) => {
            this.highlightSquare(x, y, CSS_CLASSES.REVIVE_TARGET);
        });
    }

    /**
     * Odstraní všechna zvýraznění
     */
    clearHighlights() {
        for (const [coords, classes] of this.highlightedSquares.entries()) {
            const [x, y] = coords.split(',').map(Number);
            const square = this.getSquareElement(x, y);
            if (square) {
                classes.forEach(cssClass => {
                    square.classList.remove(cssClass);
                });
            }
        }
        this.highlightedSquares.clear();
    }
}