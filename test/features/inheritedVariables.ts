import {Article as Art} from './Class';
import somFunc from './export';
let a = {
    b: '123456'
};
let b = 'b';
let c = 'c';
let d = 'd';
let arr = ['1', '2', '3'];

let arr1 = arr.map(item => {
    return item + b + c + d;
});

let ar = [{aaa: 123}];
interface DDD {
    aaa: number;
}
let arr2 = ar.map(function (item: DDD) {
    return item + b;
});

let fa = () => '123' + b;

let f = function () {
    somFunc('');
    fa();
    console.log(123);
    return '123' + a.b.length;
}

let obj = {
    /**
     * aaa
     *
     * @ssr
     */
    a: function () {
        return '123' + b;
    },
    b() {
        /**
         * @ssr
         */
        const a = b;
        return '123' + b + a;
    }
}

let arr3 = arr.map(item => {
    return {
        ...a,
        item
    }
});

class mmm {
    static func(num: string) {
        return num;
    }
}

class nnn {}

let arr4 = arr.map(item => {
    let c = new nnn();
    let d = new Art({title: ''});
    return mmm.func(item);
});

function noError() {
    somFunc('');
}