import input from './input.txt';
import { prototypes, not, copy } from '../../helper.js';

function main(grid, loc) {

    if (grid[loc.y][loc.x] === "#") return false;
    
    let pos = (() => {
        let pos = null;
        grid.forEach((row, y) => {
            grid[y].forEach((c, x) => {
                if (c === "^") {
                    pos = {x, y};
                }
            });
        });
        return pos;
    })();

    if (loc.eq(pos)) return false;

    grid[loc.y][loc.x] = "#";

    const toVec = {
        U: {x: 0, y: -1},
        R: {x: 1, y: 0},
        D: {x: 0, y: 1},
        L: {x: -1, y: 0}
    };
    
    const rot = {
        U: 'R',
        R: 'D',
        D: 'L',
        L: 'U'
    };

    let dir = 'U';
    
    function hash(pos) {
        return JSON.stringify(pos);
    }

    function inBounds({x, y}) { 
        return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
    }
    const track = {};
    while (true) {

        const h = hash(pos);
        if (h in track && track[h] === dir) return true;
        if (not(h in track)) track[h] = dir;

        let n = pos.add(toVec[dir]);
        if (not(inBounds(n))) break;

        if (grid[n.y][n.x] === "#") {
            dir = rot[dir];
        
        } else {
            pos = n;

        }
    }
    return false;
}

function sol(data) {
    const grid = data.trim().split("\n").map(line => line.split(""));
    let total = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const preserve = grid[y][x];
            if (main(grid, {x, y})) {
                total += 1;
            }
            grid[y][x] = preserve;
        }
    }
    return total.toString();
}

prototypes();
console.log(sol(input));