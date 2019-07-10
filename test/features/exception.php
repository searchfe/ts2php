<?php
namespace test\case_exception;
try {
    throw new \Exception("error!");
}
catch (\Exception $e) {
    echo "error" . $e->getMessage();
}
$a = "hard";
throw new \Exception("a " . $a . " error!");
throw new \Exception($a . "!");
