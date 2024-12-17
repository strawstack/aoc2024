import input from './input.txt';
import { prototypes, mod } from '../../helper.js';

function getNext({ ip, prog }) {
    return {
        inst: prog[ip],
        op: prog[ip + 1]
    };
}

function makeCombo(reg) {
    return op => {
        if (op <= 3) {
            return op;
    
        } else if (op === 4) {
            return reg.a;

        } else if (op === 5) {
            return reg.b;

        } else if (op === 6) {
            return reg.c;

        } else if (op === 7) {
            throw new Error("Should not get here");

        }
    };
}

function exec({ inst, ip, op, reg }) {

    const combo = makeCombo(reg);

    const lookup = [
        'adv', // 0
        'bxl', // 1
        'bst', // 2
        'jnz', // 3
        'bxc', // 4
        'out', // 5
        'bdv', // 6
        'cdv'  // 7
    ];

    let nip = ip + 2;

    const cmds = {
        adv: op => {
            reg.a = Math.floor(reg.a / Math.pow(2, combo(op)));
        },
        bxl: op => {
            reg.b = reg.b ^ op;
        },
        bst: op => {
            reg.b = mod(combo(op), 8);
        },
        jnz: op => {
            if (reg.a === 0) {
                nip = ip + 1;    
            } else {
                nip = op;
            }
        },
        bxc: _ => {
            reg.b = reg.b ^ reg.c;
        },
        out: op => {
            return mod(combo(op), 8);
        },
        bdv: op => {
            reg.b = Math.floor(reg.a / Math.pow(2, combo(op)));
        },
        cdv: op => {
            reg.c = Math.floor(reg.a / Math.pow(2, combo(op)));
        }
    };

    const out = cmds[lookup[inst]](op);
    return (lookup[inst] === 'out') ? {out, nip} : {out: null, nip};    
}

function sol(data) {
    data = data.trim().split("\n\n");
    const reg = (() => {
        const r = data[0].split("\n").map(line => parseInt(line.split(" ")[2], 10));
        return { a: r[0], b: r[1], c: r[2] };
    })();
    const prog = data[1].split(" ")[1].split(",").map(n => parseInt(n, 10));
    
    let ip = 0;
    const output = [];
    while (ip >= 0 && ip < prog.length) {
        const { inst, op } = getNext({ ip, prog });
        const { out, nip } = exec({ inst, ip, op, reg });
        ip = nip;
        if (out !== null) output.push(out);
    }
    
    return output.map(n => n.toString()).join(",");
}

prototypes();
console.log(sol(input));