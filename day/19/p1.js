import input from './input.txt';
import { prototypes, not } from '../../helper.js';

function cutTowel(design, pat, available, cache) {
    if (not(design.includes(pat))) return false;
    if (design === pat) return true;
    const pieces = design.split(pat);
    return pieces.every(piece => createTowel(piece, available, cache));
}

export function createTowel(design, available, cache) {
    if (design === "") return true;

    if (design in cache) {
        return cache[design];
    }

    for (const pat of available) {
        if (cutTowel(design, pat, available, cache)) {
            cache[design] = true;
            return true;
        }
    }

    cache[design] = false;
    return false;
}

function sol(data) {
    const [ avail, make ] = data.trim().split("\n\n");
    const available = avail.split(", ");
    const required = make.split("\n");
    
    let total = 0;
    const cache = {};
    for (let design of required) {
        if (createTowel(design, available, cache)) {
            total += 1;
        }
    }
    return total;
}

if (require.main === module) {
    prototypes();
    console.log(sol(input));
}
