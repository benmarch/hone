//extremely simple enum
export class Enum {
    constructor(iterable) {
        iterable.forEach(value => {
            this[value.toUpperCase()] = value;
        });
    }
}

export function addClass(el, className) {
    const classes = className.split(' ');
    classes.filter(className => className.length).forEach(className => {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    });
}

export function removeClass(el, className) {
    const classes = className.split(' ');
    classes.filter(className => className.length).forEach(className => {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    });
}

export function parseStyle(value) {
    value = parseFloat(value);
    return isFinite(value) ? value : 0;
}

export function offset(el) {
    const elBCR = el.getBoundingClientRect();
    return {
        width: Math.round(typeof elBCR.width === 'number' ? elBCR.width : elem.offsetWidth),
        height: Math.round(typeof elBCR.height === 'number' ? elBCR.height : elem.offsetHeight),
        top: Math.round(elBCR.top + (window.pageYOffset || document.documentElement.scrollTop)),
        left: Math.round(elBCR.left + (window.pageXOffset || document.documentElement.scrollLeft)),
        viewportWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        viewportHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    };
}

export function viewportOffset(el) {
    var elemBCR = el.getBoundingClientRect(),
        offsetElem = offset(el),
        offsetBCR = {top: 0, left: 0},
        offsetParent = document.documentElement,
        offsetParentBCR = offsetParent.getBoundingClientRect(),
        offsetParentStyle = window.getComputedStyle(offsetParent);

    //raw offset
    offsetBCR.top = offsetParentBCR.top + offsetParent.clientTop;
    offsetBCR.left = offsetParentBCR.left + offsetParent.clientLeft;

    //account for window offset
    offsetBCR.top += window.pageYOffset;
    offsetBCR.left += window.pageXOffset;

    //account for padding
    offsetBCR.top += parseStyle(offsetParentStyle.paddingTop);
    offsetBCR.left += parseStyle(offsetParentStyle.paddingLeft);

    return Object.assign(offsetElem, {
        top: Math.round(elemBCR.top - offsetBCR.top),
        left: Math.round(elemBCR.left - offsetBCR.left)
    });
}

export function createElement(html) {
    const container = document.createElement('div');
    container.innerHTML = html.trim();
    return container.firstChild;
}

export function parsePadding(paddingString) {
    const pieces = paddingString.split(' ').filter(p => p.length).map(p => parseInt(p, 10));

    switch (pieces.length) {
    case 0:
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

    case 1:
        return {
            top: pieces[0],
            right: pieces[0],
            bottom: pieces[0],
            left: pieces[0]
        };

    case 2:
        return {
            top: pieces[0],
            right: pieces[1],
            bottom: pieces[0],
            left: pieces[1]
        };

    case 3:
        return {
            top: pieces[0],
            right: pieces[1],
            bottom: pieces[2],
            left: pieces[1]
        };
    case 4:
        return {
            top: pieces[0],
            right: pieces[1],
            bottom: pieces[2],
            left: pieces[3]
        };

    default:
        throw new Error('Invalid padding for hone scope: ' + paddingString);
    }
}

//stole this from Tether
export const transformKey = (function () {
    if (typeof document === 'undefined') {
        return '';
    }
    var el = document.createElement('div'),
        transforms = ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform'];

    for (let i = 0; i < transforms.length; ++i) {
        let key = transforms[i];
        if (el.style[key] !== undefined) {
            return key;
        }
    }
})();

//adapted from https://github.com/olahol/scrollparent.js
export function scrollParents(node) {
    const regex = /(auto|scroll)/;

    function parents(node, ps) {
        if (node.parentNode === null) { return ps; }

        return parents(node.parentNode, ps.concat([node]));
    }

    function style(node, prop) {
        return getComputedStyle(node, null).getPropertyValue(prop);
    }

    function overflow(node) {
        return style(node, "overflow") + style(node, "overflow-y") + style(node, "overflow-x");
    }

    function scroll(node) {
        return regex.test(overflow(node));
    }

    //start
    if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
        return [];
    }

    const allParents = parents(node.parentNode, []),
        scrollParents = allParents.filter(parent => scroll(parent));

    return [window, ...scrollParents];
}