import input from './input.txt';
import { prototypes, hash, inBounds } from '../../helper.js';

const adj = [
    {x: 0, y: -1},
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0}
];

function bfs(grid, pos, visited) {
    const h = hash(pos);
    if (h in visited) return 0;
    visited[h] = true;

    const cell = grid[pos.y][pos.x];
    if (cell === 9) return 1;

    let total = 0;
    for (let a of adj) {
        const t = pos.add(a);
        if (inBounds(grid, t) && (grid[t.y][t.x] - cell) === 1) {
            total += bfs(grid, t, visited);
        }
    }
    return total;
}

function sol(data) {
    const grid = data.trim().split("\n")
        .map(line => line.split("").map(n => parseInt(n)));
    
    let total = 0;
    grid.forEach((_, y) => {
        grid[y].forEach((c, x) => {
            if (c === 0) {
                total += bfs(grid, {x, y}, {});
            }
        });
    });

    return total;
}

prototypes();
console.log(sol(input));