import input from './input.txt';
import { prototypes } from '../../helper.js';

function splitNumber(str) {
    const half = Math.floor(str.length / 2);
    return {
        left: parseInt(str.slice(0, half)),
        right: parseInt(str.slice(half)),
    };
}

function hash(stone, blinks) {
    return `${stone}:${blinks}`;
}

function calculate(stone, cache, blinks) {
    if (blinks === 0) return 1;
    
    const h = hash(stone, blinks);
    if (h in cache) return cache[h];

    const str = stone.toString();
    
    if (stone === 0) {
        cache[h] = calculate(1, cache, blinks - 1);
        return cache[h];
    
    } else if ((str.length % 2) === 0) {
        const { left, right } = splitNumber(str);
        const v_left = calculate(left, cache, blinks - 1);
        const v_right = calculate(right, cache, blinks - 1);
        cache[h] = v_left + v_right;
        return cache[h];

    } else {
        cache[h] = calculate(stone * 2024, cache, blinks - 1);
        return cache[h];
    }
}

function sol(data) {
    const stone_data = data.trim().split(" ").map(n => parseInt(n));

    const blinks = 75;
    const cache = {};

    let total = 0;
    for (const stone of stone_data) {
        total += calculate(stone, cache, blinks);
    }
    return total;
}

prototypes();
console.log(sol(input));