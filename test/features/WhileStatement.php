<?php
namespace test\WhileStatement;
$a = true;
$b;
while (!$a) {
    $b = 2;
}
do {
    $b++;
} while (!$a);
