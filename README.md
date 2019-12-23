# ts2php

**under development**

TypeScript 转 PHP

A Compiler which can compile TypeScript to PHP.

![Language](https://img.shields.io/badge/-TypeScript-blue.svg)
[![Build Status](https://travis-ci.com/searchfe/ts2php.svg?branch=master)](https://travis-ci.org/searchfe/ts2php)
[![npm package](https://img.shields.io/npm/v/ts2php.svg)](https://www.npmjs.org/package/ts2php)
[![npm downloads](http://img.shields.io/npm/dm/ts2php.svg)](https://www.npmjs.org/package/ts2php)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/searchfe/ts2php)

- [ts2php](#ts2php)
  - [Usage](#usage)
    - [compiler](#compiler)
    - [runtime](#runtime)
    - [CLI](#cli)
    - [update ts2php version](#update-ts2php-version)
  - [Features](#features)
    - [Javascript Syntax](#javascript-syntax)
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

> Some features are implemented by a PHP helper class, which need to be included in your PHP
 code.

```php
require_once("/path/to/ts2php/dist/runtime/Ts2Php_Helper.php");
```

### CLI

Quick Start：

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

### update ts2php version

Same TS code with different version of ts2php may result to different PHP code. When updating the version of ts2php, we should check the result PHP code manually. To simplify this process, we recommend to use [ts2php-diff-checker][ts2php-diff-checker]. Specify two version of ts2php, and some source TS code, [ts2php-diff-checker][ts2php-diff-checker] will generate diff info directly.

```sh
ts2php-check <pattern> <old-version> <new-version> [destination]
```

## Features

### Javascript Syntax

- [`for`/`for of`/`for in`](./test/features/ForStatement.md)
- [`if`/`else if`/`else`](./test/features/IfStatement.md)
- [`swtich`](./test/features/SwitchStatement.md)
- [`while`/`do while`](./test/features/WhileStatement.md)
- [`Class`](./test/features/Class.md)
- [`typeof`](./test/features/GlobalApi.md)
- [`delete`](./test/features/GlobalApi.md)
- [`destructuring`](./test/features/Destructuring.md)
- [`template string`](./test/features/template.md)
- [`object computed property`](./test/features/ComputedPropertyName.md)
- [`object shorthand property`](./test/features/ShorthandPropertyAssignment.md)
- [`enum`](./test/features/EnumDeclaration.md)
- [`anonymous function inherit variables`](./test/features/inheritedVariables.md)
- [`rest function arguments`](./test/features/spreadExpression.md)
- [`spread`](./test/features/spreadExpression.md)
- [`exception`](./test/features/exception.md)

For more, see feature test markdowns: [Javascript Syntax](./test/features)

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
  - Array.prototype.sort
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
[ts2php-diff-checker]: https://github.com/meixg/ts2php-diff-checker
