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

function printmap(diskmap) {
    const size = diskmap.reduce((a, c) => a + c.size, 0);
    const disk = Array(size).fill(".");
    for (let { isFile, id, pos, size } of diskmap ) {
        if (not(isFile)) continue;
        for (let i = pos; i < pos + size; i++) {
            disk[i] = id.toString();
        }
    }
    console.log(disk.join(""));
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

    let right = diskmap.length - 1;

    while (right > 0) {
        const rightData = diskmap[right];

        // If right is on free space then advance past
        if (not(rightData.isFile)) {
            right -= 1;

        } else {
            let left = 0;
            while (left < right) {
                const leftData = diskmap[left];
                if (leftData.isFile) {
                    left += 1;
                    continue;

                } else if (leftData.size >= rightData.size) {
                    rightData.pos = leftData.pos;
                    leftData.pos += rightData.size;
                    leftData.size = leftData.size - rightData.size;
                    break;
                }
                left += 1;
            }
            right -= 1;
        }
    }
    
    // printmap(diskmap);

    // Calculate checksum
    return diskmap.reduce((a, c) => {
        const check = (c.isFile) ? processFile(c) : 0;
        return a + check;
    }, 0);
}

prototypes();
// console.log(sol("2333133121414131402\n")); // test
console.log(sol(input));