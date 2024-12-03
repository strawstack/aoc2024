import input from './input.txt';
import { prototypes } from '../../helper.js';

function sol(data) {
    const res = data.trim().matchAll(/(mul)\((\d+),(\d+)\)|(do)\(\)|(don)'t\(\)/g);
    for (let match of res) {
        console.log(match[5] || match[4] || match[1]);
    }
    return 0;
}

prototypes();
console.log(sol(input));