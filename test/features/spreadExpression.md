spreadExpression
======

## spreadExpression

```ts
function aaa(...aaa: number[]) {
    return Math.max(...aaa);
}
const arr = [6,3,9];
aaa(10, ...arr, 101);
Math.max(10, ...arr, 100);
```

```php
function aaa() {
    $aaa = func_get_args();
    return call_user_func_array("max", $aaa);
}
$arr = array(6, 3, 9);
call_user_func_array("aaa", array_merge(array(10), $arr, array(101)));
call_user_func_array("max", array_merge(array(10), $arr, array(100)));
```