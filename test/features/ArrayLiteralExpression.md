ArrayLiteralExpression
======

## ArrayLiteralExpression

```ts
let b = 4;
let a = [1, 2, 3, b];
let c = [
    1,
    2,
    3,
    b
];

let [, e, f] = a;

const g = [...a, 'a', 'b', ...c, 1];

[, e, f = 1] = a;
```

```php
$b = 4;
$a = array(1, 2, 3, $b);
$c = array(
    1,
    2,
    3,
    $b
);
$e = $a[1]; $f = $a[2];
$g = array_merge(array(), $a, array(
    "a", "b"
), $c, array(
    1
));
$destruct_temp_1 = &$a; $e = $destruct_temp_1[1]; $f = isset($destruct_temp_1[2]) ? $destruct_temp_1[2] : 1;
```