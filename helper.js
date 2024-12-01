export function prototypes() {
    Array.prototype.dropLast = function() {
        this.pop();
        return this;
    };
    Array.prototype.unzip = function() {
        const left = [];
        const right = [];
        this.forEach(v => {
            left.push(v[0]);
            right.push(v[1]);
        });
        return [left, right];
    };
    Array.prototype.zip = function() {
        const res = [];
        const left = this[0];
        const right = this[1];
        for (let i = 0; i < Math.max(left.length, right.length); i++) {
            const l = (i < left.length) ? left[i] : null;
            const r = (i < right.length) ? right[i] : null;
            res.push([l, r]); 
        }
        return res;
    };
}