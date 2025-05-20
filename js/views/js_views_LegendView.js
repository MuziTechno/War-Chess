/**
 * LegendView.js
 * Pohled pro legendu - zobrazuje informace o figurkách
 */
import { PIECE_CONFIG } from '../constants/GameConstants.js';

export class LegendView {
    /**
     * @constructor
     * @param {HTMLElement} element - Element pro legendu
     */
    constructor(element) {
        this.element = element;
    }

    /**
     * Vykreslí legendu s vysvětlením všech typů figurek
     */
    renderLegend() {
        this.element.innerHTML = '';
        
        // Vytvoří položky pro všechny typy figurek
        for (const [type, config] of Object.entries(PIECE_CONFIG)) {
            const item = document.createElement('li');
            
            // Symbol
            const symbol = document.createElement('span');
            symbol.className = 'piece-symbol';
            symbol.textContent = config.symbol.bila;
            item.appendChild(symbol);
            
            // Název a popis
            const text = document.createTextNode(
                `${config.name} (${this.getPieceTypeName(type)}): ${config.description}`
            );
            item.appendChild(text);
            
            this.element.appendChild(item);
        }
    }

    /**
     * Vrátí český název typu figurky
     * @param {string} type - Typ figurky
     * @returns {string} Český název
     */
    getPieceTypeName(type) {
        const names = {
            'pesec': 'pěšec',
            'strelec': 'střelec',
            'jezdec': 'jezdec',
            'vez': 'věž',
            'kralovna': 'královna',
            'kral': 'král'
        };
        return names[type] || type;
    }
}