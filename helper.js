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