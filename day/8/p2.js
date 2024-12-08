import input from './input.txt';
import { prototypes, hash } from '../../helper.js';

function print(grid, antinodes) {
    const render = [];
    grid.forEach((_, y) => {
        const row = [];
        grid[y].forEach((cell, x) => {
            const h = hash({x, y});
            if (h in antinodes && cell === ".") {
                row.push("#");
            } else {
                row.push(cell);
            }
        });
        render.push(row);
    });
    for (let row of render) {
        console.log(row.join(""));
    }
}

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
                    antinodes[hash(p1.pos)] = { p1, p2 };
                    antinodes[hash(p2.pos)] = { p1, p2 };
                    const dist = p1.pos.sub(p2.pos);
                    
                    let an1 = p1.pos.add(dist);
                    while (inBounds(grid, an1)) {
                        antinodes[hash(an1)] = { p1, p2 };
                        an1 = an1.add(dist);
                    }

                    let an2 = p2.pos.sub(dist);
                    while (inBounds(grid, an2)) {
                        antinodes[hash(an2)] = { p1, p2 };
                        an2 = an2.sub(dist);
                    }
                }
            }
        }
    }
    //print(grid, antinodes);
    return antinodes.keys().length;
}


const test = `
##....#....#
.#.#....0...
..#.#0....#.
..##...0....
....0....#..
.#...#A....#
...#..#.....
#....#.#....
..#.....A...
....#....A..
.#........#.
...#......##
`.replaceAll("#", ".");

prototypes();
//console.log(sol(test));
console.log(sol(input));