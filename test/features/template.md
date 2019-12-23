template
======

## template

```ts
const b = `123`;
const c = `0${b}45'6'"789"`;
const s = `1${b}2${b}3${b}4`;

let sa = '111';
let i = 123;
sa + `_${i ? 'a' : 'b'}_${i + 2}_${`1${b}2${b}3${b}4`}`;

let a = {
    b: ['123'],
    c: {
        d: '456'
    }
};
let d = `aaa${a.b[0]}ccc`;
`aaa${a.c.d}ccc`;
`aaa${Math.round(i)}ccc`;
`aaa${(i / 10)}bbb`;
let x1 = `x
x`;
let x2 = `x\nx`;
```

```php
$b = "123";
$c = "0" . $b . "45'6'\"789\"";
$s = "1" . $b . "2" . $b . "3" . $b . "4";
$sa = "111";
$i = 123;
$sa . "_" . ($i ? "a" : "b") . "_" . ($i + 2) . "_" . ("1" . $b . "2" . $b . "3" . $b . "4");
$a = array(
    "b" => array("123"),
    "c" => array(
        "d" => "456"
    )
);
$d = "aaa" . $a["b"][0] . "ccc";
"aaa" . $a["c"]["d"] . "ccc";
"aaa" . round($i) . "ccc";
"aaa" . ($i / 10) . "bbb";
$x1 = "x\nx";
$x2 = "x\nx";
```