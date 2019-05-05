<?php
namespace test\case_ArrayLiteralExpression;
$b = 4;
$a = array(1, 2, 3, $b);
$c = [
    1,
    2,
    3,
    $b
];
