stringReplace
======

## stringReplace

```ts
let a = 'abc';

a.replace(/ab/i, '');
a.replace(/ab/gi, '');
a.replace(/ab/ig, '');
a.replace(/ab/g, '');
a.replace(/ab/, '');
```

```php
$a = "abc";
preg_replace("/ab/i", "", $a, 1);
preg_replace("/ab/i", "", $a);
preg_replace("/ab/i", "", $a);
preg_replace("/ab/", "", $a);
preg_replace("/ab/", "", $a, 1);
```