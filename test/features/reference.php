<?php
namespace test\case_reference;
$a = array();
$b = &$a;
$c = array();
$d = &$c;
$e = function () { };
$f = $e;
