/**
 * ControlsView.js
 * Pohled pro ovládací prvky - zobrazuje zprávy a speciální akce
 */
export class ControlsView {
    /**
     * @constructor
     * @param {HTMLElement} messageElement - Element pro zprávy
     * @param {HTMLElement} specialActionsElement - Element pro speciální akce
     * @param {HTMLElement} restartButton - Tlačítko pro restart
     */
    constructor(messageElement, specialActionsElement, restartButton) {
        this.messageElement = messageElement;
        this.specialActionsElement = specialActionsElement;
        this.restartButton = restartButton;
    }

    /**
     * Aktualizuje textovou zprávu
     * @param {string} message - Text zprávy
     */
    updateMessage(message) {
        this.messageElement.textContent = message;
    }

    /**
     * Odstraní všechny speciální akce
     */
    clearSpecialActions() {
        this.specialActionsElement.innerHTML = '';
    }

    /**
     * Přidá speciální akci jako tlačítko
     * @param {string} label - Popisek tlačítka
     * @param {Function} onClick - Handler pro kliknutí
     */
    addSpecialAction(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.addEventListener('click', onClick);
        this.specialActionsElement.appendChild(button);
    }

    /**
     * Nastaví stav tlačítka pro restart hry
     * @param {boolean} enabled - Je tlačítko povoleno?
     */
    setRestartButtonEnabled(enabled) {
        this.restartButton.disabled = !enabled;
    }
}