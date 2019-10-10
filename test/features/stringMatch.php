<?php
namespace test\case_stringMatch;
$a = "abc";
$b = \Ts2Php_Helper::match("/a/i", $a, false, true);
$c = \Ts2Php_Helper::match("/a(?<name>bc)/i", $a, false, true);
$d = \Ts2Php_Helper::match("/a(?<name>bc)/", $a, false, true);
$e = \Ts2Php_Helper::match("a", $a, true);
