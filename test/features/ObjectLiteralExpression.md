ObjectLiteralExpression
======

## ObjectLiteralExpression

```ts
import {func as func1} from './helper/some-utils';

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
    eee,
    fff: aaa,
    ggg: bbb,
    hhh: ddd,
    iii: eee,
    jjj: func1
};

mmm.aaa();
mmm.bbb();
mmm.ccc();
mmm.ddd();
mmm.eee();
```

```php
require_once(dirname(__FILE__) . '/' . "./helper/some-utils.php");
$b = array(
    "a" => 123,
    "b" => "456"
);
$a = array(
    "a" => $b,
    "b" => $b,
    "a-b" => $b
);
$c = array_key_exists("b", $a);
$d = array(
    "\$a" => "a",
    "b" => "\$b"
);
$e = array_merge(array(), array(
    "f" => 1
), $a, array(
    "w" => 2,
    "c" => 3
));
function aaa() {
    echo "aaa";
}
$bbb = function () {
    echo "bbb";
};
$ddd = function () {
    echo "ddd";
};
$eee = $bbb;
$mmm = array(
    "aaa" => "aaa",
    "bbb" => $bbb,
    "ccc" => function () {
        echo "ccc";
    },
    "ddd" => $ddd,
    "eee" => $eee,
    "fff" => "aaa",
    "ggg" => $bbb,
    "hhh" => $ddd,
    "iii" => $eee,
    "jjj" => "\someModule\func"
);
$mmm["aaa"]();
$mmm["bbb"]();
$mmm["ccc"]();
$mmm["ddd"]();
$mmm["eee"]();
```