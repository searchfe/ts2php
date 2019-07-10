<?php
namespace test\case_exception;
throw new \Exception("error!");
$a = "hard";
throw new \Exception("a " . $a . " error!");
throw new \Exception($a . "!");
