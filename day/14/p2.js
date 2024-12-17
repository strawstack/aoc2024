import input from './input.txt';
import { prototypes, inBounds2, adj8, hash } from '../../helper.js';

function advance(pos, speed, time, clamp) {
    return pos.add(speed.mul(time)).modv(clamp);
}

function sol(data) {
    let bots = data.trim().split("\n").map(line => {
        const n = [...line.matchAll(/.+?(\d+).+?(\d+).+?(-\d+|\d+).+?(-\d+|\d+)/g)][0]
            .slice(1, 7).map(n => parseInt(n));
        return {
            pos: {x: n[0], y: n[1]},
            vec: {x: n[2], y: n[3]}
        };
    });

    const density = {
        time: null,
        value: 0
    };

    let sec = 0;
    while (sec <= 10000) {
        sec += 1;

        const map = {};
        bots = bots.map(({pos, vec}) => {
            const newPos = advance(pos, vec, 1, {x: 101, y: 103});
            map[hash(newPos)] = true;
            return {
                pos: newPos,
                vec 
            };
        });

        let step_density = 0;
        for (const { pos } of bots) {
            for (let a of adj8) {
                const t = pos.add(a);
                if (inBounds2(101, 103, t)) {
                    if (hash(t) in map) {
                        step_density += 1;
                    }
                } 
            }
        }

        if (step_density > density.value) {
            density.time = sec;
            density.value = step_density;
        }
    }

    return density.time;
}

prototypes();
console.log(sol(input));