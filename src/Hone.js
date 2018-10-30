import BackdropSide from './BackdropSide';
import BackdropCorner from './BackdropCorner';
import {Enum, offset, viewportOffset, parsePadding, scrollParents} from './utils';

const defaultOptions = {
    classPrefix: 'hone',            //all components are given style classes like "hone-component". This sets the prefix
    fixed: false,                   //set to true if the element is position: fixed
    borderRadius: 0,                //creates rounded corners (all four or nothing)
    enabled: true,                  //controls the visibility and event listeners
    padding: '0',                   //adds padding around the target. Same format as CSS padding rule
    fullScreen: false,              //should the backdrop be full screen (for a modal window)
    disableOptimizations: false     //should the positioning optimizations be disabled (fixes positioning issues in SPAs when true)
};

//must be called in context of a hone
function throwIfDestroyed() {
    if (this.status === Hone.status.DESTROYED) {
        throw new Error('Hone scope has been destroyed.');
    }
}

//must be called in context of a hone
function addEventListeners() {
    window.addEventListener('resize', this.eventListener);
    this.scrollParents.forEach(parent => {
        parent.addEventListener('scroll', this.eventListener);
    });
}

//must be called in context of a hone
function removeEventListeners() {
    window.removeEventListener('resize', this.eventListener);
    this.scrollParents.forEach(parent => {
        parent.removeEventListener('scroll', this.eventListener);
    });
}

export default class Hone {
    constructor(target = {}, options = {}) {
        //fix arguments
        if (target instanceof Element) {
            this.target = target;
        } else {
            options = target;
            options.enabled = false;
        }

        //assign initial values
        this.element = document.createElement('div');
        this.status = Hone.status.HIDDEN;
        this.setOptions(Object.assign({}, defaultOptions, options));

        //initialize components
        this.createComponents(this.options);
        document.body.appendChild(this.element);

        //assign listeners
        this.eventListener = () => this.status === Hone.status.VISIBLE && this.position(); //only position if visible
        this.scrollParents = scrollParents(this.target);
        addEventListeners.call(this);

        //initialize action
        if (this.options.enabled) {
            this.show();
        }
    }

    createComponents(options) {
        this.components = [

            //sides
            new BackdropSide(Object.assign({
                name: 'top',
                position: BackdropSide.position.TOP
            }, options)),

            new BackdropSide(Object.assign({
                name: 'right',
                position: BackdropSide.position.RIGHT
            }, options)),

            new BackdropSide(Object.assign({
                name: 'bottom',
                position: BackdropSide.position.BOTTOM
            }, options)),

            new BackdropSide(Object.assign({
                name: 'left',
                position: BackdropSide.position.LEFT
            }, options)),


            //corners
            new BackdropCorner(Object.assign({
                name: 'top-left',
                position: BackdropCorner.position.TOP_LEFT
            }, options)),

            new BackdropCorner(Object.assign({
                name: 'top-right',
                position: BackdropCorner.position.TOP_RIGHT
            }, options)),

            new BackdropCorner(Object.assign({
                name: 'bottom-right',
                position: BackdropCorner.position.BOTTOM_RIGHT
            }, options)),

            new BackdropCorner(Object.assign({
                name: 'bottom-left',
                position: BackdropCorner.position.BOTTOM_LEFT
            }, options))
        ];

        //add them all to a single element
        this.components.forEach(component => this.element.appendChild(component.element));
    }

    getOffset(target = this.target) {
        return this.options.fixed ? viewportOffset(target) : offset(target);
    }

    position(target = this.target) {
        throwIfDestroyed.call(this);

        const padding = this.options.parsedPadding;
        let offset = this.getOffset(target);

        if (this.options.fullScreen) {
            //reset so that it covers the screen
            Object.assign(offset, {
                top: 0,
                left: 0,
                width: 0,
                height: 0
            });
        } else {
            //adjust for padding
            offset.top -= padding.top;
            offset.left -= padding.left;
            offset.width += padding.left + padding.right;
            offset.height += padding.top + padding.bottom;
        }

        if (this.lastOffset && !this.options.disableOptimizations &&
            offset.top === this.lastOffset.top &&
            offset.left === this.lastOffset.left &&
            offset.width === this.lastOffset.width &&
            offset.height === this.lastOffset.height &&
            offset.viewportWidth === this.lastOffset.viewportWidth &&
            offset.videoHeight === this.lastOffset.videoHeight
        ) {
            return;
        }

        this.components.forEach(component => component.position(offset));
        this.lastOffset = offset;

        if (target !== this.target) {
            removeEventListeners.call(this);
            this.target = target;
            this.scrollParents = scrollParents(this.target);
            addEventListeners.call(this);
        }
    }

    show() {
        throwIfDestroyed.call(this);

        this.element.style.display = 'block';
        this.status = Hone.status.VISIBLE;
    }

    hide() {
        throwIfDestroyed.call(this);

        this.element.style.display = 'none';
        this.status = Hone.status.HIDDEN;
    }

    setOptions(options = {}) {
        throwIfDestroyed.call(this);

        this.options = Object.assign(this.options || {}, options);
        this.options.parsedPadding = parsePadding(this.options.padding);

        if (this.components) {
            this.components.forEach(component => component.setOptions(this.options));
        }
    }

    destroy() {
        throwIfDestroyed.call(this);

        this.components.forEach(component => component.destroy());

        this.scrollParents.forEach(parent => {
            parent.removeEventListener('scroll', this.eventListener);
        });
        window.removeEventListener('resize', this.eventListener);
        document.body.removeChild(this.element);
        this.element = null;

        this.status = Hone.status.DESTROYED;
    }
}

Hone.status = new Enum([
    'HIDDEN',
    'VISIBLE',
    'DESTROYED'
]);
