import input from './input.txt';
import { prototypes, adj4, inBounds, not, hash, copy } from '../../helper.js';

function queue() {
    const s1 = [];
    const s2 = [];
    let len = 0; 

    function push(v) {
        len += 1;
        s2.push(v);
    }

    function pop() {
        len -= 1;
        if (s1.length === 0) {
            while (s2.length > 0) {
                s1.push(s2.pop());
            }
        }
        return s1.pop();
    }

    function size() {
        return len;
    }

    return {
        push,
        pop,
        size
    };
}

function bfs(p, map, grid) {
    const q = queue();
    q.push({
        pos: p,
        path: []
    });

    const orig = grid[p.y][p.x];

    while (q.size() > 0) {
        const { pos, path } = q.pop();

        for (const a of adj4) {
            const t = pos.add(a);
            
            if (not(inBounds(grid, t))) continue; // must be in bounds
            if (grid[t.y][t.x] === " ") continue; // don't step on gap

            const cpath = copy(path);
            cpath.push(a);

            const symb = grid[t.y][t.x];
            if (symb === orig) continue;

            if (not(symb in map)) map[symb] = [];
            map[symb].push(cpath);

            if (cpath.length > 5) continue;

            q.push({
                pos: t,
                path: cpath
            });
        }
    }

    for (const from in map) {
        for (const to in map[from]) {
            let short = Infinity;
            for (const path of map[from][to]) {
                short = Math.min(short, path.length);
            }
            map[from][to] = map[from][to].filter(path => path.length <= short);
        }
    }

    return map;
}

function wireGrid(grid) {
    const wires = {};
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const c = grid[y][x];
            if (c === " ") continue;
            
            const map = {};
            wires[c] = bfs({x, y}, map, grid);
        }
    }
    return wires;
}

function convert(seq) {
    const lookup = {
        [hash({x: 0, y: -1})]: "U",
        [hash({x: 1, y: 0})]: "R",
        [hash({x: 0, y: 1})]: "D",
        [hash({x: -1, y: 0})]: "L"
    };
    return seq.map(p => lookup[hash(p)]);
}

function tryAll(seq, pads) {

    for (let i = 0; i < seq.length; i++) {

    }

}

function enter(seq, pad) {
    const res = [];
    for (let i = 0; i < seq.length; i++) {
        const from = (i === 0) ? "A" : seq[i - 1];
        const to = seq[i];

        let path = [];
        if (from !== to) {
            path = convert(pad[from][to]);
        }
        path.push("A");
        for (let step of path) res.push(step);
    }
    return res;
}

function sol(data) {
    const codes = data.trim().split("\n");
    // p0 < R0 < p1 < R1 < p2 < R2 < p3 < me

    const pad0 = wireGrid([
        "789",
        "456",
        "123",
        " 0A",
    ]);

    const pad1 = wireGrid([
        " UA",
        "LDR"
    ]);

    const res = {};
    for (let code of codes) {
        let seq = code.split("");
        seq = tryAll(seq, [pad0, pad1, pad1, pad1]);
        res[code] = {
            value: parseInt(code.slice(0, code.length - 1), 10),
            seq 
        };
    }

    return res.values().reduce((a, { value, seq }) => {
        return a + value * seq.length;
    }, 0);

}

prototypes();
// console.log(sol(input));

console.log(sol(`029A
980A
179A
456A
379A
`));