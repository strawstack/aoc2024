import input from './input.txt';
import { prototypes, copy, inBounds } from '../../helper.js';

const adj = [
    {x: 0, y: -1},
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0}
];

function sol(data) {
    const grid = data.trim().split("\n")
        .map(line => line.split("").map(n => parseInt(n)));
    const trails = copy(grid).map(line => line.map(_ => 0));

    let overall = 0;
    for (let i = 9; i >= 0; i--) {
        grid.forEach((_, y) => {
            grid[y].forEach((c, x) => {
                if (c === 9) {
                    trails[y][x] = 1;

                } else if (c === i) {
                    let total = 0;
                    for (let a of adj) {
                        const t = ({x, y}).add(a);
                        if (inBounds(grid, t) && grid[t.y][t.x] === (i + 1)) {
                            total += trails[t.y][t.x];
                        }
                    }
                    trails[y][x] = total;
                    if (i === 0) overall += total;
                }
            });
        });
    }
    
    return overall;
}

prototypes();
console.log(sol(input));