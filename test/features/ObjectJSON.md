ObjectJSON
======

## ObjectJSON

```ts
const a = Object.assign({}, {a: 1});
const b = Object.keys(a);
const c = Object.freeze(a);
const d = JSON.stringify(a);
const e = JSON.parse('{"a": "ss"}');
```

```php
$a = array_merge(array(), array( "a" => 1 ));
$b = array_keys($a);
$c = $a;
$d = json_encode($a, 256);
$e = json_decode("{\"a\": \"ss\"}", true);
```