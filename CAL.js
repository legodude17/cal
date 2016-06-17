Function.prototype.method = function (name, obj) {
    'use strict';
    this.prototype[name] = obj;
};
Function.method('props', function (name, props) {
    'use strict';
    Object.defineProperties(this.prototype[name], props);
});
Function.method('getObject', function (name) {
    'use strict';
    return this.prototype[name];
});
var CAL = function () {
    'use strict';
    this.add = new CAL.Factory(this);
};
CAL.Factory = function (container) {
    'use strict';
};
CAL.Factory.method('display', function (w, h) {
    'use strict';
    return new CAL.Display(this.container, w, h);
});
CAL.Factory.method('line', function (x1, y1, x2, y2) {
    'use strict';
    return new CAL.Line(this.container, x1, y1, x2, y2);
});
CAL.Display = function (container, w, h) {
    'use strict';
    var c = document.body.appendChild(document.createElement('canvas'));
    c.width = w;
    c.height = h;
    this.container = container;
    this.canvas = c;
    this.context = c.getContext('2d');
};
CAL.Point = function (x, y) {
    'use strict';
    this.x = +x;
    this.y = +y;
};
CAL.Point.method('add', function (x, y, mod) {
    'use strict';
    if (typeof x === 'object') {
        if (!(x.x && x.y)) {
            throw new Error('Incorrect x value for CAL.Point#add!');
        }
    } else {
        x = new CAL.Point(x, y);
    }
    var sum = new CAL.Point(this.x + x.x, this.y + x.y);
    if (mod) {
        this.x += sum.x;
        this.y = sum.y;
    }
    return sum;
});
CAL.Point.method('scale', function (num, mod) {
    'use strict';
    var result = new CAL.Point(this.x * num, this.y * num);
    if (mod) {
        this.x = result.x;
        this.y = result.y;
    }
    return result;
});
CAL.Point.method('copy', function () {
    'use strict';
    return new CAL.Point(this.x, this.y);
});
CAL.Line = function (container, x1, y1, x2, y2) {
    'use strict';
    this.container = container;
    if (typeof x1 === 'number' && typeof y1 === 'number') {
        this.start = new CAL.Point(x1, y1);
        if (typeof x2 === 'number' && typeof y2 === 'number') {
            this.end = new CAL.Point(x2, y2);
        } else {
            if (typeof x2 === 'number' && y2 === undefined) {
                this.length = x2;
            } else {
                this.end = x2;
            }
        }
    } else {
        this.start = x1;
        if (typeof y1 === 'number') {
            this.length = y1;
        } else {
            this.end = y1;
        }
    }
    if (!(this.start && typeof this.start === 'object' && typeof this.start.x === 'number' && typeof this.start.y === 'number')) {
        throw new Error('Incorrect start arguments to CAL.Line!');
    }
    if (!((this.end && typeof this.end === 'object' && typeof this.end.x === 'number' && typeof this.end.y === 'number') || (typeof this.length === 'number'))) {
        throw new Error('Incorrect end arguments to CAL.Line!');
    }
    this.calc();
};