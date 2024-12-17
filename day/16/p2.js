import input from './input.txt';
import { prototypes, hash, adj4, dir, not, copy } from '../../helper.js';

import { heap } from './heap.js';

function rot(d) {
    const lookup = {
        'UP': 'RIGHT',
        'RIGHT': 'DOWN',
        'DOWN': 'LEFT',
        'LEFT': 'UP'
    };
    return lookup[d];
}

function follow(cur, parent, tiles, visited) {
    for (let c of cur) {
        const hc3 = hash3(c.pos, c.face);
        
        if (hc3 in visited) continue;
        visited[hc3] = true;
        
        tiles[hash(c.pos)] = true;
        const nx = parent[hc3];
        if (nx.length > 0) {
            follow(nx, parent, tiles, visited);
        }
    }
}

function dij({ end, walls, visited, dist, heap, parent, tiles, best, grid }) {

    while (heap.length > 0) {
        const { key, pos, face } = heap.pop();

        if (pos.eq(end)) {
            if (best === null) best = dist[key];
            if (dist[key] === best) {
                debugger;
                follow([{pos, face}], parent, tiles, {});
            }
            continue;
        }

        if (key in visited) continue;
        visited[key] = true;

        const edges = [
            {
                face: face, // forward
                cost: 1
            },
            {
                face: rot(face), // right
                cost: 1000 + 1
            },
            {
                face: rot(rot(rot(face))), // Left turn
                cost: 1000 + 1
            },
        ];

        const parent_face = face;
        for (const { face, cost } of edges) {
            const t1 = pos.add(dir[face]);
            const h3 = hash3(t1, face);
            if (not(hash(t1) in walls)) {
                const isNew = not(h3 in dist);
                if (isNew || dist[key] + cost <= dist[h3]) {
                    
                    // If not yet reached 
                    if (isNew) {
                        dist[h3] = dist[key] + cost;
                        parent[h3] = [{ pos, face: parent_face }];
                        heap.push({
                            key: h3,
                            pos: t1,
                            face
                        });
                    } else {
                        if (dist[key] + cost === dist[h3]) {
                            parent[h3].push({ pos, face: parent_face });

                        } else { // dist[key] + cost < dist[h3]
                            parent[h3] = [{ pos, face: parent_face }];
                            dist[h3] = dist[key] + cost;

                        }
                    }
                }
            }
        }
        heap.sort((a, b) => dist[b.key] - dist[a.key]);
    }
    return;
}

function hash3({x, y}, face) {
    return `${x}:${y}:${face}`;
}

function print(walls, tiles, grid, parent) {
    const height = grid.length;
    const width = grid[0].length;
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const h = hash({x, y});
            if (h in walls) {
                row.push("#");

            } else if (h in tiles) {
                row.push("O");

            } else {
                row.push(".");
            }
        }
        console.log(row.join(""));
    }
    console.log("");
}

function sol(data) {
    const { start, end, walls } = (() => {
        const grid = data.trim().split("\n").map(line => line.split(""));
        const start = {x: null, y: null};
        const end = {x: null, y: null};
        const walls = {};
        grid.forEach((_, y) => {
            grid[y].forEach((c, x) => {
                if (c === 'S') {
                    start.x = x;
                    start.y = y;

                } else if (c === "E") {
                    end.x = x;
                    end.y = y;

                } else if (c === "#") {
                    walls[hash({x, y})] = {x, y};

                }
            });
        });
        return {start, end, walls};
    })();
    
    const dist = {};
    const face = "RIGHT";
    const h3 = hash3(start, face);
    dist[h3] = 0;
    // const myheap = heap([{
    //         key: h3,
    //         pos: start,
    //         face
    //     }],
    //     (a, b) => {
    //         return dist[hash3[a.key]] < dist[hash3[b.key]]
    //     },
    //     item => item.key
    // );

    const myheap = [{
        key: h3,
        pos: start,
        face
    }];

    const parent = {
        [h3]: []
    };
    const tiles = {};

    dij({
        end, 
        walls, 
        visited: {},
        dist,
        heap: myheap,
        parent,
        tiles,
        best: null,
        grid: data.trim().split("\n")
    });

    // print(walls, tiles, data.trim().split("\n"), parent);

    return tiles.keys().length;

}

prototypes();

const test_45 = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;

const test_64 = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;
// console.log(sol(test_45));
// console.log(sol(test_64));
console.log(sol(input));