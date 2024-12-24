import input from './input.txt';
import { prototypes } from '../../helper.js';

function exec(op, a, b) {
    const lookup = {
        AND: (a, b) => a & b,
        OR: (a, b) => a | b,
        XOR: (a, b) => a ^ b
    };
    return lookup[op](a, b);
}

function get(wires, gates, cache, name) {
    if (name in cache) return cache[name];
    if (name in wires) return wires[name];
    const { a, op, b } = gates[name];
    const av = get(wires, gates, cache, a);
    const bv = get(wires, gates, cache, b);
    const res = exec(op, av, bv);
    cache[name] = res;
    return res;
}

function sol(data) {
    const [wires_pack, gates_pack] = data.trim().split("\n\n");

    const wires = (() => {
        const wires = {};
        wires_pack.split("\n").forEach(line => {
            const [name, value] = line.split(": ");
            wires[name] = parseInt(value, 10);
        });
        return wires;
    })();

    const gates = (() => {
        const gates = {};
        gates_pack.split("\n").forEach(line => {
            const d = line.split(" ");
            const a = d[0];
            const op = d[1];
            const b = d[2];
            const out = d[4];
            gates[out] = { a, op, b, out };
        });
        return gates;
    })();

    const zs = gates.keys().filter(name => name[0] === "z").sort((a, b) => b.localeCompare(a));

    const cache = {};
    for (let i = 0; i < zs.length; i++) {
           zs[i] = get(wires, gates, cache, zs[i]);
    }

    return parseInt(
        zs.map(n => n.toString()).join(""), 2
    );
}

prototypes();
console.log(sol(input));