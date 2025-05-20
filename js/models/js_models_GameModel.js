/**
 * GameModel.js
 * Hlavní model hry - uchovává herní stav a řídí herní logiku
 */
import { PieceFactory } from './PieceFactory.js';
import { BoardModel } from './BoardModel.js';
import { PLAYER_COLORS, BOARD_SIZE, GAME_PHASES } from '../constants/GameConstants.js';
import { Observable } from '../utils/Observable.js';

export class GameModel extends Observable {
    /**
     * @constructor
     * Inicializuje herní model
     */
    constructor() {
        super();
        this.board = new BoardModel(BOARD_SIZE);
        this.currentPlayer = PLAYER_COLORS.WHITE;
        this.currentPhase = GAME_PHASES.SELECTION;
        this.selectedPiece = null;
        this.selectedPosition = null;
        this.apActor = null;
        this.fallenPieces = { 
            [PLAYER_COLORS.WHITE]: { pesec: 0 }, 
            [PLAYER_COLORS.BLACK]: { pesec: 0 } 
        };
        this.isGameOver = false;
    }

    /**
     * Inicializuje novou hru
     */
    initializeGame() {
        // Reset stavu
        this.board.clear();
        this.currentPlayer = PLAYER_COLORS.WHITE;
        this.currentPhase = GAME_PHASES.SELECTION;
        this.selectedPiece = null;
        this.selectedPosition = null;
        this.apActor = null;
        this.fallenPieces = { 
            [PLAYER_COLORS.WHITE]: { pesec: 0 }, 
            [PLAYER_COLORS.BLACK]: { pesec: 0 } 
        };
        this.isGameOver = false;

        // Vytvoření počátečního rozestavení
        this.setupInitialBoard();
        
        // Notifikace pozorovatelů
        this.notify('gameInitialized');
    }

    /**
     * Nastaví počáteční rozestavení šachovnice
     */
    setupInitialBoard() {
        // Pěšci
        for (let x = 0; x < BOARD_SIZE; x++) {
            this.board.placePiece(PieceFactory.createPiece('pesec', PLAYER_COLORS.WHITE), x, 1);
            this.board.placePiece(PieceFactory.createPiece('pesec', PLAYER_COLORS.BLACK), x, 6);
        }

        // Ostatní figury
        const backRow = ["vez", "jezdec", "strelec", "kralovna", "kral", "strelec", "jezdec", "vez"];
        for (let x = 0; x < BOARD_SIZE; x++) {
            this.board.placePiece(PieceFactory.createPiece(backRow[x], PLAYER_COLORS.WHITE), x, 0);
            this.board.placePiece(PieceFactory.createPiece(backRow[x], PLAYER_COLORS.BLACK), x, 7);
        }
    }

    /**
     * Vrátí figurku na dané pozici
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     * @returns {ChessPiece|null} Figurka nebo null
     */
    getPieceAt(x, y) {
        return this.board.getPieceAt(x, y);
    }

    /**
     * Vybere figurku a její pozici
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     */
    selectPiece(x, y) {
        const piece = this.getPieceAt(x, y);
        if (piece && piece.color === this.currentPlayer && this.currentPhase === GAME_PHASES.SELECTION) {
            this.selectedPiece = piece;
            this.selectedPosition = { x, y };
            this.notify('pieceSelected', { piece, x, y });
        }
    }

    /**
     * Pokusí se pohnout vybranou figurkou
     * @param {number} x - Cílová X souřadnice
     * @param {number} y - Cílová Y souřadnice
     * @returns {boolean} Úspěch pohybu
     */
    movePiece(x, y) {
        if (!this.selectedPiece || this.currentPhase !== GAME_PHASES.SELECTION) {
            return false;
        }

        const fromX = this.selectedPosition.x;
        const fromY = this.selectedPosition.y;
        const canMove = this.selectedPiece.canMoveTo(fromX, fromY, x, y, this.board);

        if (canMove) {
            // Pohyb figurky
            this.board.movePiece(fromX, fromY, x, y);
            this.selectedPiece.hasMoved = true;
            
            // Přidělení AP pro akční fázi
            this.selectedPiece.ap = (this.selectedPiece.type === 'jezdec') ? 2 : 1;
            
            // Přechod do AP fáze
            this.currentPhase = GAME_PHASES.ACTION;
            this.apActor = { 
                piece: this.selectedPiece, 
                position: { x, y } 
            };
            
            this.notify('pieceMoved', { 
                piece: this.selectedPiece, 
                from: { x: fromX, y: fromY }, 
                to: { x, y } 
            });
            
            return true;
        }
        return false;
    }

    /**
     * Provede AP akci (útok nebo speciální schopnost)
     * @param {number} x - Cílová X souřadnice
     * @param {number} y - Cílová Y souřadnice
     * @returns {boolean} Úspěch akce
     */
    performAction(x, y) {
        if (this.currentPhase !== GAME_PHASES.ACTION || !this.apActor) {
            return false;
        }

        const actor = this.apActor.piece;
        const actorPos = this.apActor.position;
        const target = this.getPieceAt(x, y);

        // Pokud klikneme na vlastní figurku, ukončíme AP fázi
        if (target && target.color === this.currentPlayer) {
            this.endAPPhase();
            return true;
        }

        // Útok na nepřítele
        if (actor.canAttack(actorPos.x, actorPos.y, x, y, this.board)) {
            if (target) {
                // Speciální případ: pancíř věže
                if (target.type === 'vez' && target.armorActive) {
                    target.armorActive = false;
                    this.notify('armorBlocked', { target, x, y });
                } else {
                    // Běžný útok
                    target.hp -= actor.dmg;
                    this.notify('attack', { attacker: actor, target, damage: actor.dmg });
                    
                    // Kontrola, jestli figurka přežila
                    if (target.hp <= 0) {
                        // Když je zničena figurka
                        if (target.type === 'pesec') {
                            this.fallenPieces[target.color].pesec++;
                        }
                        this.board.removePiece(x, y);
                        this.notify('pieceFallen', { piece: target, x, y });
                    }
                }
                
                // Snížení AP
                actor.ap--;
                
                // Kontrola, jestli může pokračovat v AP fázi
                if (actor.ap <= 0) {
                    this.endAPPhase();
                }
                
                return true;
            }
        }
        
        // Speciální schopnost: léčení jezdcem
        if (actor.type === 'jezdec') {
            if (target && target.color === actor.color && target.hp < target.maxHp) {
                const adjacentCoords = actor.getAdjacentSquares(actorPos.x, actorPos.y);
                if (adjacentCoords.some(coord => coord[0] === x && coord[1] === y)) {
                    target.hp++;
                    actor.ap--;
                    this.notify('heal', { healer: actor, target, amount: 1 });
                    
                    if (actor.ap <= 0) {
                        this.endAPPhase();
                    }
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * Aktivuje speciální schopnost královny (oživení pěšce)
     * @param {number} queenX - X souřadnice královny
     * @param {number} queenY - Y souřadnice královny
     * @returns {Array} Souřadnice možných pozic pro oživení
     */
    activateQueenRevive(queenX, queenY) {
        const queen = this.getPieceAt(queenX, queenY);
        if (!queen || queen.type !== 'kralovna' || queen.reviveUsed || 
            this.fallenPieces[queen.color].pesec <= 0) {
            return [];
        }

        // Najdi volná pole pro oživení
        const targets = [];
        
        // První řada pěšců
        const row = (queen.color === PLAYER_COLORS.WHITE) ? 1 : 6;
        for (let x = 0; x < BOARD_SIZE; x++) {
            if (!this.board.getPieceAt(x, row)) {
                targets.push([x, row]);
            }
        }
        
        // Okolí královny
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = queenX + dx;
                const ny = queenY + dy;
                if (this.board.isValidPosition(nx, ny) && !this.board.getPieceAt(nx, ny)) {
                    targets.push([nx, ny]);
                }
            }
        }

        if (targets.length) {
            this.currentPhase = GAME_PHASES.SPECIAL;
            this.notify('reviveActivated', { queen, targets });
        }
        
        return targets;
    }

    /**
     * Oživí pěšce na vybrané pozici
     * @param {number} x - X souřadnice pro oživení
     * @param {number} y - Y souřadnice pro oživení
     * @returns {boolean} Úspěch oživení
     */
    revivePawn(x, y) {
        if (this.currentPhase !== GAME_PHASES.SPECIAL || !this.selectedPiece || 
            this.selectedPiece.type !== 'kralovna') {
            return false;
        }

        // Vytvoří nového pěšce
        const newPawn = PieceFactory.createPiece('pesec', this.selectedPiece.color);
        newPawn.hasMoved = true;  // Oživený pěšec nemůže hned udělat dvojkrok
        
        // Umístí na šachovnici
        this.board.placePiece(newPawn, x, y);
        
        // Označení královny jako použité
        this.selectedPiece.reviveUsed = true;
        this.fallenPieces[this.selectedPiece.color].pesec--;
        
        // Informace o akci
        this.notify('pawnRevived', { pawn: newPawn, x, y, queen: this.selectedPiece });
        
        // Vrátit do normální fáze
        this.currentPhase = GAME_PHASES.SELECTION;
        this.selectedPiece = null;
        this.selectedPosition = null;
        
        return true;
    }

    /**
     * Ukončí AP fázi a přepne hráče
     */
    endAPPhase() {
        this.currentPhase = GAME_PHASES.SELECTION;
        this.apActor = null;
        this.selectedPiece = null;
        this.selectedPosition = null;
        this.switchPlayer();
    }

    /**
     * Přepne aktuálního hráče
     */
    switchPlayer() {
        this.currentPlayer = (this.currentPlayer === PLAYER_COLORS.WHITE) ? 
                              PLAYER_COLORS.BLACK : PLAYER_COLORS.WHITE;

        // Obnovení pancíře věžím aktuálního hráče
        this.board.forEachPiece((piece, x, y) => {
            if (piece.type === 'vez' && piece.color === this.currentPlayer) {
                piece.armorActive = true;
            }
        });

        // Kontrola aury králů
        this.checkKingsAura();
        
        this.notify('playerSwitched', { currentPlayer: this.currentPlayer });
        
        // Kontrola konce hry
        this.checkGameOver();
    }

    /**
     * Kontrola aury králů (dočasné HP při ohrožení)
     */
    checkKingsAura() {
        this.board.forEachPiece((piece, x, y) => {
            if (piece.type === 'kral') {
                const isInDanger = this.isKingThreatened(piece, x, y);
                
                if (isInDanger) {
                    if (piece.bonusHp < 2) {
                        piece.bonusHp = 2;
                        piece.hp += 2;
                        this.notify('kingAuraActivated', { king: piece, x, y });
                    }
                } else if (piece.bonusHp > 0) {
                    piece.hp -= piece.bonusHp;
                    piece.bonusHp = 0;
                    this.notify('kingAuraDeactivated', { king: piece, x, y });
                }
            }
        });
    }

    /**
     * Kontroluje, zda je král ohrožen
     * @param {ChessPiece} king - Král
     * @param {number} kingX - X souřadnice krále
     * @param {number} kingY - Y souřadnice krále
     * @returns {boolean} Je král ohrožen?
     */
    isKingThreatened(king, kingX, kingY) {
        let threatened = false;
        
        // Projít všechny soupeřovy figurky
        this.board.forEachPiece((piece, x, y) => {
            if (!threatened && piece.color !== king.color) {
                if (piece.canAttack(x, y, kingX, kingY, this.board)) {
                    threatened = true;
                }
            }
        });
        
        return threatened;
    }

    /**
     * Kontroluje konec hry (ztráta krále)
     */
    checkGameOver() {
        let whiteKingAlive = false;
        let blackKingAlive = false;
        
        // Hledání králů
        this.board.forEachPiece((piece) => {
            if (piece.type === 'kral') {
                if (piece.color === PLAYER_COLORS.WHITE) whiteKingAlive = true;
                if (piece.color === PLAYER_COLORS.BLACK) blackKingAlive = true;
            }
        });
        
        // Pokud jeden z králů chybí, hra končí
        if (!whiteKingAlive || !blackKingAlive) {
            this.isGameOver = true;
            const winner = whiteKingAlive ? PLAYER_COLORS.WHITE : PLAYER_COLORS.BLACK;
            this.currentPhase = GAME_PHASES.GAME_OVER;
            this.notify('gameOver', { winner });
        }
    }
}