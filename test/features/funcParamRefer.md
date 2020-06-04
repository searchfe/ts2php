funcParamRefer
======

## funcParamRefer

```ts
let a = [1, 2, 3];
let b = {
    a: 1
};
let c = '123';

function aaa(m: number[], n: {[name: string]: number}, k: string, d?: () => string) {
    m.push(4);
    n.b = 2;
    k += '4';
}

aaa(a as number[], b, c);
```

```php
$a = array(1, 2, 3);
$b = array(
    "a" => 1
);
$c = "123";
function aaa($m, $n, $k, $d = null) {
    array_push($m, 4);
    $n["b"] = 2;
    $k .= "4";
}
aaa($a, $b, $c);
```