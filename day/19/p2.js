import input from './input.txt';
import { createTowel } from './p1.js';
import { prototypes, not } from '../../helper.js';


function getCombos(design, available, cache) {
    if (design === "") return 1;

    if (design in cache) {
        return cache[design];
    }

    let total = 0;
    let match = false;
    for (const pat of available) {
        if (design.indexOf(pat) === 0) {
            match = true;
            total += getCombos(design.slice(pat.length), available, cache);
        }
    }

    if (not(match)) {
        cache[design] = 0;
        return total;
    }

    cache[design] = total;
    return total;
}

function sol(data) {
    const [ avail, make ] = data.trim().split("\n\n");
    const available = avail.split(", ");
    const required = make.split("\n");
    
    let total = 0;
    const create_cache = {};
    const get_cache = {};
    for (let design of required) {
        if (createTowel(design, available, create_cache)) {
            total += getCombos(design, available, get_cache);
        }
    }
    return total;
}

prototypes();
console.log(sol(input));