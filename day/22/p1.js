import input from './input.txt';
import { prototypes } from '../../helper.js';

function calculate(num, times) {
    let t = num;
    for (let i = 0; i < times; i++) {
        const a = (t ^ (t * 64)) % 16777216;
        const b = (a ^ Math.floor(a / 32)) % 16777216;
        const c = (b ^ (b * 2048)) % 16777216;
        t = c;
    }
    return t;
}

function sol(data) {
    const nums = data.trim().split("\n").map(n => parseInt(n, 10));
    const times = 2000;
    let total = 0;
    for (let num of nums) {
        total += calculate(num, times);
    }
    return total;
}

prototypes();
console.log(sol(input));