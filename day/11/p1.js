import input from './input.txt';
import { prototypes } from '../../helper.js';

function createNode(value, next) {
    if (value === undefined) value = null;
    if (next === undefined) next = null;
    return {
        value,
        next
    };
}

function splitNumber(str) {
    const half = Math.floor(str.length / 2);
    return {
        left: parseInt(str.slice(0, half)),
        right: parseInt(str.slice(half)),
    };
}

function print(root) {
    let stone = root;
    let lst = [];
    while (stone !== null) {
        lst.push(stone.value);
        stone = stone.next;
    }
    console.log(lst.map(e => e.toString()).join(", "));
}

function update(root) {
    let stone = root;
    while (stone !== null) {

        const str = stone.value.toString();

        if (stone.value === 0) {
            stone.value += 1;
        
        } else if ((str.length % 2) === 0) {
            const {left, right} = splitNumber(str);
            stone.value = left;
            const temp = stone.next;
            stone.next = createNode(right, temp);
            stone = stone.next;

        } else {
            stone.value *= 2024;

        }

        stone = stone.next;
    }
}

function sol(data) {
    const stone_data = data.trim().split(" ").map(n => parseInt(n));
    const root = createNode(stone_data[0]);
    let prevNode = root; 
    for (let i = 1; i < stone_data.length - 1; i++) {
        prevNode.next = createNode(stone_data[i]);
        prevNode = prevNode.next;
    }
    prevNode.next = createNode(stone_data[stone_data.length - 1]);

    let blink = 25;
    while (blink > 0) {
        // print(root);
        update(root);
        blink -= 1;
    }

    let count = 0;
    let stone = root;
    while (stone !== null) {
        count += 1;
        stone = stone.next;
    }

    return count;
}

prototypes();
// console.log(sol("125 17\n"));
// console.log(sol("0 1 10 99 999\n"));
console.log(sol(input));