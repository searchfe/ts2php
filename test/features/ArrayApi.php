<?php
$a = count(array(1));
$b = array(1, "a");
$c = count($b);
array_push($b, $c);
$d = array_search(1, $b);
