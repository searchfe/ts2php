
function funcA(...args: string[]) {
}

function funcB(...args: string[]) {
    funcA(...args);
    let c = '11';
    let d = args[0];
    let f = d.includes('1');
    funcA('a', ...args, c);
}

function funcC(a: string, ...args: string[]) {
}
