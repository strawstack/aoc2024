import input from './input.txt';
import { prototypes, not } from '../../helper.js';

function dfs(graph, visited, k, comps) {
    if (k in visited) return comps;
    visited[k] = true;

    const res = [];
    for (const other in graph[k]) {
        for (const cp of dfs(graph, visited, other, [])) {
            res.push(cp);
        }
    }
    res.push(k);
    return res;
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

    let total = 0;

    const comps = graph.keys();
    for (let i = 0; i < comps.length; i++) {
        for (let j = i + 1; j < comps.length; j++) {
            for (let k = j + 1; k < comps.length; k++) {
                const a = comps[i];
                const b = comps[j];
                const c = comps[k];
                if (
                    graph[a][b] &&
                    graph[a][c] &&
                    graph[b][c] &&
                    (a[0] === "t" || b[0] === "t" || c[0] === "t")
                ) {
                    total += 1;
                }
            }
        }
    }

    // const groups = [];
    // for (const k in graph) {
    //     const visited = {};
    //     groups.push(
    //         dfs(graph, visited, k, [])
    //     );
    // }

    return total;
}

prototypes();
console.log(sol(input));