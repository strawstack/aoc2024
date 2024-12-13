import input from './input.txt';
import { prototypes } from '../../helper.js';

function mdic(n, target) {
    const d = {};
    const base = n;
    let cur = n;
    let index = 1;
    while (cur <= target) {
        d[cur] = index;
        cur += base;
        index += 1;
    }
    return d;
}

function solve({ ax, ay, bx, by, x, y }) {
    const bxm = mdic(bx, x);

    // For every number of presses of 'a'...
    for (let a = 0; a <= 100; a++) {
        
        // Get the resulting 'x' value
        const xr = x - ax * a;
        const yr = y - ay * a;
        
        // Can 'bx' match the result and does the 'by' line up as well
        if (xr in bxm && by * bxm[xr] === yr) {
            return 3 * a + bxm[xr];
        }
    }

    return 0;
}

function sol(data) {
    const machines = data.trim().split("\n\n")
        .map(pack => {
            const result = [
                ...pack.matchAll(/X\+(\d+), Y\+(\d+)\n.+X\+(\d+), Y\+(\d+)\n.+X=(\d+), Y=(\d+)/g)
            ];
            const ax = parseInt(result[0][1]);
            const ay = parseInt(result[0][2]);
            const bx = parseInt(result[0][3]);
            const by = parseInt(result[0][4]);
            const x = parseInt(result[0][5]);
            const y = parseInt(result[0][6]);
            return { ax, ay, bx, by, x, y };
        });

    let total = 0;
    for (const machine of machines) {
        total += solve(machine);
    }
    return total;
}

prototypes();
console.log(sol(input));