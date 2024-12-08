import input from './input.txt';
import { prototypes, hash } from '../../helper.js';

function sol(data) {
    const grid = data.trim().split("\n")
        .map(line => line.split(""));
    
    function inBounds(grid, {x, y}) {
        return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length; 
    }

    const locs = (() => {
        const locations = {};
        grid.forEach((_, y) => {
            grid[y].forEach((cell, x) => {
                if (cell !== ".") {
                    const h = hash({x, y});
                    locations[h] = {
                        type: cell,
                        hash: h,
                        pos: {x, y}
                    }
                }
            });
        });
        return locations;
    })();

    const antinodes = {};
    for (const k1 in locs) {
        for (const k2 in locs) {
            if (k1 !== k2) {
                const p1 = locs[k1];
                const p2 = locs[k2];
                if (p1.type === p2.type) {
                    const dist = p1.pos.sub(p2.pos);
                    const an1 = p1.pos.add(dist);
                    const an2 = p2.pos.sub(dist);
                    if (inBounds(grid, an1)) {
                        antinodes[hash(an1)] = { p1, p2 };
                    }
                    if (inBounds(grid, an2)) {
                        antinodes[hash(an2)] = { p1, p2 };
                    }
                }
            }
        }
    }

    return antinodes.keys().length;
}

prototypes();
console.log(sol(input));