import input from './input.txt';
import { prototypes, not, time } from '../../helper.js';

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

function inBoundsPassthrough(grid, pos) {
    return inBounds(grid, pos) ? pos : null;
}

function inBounds(grid, {x, y}) { 
    return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
}

function hash(pos) {
    return JSON.stringify(pos);
}

function trackHash(vid, dir) {
    return `${vid}${dir}`;
}

function main(graph, vid, dir) {
    const track = {};
    let nvid = vid;
    while (true) {
        const tr = trackHash(nvid, dir);
        if (tr === `{"x":74,"y":41}R`) {
            debugger;
        }
        if (tr in track) return true;
        track[tr] = true;

        nvid = graph[nvid][dir];
        if (nvid === null) return false;
        dir = rot[dir];
    }
}

// Modifies graph
function placeBlock(graph, grid, {x, y}, additional) {
    const undos = [];

    const h = hash({x, y});
    graph[h] = {
        U: null,
        R: null,
        D: null,
        L: null
    };

    undos.push(() => {
        delete graph[h];
    });

    const adj = {
        U: inBoundsPassthrough(grid, ({x, y}).add(toVec["U"])),
        R: inBoundsPassthrough(grid, ({x, y}).add(toVec["R"])),
        D: inBoundsPassthrough(grid, ({x, y}).add(toVec["D"])),
        L: inBoundsPassthrough(grid, ({x, y}).add(toVec["L"]))
    };

    for (let key in adj) {
        let pos = adj[key];
        if (pos) {
            const dir = rot[rot[rot[key]]];
            while (true) {
                let n = pos.add(toVec[dir]);
                if (not(inBounds(grid, n))) break;

                if (grid[n.y][n.x] === "#") {
                    graph[h][rot[rot[key]]] = hash(n);
                    break;
                
                } else {
                    pos = n;
        
                }
            }
        }
    }

    if (additional) {
        for (let key in adj) {
            let pos = {x, y};
            const dir = key;
            while (true) {
                let n = pos.add(toVec[dir]);
                if (not(inBounds(grid, n))) break;
                if ((grid[n.y][n.x]) === "#") break;

                const side = n.add(toVec[rot[dir]]);
                if (not(inBounds(grid, side))) break;

                if (grid[side.y][side.x] === "#") {
                    const before = graph[hash(side)][rot[dir]];
                    
                    graph[hash(side)][rot[dir]] = h;

                    const hs = hash(side);
                    const rd = rot[dir];
                    undos.push(() => {
                        graph[hs][rd] = before;
                    });
                
                }
                pos = n;
            }
        }
    }

    return () => {
        for (let u of undos) {
            u();
        }
    };
}

function grid2graph(grid) {
    const graph = {};
    grid.forEach((_, y) => {
        grid[y].forEach((c, x) => {
            if (c === "#") {
                placeBlock(graph, grid, {x, y});
            }
        });
    });
    return graph;
}

function getStart(grid, {x, y}, pos) {
    let dir = "U";
    while (true) {
        let n = pos.add(toVec[dir]);
        if (not(inBounds(grid, n))) {
            throw new Error("Should not get here. Should always hit a block.");
        };

        if (n.eq({x, y})) return {x, y};

        if (grid[n.y][n.x] === "#") {
            return n;
        
        } else {
            pos = n;

        }
    }
}

function sol(data) {
    const grid = data.trim().split("\n").map(line => line.split(""));
    const graph = grid2graph(grid);

    const pos = (() => {
        let pos = null;
        grid.forEach((_, y) => {
            grid[y].forEach((c, x) => {
                if (c === "^") {
                    pos = {x, y};
                }
            });
        });
        return pos;
    })();

    let graph_total = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
        
            // graph version
            if (grid[y][x] === "#") continue;
            if (grid[y][x] === "^") continue;
            
            const undo = placeBlock(graph, grid, {x, y}, true);
            const sv = getStart(grid, {x, y}, pos);
            if (main(graph, hash(sv), 'U')) {
                graph_total += 1;
            }
            undo();
        }
    }
    return graph_total.toString();
}

prototypes();
time(() => sol(input));
