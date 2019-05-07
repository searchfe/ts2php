<?php
namespace test\case_restArguments;
function funcA() {
    $args = func_get_args();
}
function funcB() {
    $args = func_get_args();
    call_user_func_array("funcA", $args);
    $c = "11";
    $d = $args[0];
    $f = \Ts2Php_Helper::includes($d, "1");
    call_user_func_array("funcA", array_merge(array("a"), $args, array($c)));
}
function funcC() {
    $a = func_get_arg(0); $args = array_slice(func_get_args(), 1);
}
