import input from './input.txt';
import { prototypes, hash, adj4, dir, not } from '../../helper.js';

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

function dij({ end, walls, visited, dist, heap }) {

    while (heap.length > 0) {
        const { key, pos, face } = heap.pop();

        if (pos.eq(end)) {
            return dist[key];
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

        for (const { face, cost } of edges) {
            const t1 = pos.add(dir[face]);
            const h3 = hash3(t1, face);
            if (not(hash(t1) in walls)) {
                const isNew = not(h3 in dist);
                if (isNew || dist[key] + cost < dist[h3]) {
                    dist[h3] = dist[key] + cost;
                    if (isNew) {
                        heap.push({
                            key: h3,
                            pos: t1,
                            face
                        });
                    }
                }
            }
        }
        heap.sort((a, b) => dist[b.key] - dist[a.key]);
    }
}

function hash3({x, y}, face) {
    return `${x}:${y}:${face}`;
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

    return dij({
        end, 
        walls, 
        visited: {},
        dist,
        heap: myheap}
    );
    
}

prototypes();

const test_7036 = `###############
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

const test_11048 = `#################
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
//console.log(sol(test_7036));
//console.log(sol(test_11048));
console.log(sol(input));