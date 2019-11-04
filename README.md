# ts2php

**under development**

TypeScript 转 PHP

![Language](https://img.shields.io/badge/-TypeScript-blue.svg)
[![Build Status](https://travis-ci.org/searchfe/ts2php.svg?branch=master)](https://travis-ci.org/searchfe/ts2php)
[![npm package](https://img.shields.io/npm/v/ts2php.svg)](https://www.npmjs.org/package/ts2php)
[![npm downloads](http://img.shields.io/npm/dm/ts2php.svg)](https://www.npmjs.org/package/ts2php)

- [ts2php](#ts2php)
  - [Usage](#usage)
    - [compiler](#compiler)
    - [runtime](#runtime)
    - [CLI](#cli)
  - [Features](#features)
    - [Javascript Syntax](#javascript-syntax)
      - [`for`/`for of`/`for in`](#forfor-offor-in)
      - [`if`/`else if`/`else`](#ifelse-ifelse)
      - [`swtich`](#swtich)
      - [`while`/`do while`](#whiledo-while)
      - [`Class`](#class)
      - [`typeof`](#typeof)
      - [`delete`](#delete)
      - [`destructuring`](#destructuring)
      - [`template string`](#template-string)
      - [`object computed property`](#object-computed-property)
      - [`object shorthand property`](#object-shorthand-property)
      - [`object method`](#object-method)
      - [`enum`](#enum)
      - [`anonymous function inherit variables`](#anonymous-function-inherit-variables)
      - [`rest function arguments`](#rest-function-arguments)
      - [`spread`](#spread)
      - [`exception`](#exception)
    - [Core JavaScript API](#core-javascript-api)
  - [Thanks to](#thanks-to)

## Usage

### compiler

```javascript
import {compile} from 'ts2php';

const result = compile(filePath, options);
```

### runtime

> 部分功能依赖一个 PHP 的类库，需要在 PHP 工程中引入

```php
require_once("/path/to/ts2php/dist/runtime/Ts2Php_Helper.php");
```

### CLI

简单使用：

```bash
$ npm i -g ts2php
$ ts2php ./a.ts                   # 编译输出到 stdout
```

使用[配置][options]并输出到文件：

```bash
$ cat config.js
module.exports = {
  emitHeader: false
};
$ ts2php -c config.js src/ -o output/
```

更多选项：

```bash
$ ts2php --show-diagnostics       # 输出诊断信息
$ ts2php --emit-header            # 输出头部信息
$ ts2php -h                       # 更多功能请查看帮助
```

## Features

### Javascript Syntax

#### `for`/`for of`/`for in`

```javascript
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
    console.log(iterator);
}
```

output

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
foreach ($d as $iterator) {
    echo $iterator;
}
```

#### `if`/`else if`/`else`

```javascript
const a = true;

if (!a) {
    const b = 456;
    const c = 123;
}
else {
    const d = 789;
}
```

output

```php
$a = true;
if (!$a) {
    $b = 456;
    $c = 123;
}
else {
    $d = 789;
}
```

#### `swtich`

```javascript
let b = 2;
let c = 1;
switch (b) {
    case 1:
        c = 2;
        break;
    case 2:
        c = 3;
        break;
    default:
        c = 4;
}
```

output

```php
$b = 2;
$c = 1;
switch ($b) {
    case 1:
        $c = 2;
        break;
    case 2:
        $c = 3;
        break;
    default:
        $c = 4;
}
```

#### `while`/`do while`

```javascript
const a = true;
let b;
while(!a) {
    b = 2;
}
do {
    b++;
} while(!a);
```

output

```php
$a = true;
$b;
while (!$a) {
    $b = 2;
}
do {
    $b++;
} while (!$a);
```

#### `Class`

```javascript
import {Base} from '../some-utils';

class Article extends Base {

    public title: string;
    id: number;

    private _x: number;

    static published = [];

    constructor(options: {title: string}) {
        super(options);
        this.title = options.title;
        this.publish(1);
    }

    private publish(id) {
        Article.published.push(id);
        super.dispose();
    }
}

const a = new Article({title: 'a'});
const b = a.base;
a.dispose();
```

output

```php
namespace test\case_Class;
require_once(realpath(dirname(__FILE__) . '/' . "../some-utils.php"));
use \Base;
class Article extends Base {
    public $title;
    public $id;
    public $foo;
    private $_x;
    public static $published = array();
    function __construct($options) {
        parent::__construct($options);
        $this->title = $options["title"];
        $this->publish(1);
    }
    private function publish($id) {
        array_push(Article::$published, $id);
        parent::dispose();
    }
}
$a = new Article(array( "title" => "a" ));
$b = $a->base;
$a->dispose();
```

#### `typeof`

> 由于 php 中没有 `undefined` 关键字，故不支持返回 `undefined`

```javascript
const d = typeof c === 'string';
```

output

```php
$d = \Ts2Php_Helper::typeof($c) === "string";
```

#### `delete`

```javascript
const e = {a: 1, b: 2};
delete e.a;
```

output

```php
$e = array( "a" => 1, "b" => 2 );
unset($e["a"]);
```

#### `destructuring`

```javascript
const tplData: {a: number, difftime?: number, c?: 1} = {a: 1};

const {
    difftime = 8,
    a,
    c: y = 1
} = tplData;

let a = [1, 2, 3];
const [, e, f] = a;
```

output

```php
$tplData = array( "a" => 1 );
$difftime = isset($tplData["difftime"]) ? $tplData["difftime"] : 8; $a = $tplData["a"]; $y = isset($tplData["c"]) ? $tplData["c"] : 1;
$a = array(1, 2, 3);
$e = $a[1]; $f = $a[2];
```

#### `template string`

```javascript
const b = '123';
const c = `0${b}45'6'"789"`;
```

output

```php
$b = "123";
$c = "0" . $b . "45'6'\"789\"";
```

#### `object computed property`

```javascript
let a = 'aaa';
let b = 'bbb';
let c = {
    [a + b]: 123,
    [b]: 456
};
```

output

```php
$a = "aaa";
$b = "bbb";
$c = array(
    ($a . $b) => 123,
    ($b) => 456
);
```

#### `object shorthand property`

```javascript
let b = 2;
let c = 1;
const a = {
    b,
    c
};
```

output

```php
$b = 2;
$c = 1;
$a = array(
    "b" => $b,
    "c" => $c
);
```

#### `object method`

```javascript
const a = {
    b() {
        return "111";
    }
};
```

output

```php
$a = array(
    "b" => function () {
        return "111";
    }
);
```

#### `enum`

```typescript
enum aaa {a = 1, b, c}
enum bbb {a, b, c}
enum ccc {
    a = 'a',
    b = 'b',
    c = 'c'
}

const str = '123';
enum ddd {
    a = str.length,
    b = str.length + 1
}
```

```php
$aaa = array( "a" => 1, "b" => 2, "c" => 3 );
$bbb = array( "a" => 0, "b" => 1, "c" => 2 );
$ccc = array( "a" => "a", "b" => "b", "c" => "c" );
$str = "123";
$ddd = array( "a" => strlen($str), "b" => strlen($str) + 1 );
```

#### `anonymous function inherit variables`

```typescript
let b = 'b';
let f = function () {
    return '123' + b;
}
```

```php
$b = "b";
$f = function () use(&$b)  {
    return "123" . $b;
};
```


#### `rest function arguments`

```typescript
function funcA(...args: string[]) {
}
function funcC(a: string, ...args: string[]) {
}
```

output

```php
function funcA() {
    $args = func_get_args();
}
function funcC() {
    $a = func_get_arg(0); $args = array_slice(func_get_args(), 1);
}
```

#### `spread`

```typescript
const e = {
    f: 1,
    ...a,
    w: 2,
    c: 3
};
const g = [...a, 'a', 'b', ...c, 1];
```

output

```php
$e = array_merge(array(), array(
    "f" => 1
), $a, array(
    "w" => 2,
    "c" => 3
));
$g = array_merge(array(), $a, array(
    "a", "b"
), $c, array(
    1
));
```

> 注：箭头函数暂不支持


#### `exception`

```typescript
try {
    throw 'error!';
}
catch (e) {
    console.log('error' + e.message);
}
```

outputs

```typescript
try {
    throw new \Exception("error!");
}
catch (\Exception $e) {
    echo "error" . $e->getMessage();
}
```

### Core JavaScript API

- parseInt **只接收一个参数**
- parseFloat
- encodeURIComponent
- decodeURIComponent
- encodeURI
- __dirname
- __filename
- Date
  - Date.now
  - Date.prototype.getTime
  - Date.prototype.getDate
  - Date.prototype.getDay
  - Date.prototype.getFullYear
  - Date.prototype.getHours
  - Date.prototype.getMinutes
  - Date.prototype.getMonth
  - Date.prototype.getSeconds
  - Date.prototype.setDate
  - Date.prototype.setFullYear
  - Date.prototype.setHours
  - Date.prototype.setMinutes
  - Date.prototype.setMonth
  - Date.prototype.setSeconds
  - Date.prototype.setTime
- Object
  - Object.assign
  - Object.keys
  - Object.values
  - Object.freeze
  - Object.prototype.hasOwnProperty
- JSON
  - JSON.stringify **只接收一个参数**
  - JSON.parse **只接收一个参数**
- console
  - console.log
  - console.info **转成 var_dump**
  - console.error
- String
  - String.prototype.replace **第二个参数只支持 string，不支持 Function**
  - String.prototype.trim
  - String.prototype.trimRight
  - String.prototype.trimLeft
  - String.prototype.toUpperCase
  - String.prototype.toLowerCase
  - String.prototype.split
  - String.prototype.indexOf
  - String.prototype.substring
  - String.prototype.repeat
  - String.prototype.startsWidth
  - String.prototype.endsWidth
  - String.prototype.includes
  - String.prototype.padStart
  - String.prototype.match **只支持正则和字符串匹配**
- Array
  - Array.isArray
  - Array.prototype.length
  - Array.prototype.filter **回调函数只接收第一个参数**
  - Array.prototype.push
  - Array.prototype.pop
  - Array.prototype.shift
  - Array.prototype.unshift
  - Array.prototype.concat
  - Array.prototype.reverse
  - Array.prototype.splice
  - Array.prototype.reverse
  - Array.prototype.map
  - Array.prototype.forEach
  - Array.prototype.indexOf
  - Array.prototype.join
  - Array.prototype.some
  - Array.prototype.every
  - Array.prototype.find
  - Array.prototype.findIndex
- Number
  - Number.isInterger
  - Number.prototype.toFixed
- Math
  - Math.abs
  - Math.acos
  - Math.acosh
  - Math.asin
  - Math.asinh
  - Math.atan
  - Math.atanh
  - Math.atan2
  - Math.cbrt
  - Math.ceil
  - Math.clz32
  - Math.cos
  - Math.cosh
  - Math.exp
  - Math.expm1
  - Math.floor
  - Math.hypot
  - Math.log
  - Math.log1p
  - Math.log10
  - Math.max
  - Math.min
  - Math.pow
  - Math.random
  - Math.round
  - Math.sin
  - Math.sinh
  - Math.sqrt
  - Math.tan
  - Math.tanh

## Thanks to

Based on [Typescript](https://github.com/Microsoft/TypeScript) compiler

[options]: https://searchfe.github.io/ts2php/interfaces/ts2phpoptions.html
