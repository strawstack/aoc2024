import input from './input.txt';
import { prototypes } from '../../helper.js';

function sol(data) {
    const res = data.trim().matchAll(/mul\((\d+),(\d+)\)/g);
    let total = 0;
    for (let match of res) {
        const a = match[1];
        const b = match[2];
        if (a && b) {
            total += a * b;
        }
    }
    return total;
}

prototypes();
console.log(sol(input));