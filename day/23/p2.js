import input from './input.txt';
import { prototypes, not } from '../../helper.js';

function investigate(graph, comp) {
    const sets = [];
    const votes = {};
    votes[comp] = 1;
    for (const other in graph[comp]) {
        votes[other] = 1;
        const set = {};
        set[other] = true;
        for(const k in graph[other]) {
            set[k] = true;
        }
        sets.push(set);
    }

    for (const set of sets) {
        for (const comp in set) {
            if (not(comp in votes)) votes[comp] = 0;
            votes[comp] += 1;
        }
    }

    let best = 0;
    for (const k in votes) {
        if (k === comp) continue;
        const number = votes[k];
        best = Math.max(best, number);
    }

    const ans = [];
    for (const k in votes) {
        if (votes[k] >= best) {
            ans.push(k);
        }
    }

    return ans;
}

function sol(data) {
    const conns = data.trim().split("\n")
        .map(line => line.split("-"));
    const graph = {};
    for (let [a, b] of conns) {
        if (not(a in graph)) graph[a] = {};
        if (not(b in graph)) graph[b] = {};
        graph[a][b] = true;
        graph[b][a] = true;
    }
    const comps = graph.keys();

    const groups = [];
    for (const comp of comps) {
        const group = investigate(graph, comp);
        groups.push(group);
    }

    const big = groups.sort((a, b) => b.length - a.length)[0];
    const ans = big.sort((a, b) => a.localeCompare(b)).join(",");
    return ans;
}

prototypes();
console.log(sol(input));

// console.log(sol(`kh-tc
// qp-kh
// de-cg
// ka-co
// yn-aq
// qp-ub
// cg-tb
// vc-aq
// tb-ka
// wh-tc
// yn-cg
// kh-ub
// ta-co
// de-co
// tc-td
// tb-wq
// wh-td
// ta-ka
// td-qp
// aq-cg
// wq-ub
// ub-vc
// de-ta
// wq-aq
// wq-vc
// wh-yn
// ka-de
// kh-ta
// co-tc
// wh-qp
// tb-vc
// td-yn
// `));