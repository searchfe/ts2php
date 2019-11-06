<?php
namespace test\case_objectForObjectLiteral;
class Bar {
    public static $bar = "s";
    static function getBar() {
        return "s";
    }
    public $name;
    function method() {
        $this->name;
    }
}
$foo = (object)array( "name" => "s", "getName" => function (){
    return "s";
    } );
$foo->name;
$foo->getName();
$bar = (object)array( "name" => "s", "getName" => function (){
    return "s";
    } );
$bar->name;
$bar->getName();
$arr1 = array(1, 2, 3);
$arr1[2];
$arr2 = array(1, 2, 3);
$i = 2;
$arr2[$i];
$arr2[2];
Bar::$bar;
Bar::getBar();
$bar->{"name"};
$bar->{$bar->{"name"}};
