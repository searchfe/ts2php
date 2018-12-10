<?php

$a = "aaa";
$b = "bbb";
$c = array(
    $a . $b => 123,
    b => 456
);

var_dump($c);