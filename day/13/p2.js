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

function solve({ ax, ay, bx, by, x, y, extra }, max_press) {
    const bxm = mdic(bx, x);

    // For every number of presses of 'a'...
    for (let a = 0; a <= max_press; a++) {
        
        // Get the resulting 'x' value
        const xr = x - ax * a;
        const yr = y - ay * a;
        
        // Can 'bx' match the result and does the 'by' line up as well
        if (xr in bxm && by * (bxm[xr] + extra) === yr) {
            return 3 * a + bxm[xr] + extra;
        }
    }

    return 0;
}

function sol(data) {
    let max_press = 0;
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
            const big = 10000000000000;
            const lcmx = ax * bx;
            const lcmy = ay * by;
            max_press = Math.max(max_press, Math.max(lcmx, lcmy));
            const xv = x + big;
            const yv = y + big;

            let apps = Math.floor(xv / lcmx);
            let press = ax;

            return { ax, ay, bx, by, x: xv % lcmx, y: yv,
                extra: apps * press
            };
        });

    let total = 0;
    for (const machine of machines) {
        total += solve(machine, max_press);
    }
    return total;
}

prototypes();
console.log(sol(input));