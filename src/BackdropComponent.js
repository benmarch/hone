export default class BackdropComponent {
    constructor(options, element) {
        this.element = element;
        this.options = options;
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }

    setOptions(options = {}) {
        this.removeEventListeners();
        this.options = Object.assign(this.options || {}, options);
        this.addEventListeners();
    }

    addEventListeners() {
        if (this.options && this.options.events) {
            for (const eventName in this.options.events) {
                if (Object.prototype.hasOwnProperty.call(this.options.events, eventName)) {
                    this.element.addEventListener(eventName, this.options.events[eventName]);
                }
            }
        }
    }

    removeEventListeners() {
        if (this.options && this.options.events) {
            for (const eventName in this.options.events) {
                if (Object.prototype.hasOwnProperty.call(this.options.events, eventName)) {
                    this.element.removeEventListener(eventName, this.options.events[eventName]);
                }
            }
        }
    }

    destroy() {
        this.removeEventListeners();
        this.element = null;
    }
}
