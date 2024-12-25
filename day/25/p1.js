import input from './input.txt';
import { prototypes, not } from '../../helper.js';

function fz(lst) {
    const fre = {};
    for (const c of lst) {
        if (not(c in fre)) fre[c] = 0;
        fre[c] += 1;
    }
    return fre;
}

function rot(grid) {
    const ng = [];
    for (let x = 0; x < grid[0].length; x++) {
        const row = [];
        for (let y = grid.length - 1; y >= 0; y--) {
            row.push(grid[y][x]);
        }
        ng.push(row);
    }
    return ng;
}

function sol(data) {
    const type = {KEY: 0, LOCK: 1};
    let HEIGHT = null;
    const grids = data.trim().split("\n\n")
        .map(line => line.split("\n").map(row => row.split("")))
        .map(grid => {
            HEIGHT = grid.length;
            return {
                type: (grid[0].every(v => v === "#")) ? type.LOCK : type.KEY,
                count: rot(grid).map(row => fz(row)).map(d => d["#"])
            }
        });
    
    // grids is a list of obj {type, count}. count is a list of heights
    const keys = grids.filter(v => v["type"] === type.KEY);
    const locks = grids.filter(v => v["type"] === type.LOCK);

    let total = 0;
    for (const { count: key_count } of keys) {
        for (const { count: lock_count } of locks) {
            if (key_count.every((kh, i) => lock_count[i] + kh <= HEIGHT)) {
                total += 1;
            }
        }
    }

    return total;
}

prototypes();
console.log(sol(input));