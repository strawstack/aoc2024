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
                    walls[hash({x: 2 * x, y})] = true;
                    walls[hash({x: 2 * x + 1, y})] = true;

                } else if (c === "O") { // box
                    boxes[hash({x: 2 * x, y})] = {x: 2 * x + 1, y};
                    boxes[hash({x: 2 * x + 1, y})] = {x: 2 * x, y};

                } else if (c === "@") { // player
                    player.x = 2 * x;
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
    // print({ boxes, walls, player });
    return solve({ boxes, walls, player, dirs });
}

function print({ boxes, walls, player }) {
    const width = 2 * '##########'.length;
    const height = 10;
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const h = hash({x, y});
            if (h in walls) {
                row.push("#");

            } else if (h in boxes) {
                row.push("O");

            } else if (({x, y}).eq(player)) {
                row.push("@");

            } else {
                row.push(".");

            }
        }
        console.log(row.join(""));
    }
}

function findOpenSpace(pos, push_dir, { boxes, walls }, seen, collect) {
    const h = hash(pos);
    if (h in seen) return true;
    
    if (h in walls) return false;
    if (h in boxes) {
        const b1 = pos;
        const b1h = hash(b1);
        collect[b1h] = b1;
        seen[b1h] = true;
        const r1 = findOpenSpace(b1.add(push_dir), push_dir, { boxes, walls }, seen, collect);

        const b2 = boxes[h];
        const b2h = hash(b2);
        collect[b2h] = b2;
        seen[b2h] = true;
        const r2 = findOpenSpace(b2.add(push_dir), push_dir, { boxes, walls }, seen, collect);

        if (!r1) return false;
        if (!r2) return false;
        return true;

    } else {
        return true;

    }
}

function openSpace(start, push_dir, { boxes, walls }) {
    const seen = {};
    const collect = {};
    const res = findOpenSpace(start, push_dir, { boxes, walls }, seen, collect);

    let lst = null;
    if (push_dir.x === 0) { // vertical
        if (push_dir.y === -1) {
            lst = collect.values().sort((a, b) => a.y - b.y);

        } else {
            lst = collect.values().sort((a, b) => b.y - a.y);

        }
    } else { // horizontal
        if (push_dir.x === -1) {
            lst = collect.values().sort((a, b) => a.x - b.x);

        } else {
            lst = collect.values().sort((a, b) => b.x - a.x);

        }
    }

    return (res) ? lst : false;
}

function solve({ boxes, walls, player, dirs }) {

    for (const dir of dirs) {
        const t = player.add(dir);
        const h = hash(t);
        if (h in walls) continue;
        if (h in boxes) {
            const push_dir = t.sub(player);
            const boxList = openSpace(t, push_dir, { boxes, walls });
            if (boxList) { // Boxlist is sorted far to near
                player = t;
                for (let box of boxList) {
                    const p = hash(box);
                    const link = boxes[p];
                    delete boxes[p];
                    const n = hash(box.add(push_dir));
                    boxes[n] = link.add(push_dir);
                }
            }
        } else { // move to open space
            player = t;

        }

        // print({ boxes, walls, player });
        
    }

    const seen = {};
    return boxes.values().reduce((a, {x, y}) => {
        const h = hash({x, y});
        const o = boxes[hash({x, y})];
        const oh = hash(o);
        if (h in seen || oh in seen) return a;

        seen[h] = true;
        seen[hash(o)] = true;

        const value = Math.min(
            100 * y + x,
            100 * o.y + o.x
        );

        return a + value;
    }, 0);
}

prototypes();
console.log(sol(input));

const test = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;
const test2 = `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`;
// console.log(sol(test))