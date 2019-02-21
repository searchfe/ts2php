<?php
use test\ObjectLiteralExpression;
$b = array(
    "a" => 123,
    "b" => "456"
);
$a = array(
    "a" => $b,
    "b" => $b,
    "a-b" => $b
);
