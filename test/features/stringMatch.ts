let a = 'abc';

let b = a.match(/a/g);
let c = a.match(/a(?<name>bc)/g);
let d = a.match('a');