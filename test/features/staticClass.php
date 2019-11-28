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
