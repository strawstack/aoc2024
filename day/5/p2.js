import input from './input.txt';
import { prototypes, not } from '../../helper.js';

function sol(data) {

    function mid(lst) {
        return lst[Math.floor(lst.length/2)];
    }

    function isValid(update, rules) {
        const lookup = update.reduce((a, c) => {
            a[c] = Object.keys(a).length;
            return a;
        }, {});

        // I assume no duplicates
        if (Object.keys(lookup).length !== update.length) {
            throw new Error(`Duplicate found: ${update}`);
        }

        for (let [a, b] of rules) {
            if (a in lookup && b in lookup) {
                if (not(lookup[a] < lookup[b])) {
                    return false;
                }
            }
        }
        return true;
    }

    function order(update, rules) {
        const verts = update.reduce((a, c) => {
            a[c] = {
                in_edge: {},
                out_edge: {}
            };
            return a;
        }, {});

        for (let [a, b] of rules) {
            if (a in verts && b in verts) {
                verts[a].out_edge[b] = true;
                verts[b].in_edge[a] = true;
            }
        }

        const order = [];
        while (Object.keys(verts).length > 0) {
            const rem = [];
            for (let v in verts) {
                const { in_edge } = verts[v];
                if (Object.keys(in_edge).length === 0) {
                    rem.push(v);
                }
            }

            rem.forEach(v1 => {
                for (let v2 in verts[v1].out_edge) {
                    delete verts[v2].in_edge[v1];
                }
                delete verts[v1];
                order.push(v1);
            });
        }

        return order;
    }

    const [rules_str, updates_str] = data.trim().split("\n\n");
    const rules = rules_str.split("\n").map(line => line.split("|").map(n => parseInt(n)));
    const updates = updates_str.split("\n").map(line => line.split(",").map(n => parseInt(n)));
    const invalid_updates = updates.filter(update => not(isValid(update, rules)));
    const ordered_updates = invalid_updates.map(update => order(update, rules));

    return ordered_updates.reduce((a, c) => a + mid(c), 0);
}

prototypes();
console.log(sol(input));