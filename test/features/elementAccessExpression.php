<?php
namespace test\elementAccessExpression;
$a = "aaa";
$tplData[$a] = 123;
$tplData[$a . "123"] = 123;
