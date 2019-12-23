arrowFunction
======

## arrowFunction

```ts
let arr = [] as string[];
arr.map(item => {
    return item + '';
});

let a = (b: string) => '123';

let v = '123';
let b = () => v;
```

```php
$arr = array();
array_map(function ($item) {
    return $item . "";
}, $arr);
$a = function ($b){
return "123";
};
$v = "123";
$b = function () use(&$v) {
return $v;
};
```