<?php
namespace test\case_arrowFunction;
$arr = array();
array_map(function ($item) {
    return $item . "";
}, $arr);
$a = function ($b){
return "123";
};
