exception
======

## exception

```ts
try {
    throw 'error!';
    throw new Error('error!');
}
catch (e) {
    console.log('error' + e.message);
}

const a = 'hard';

throw `a ${a} error!`

throw a + '!';
```

```php
try {
    throw new \Exception("error!");
    throw new \Exception("error!");
}
catch (\Exception $e) {
    echo "error" . $e->getMessage();
}
$a = "hard";
throw new \Exception("a " . $a . " error!");
throw new \Exception($a . "!");
```