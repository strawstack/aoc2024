import input from './input.txt';
import { prototypes, not } from '../../helper.js';

// function dfs(graph, visited, k, comps) {
//     if (k in visited) return comps;
//     visited[k] = true;

//     const res = [];
//     for (const other in graph[k]) {
//         for (const cp of dfs(graph, visited, other, [])) {
//             res.push(cp);
//         }
//     }
//     res.push(k);
//     return res;
// }

function check(graph, comps) {
    for (let i = 0; i < comps.length; i++) {
        for (let j = i + 1; j < comps.length; j++) {
            const a = comps[i];
            const b = comps[j];
            if (not(b in graph[a])) return false;
        }
    }
    return true;
}

function create(comps, size) {

    function createRecursive(bag, comps, size, index, ans) {
        const keys = bag.keys();
        if (keys.length === size) {
            ans.push(keys);

        } else {
            for (let i = index; i < comps.length; i++) {
                const a = comps[i];
                if (not(a in bag)) {
                    bag[a] = true;
                    createRecursive(bag, comps, size, index + 1, ans);
                    delete bag[a];
                }
            }
        }
    }

    let index = 0;
    const ans = [];
    for (const comp of comps) {
        const bag = { [comp]: true };
        createRecursive(bag, comps, size, index + 1, ans);
        delete bag[comp];
        index += 1;
    }
    return ans;
}

function createAndCheck(graph, comps, mi) {
    const sets = create(comps, mi);
    for (const set of sets) {
        if (check(graph, set)) return true;
    }
    return false;
}

function binary(graph, comps) {
    let lo = 0;
    let hi = comps.length - 1;
    let mi = null;
    while (lo < hi) {
        mi = Math.ceil((lo + hi) / 2);

        if (createAndCheck(graph, comps, mi)) {
            lo = mi;

        } else {
            hi = mi - 1;

        }
    }
    return mi;
}

function linear(graph, comps) {
    for (let i = 3; i < comps.length; i++) {
        console.log(i);
        if(!createAndCheck(graph, comps, i)) {
            return i - 1;
        }
    }
    throw new Error("Should not reach");
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
    // const ans = binary(graph, comps);
    const ans = linear(graph, comps);

    return ans;
}

prototypes();
console.log(sol(input));