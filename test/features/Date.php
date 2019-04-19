<?php
namespace test\case_Date;
$a = \Ts2Php_Date::now();
$date = new \Ts2Php_Date();
$b = $date->getTime();
$c = $date->setDate(12);
