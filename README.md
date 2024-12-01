# aoc2024

Advent of Code 2024 with the Bun Javascript runtime: https://bun.sh/

# How to Use

1. Create `secret.js` in the root directory with `export const session = <TOKEN>` as contents.
2. Run `bun run make <day_number>`
3. This command creates a directory for the current day, downloads the input file, and copies files from `template`.
