isset
======

## isset

```ts
const a = 1;

if (a === undefined) {
    console.log('a');
}

if (a !== undefined) {
    console.log('a');
}
```

```php
$a = 1;
if (!isset($a)) {
    echo "a";
}
if (isset($a)) {
    echo "a";
}
```