<?php
namespace test\elementAccessExpression;
$tplData = array();
$a = "aaa";
$tplData[$a] = 123;
$tplData[$a . "123"] = 123;
