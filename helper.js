export function prototypes() {
    const arr = {
        dropLast: function() {
            this.pop();
            return this;
        },
        unzip: function() {
            const left = [];
            const right = [];
            this.forEach(v => {
                left.push(v[0]);
                right.push(v[1]);
            });
            return [left, right];
        },
        zip: function() {
            const res = [];
            const left = this[0];
            const right = this[1];
            for (let i = 0; i < Math.max(left.length, right.length); i++) {
                const l = (i < left.length) ? left[i] : null;
                const r = (i < right.length) ? right[i] : null;
                res.push([l, r]); 
            }
            return res;
        }
    };

    const obj = {
        add: function(vec) {
            return {
                x: this.x + vec.x,
                y: this.y + vec.y,
            };
        },
        sub: function(vec) {
            return {
                x: this.x - vec.x,
                y: this.y - vec.y,
            };
        },
        equal: function(vec) {
            return this.x === vec.x && this.y === vec.y;
        },
        flip: function() {
            return this.mul(-1);
        },
        mul: function(s) {
            return {
                x: s * this.x,
                y: s * this.y,
            };
        },
        keys: function() {
            return Object.keys(this).filter(k => this.hasOwnProperty(k));
        },
        values: function() {
            return Object.values(this);
        },
        mag: function() {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        },
        modv: function(vec) {
            const x = this.x % vec.x;
            const y = this.y % vec.y;
            return {
                x: (x < 0) ? x + vec.x : x,
                y: (y < 0) ? y + vec.y : y
            };
        } 
    };

    for (let k in arr) {
        Object.defineProperty(Array.prototype, k, {
            value: arr[k],
            enumerable: false
        });
    }

    for (let k in obj) {
        Object.defineProperty(Object.prototype, k, {
            value: obj[k],
            enumerable: false
        });
    }
}

export function not(value) {
    return !value;
}

export function copy(value) {
    return JSON.parse(JSON.stringify(value));
}

export function time(func) {
    const start = new Date();
    const ans = func();
    console.log(`time: ${(new Date()) - start}`);
    console.log(ans);
}

export function hash(value) {
    return JSON.stringify(value);
}

export function inBounds(grid, {x, y}) {
    return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
}

export function inBounds2(width, height, {x, y}) {
    return y >= 0 && y < height && x >= 0 && x < width;
}

export const adj4 = [
    {x: 0, y: -1},
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0}
];

export const adj8 = [
    ...adj4,
    {x: 1, y: -1},
    {x: 1, y: 1},
    {x: -1, y: 1},
    {x: -1, y: -1}
];

export const dir = {
    UP: {x: 0, y: -1},
    RIGHT: {x: 1, y: 0},
    DOWN: {x: 0, y: 1},
    LEFT: {x: -1, y: 0},
    UP_RIGHT: {x: 1, y: -1},
    DOWN_RIGHT: {x: 1, y: 1},
    DOWN_LEFT: {x: -1, y: 1},
    UP_LEFT: {x: -1, y: -1}
};

export function gcd(a, b) {
    if (b) {
        return gcd(b, a % b);
    } else {
        return Math.abs(a);
    }
}

export function mod(a, b) {
    const v = a % b;
    return (v < 0) ? v + b : v;
}

