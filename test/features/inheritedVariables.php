<?php
namespace test\case_inheritedVariables;
$a = array(
    "b" => "123456"
);
$b = "b";
$c = "c";
$d = "d";
$arr = array("1", "2", "3");
$arr1 = array_map(function ($item) use(&$d, &$c, &$b)  {
    return $item . $b . $c . $d;
}, $arr);
$ar = array(array( "aaa" => 123 ));
$arr2 = array_map(function ($item) use(&$b)  {
    return $item . $b;
}, $ar);
$fa = function () use(&$b) {
return "123" . $b;
};
$f = function () use(&$a)  {
    echo 123;
    return "123" . mb_strlen($a["b"], "utf8");
};
$obj = array(
    "a" => function () use(&$b)  {
        return "123" . $b;
    },
    "b" => function () use(&$b)  {
        $a = $b;
        return "123" . $b . $a;
    }
);
$arr3 = array_map(function ($item) use(&$a)  {
    return array_merge(array(), $a, array(
        "item" => $item
    ));
}, $arr);
class mmm {
    static function func($num) {
        return $num;
    }
}
class nnn {
}
$arr4 = array_map(function ($item) {
    $c = new nnn();
    return mmm::func($item);
}, $arr);
