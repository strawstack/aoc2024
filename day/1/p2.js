import input from './input.txt';
import { prototypes } from '../../helper.js';

function calculate([left, right]) {
    const lookup = right.reduce((a, c) => {
        if (!(c in a)) a[c] = 0;
        a[c] += 1;
        return a;
    }, {});
    return left.reduce((a, c) => a + c * ((c in lookup) ? lookup[c] : 0), 0);
}

function sol(data) {
    return calculate(data.split("\n").dropLast()
        .map(line => line.split(/\s+/).map(x => parseInt(x)))    
        .unzip());
}

prototypes();
console.log(sol(input));