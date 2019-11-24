<?php
namespace test\case_interfaceAsClass;
class Cls {
    function log() {
        echo "foo";
    }
}
$foo = new Cls();
($foo)->log();
($foo)->log();
($foo)["log"]();
