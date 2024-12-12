import input from './input.txt';
import { prototypes, not, adj4, inBounds, hash } from '../../helper.js';

function dfs(grid, {x, y}, visited) {

    const h = hash({x, y});
    if (h in visited) return { type: null, area: 0, par: 0 };
    visited[h] = true;

    const type = grid[y][x];
    let area = 1;
    let par = 0;

    for (const a of adj4) {
        const t = ({x, y}).add(a);
        if (inBounds(grid, t)) {

            if (type === grid[t.y][t.x]) {
                const { area: oa, par: op } = dfs(grid, t, visited);
                area += oa;
                par += op;

            } else {
                par += 1;

            }

        } else {
            par += 1;

        }
    }

    return { type, area, par };
}

function sol(data) {
    const grid = data.trim().split("\n").map(line => line.split(""));

    const visited = {};
    const plot_data = [];
    grid.forEach((_, y) => {
        grid[y].forEach((c, x) => {
            const { type, area, par } = dfs(grid, {x, y}, visited);
            plot_data.push({ type, area, par });
        });  
    });

    return plot_data.reduce((a, { type, area, par }) => {
        return a + area * par;
    }, 0);
}

prototypes();
console.log(sol(input));

// console.log(sol(`RRRRIICCFF
// RRRRIICCCF
// VVRRRCCFFF
// VVRCCCJFFF
// VVVVCJJCFE
// VVIVCCJJEE
// VVIIICJJEE
// MIIIIIJJEE
// MIIISIJEEE
// MMMISSJEEE
// `));