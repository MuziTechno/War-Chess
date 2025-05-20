/**
 * GameController.js
 * Hlavní kontroler hry - propojuje model a pohledy
 */
import { GAME_PHASES, CSS_CLASSES } from '../constants/GameConstants.js';

export class GameController {
    /**
     * @constructor
     * @param {GameModel} model - Model hry
     * @param {ChessboardView} boardView - Pohled šachovnice
     * @param {ControlsView} controlsView - Pohled ovládacích prvků
     * @param {LegendView} legendView - Pohled legendy
     */
    constructor(model, boardView, controlsView, legendView) {
        this.model = model;
        this.boardView = boardView;
        this.controlsView = controlsView;
        this.legendView = legendView;
        
        // Registrace pozorovatelů pro model
        this.registerModelObservers();
        
        // Registrace handleru událostí
        this.setupEventListeners();
    }

    /**
     * Inicializace hry
     */
    initGame() {
        this.model.initializeGame();
        this.legendView.renderLegend();
        this.controlsView.updateMessage(`Na tahu je hráč: ${this.model.currentPlayer.toUpperCase()}`);
        this.boardView.renderBoard();
    }

    /**
     * Restart hry
     */
    restartGame() {
        this.initGame();
    }

    /**
     * Registrace pozorovatelů pro model
     * Observer pattern - reaguje na události modelu
     */
    registerModelObservers() {
        this.model.subscribe('gameInitialized', () => {
            this.boardView.renderBoard();
            this.controlsView.updateMessage(`Na tahu je hráč: ${this.model.currentPlayer.toUpperCase()}`);
            this.controlsView.clearSpecialActions();
        });
        
        this.model.subscribe('pieceSelected', (data) => {
            this.boardView.highlightSquare(data.x, data.y, CSS_CLASSES.SELECTED);
            this.controlsView.updateMessage(`Vybraná figurka: ${data.piece.toString()}`);
            this.updateSpecialActionsForPiece(data.piece, data.x, data.y);
        });
        
        this.model.subscribe('pieceMoved', () => {
            this.boardView.clearHighlights();
            this.boardView.renderBoard();
            this.controlsView.updateMessage("AP fáze: Útok/speciální schopnost nebo kliknutí na vlastní figurku pro ukončení.");
        });
        
        this.model.subscribe('attack', (data) => {
            this.controlsView.updateMessage(`Útok! DMG: ${data.damage}`);
            this.boardView.renderBoard();
        });
        
        this.model.subscribe('pieceFallen', () => {
            this.boardView.renderBoard();
        });
        
        this.model.subscribe('heal', (data) => {
            this.controlsView.updateMessage(`Léčení! +${data.amount} HP`);
            this.boardView.renderBoard();
        });
        
        this.model.subscribe('playerSwitched', (data) => {
            this.controlsView.updateMessage(`Na tahu je hráč: ${data.currentPlayer.toUpperCase()}`);
            this.controlsView.clearSpecialActions();
        });
        
        this.model.subscribe('armorBlocked', () => {
            this.controlsView.updateMessage("Pancíř tanku zablokoval útok!");
            this.boardView.renderBoard();
        });
        
        this.model.subscribe('kingAuraActivated', () => {
            this.controlsView.updateMessage("Král je v ohrožení! Aura aktivována (+2 HP)");
            this.boardView.renderBoard();
        });
        
        this.model.subscribe('reviveActivated', (data) => {
            this.boardView.clearHighlights();
            this.boardView.highlightReviveTargets(data.targets);
            this.controlsView.updateMessage("Vyberte pole pro oživení pěšce");
        });
        
        this.model.subscribe('pawnRevived', () => {
            this.boardView.clearHighlights();
            this.boardView.renderBoard();
            this.controlsView.updateMessage("Pěšec oživen!");
        });
        
        this.model.subscribe('gameOver', (data) => {
            this.controlsView.updateMessage(`Konec hry! Vítěz: ${data.winner.toUpperCase()}`);
            this.boardView.renderBoard();
        });
    }

    /**
     * Nastavení event listenerů pro interakci s uživatelem
     */
    setupEventListeners() {
        // Propojení s View - boardView deleguje události sem
        this.boardView.setClickHandler((x, y) => {
            this.handleSquareClick(x, y);
        });
        
        // Nastavení modelu pro pohledy
        this.boardView.setModel(this.model);
    }

    /**
     * Obsluha kliknutí na pole šachovnice
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     */
    handleSquareClick(x, y) {
        const piece = this.model.getPieceAt(x, y);
        
        // V různých fázích hry reagujeme jinak
        switch (this.model.currentPhase) {
            case GAME_PHASES.SELECTION:
                if (piece && piece.color === this.model.currentPlayer) {
                    // Výběr figurky
                    this.model.selectPiece(x, y);
                } else if (this.model.selectedPiece) {
                    // Pokus o pohyb
                    this.model.movePiece(x, y);
                }
                break;
                
            case GAME_PHASES.ACTION:
                // Akce/útok v AP fázi
                this.model.performAction(x, y);
                break;
                
            case GAME_PHASES.SPECIAL:
                // Speciální akce (např. oživení pěšce)
                if (this.boardView.isHighlighted(x, y, CSS_CLASSES.REVIVE_TARGET)) {
                    this.model.revivePawn(x, y);
                }
                break;
                
            case GAME_PHASES.GAME_OVER:
                // Ve fázi konce hry ignorujeme kliknutí
                break;
        }
    }

    /**
     * Aktualizace speciálních akcí pro vybranou figurku
     * @param {ChessPiece} piece - Figurka
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     */
    updateSpecialActionsForPiece(piece, x, y) {
        this.controlsView.clearSpecialActions();
        
        // Pokud má figurka dostupné speciální akce
        if (piece.type === 'kralovna' && !piece.reviveUsed) {
            // Kontrola, zda může královna oživit pěšce
            if (this.model.fallenPieces[piece.color].pesec > 0) {
                this.controlsView.addSpecialAction("Přivolat posily (oživit pěšce)", () => {
                    this.model.activateQueenRevive(x, y);
                });
            }
        }
    }
}