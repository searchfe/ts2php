For Statement
======

## For Statement

```ts
let b = 1;
for (let i = 0; i < 10; i++) {
    b += 10;
}

const a = [1, 2, 3];
for (const iterator of a) {
    console.log(iterator);
}

const d = {a: 1, b: 2};
for (const iterator in d) {
    if (d.hasOwnProperty(iterator)) {
        console.log(iterator);
    }
}
```

```php
$b = 1;
for ($i = 0; $i < 10; $i++) {
    $b += 10;
}
$a = array(1, 2, 3);
foreach ($a as $iterator) {
    echo $iterator;
}
$d = array( "a" => 1, "b" => 2 );
foreach ($d as $iterator => $__ts2php_item) {
    if (array_key_exists($iterator, $d)) {
        echo $iterator;
    }
}
```