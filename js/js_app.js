/**
 * Warhammer šachy - Hlavní aplikační soubor
 * OOP Architektura založená na MVC vzoru
 */
import { ChessboardView } from './views/ChessboardView.js';
import { ControlsView } from './views/ControlsView.js';
import { LegendView } from './views/LegendView.js';
import { GameController } from './controllers/GameController.js';
import { GameModel } from './models/GameModel.js';

// Vytvoření instance herního enginu 
class WarhammerChessApp {
    /**
     * @constructor
     * Inicializuje aplikaci a spojuje komponenty
     */
    constructor() {
        // Inicializace modelu
        this.gameModel = new GameModel();
        
        // Inicializace pohledů
        this.chessboardView = new ChessboardView(document.getElementById('chessboard'));
        this.controlsView = new ControlsView(
            document.getElementById('message'),
            document.getElementById('special-actions'),
            document.getElementById('restart-btn')
        );
        this.legendView = new LegendView(document.getElementById('legend-items'));
        
        // Inicializace hlavního kontroleru
        this.gameController = new GameController(
            this.gameModel, 
            this.chessboardView, 
            this.controlsView,
            this.legendView
        );

        // Tlačítko pro restart hry
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.gameController.restartGame();
        });
        
        // Inicializace hry
        this.gameController.initGame();
    }
}

// Při načtení DOM inicializujeme aplikaci
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WarhammerChessApp();
});

// Exportujeme konstanty pro snadný přístup
export * from './constants/GameConstants.js';