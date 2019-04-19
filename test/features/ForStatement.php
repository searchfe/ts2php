<?php
namespace test\case_ForStatement;
$b = 1;
for ($i = 0; $i < 10; $i++) {
    $b += 10;
}
$a = array(1, 2, 3);
foreach ($a as $iterator) {
    var_dump($iterator);
}
$d = array( "a" => 1, "b" => 2 );
foreach ($d as $iterator) {
    var_dump($iterator);
}
