import input from './input.txt';
import { prototypes } from '../../helper.js';

function check(report) {
    let ascending = null;
    for (let i = 0; i < report.length - 1; i++) {

        const a = report[i];
        const b = report[i + 1];

        if (i === 0) {
            const d = report[report.length - 1] - report[0];
            if (d === 0) return false;
            ascending = d > 0; 
        }

        const d = b - a;
        if (ascending) {
            if (d < 1 || d > 3) {
                return false;
            }
        } else {
            if (d > -1 || d < -3) {
                return false;
            }
        }
    }
    return true;
}

function checkAll(reports) {
    let count = 0;
    reports.forEach(r => {

        for (let i = 0; i < r.length; i++) {
            let cr = JSON.parse(JSON.stringify(r));
            cr.splice(i, 1);
            if (check(cr)) {
                count += 1;
                break;
            }
        }

    });
    return count;
}

function sol(data) {
    return checkAll(data.trim().split("\n")
        .map(line => line.split(" ")
            .map(n => parseInt(n))
        ));
}

const test = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`;

prototypes();
console.log(sol(input));