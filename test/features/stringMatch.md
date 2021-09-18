stringMatch
======

## stringMatch

```ts
let a = 'abc';

let b = a.match(/a/gi);
let c = a.match(/a(?<name>bc)/ig);
let d = a.match(/a(?<name>bc)/g);
let e = a.match(/a(?<name>\/bc)/g);
let f = a.match('a');
const aaa = /(filetype|intitle|site|inurl):([^\s]*)/;
const reg = aaa;
const key = '123';
const matches = key.match(reg);
```

```php
$a = "abc";
$b = \Ts2Php_Helper::match("/a/i", $a, false, true);
$c = \Ts2Php_Helper::match("/a(?<name>bc)/i", $a, false, true);
$d = \Ts2Php_Helper::match("/a(?<name>bc)/", $a, false, true);
$e = \Ts2Php_Helper::match("/a(?<name>\\/bc)/", $a, false, true);
$f = \Ts2Php_Helper::match("a", $a, true);
$aaa = "/(filetype|intitle|site|inurl):([^\\s]*)/";
$reg = &$aaa;
$key = "123";
$matches = \Ts2Php_Helper::match($reg, $key);
```