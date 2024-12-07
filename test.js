function main() {
    let strs = ["green", "red", "blue"];
    
    const events = [];
    for (let i = 0; i < strs.length; i++) {
        events.push(() => {
            console.log(strs[i]);
        });
    }

    strs = ["black", "black", "black"];

    setTimeout(() => {
        events.forEach(event => event());   
    }, 1000);

}

main();



function main2() {
    let strs = ["green", "red", "blue"];
    
    const events = [];
    for (let i = 0; i < strs.length; i++) {
        const color = strs[i];
        events.push(() => {
            console.log(color);
        });
    }

    strs = ["black", "black", "black"];

    setTimeout(() => {
        events.forEach(event => event());   
    }, 1000);

}

main2();