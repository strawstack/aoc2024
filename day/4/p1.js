import input from './input.txt';
import { prototypes } from '../../helper.js';

function sol(data) {

    function bounds(grid, {x, y}) {
        return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
    }

    function grab(grid, pos, dir, len) {
        const res = [];
        let loc = pos;
        for (let i = 0; i < len; i++) {
            if (!bounds(grid, loc)) break;
            res.push( grid[loc.y][loc.x] );
            loc = loc.add(dir);
        }
        return res.join("");
    }

    function check(grid, pos, word, dirs) {
        let count = 0;
        // For each direction
        for (let dir of dirs) {
            const value = grab(grid, pos, dir, word.length);
            if (value === word || value.split("").reverse().join("") === word) {
                count += 1;
            }
        }
        return count;
    }

    const grid = data.trim().split("\n");
    const word = "XMAS";
    const dirs = [
        {x: 1, y: 0}, // right (left)
        {x: 0, y: 1}, // down (up)
        {x: 1, y: 1}, // down-right (up-left)
        {x: 1, y: -1}, // up-right (down-left)
    ];

    let total = 0;

    // For each starting location
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const count = check(grid, {x, y}, word, dirs);
            total += count;
        }
    }

    return total;
}

prototypes();
console.log(sol(input));