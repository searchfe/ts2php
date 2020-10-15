Global Api
======

## parseInt

```ts
const a = parseInt('1.2');
```

```php
$a = intval("1.2");
```

## parseFloat

```ts
const b = parseFloat('1.2');
```

```php
$b = floatval("1.2");
```

## typeof

> 由于 php 中没有 `undefined` 关键字，故不支持返回 `undefined`，如果你写了，会被转成 `null`

> There is no `undefined` in PHP. It will be transformed to `null` if you use it.

```ts
const a = parseInt('1.2');
const c = typeof a;
const d = typeof c === 'string';
```

```php
$a = intval("1.2");
$c = \Ts2Php_Helper::typeof($a);
$d = \Ts2Php_Helper::typeof($c) === "string";
```


## delete

```ts
const e = {a: 1, b: 2};
delete e.a;
```

```php
$e = array( "a" => 1, "b" => 2 );
unset($e["a"]);
```


## navigator.userAgent

```ts
const f = navigator.userAgent;
```

```php
$f = $_SERVER["HTTP_USER_AGENT"];
```

## __dirname/__filename

```ts
const g = __dirname;
const h = __filename;
```

```php
$g = dirname(__FILE__);
$h = __FILE__;
```

## escape

```ts
import {escape} from './helper/export';

escape();
```

```php
require_once(dirname(__FILE__) . '/' . "./helper/export.php");
\someModule\escape();
```