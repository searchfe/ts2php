const b = {
    a: 123,
    b: '456'
};

const a = {
    a: b,
    b,
    'a-b': b
};

const c = 'b' in a;

const d = {
    $a: "a",
    b: "$b"
};

const e = {
    f: 1,
    ...a,
    w: 2,
    c: 3
};
