import input from './input.txt';
import { prototypes, copy } from '../../helper.js';

function next(lst, base) {
    const clst = copy(lst);
    let i = clst.length - 1;
    while (i >= 0) {
        if (clst[i] < base - 1) {
            clst[i] += 1;
            break;
        } else {
            clst[i] = 0;
        }
        i -= 1;
    }
    return clst;
}

function add(a, b) {
    return a + b;
}

function mult(a, b) {
    return a * b;
}

function concat(a, b) {
    return parseInt(`${a}${b}`);
}

function calculate(args, ops) {
    let op = -1;
    return args.reduce((a, c) => {
        op += 1;
        if (ops[op] === 0) {
            return add(a, c);
        
        } else if (ops[op] === 1) {
            return mult(a, c);
        
        } else { // ops[op] === 2
            return concat(a, c);

        }
    });
}

function isValid(ans, args) {
    let ops = Array(args.length - 1).fill(0);
    while (ans !== calculate(args, ops)) {
        ops = next(ops, 3);
        if (ops.every(d => d === 0)) return false;
    }
    return true;
}

function sol(data) {
    const eqs = data.trim().split("\n")
        .map(line => {
            const split = line.split(": ");
            const ans = parseInt(split[0]);
            const args = split[1];
            return {
                ans,
                args: args.split(" ").map(n => parseInt(n))
            }
        });
    let total = 0;
    for (let { ans, args } of eqs) {
        if (isValid(ans, args)) {
            total += ans;
        }
    }
    return total;
}

prototypes();
console.log(sol(input));