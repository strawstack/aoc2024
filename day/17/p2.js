import input from './input.txt';
import { prototypes, mod, copy } from '../../helper.js';

const d = false;

function getNext({ ip, prog }) {
    return {
        inst: prog[ip],
        op: prog[ip + 1]
    };
}

function makeCombo(reg) {
    return (op, debug) => {
        if (op <= 3) {
            if (debug) return op;
            return op;
    
        } else if (op === 4) {
            if (debug) return `a[${reg.a}]`;
            return reg.a;

        } else if (op === 5) {
            if (debug) return `b[${reg.b}]`;
            return reg.b;

        } else if (op === 6) {
            if (debug) return `c[${reg.c}]`;
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
            const ans = Math.floor(reg.a / Math.pow(2, combo(op)));
            if (d) console.log(`a[${ans}] = a[${reg.a}] / 2 ** ${combo(op, true)}`);
            reg.a = ans;
        },
        bxl: op => {
            const ans = reg.b ^ op;
            if (d) console.log(`b[${ans}] = b[${reg.b}] ^ ${op}`);
            reg.b = ans;
        },
        bst: op => {
            const ans = mod(combo(op), 8);
            if (d) console.log(`b[${ans}] = ${combo(op, true)} % 8`);
            reg.b = ans;
        },
        jnz: op => {
            if (d) console.log(`jnz a[${reg.a}] !== 0`);
            if (reg.a === 0) {
                nip = ip + 1;
            } else {
                nip = op;
            }
        },
        bxc: _ => {
            const ans = reg.b ^ reg.c;
            if (d) console.log(`b[${ans}] = b[${reg.b}] ^ c[${reg.c}]`);
            reg.b = ans;
        },
        out: op => {
            const ans = mod(combo(op), 8);
            if (d) console.log(`out[${ans}] <- ${combo(op, true)} % 8\n`);
            return ans;
        },
        bdv: op => {
            const ans = Math.floor(reg.a / Math.pow(2, combo(op)));
            if (d) console.log(`b[${ans}] = a[${reg.a}] / 2 ** ${combo(op, true)}`);
            reg.b = ans;
        },
        cdv: op => {
            const ans = Math.floor(reg.a / Math.pow(2, combo(op)));
            if (d) console.log(`c[${ans}] = a[${reg.a}] / 2 ** ${combo(op, true)}`);
            reg.c = ans;
        }
    };

    const out = cmds[lookup[inst]](op);
    return (lookup[inst] === 'out') ? {out, nip} : {out: null, nip};    
}

function run({reg, prog}) {
    let ip = 0;
    const output = [];
    while (ip >= 0 && ip < prog.length - 1) {
        const { inst, op } = getNext({ ip, prog });
        const { out, nip } = exec({ inst, ip, op, reg });
        ip = nip;
        if (out !== null) output.push(out);
    }
    
    return output.map(n => n.toString()).join(",");
}

const initial = 1;
const back_space = 8; 

function valid(a, prog) {
    if (prog.length === 0) return a;
    const pv = a;
    const nv = a * 8;
    const r = prog[prog.length - 1];
    for (let i = nv; i < nv + back_space; i++) {
        let av = i;
        let b = av % 8;
        b = b ^ 3;
        let c = Math.floor(av / Math.pow(2, b));
        b = b ^ 5;
        av = Math.floor(av / 8); // 8 = Math.pow(2, 3)
        b = b ^ c;
        if (av === pv && (b % 8) === r) {
            const temp = prog.pop();
            const res = valid(i, prog);
            if (res !== false) return res;
            prog.push(temp);
        }
    }
    return false;
}

function sol(data) {
    data = data.trim().split("\n\n");
    const prog = data[1].split(" ")[1].split(",").map(n => parseInt(n, 10));
    
    // Example
    // b[1] = a[1] % 8
    // b[2] = b[1] ^ 3
    // c[0] = a[1] / 2 ** b[2]
    // b[7] = b[2] ^ 5
    // a[0] = a[1] / 2 ** 3
    // b[7] = b[7] ^ c[0]
    // out[7] <- b[7] % 8

    for (let aa = 0; aa < initial; aa++) {
        const a = valid(aa, copy(prog));
        if (a !== false) {
            console.log(a);
            console.log(run({ reg: { a, b: 0, c: 0 }, prog }));
            return;
        }
    }

}

prototypes();
// console.log(sol(input));
sol(input);