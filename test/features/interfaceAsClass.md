interfaceAsClass
======

## interfaceAsClass

```ts
import { PHPClass, PHPArray } from '../..'

class Cls implements I1 {
    log() {
        console.log('foo')
    }
}

interface I1 extends PHPClass {
    log(): void
}

interface I2 extends I1 {
    log(): void
}

interface I3 extends I1, PHPArray { }

const foo = new Cls();

(foo as I1).log();  // direct base is PHPClass
(foo as I2).log();  // indirect base is PHPClass
(foo as I3).log();  // nearest base is PHPArray
```

```php
class Cls {
    function log() {
        echo "foo";
    }
}
$foo = new Cls();
($foo)->log();
($foo)->log();
($foo)["log"]();
```