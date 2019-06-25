<?php
namespace test\case_ObjectLiteralExpression;
$b = array(
    "a" => 123,
    "b" => "456"
);
$a = array(
    "a" => $b,
    "b" => $b,
    "a-b" => $b
);
$c = array_key_exists("b", $a);
$d = array(
    "\$a" => "a",
    "b" => "\$b"
);
$e = array_merge(array(), array(
    "f" => 1
), $a, array(
    "w" => 2,
    "c" => 3
));
