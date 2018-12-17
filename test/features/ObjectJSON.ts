const a = Object.assign({}, {a: 1});
const b = Object.keys(a);
const c = Object.freeze(a);
const d = JSON.stringify(a);
const e = JSON.parse('{"a": "ss"}');
