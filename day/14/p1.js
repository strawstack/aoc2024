import input from './input.txt';
import { prototypes } from '../../helper.js';

function advance(pos, speed, time, clamp) {
    return pos.add(speed.mul(time)).modv(clamp);
}

function sol(data) {
    const bots = data.trim().split("\n").map(line => {
        const n = [...line.matchAll(/.+?(\d+).+?(\d+).+?(-\d+|\d+).+?(-\d+|\d+)/g)][0]
            .slice(1, 7).map(n => parseInt(n));
        return {
            pos: {x: n[0], y: n[1]},
            vec: {x: n[2], y: n[3]}
        };
    });

    const results = bots.map(({pos, vec}) => {
        return advance(pos, vec, 100, {x: 101, y: 103});
    });

    // quads
    // 0 | 1
    // -----
    // 2 | 3
    const counts = [0, 0, 0, 0];
    results.forEach(({x, y}) => {
        const yh = Math.floor(103/2);
        const xh = Math.floor(101/2);
        if (y < yh) {
            if (x < xh) counts[0] += 1;
            if (x > xh) counts[1] += 1;
        } 
        if (y > yh) {
            if (x < xh) counts[2] += 1;
            if (x > xh) counts[3] += 1;
        }
    });

    return counts.reduce((a, c) => a * c, 1);
}

prototypes();
console.log(sol(input));