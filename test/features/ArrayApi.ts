const a = [1].length;
const b = [1, 'a'];
const c = b.length;
b.push(c);
const d = b.indexOf(1);
const f = b.map(function (value, index) {
    return value + 1;
});
const e = b.forEach(function (value, index) {
    let a = value + 1;
});
const g = b.filter(function (value, index) {
    return value;
});
const t = Array.isArray(a);

function process(x: {y: number[]}) {
    x.y.slice(1);
    x.y.push(1);
}
