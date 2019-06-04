<?php
namespace test\case_isset;
$a = 1;
if (!isset($a)) {
    echo "a";
}
if (isset($a)) {
    echo "a";
}
