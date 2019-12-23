staticClass
======

## staticClass

```ts
class XX {
    static aaa() {

    }
    static bbb() {

    }
    static ccc = '123'
}
XX['ccc'];
XX['aaa']();

enum key {
    aaa = 'aaa',
    bbb = 'bbb',
    ccc = 'ccc'
}
const nnn = key.aaa;
const mmm = key.ccc;
let a = XX[nnn]();
let b = XX[mmm];

let aa = 'x';
let bb = aa
class Demo {
    static x = [bb];
    static y: number;
    static z = bb;
    static bbb() {};
    static meixg = 123;
    static ooo = '1123';
} 
Demo.y = 123;
Demo.bbb();
console.log(Demo.x);
aa = 'y';
console.log(Demo.x);
```

```php
class XX {
    static function aaa() {
    }
    static function bbb() {
    }
    public static $ccc = "123";
}
XX::$ccc;
XX::aaa();
$key = array( "aaa" => "aaa", "bbb" => "bbb", "ccc" => "ccc" );
$nnn = $key["aaa"];
$mmm = $key["ccc"];
$a = XX::$nnn();
$b = XX::$$mmm;
$aa = "x";
$bb = $aa;
class Demo {
    public static $x;
    public static $y;
    public static $z;
    static function bbb() { }
    public static $meixg = 123;
    public static $ooo = "1123";
}
Demo::$x = array($bb);
Demo::$z = $bb;
Demo::$y = 123;
Demo::bbb();
echo Demo::$x;
$aa = "y";
echo Demo::$x;
```