reference
======

## reference

```ts
let a: number[] = [];
let b = a;

let c: {aaa?: string} = {};
let d = c;

let e = function () {};
let f = e;
```

```php
$a = array();
$b = &$a;
$c = array();
$d = &$c;
$e = function () { };
$f = $e;
```