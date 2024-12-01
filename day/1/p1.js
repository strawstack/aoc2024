import input from './input.txt';
import {
    prototypes
} from '../../helper.js';

function sol(data) {
    return data.split("\n").dropLast()
        .map(line => line.split(/\s+/).map(x => parseInt(x)))    
        .unzip()
        .map(arr => arr.sort((a, b) => a - b))
        .zip()
        .reduce((a, c) => a + Math.abs(c[0] - c[1]), 0);
}

prototypes();
console.log(sol(input));