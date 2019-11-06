<?php
namespace test\case_WhileStatement;
$a = true;
$b;
while (!$a) {
    $b = 2;
}
do {
    $b++;
} while (!$a);
echo $a, $b, "\n";
