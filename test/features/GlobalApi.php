<?php
use test\GlobalApi;
$a = intval("1.2");
$b = floatval("1.2");
$c = Ts2Php_Helper::typeof($a);
$d = Ts2Php_Helper::typeof($c) === "string";
$e = array( "a" => 1, "b" => 2 );
unset($e["a"]);
