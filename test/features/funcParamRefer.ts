let a = [1, 2, 3];
let b = {
    a: 1
};
let c = '123';

function aaa(m: number[], n: {[name: string]: number}, k: string, d?: () => string) {
    m.push(4);
    n.b = 2;
    k += '4';
}

aaa(a, b, c);