import input from './input.txt';
import { prototypes, dir as dir_lookup, hash } from '../../helper.js';

function sol(data) {
    data = data.trim().split("\n\n");
    const { boxes, walls, player } = (() => {
        const grid = data[0].split("\n").map(line => line.split(""));
        const boxes = {};
        const walls = {};
        const player = { x: null, y: null };
        grid.forEach((_, y) => {
            grid[y].forEach((c, x) => {
                if (c === "#") { // wall
                    walls[hash({x, y})] = true;

                } else if (c === "O") { // box
                    boxes[hash({x, y})] = {x, y};

                } else if (c === "@") { // player
                    player.x = x;
                    player.y = y;

                }
            });
        })
        return { boxes, walls, player };
    })();
    const dirs = data[1].split("\n").join("").split("").map(s => {
        const lookup = {
            '^': 'UP',
            '>': 'RIGHT',
            'v': 'DOWN',
            '<': 'LEFT'
        };
        return dir_lookup[lookup[s]];
    });

    return solve({ boxes, walls, player, dirs });
}

function openSpace(start, dir, { boxes, walls }) {
    let cur = start;
    while (true) {
        const hc = hash(cur);
        if (hc in walls) return false;
        if (hc in boxes) {
            cur = cur.add(dir);

        } else { // open space
            return cur;

        }
    }
}

function solve({ boxes, walls, player, dirs }) {

    for (const dir of dirs) {
        const t = player.add(dir);
        const h = hash(t);
        if (h in walls) continue;
        if (h in boxes) {
            const open = openSpace(t, t.sub(player), { boxes, walls });
            if (open) {
                player = t;
                delete boxes[h];
                boxes[hash(open)] = open;
            }
        } else { // move to open space
            player = t;

        }
        
    }

    return boxes.values().reduce((a, {x, y}) => {
        return a + 100 * y + x;
    }, 0);
}

prototypes();
console.log(sol(input));