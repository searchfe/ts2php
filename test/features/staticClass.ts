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

let aa = 'x';
let bb = aa
class Demo {
    static x = [bb];
    static y: number;
    static z = bb;
    static bbb() {};
    static meixg = 123;
    static ooo = '1123';
} 
Demo.y = 123;
Demo.bbb();
console.log(Demo.x);
aa = 'y';
console.log(Demo.x);