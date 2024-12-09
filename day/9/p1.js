import input from './input.txt';
import { prototypes, not } from '../../helper.js';

function processFile({ isFile, id, pos, size }) {
    if (not(isFile)) throw Error("Should always be a file.");
    let check = 0;
    for (let i = pos; i < pos + size; i++) {
        check += id * i;
    }
    return check;
}

function sol(data) {
    
    const diskmap = (() => {
        let prefix = 0;
        return data.trim().split("")
            .map(n => parseInt(n))
            .map((size, index) => {
                const isFile = (index % 2) === 0;
                const pos = prefix;
                prefix += size;
                return {
                    isFile,
                    id: isFile ? Math.floor(index / 2) : null,
                    pos,
                    size
                }; 
            })
    })();

    let left = 0;
    let right = diskmap.length - 1;

    let checksum = 0;
    while (left < right) {
        const leftData = diskmap[left];
        const rightData = diskmap[right];

        // If left is on a file, advance past
        if (leftData.isFile) {
            checksum += processFile(leftData);
            left += 1;

        // If right is on free space then advance past
        } else if (not(rightData.isFile)) {
            right -= 1;

        // Left is on free space, and right is on a file
        // Move file (or partial file) to fill space
        } else {
            if (leftData.size === 0) {
                left += 1;

            } else if (rightData.size === 0) {
                right -= 1;

            } else { // (leftData.size > 0 && rightData.size > 0)
                checksum += rightData.id * leftData.pos;
                leftData.pos += 1;
                leftData.size -= 1;
                rightData.size -= 1;
            }
        }
    }
    return checksum;
}

prototypes();
console.log(sol(input));