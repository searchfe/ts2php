GlobalApi
======

## GlobalApi

```ts
const a = parseInt('1.2');
const b = parseFloat('1.2');
const c = typeof a;
const d = typeof c === 'string';
const e = {a: 1, b: 2};
delete e.a;
const f = navigator.userAgent;
const g = __dirname;
const h = __filename;
```

```php
$a = intval("1.2");
$b = floatval("1.2");
$c = \Ts2Php_Helper::typeof($a);
$d = \Ts2Php_Helper::typeof($c) === "string";
$e = array( "a" => 1, "b" => 2 );
unset($e["a"]);
$f = $_SERVER["HTTP_USER_AGENT"];
$g = dirname(__FILE__);
$h = __FILE__;
```