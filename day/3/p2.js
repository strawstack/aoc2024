import input from './input.txt';
import { prototypes } from '../../helper.js';

function sol(data) {
    const res = data.trim().matchAll(/(mul)\((\d+),(\d+)\)|(do)\(\)|(don)'t\(\)/g);
    let total = 0;
    let enabled = true;
    for (let match of res) {
        
        const type = match[0].slice(0, 3);
        if (type === "mul") {
            
            if (enabled) {
                const a = match[2];
                const b = match[3];
                if (a && b) {
                    total += a * b;
                }
            }
            
        } else if (type === "do(") {
            enabled = true;

        } else if(type === "don") {
            enabled = false;

        }
    }
    return total;
}

prototypes();
console.log(sol(input));