<?php
namespace test\case_stringMatch;
$a = "abc";
$b = \Ts2Php_Helper::match("/a/", $a);
$c = \Ts2Php_Helper::match("/a(?<name>bc)/", $a);
$d = \Ts2Php_Helper::match("a", $a, true);
