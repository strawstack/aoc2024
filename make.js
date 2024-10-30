/*
    Run with `bun make.js <day_number>`

    Creates day/<day_number> directory.
    Gets related input file from AOC.
    Copies template/p.js into day/<day_number>.
*/

import { session } from './secret.js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const DAY = parseInt(process.argv[2]);
const YEAR = 2024;

const input = await fetch(`https://adventofcode.com/${YEAR}/day/${DAY}/input`, {
    "headers": {
        "Cookie": `session=${session}`
    },
    "method": "GET"
});

const data = await input.text();

// Make day number dir
mkdirSync(`day/${DAY}`);

// Place input file
writeFileSync(`day/${DAY}/input.txt`, data);

// Place solution template
const p = readFileSync('template/p.js');
writeFileSync(`day/${DAY}/p1.js`, p);