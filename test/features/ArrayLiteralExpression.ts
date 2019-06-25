let b = 4;
let a = [1, 2, 3, b];
let c = [
    1,
    2,
    3,
    b
];

const [, e, f] = a;

const g = [...a, 'a', 'b', ...c, 1];
