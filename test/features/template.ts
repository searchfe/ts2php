const b = `123`;
const c = `0${b}45'6'"789"`;
const s = `1${b}2${b}3${b}4`;

let sa = '111';
let i = 123;
sa + `_${i ? 'a' : 'b'}_${i + 2}_${`1${b}2${b}3${b}4`}`;

let a = {
    b: ['123'],
    c: {
        d: '456'
    }
};
let d = `aaa${a.b[0]}ccc`;
`aaa${a.c.d}ccc`;
`aaa${Math.round(i)}ccc`;
`aaa${(i / 10)}bbb`;