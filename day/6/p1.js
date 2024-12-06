import input from './input.txt';
import { prototypes, not } from '../../helper.js';

function sol(data) {
    const grid = data.trim().split("\n").map(line => line.split(""));

    let pos = (() => {
        let pos = null;
        grid.forEach((row, y) => {
            grid[y].forEach((c, x) => {
                if (c === "^") {
                    pos = {x, y};
                }
            });
        });
        return pos;
    })();

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

    let dir = 'U';
    
    function hash(pos) {
        return JSON.stringify(pos);
    }

    function inBounds({x, y}) { 
        return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
    }
    const track = {};
    while (true) {
        track[hash(pos)] = true;

        let n = pos.add(toVec[dir]);
        if (not(inBounds(n))) break;

        if (grid[n.y][n.x] === "#") {
            dir = rot[dir];
        
        } else {
            pos = n;

        }
    }
    return track.keys().length;
}

prototypes();
console.log(sol(input));