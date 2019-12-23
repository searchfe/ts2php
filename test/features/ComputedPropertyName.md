ComputedPropertyName
======

## ComputedPropertyName

```ts
let a = 'aaa';
let b = 'bbb';
let c = {
    [a + b]: 123,
    [b]: 456
};
```

```php
$a = "aaa";
$b = "bbb";
$c = array(
    ($a . $b) => 123,
    ($b) => 456
);
```