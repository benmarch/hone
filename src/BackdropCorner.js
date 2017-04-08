import BackdropComponent from './BackdropComponent';
import {Enum, createElement, addClass, transformKey} from './utils';

export default class BackdropCorner extends BackdropComponent {
    constructor(options = {}) {
        super(options, createElement(`
        <div>
            <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" style="position: absolute">
                <path d="M100 0
                         Q 0 0 0 100
                         L0 0
                         Z" />
            </svg>
        </div>`));

        addClass(this.element.querySelector('path'), `hone-scope ${this.options.classPrefix} ${this.options.classPrefix}-component ${this.options.classPrefix}-corner ${this.options.classPrefix}-corner-${options.name}`);
        this.hide();
    }

    position(targetOffset) {
        const height = this.options.borderRadius || 0,
            width = this.options.borderRadius || 0;

        let left,
            top,
            rotation;

        switch (this.options.position) {
        case BackdropCorner.position.TOP_LEFT:
            left = targetOffset.left;
            top = targetOffset.top;
            rotation = '0deg';
            break;

        case BackdropCorner.position.TOP_RIGHT:
            left = targetOffset.left + targetOffset.width - width;
            top = targetOffset.top;
            rotation = '90deg';
            break;

        case BackdropCorner.position.BOTTOM_RIGHT:
            left = targetOffset.left + targetOffset.width - width;
            top = targetOffset.top + targetOffset.height - height;
            rotation = '180deg';
            break;

        case BackdropCorner.position.BOTTOM_LEFT:
            left = targetOffset.left;
            top = targetOffset.top + targetOffset.height - height;
            rotation = '-90deg';
            break;

        default:
            throw new Error('Invalid position: ' + this.options.position);
        }

        Object.assign(this.element.style, {
            position: this.options.fixed ? 'fixed' : 'absolute',
            left: left + 'px',
            top: top + 'px',
            height: height + 'px',
            width: width + 'px',
            [transformKey]: `rotate(${rotation})`
        });
        this.show();
    }

}

BackdropCorner.position = new Enum([
    'TOP_LEFT',
    'TOP_RIGHT',
    'BOTTOM_RIGHT',
    'BOTTOM_LEFT'
]);
