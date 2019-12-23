export
======

## export

```ts
export default function run(a: string) {
    var b = '111';
    console.log(a, b);
}

export {Some_Utils} from './helper/some-utils';
```

```php
function run($a) {
    $b = "111";
    echo $a, $b;
}
require_once(dirname(__FILE__) . '/' . "./helper/some-utils.php");
```