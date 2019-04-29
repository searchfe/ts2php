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
