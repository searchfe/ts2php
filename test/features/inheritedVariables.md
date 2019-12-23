inheritedVariables
======

## inheritedVariables

```ts
import {Article as Art} from './helper/Class';
import somFunc from './helper/export';
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
```

```php
require_once(dirname(__FILE__) . '/' . "./helper/Class.php");
use \someModule\Article as Art;
$a = array(
    "b" => "123456"
);
$b = "b";
$c = "c";
$d = "d";
$arr = array("1", "2", "3");
$arr1 = array_map(function ($item) use(&$d, &$c, &$b)  {
    return $item . $b . $c . $d;
}, $arr);
$ar = array(array( "aaa" => 123 ));
$arr2 = array_map(function ($item) use(&$b)  {
    return $item . $b;
}, $ar);
$fa = function () use(&$b) {
return "123" . $b;
};
$f = function () use(&$a, &$fa)  {
    somFunc("");
    $fa();
    echo 123;
    return "123" . mb_strlen($a["b"], "utf8");
};
$obj = array(
    "a" => function () use(&$b)  {
        return "123" . $b;
    },
    "b" => function () use(&$b)  {
        $a = $b;
        return "123" . $b . $a;
    }
);
$arr3 = array_map(function ($item) use(&$a)  {
    return array_merge(array(), $a, array(
        "item" => $item
    ));
}, $arr);
class mmm {
    static function func($num) {
        return $num;
    }
}
class nnn {
}
$arr4 = array_map(function ($item) {
    $c = new nnn();
    $d = new Art(array( "title" => "" ));
    return mmm::func($item);
}, $arr);
function noError() {
    somFunc("");
}
```