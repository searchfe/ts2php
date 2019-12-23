stringApi
======

## stringApi

```ts
let a = 'wwa';
let b = a.replace('a', 'b');
let c = {s: 'aaa'};
let d = c["s"].replace('a', 'b');
let f = a.replace(/w/g, 'b');
let e = a.replace(/w/, 'b');
let g = a.trim();
let h = a.indexOf('a');
let i = a.split(" ");
let j = a.split(/\0/);
let k = 2;
let l = a.slice(1, k);
let m = a.length;
let n = "a啊哈哈";
console.log(n[1]);
```

```php
$a = "wwa";
$b = \Ts2Php_Helper::str_replace_once("a", "b", $a);
$c = array( "s" => "aaa" );
$d = \Ts2Php_Helper::str_replace_once("a", "b", $c["s"]);
$f = preg_replace("/w/", "b", $a);
$e = preg_replace("/w/", "b", $a, 1);
$g = trim($a);
$h = \Ts2Php_Helper::str_pos($a, "a");
$i = \Ts2Php_Helper::strSplit(" ", $a);
$j = preg_split("/\\0/", $a, null, PREG_SPLIT_DELIM_CAPTURE);
$k = 2;
$l = \Ts2Php_Helper::str_slice($a, 1, $k);
$m = mb_strlen($a, "utf8");
$n = "a啊哈哈";
echo mb_substr($n, 1, 1, "utf8");
```