<?php
namespace test\case_spreadExpression;
function aaa() {
    $aaa = func_get_args();
    return call_user_func_array("max", $aaa);
}
$arr = array(6, 3, 9);
call_user_func_array("aaa", array_merge(array(10), $arr, array(101)));
call_user_func_array("max", array_merge(array(10), $arr, array(100)));
