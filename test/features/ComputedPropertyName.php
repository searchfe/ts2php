<?php
namespace test\ComputedPropertyName;
$a = "aaa";
$b = "bbb";
$c = array(
    ($a . $b) => 123,
    ($b) => 456
);
