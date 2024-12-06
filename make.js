/*
    Run with `bun run make <day_number>`

    Creates day/<day_number> directory.
    Gets related input file from AOC.
    Copies template/p.js into day/<day_number>.
*/

import { $ } from "bun";
import { session } from './secret.js';
import { readFileSync, writeFileSync, existsSync, watch } from 'fs';

const DAY = parseInt(process.argv[2]);
const YEAR = 2024;

if (!existsSync(`day/${DAY}`)) {
    const input = await fetch(`https://adventofcode.com/${YEAR}/day/${DAY}/input`, {
        "headers": {
            "Cookie": `session=${session}`
        },
        "method": "GET"
    });
    
    const data = await input.text();

    // Make day number dir
    await $`mkdir -p day`;
    await $`mkdir -p day/${DAY}`;

    // Place input file
    writeFileSync(`day/${DAY}/input.txt`, data);

    // Place solution template
    const p = readFileSync('template/p.js');
    writeFileSync(`day/${DAY}/p1.js`, p);
}

let debounce = true;

watch(
    './day',
    { recursive: true },
    async (event, filename) => {
        if (debounce) {
            debounce = false;
            try {
                const output = await $`bun run day/${filename}`.text();
                console.log(output.trim());
            } catch(e) {
                console.log(String.fromCharCode(...e.info.stderr));
            }

            setTimeout(() => { debounce = true }, 100);
        }
    },
);