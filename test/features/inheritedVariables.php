<?php
namespace test\case_inheritedVariables;
$b = "b";
$c = "c";
$d = "d";
$arr = array("1", "2", "3");
$arr1 = array_map(function ($item) use(&$b, &$c, &$d)  {
    return $item . $b . $c . $d;
}, $arr);
$arr2 = array_map(function ($item) use(&$b)  {
    return $item . $b;
}, $arr);
$a = function () use(&$b) {
return "123" . $b;
};
$f = function () use(&$b)  {
    return "123" . $b;
};
