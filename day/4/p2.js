import input from './input.txt';
import { prototypes } from '../../helper.js';

function sol(data) {

    function bounds(grid, {x, y}) {
        if (y >= 0 && y < grid.length && x >= 0 && x < grid[y].length) {
            return {x, y};
        } else {
            return false;
        }
    }

    function get(grid, {x, y}) {
        return grid[y][x];
    }

    function grabx(grid, pos, dirs) {
        // a . e
        // . b .
        // d . c
        const a = bounds(grid, pos.add(dirs.downRight.flip()));
        const b = bounds(grid, pos);
        const c = bounds(grid, pos.add(dirs.downRight));
        const d = bounds(grid, pos.add(dirs.upRight.flip()));
        const e = bounds(grid, pos.add(dirs.upRight));

        if (a && b && c && d && e) {
            return {
                one: `${get(grid, a)}${get(grid, b)}${get(grid, c)}`,
                two: `${get(grid, d)}${get(grid, b)}${get(grid, e)}`,
                success: true
            };
        } else {
            return {
                one: null,
                two: null,
                success: false
            };
        }
    }

    function rev(word) {
        return word.split("").reverse().join("");
    }

    function check(grid, pos, dirs) {
        let count = 0;
        const { one, two, success } = grabx(grid, pos, dirs);
        if (success) {
            if ((one === "MAS" || rev(one) === "MAS") && (two === "MAS" || rev(two) === "MAS")) {
                count += 1;
            }
        }
        return count;
    }

    const grid = data.trim().split("\n");
    //const word = "MAS";
    const dirs = {
        right: {x: 1, y: 0}, // right (left)
        down: {x: 0, y: 1}, // down (up)
        downRight: {x: 1, y: 1}, // down-right (up-left)
        upRight: {x: 1, y: -1}, // up-right (down-left)
    };

    let total = 0;

    // For each starting location
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const count = check(grid, {x, y}, dirs);
            total += count;
        }
    }

    return total;
}

prototypes();
console.log(sol(input));