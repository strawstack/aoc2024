async function main() {
    const DAY = parseInt(process.argv[2]);
    const PART = parseInt(process.argv[3]);
    
    await Bun.build({
        entrypoints: [`./day/${DAY}/p${PART}.js`],
        outdir: './build',
    });
} 

main();