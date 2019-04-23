<?php
namespace test\case_funcParamRefer;
$a = array(1, 2, 3);
$b = array(
    "a" => 1
);
$c = "123";
function aaa(&$m, &$n, $k) {
    array_push($m, 4);
    $n["b"] = 2;
    $k .= "4";
}
aaa($a, $b, $c);
