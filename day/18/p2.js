import input from './input.txt';
import { prototypes, hash, adj4, inBounds2, not } from '../../helper.js';
import { queue } from './queue.js';

function print({ height, width, walls, visited }) {
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const p = {x, y};
            const hp = hash(p);
            if (hp in walls) {
                row.push("#");

            } else if (hp in visited) {
                row.push("O");

            } else {
                row.push(".");

            }
        }
        console.log(row.join(""));
    }
    console.log("");
}

function bfs({ height, width, cur, end, walls, visited }) {
    const q = queue();
    q.add(cur);
    
    while (q.size() > 0) {
        const { pos, steps } = q.pop();
        const h = hash(pos);

        // print({ height, width, walls, visited });

        if (pos.eq(end)) {
            return steps;
        }

        if (h in visited) continue;
        visited[h] = true;

        for (const a of adj4) {
            const t = pos.add(a);
            if (not(inBounds2(width, height, t))) continue;
            const ht = hash(t);
            if (ht in walls) continue;
            if (ht in visited) continue;

            q.add({
                pos: t,
                steps: steps + 1
            });

        }
    }
    return null;
}

function sol(data) {
    const bytes = data.trim().split("\n")
        .map(line => {
            const pos = line.split(",").map(n => parseInt(n));
            return {x: pos[0], y: pos[1]}
        });
    
    const walls = {};
    for (let i = 0; i < 1024; i++) {
        walls[hash(bytes[i])] = bytes[i];
    }

    for (let i = 1024; i < bytes.length; i++) {
        walls[hash(bytes[i])] = bytes[i];

        const ans = bfs({
            height: 71, 
            width: 71,
            cur: {
                pos: {x: 0, y: 0},
                steps: 0
            },
            end: {x: 70, y: 70},
            walls,
            visited: {}
        });

        if (ans === null) {
            return `${bytes[i].x},${bytes[i].y}`;
        }

    }
}

prototypes();
console.log(sol(input));