import input from './input.txt';
import { prototypes, adj4, hash, not, inBounds } from '../../helper.js';

function find(grid, symb) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const c = grid[y][x];
            if (c === symb) {
                grid[y][x] = ".";
                return {x, y};
            }
        }
    }
}

function walk(grid, pos, startPos, visited, path) {
    if (pos.eq(startPos)) {
        return path[hash(startPos)].value;
    };

    const h = hash(pos);
    visited[h] = true;

    for (const a of adj4) {
        const t = pos.add(a);
        const ht = hash(t);

        if (grid[t.y][t.x] === "." && not(ht in visited)) {
            path[ht] = {
                pos: t,
                value: path[h].value + 1
            };
            return walk(grid, t, startPos, visited, path);
        }
    }
}

function hash4(a, b) {
    return `${JSON.stringify(a)}:${JSON.stringify(b)}`;
}

function sol(data) {
    const grid = data.trim().split("\n").map(line => line.split(""));
    const startPos = find(grid, "S");
    const endPos = find(grid, "E");

    const visited = {};
    const path = {
        [hash(endPos)]: {
            pos: endPos,
            value: 0
        }
    };

    const best = walk(grid, endPos, startPos, visited, path);

    let cheats = {};
    for (const k in path) {
        const { pos, value } = path[k];
        for (let v = -20; v <= 20; v++) {
            const other = 20 - Math.abs(v);
            for (let h = -other; h <= other; h++) {
                if (v === 0 && h === 0) continue;
                const t2 = pos.add({x: h, y: v});
                if (not(inBounds(grid, t2))) continue;
                if (grid[t2.y][t2.x] === ".") {
                    const start = best - value; // start to pos
                    const cheat = path[hash(t2)].value; // cheat to end
                    const cheat_duration = Math.abs(h) + Math.abs(v);
                    const save = best - (start + cheat + cheat_duration);
                    if (save >= 100) {
                        const h4 = hash4(pos, t2);
                        cheats[h4] = save;
                    }
                }
            }
        }
    }

    return cheats.keys().length;
}

prototypes();
console.log(sol(input));