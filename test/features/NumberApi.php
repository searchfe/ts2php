<?php
namespace test\case_NumberApi;
$a = 12.44;
$b = number_format($a, 1);
$c = number_format(($a + 1), 1);
$d = is_int($a);
