<?php
$a = "wwa";
$b = str_replace("a", "b", $a);
$c = array( "s" => "aaa" );
$d = str_replace("a", "b", $c["s"]);
$f = preg_replace("/w/", "b", $a);
$e = preg_replace("/w/", "b", $a, 1);
