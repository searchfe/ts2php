elementAccessExpression
======

## elementAccessExpression

```ts
let tplData = {} as {[key: string]: number};
const a = 'aaa';
tplData[a] = 123;
tplData[a + '123'] = 123;
```

```php
$tplData = array();
$a = "aaa";
$tplData[$a] = 123;
$tplData[$a . "123"] = 123;
```