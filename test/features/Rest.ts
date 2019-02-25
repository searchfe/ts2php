
const tplData: {a: number, difftime?: number, c?: 1} = {a: 1};

const {
    difftime = 8,
    a,
    c: y = 1
} = tplData;

const c = tplData.a;
