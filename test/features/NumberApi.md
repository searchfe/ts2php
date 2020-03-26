NumberApi
======

## NumberApi

```ts
const a = 12.44;
const b = a.toFixed(1);
const c = (a + 1).toFixed(1);
const d = Number.isInteger(a);
const e = a.toString();
```

```php
$a = 12.44;
$b = number_format($a, 1, ".", "");
$c = number_format(($a + 1), 1, ".", "");
$d = is_int($a);
$e = strval($a);
```