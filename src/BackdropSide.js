import BackdropComponent from './BackdropComponent';
import {Enum, addClass, offset} from './utils';

export default class BackdropSide extends BackdropComponent {
    constructor(options = {}) {
        super(options, document.createElement('div'));

        addClass(this.element, `hone-scope ${this.options.classPrefix} ${this.options.classPrefix}-component ${this.options.classPrefix}-component-${options.name}`);
        this.hide();
    }

    position(targetOffset) {
        const bodyPosition = offset(document.body);

        let left,
            top,
            height,
            width;

        switch (this.options.position) {

        case BackdropSide.position.TOP:
            left = '0';
            top = '0';
            height = targetOffset.top + 'px';
            width = '100%';
            break;

        case BackdropSide.position.RIGHT:
            left = targetOffset.left + targetOffset.width + 'px';
            top = targetOffset.top + 'px';
            height = targetOffset.height + 'px';
            width = Math.min(bodyPosition.left + bodyPosition.width - targetOffset.left - targetOffset.width, targetOffset.viewportWidth - targetOffset.left - targetOffset.width) + 'px';
            break;

        case BackdropSide.position.BOTTOM:
            left = '0';
            top = targetOffset.top + targetOffset.height + 'px';
            height = Math.max(bodyPosition.top + bodyPosition.height - targetOffset.top - targetOffset.height, targetOffset.viewportHeight - targetOffset.top - targetOffset.height) + 'px';
            width = '100%';
            break;

        case BackdropSide.position.LEFT:
            left = '0';
            top = targetOffset.top + 'px';
            height = targetOffset.height + 'px';
            width = targetOffset.left + 'px';
            break;

        default:
            throw new Error('Invalid position: ' + this.options.position);
        }

        Object.assign(this.element.style, {
            position: this.options.fixed ? 'fixed' : 'absolute',
            left: left,
            top: top,
            height: height,
            width: width
        });
        this.show();
    }

}

BackdropSide.position = new Enum([
    'TOP',
    'RIGHT',
    'BOTTOM',
    'LEFT'
]);
