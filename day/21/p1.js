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

function letters(value) {
    const lookup = {
        '^': 'U',
        '>': 'R',
        'v': 'D',
        '<': 'L'
    };
    if (value in lookup) return lookup[value];
    return value;
}

function bfs(p, map, visited, grid) {
    const q = queue();
    q.push({
        pos: p,
        path: []
    });

    while (q.size() > 0) {
        const { pos, path } = q.pop();
        const hn = hash(pos);
        visited[hn] = true;

        for (const a of adj4) {
            const t = pos.add(a);
            const ht = hash(t);
            
            if (not(inBounds(grid, t))) continue; // must be in bounds
            if (grid[t.y][t.x] === " ") continue; // don't step on gap
            if (ht in visited) continue; // not already visited

            const cpath = copy(path);
            cpath.push(a);

            map[letters(grid[t.y][t.x])] = cpath;

            q.push({
                pos: t,
                path: cpath
            });
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
            const visited = {};
            wires[letters(c)] = bfs({x, y}, map, visited, grid);
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

    const pad2 = wireGrid([
        " UA",
        "LDR"
    ]);

    const pad3 = wireGrid([
        " UA",
        "LDR"
    ]);

    const res = {};
    for (let code of codes) {
        console.log(`code: ${code}`);
        let seq = code.split("");
        console.log(`seq: ${seq}`);
        for (let pad of [pad0, pad1, pad2, pad3]) {
            seq = enter(seq, pad);
            console.log(seq);
        }
        res[code] = {
            value: parseInt(code.slice(0, code.length - 1), 10),
            seq 
        };
    }

    return res.values().reduce((a, { value, seq }) => {
        console.log(seq.length, value);
        return a + value * seq.length;
    }, 0);

}

prototypes();
// console.log(sol(input));

// NOTE: There's a pref to travel straight 
// like v<< instead of <v< because higher order bots will be more efficient
// Instead of bfs to work out the patterns we should use a more custom approach

console.log(sol(`029A
980A
179A
456A
379A
`));