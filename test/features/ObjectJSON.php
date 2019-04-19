<?php
namespace test\case_ObjectJSON;
$a = array_merge(array(), array( "a" => 1 ));
$b = array_keys($a);
$c = $a;
$d = json_encode($a, 256);
$e = json_decode("{\"a\": \"ss\"}", true);
