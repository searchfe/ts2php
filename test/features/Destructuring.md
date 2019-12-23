Destructuring
======

## Destructuring

```ts
const tplData: {a: number, difftime?: number, c?: 1} = {a: 1};

const {
    difftime = 8,
    a,
    c: y = 1
} = tplData;

const c = tplData.a;
```

```php
$tplData = array( "a" => 1 );
$difftime = isset($tplData["difftime"]) ? $tplData["difftime"] : 8; $a = $tplData["a"]; $y = isset($tplData["c"]) ? $tplData["c"] : 1;
$c = $tplData["a"];
```