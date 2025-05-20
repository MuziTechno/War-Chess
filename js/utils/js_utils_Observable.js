/**
 * Observable.js
 * Třída implementující vzor Observer (Observable)
 */
export class Observable {
    /**
     * @constructor
     */
    constructor() {
        this.observers = {};
    }

    /**
     * Přidá pozorovatele pro událost
     * @param {string} eventType - Typ události
     * @param {Function} callback - Callback funkce
     */
    subscribe(eventType, callback) {
        if (!this.observers[eventType]) {
            this.observers[eventType] = [];
        }
        this.observers[eventType].push(callback);
    }

    /**
     * Odstraní pozorovatele pro událost
     * @param {string} eventType - Typ události
     * @param {Function} callback - Callback funkce
     */
    unsubscribe(eventType, callback) {
        if (!this.observers[eventType]) {
            return;
        }
        this.observers[eventType] = this.observers[eventType].filter(
            (observer) => observer !== callback
        );
    }

    /**
     * Notifikuje všechny pozorovatele o události
     * @param {string} eventType - Typ události
     * @param {Object} data - Data události
     */
    notify(eventType, data = {}) {
        if (!this.observers[eventType]) {
            return;
        }
        this.observers[eventType].forEach((observer) => observer(data));
    }
}