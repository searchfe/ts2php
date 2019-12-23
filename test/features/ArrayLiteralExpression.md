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

const [, e, f] = a;

const g = [...a, 'a', 'b', ...c, 1];
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
```