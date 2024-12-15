import input from './input.txt';
import { prototypes } from '../../helper.js';

function solve({ ax, ay, bx, by, x, y }) {
    const ayax = ay / ax;
    const ab = (y / x) - ayax;
    const bybx = by / bx;
    const x_inter = ab / (bybx - (ay / ax));
    const y_inter = bybx * x_inter;

    console.log({ ax, ay, bx, by, x, y });

    console.log(ayax);
    console.log(ab);
    console.log(bybx);
    console.log(x_inter);
    console.log(y_inter);

    const b_dist = Math.sqrt((x_inter ** BigInt(2)) + Math.pow(y_inter, 2));
    const a_dist = Math.sqrt(Math.pow(y - y_inter, 2) + Math.pow(x - x_inter, 2));

    console.log(b_dist);
    console.log(a_dist);

    const a_mag = ({x: ax, y: ay}).mag();
    const b_mag = ({x: bx, y: by}).mag();

    console.log(a_mag);
    console.log(b_mag);

    const a_times = Math.round(a_dist / a_mag);
    const b_times = Math.round(b_dist / b_mag);

    console.log(a_times);
    console.log(b_times);
    console.log("");

    if (
        ({x: ax, y: ay}).mul(a_times)
            .add(({x: bx, y: by}).mul(b_times)) 
            .eq({x, y})
        ) {
            return 3 * a_times + b_times;
    }

    return 0;
}

function sol(data) {
    const machines = data.trim().split("\n\n")
        .map(pack => {
            const result = [
                ...pack.matchAll(/X\+(\d+), Y\+(\d+)\n.+X\+(\d+), Y\+(\d+)\n.+X=(\d+), Y=(\d+)/g)
            ];
            const ax = BigInt(parseInt(result[0][1]));
            const ay = BigInt(parseInt(result[0][2]));
            const bx = BigInt(parseInt(result[0][3]));
            const by = BigInt(parseInt(result[0][4]));
            const x = BigInt(parseInt(result[0][5]));
            const y = BigInt(parseInt(result[0][6]));
            const big = BigInt(10000000000000);
            const xv = x - big;
            const yv = y - big;
            return { ax, ay, bx, by, x: xv, y: yv };
        });

    let total = BigInt(0);
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