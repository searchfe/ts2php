<?php
namespace test\case_staticClass;
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
