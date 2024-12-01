import input from './input.txt';
import { prototypes } from '../../helper.js';

function sol(data) {
    return data.split("\n").length;
}

prototypes();
console.log(sol(input));