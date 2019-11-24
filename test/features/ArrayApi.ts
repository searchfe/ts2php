const a = [1].length;
const b = [1, 'a'];
const c = b.length;
b.push(c);
b.push(1, 2, 3, 4, 5);
const d = b.indexOf(1);
const f = b.map(function (value: number | string) {
    return value;
});
const h = b.map(function (value: number | string, index: number) {
    return {
        value,
        index
    };
});
let fn1 = function (value: number | string, index: number) {
    return index;
}
let fn2 = function (value: number | string) {
    return value;
}
b.map(fn1);
b.map(fn2);
const e = b.forEach(function (value, index) {
    let a = value;
});
const g = b.filter(function (value, index) {
    return value;
});
const w = b.every(function (value, index) {
    return !!value;
});
const t = Array.isArray(a);

const x = {u: []} as {u: string[]};
const v = x.u.length;

console.dir(x);

function run(x: {y: number[]}) {
    x.y.slice(1);
    x.y.push(1);
}

const z = b.find(item => {
    return item === 'a';
});

const zz = b.findIndex(item => {
    return item === 'a';
});

const y = b.sort();
const yy = b.sort((a: number, b: number) => a - b);
