class XX {
    static aaa() {

    }
    static bbb() {

    }
    static ccc = '123'
}
XX['ccc'];
XX['aaa']();

enum key {
    aaa = 'aaa',
    bbb = 'bbb',
    ccc = 'ccc'
}
const nnn = key.aaa;
const mmm = key.ccc;
let a = XX[nnn]();
let b = XX[mmm];