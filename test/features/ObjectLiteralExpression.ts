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

function aaa () {
    console.log('aaa');
}

let bbb = function () {
    console.log('bbb');
};

let ddd = () => {
    console.log('ddd');
};

let eee = bbb;

let mmm = {
    aaa,
    bbb,
    ccc() {
        console.log('ccc');
    },
    ddd,
    eee
};

mmm.aaa();
mmm.bbb();
mmm.ccc();
mmm.ddd();
mmm.eee();
