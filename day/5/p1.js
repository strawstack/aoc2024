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

    const [rules_str, updates_str] = data.trim().split("\n\n");
    const rules = rules_str.split("\n").map(line => line.split("|").map(n => parseInt(n)));
    const updates = updates_str.split("\n").map(line => line.split(",").map(n => parseInt(n)));
    const valid_updates = updates.filter(update => isValid(update, rules));

    return valid_updates.reduce((a, c) => a + mid(c), 0);
}

prototypes();
console.log(sol(input));