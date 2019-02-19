<?php
use test\FunctionDeclaration;
function aaa($a, $b, $c) {
    $d = 123;
    $e = $b . 123;
    return "1" . $a . "2" . $e . "3" . $c . "4" . $d;
}
aaa("1", "2", "3");
$bbb = function ($x){
return "222"
};
bbb("1");
$a = array(
    "b" => function () {
        return "111";
    }
);
$b = array(
    "b" => function () {
        return "111";
    }
);
$c = array(
    "b" => function () {
        return "111";
    }
);
