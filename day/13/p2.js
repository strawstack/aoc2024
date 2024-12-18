import input from './input.txt';
import { prototypes } from '../../helper.js';

function mdic(n, target) {
    const d = {};
    const base = n;
    let cur = n;
    let index = 1;
    while (cur <= target) {
        d[cur] = index;
        cur += base;
        index += 1;
    }
    return d;
}

function solve_p1({ ax, ay, bx, by, x, y }) {
    const bxm = mdic(bx, x);

    // For every number of presses of 'a'...
    for (let a = 0; a <= 100; a++) {
        
        // Get the resulting 'x' value
        const xr = x - ax * a;
        const yr = y - ay * a;
        
        // Can 'bx' match the result and does the 'by' line up as well
        if (xr in bxm && by * bxm[xr] === yr) {
            return {
                at: a,
                bt: bxm[xr]
            };
        }
    }

    return {
        at: null,
        bt: null
    };
}

function solve({ ax, ay, bx, by, x, y }) {
    const av = {x: Number(ax), y: Number(ay)};
    const bv = {x: Number(bx), y: Number(by)};
    const pv = {x: Number(x), y: Number(y)};

    const t1 = ((y * ax) - (ay * x)) * (ax * bx);
    const t2 = ax * ((ax * by) - (ay * bx));

    const g1 = x * t2 - t1;
    const g2 = t2 * ax;
    const g4 = t2 * bx;
    const n1 = t1;

    const at = Number(g1 * BigInt(10000) / g2) / 10000;
    const bt = Number(n1 * BigInt(10000) / g4) / 10000;

    const fat = Math.floor(at);
    const fbt = Math.floor(bt);

    const diff_a = at - fat;
    const diff_b = bt - fbt;
    
    const small = 0.07;

    if ( diff_a < small && diff_b < small ) {
        return 3 * Math.abs(fat) + Math.abs(fbt);
    } else {
        return 0;
    }
}

function sol(data) {
    const machines = data.trim().split("\n\n")
        .map(pack => {
            const result = [
                ...pack.matchAll(/X\+(\d+), Y\+(\d+)\n.+X\+(\d+), Y\+(\d+)\n.+X=(\d+), Y=(\d+)/g)
            ];
            const ax = parseInt(result[0][1]);
            const ay = parseInt(result[0][2]);
            const bx = parseInt(result[0][3]);
            const by = parseInt(result[0][4]);
            const x = parseInt(result[0][5]);
            const y = parseInt(result[0][6]);
            const big = BigInt(10000000000000); // BigInt
            const big_x = BigInt(x) - big;
            const big_y = BigInt(y) - big;
            return {
                ax: BigInt(ax),
                ay: BigInt(ay),
                bx: BigInt(bx),
                by: BigInt(by),
                x: big_x, 
                y: big_y
            };
        });

    let total = 0;
    for (const machine of machines) {
        total += solve(machine);
    }
    return total;
}

prototypes();
console.log(sol(input));

const test = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=10000000008400, Y=10000000005400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=10000000012748, Y=10000000012176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=10000000007870, Y=10000000006450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=10000000018641, Y=10000000010279
`;
// console.log(sol(test));