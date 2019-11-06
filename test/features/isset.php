<?php
namespace test\case_isset;
$a = 1;
if (!isset($a)) {
    echo "a", "\n";
}
if (isset($a)) {
    echo "a", "\n";
}
