<?php
namespace test\case_stringProto;
$a = "wwa";
$b = \Ts2Php_Helper::str_replace_once("a", "b", $a);
$c = array( "s" => "aaa" );
$d = \Ts2Php_Helper::str_replace_once("a", "b", $c["s"]);
$f = preg_replace("/w/", "b", $a);
$e = preg_replace("/w/", "b", $a, 1);
$g = trim($a);
$h = \Ts2Php_Helper::str_pos($a, "a");
$i = explode(" ", $a);
$j = preg_split("/\\0/", $a);
$k = 2;
$l = substr($a, 1, $k);
$m = mb_strlen($a, "utf8");
$n = "a啊哈哈";
echo mb_substr($n, 1, 1, "utf8");
