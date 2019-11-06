<?php
namespace test\case_objectForObjectLiteral;
class Bar {
    public static $bar = "s";
    static function getBar() {
        return "name";
    }
    public $name;
    function method() {
        $this->name;
    }
}
$foo = (object)array( "name" => "name", "getName" => function (){
    return "name";
    } );
echo "object literal as interface", "\n";
echo $foo->name, "\n";
echo ($foo->getName)(), "\n";
$bar = (object)array( "name" => "name", "getName" => function (){
    return "name";
    } );
echo "object literal", "\n";
echo $bar->name, "\n";
echo ($bar->getName)(), "\n";
$arr1 = array(1, 2, 3);
echo "read array element", "\n";
echo $arr1[2], "\n";
$arr2 = array(1, 2, 3);
$i = 2;
echo $arr2[$i], "\n";
echo $arr2[2], "\n";
echo "static property/method", "\n";
echo Bar::$bar, "\n";
echo Bar::getBar(), "\n";
echo "nested property access", "\n";
echo $bar->{"name"}, "\n";
echo ($bar->{"getName"})(), "\n";
echo $bar->{$bar->{"name"}}, "\n";
