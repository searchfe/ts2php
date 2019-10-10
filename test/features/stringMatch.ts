let a = 'abc';

let b = a.match(/a/gi);
let c = a.match(/a(?<name>bc)/ig);
let d = a.match(/a(?<name>bc)/g);
let e = a.match('a');