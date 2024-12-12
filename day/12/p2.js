import input from './input.txt';
import { prototypes, adj4, inBounds, hash, dir, not } from '../../helper.js';

function dfs(grid, {x, y}, visited, region) {

    const h = hash({x, y});
    if (h in visited) return { type: null, area: 0, par: 0, region: {} };
    visited[h] = true;

    region[h] = {x, y};

    const type = grid[y][x];
    let area = 1;
    let par = 0;

    for (const a of adj4) {
        const t = ({x, y}).add(a);
        if (inBounds(grid, t)) {

            if (type === grid[t.y][t.x]) {
                const { area: oa, par: op } = dfs(grid, t, visited, region);
                area += oa;
                par += op;

            } else {
                par += 1;

            }

        } else {
            par += 1;

        }
    }

    return { type, area, par, region };
}

function edge_hash(a, b, y) {
    return hash({x: a, y: b});
}

function countPieces(edges) {

    function countEdge(lst) { 
        lst = lst.sort((a, b) => a - b);
        let total = 1;
        for (let i = 0; i < lst.length - 1; i++) {
            if (Math.abs(lst[i + 1] - lst[i]) > 1) {
                total += 1;
            }
        }
        return total;
    }

    let total = 0;
    for (const edge_list of edges.values()) {
        total += countEdge(edge_list);
    }
    return total; 
}

function sidesFromRegion(grid, region) {
    
    const vertical_edge = {};
    for (const {x, y} of region.values()) {
        const lp = ({x, y}).add(dir.LEFT);
        if (not(inBounds(grid, lp)) || not(hash(lp) in region)) {
            const eh = edge_hash(lp.x, x);
            if (not(eh in vertical_edge)) vertical_edge[eh] = [];
            vertical_edge[eh].push(y);
        }

        const rp = ({x, y}).add(dir.RIGHT);
        if (not(inBounds(grid, rp)) || not(hash(rp) in region)) {
            const eh = edge_hash(rp.x, x);
            if (not(eh in vertical_edge)) vertical_edge[eh] = [];
            vertical_edge[eh].push(y);
        }
    }

    const horizontal_edge = {};
    for (const {x, y} of region.values()) {
        const up = ({x, y}).add(dir.UP);
        if (not(inBounds(grid, up)) || not(hash(up) in region)) {
            const eh = edge_hash(up.y, y);
            if (not(eh in horizontal_edge)) horizontal_edge[eh] = [];
            horizontal_edge[eh].push(x);
        }

        const dp = ({x, y}).add(dir.DOWN);
        if (not(inBounds(grid, dp)) || not(hash(dp) in region)) {
            const eh = edge_hash(dp.y, y);
            if (not(eh in horizontal_edge)) horizontal_edge[eh] = [];
            horizontal_edge[eh].push(x);
        }
    }

    return countPieces(vertical_edge) + countPieces(horizontal_edge);
}

function sol(data) {
    const grid = data.trim().split("\n").map(line => line.split(""));

    const visited = {};
    const plot_data = [];
    grid.forEach((_, y) => {
        grid[y].forEach((c, x) => {
            const { type, area, par, region } = dfs(grid, {x, y}, visited, {});
            plot_data.push({ type, area, par, sides: sidesFromRegion(grid, region) });
        });  
    });

    return plot_data.filter(({type}) => type !== null).reduce((a, { type, area, sides }) => {
        //console.log(`type: ${type}, area: ${area}, sides: ${sides}`);
        return a + area * sides;
    }, 0);
}

prototypes();
console.log(sol(input));

const one = sol(`AAAA
BBCD
BBCC
EEEC
`);

const two = sol(`OOOOO
OXOXO
OOOOO
OXOXO
OOOOO
`);

const three = sol(`EEEEE
EXXXX
EEEEE
EXXXX
EEEEE
`);

const four = sol(`AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA
`);

const five = sol(`RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`);

if (one !== 80) throw Error(`one fails: ${one}`);
if (two !== 436) throw Error(`two fails: ${two}`);
if (three !== 236) throw Error(`three fails: ${three}`);
if (four !== 368) throw Error(`four fails: ${four}`);
if (five !== 1206) throw Error(`five fails: ${five}`);
