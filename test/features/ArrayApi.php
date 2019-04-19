<?php
namespace test\case_ArrayApi;
$a = count(array(1));
$b = array(1, "a");
$c = count($b);
array_push($b, $c);
$d = array_search(1, $b);
$f = array_map(function ($value, $index) {
    return $value;
}, $b);
$e = array_walk($b, function ($value, $index) {
    $a = $value;
});
$g = array_filter($b, function ($value, $index) {
    return $value;
});
$t = \Ts2Php_Helper::isPlainArray($a);
$x = array( "u" => array() );
$v = count($x["u"]);
echo "<script>console.log(" . json_encode($x) . ");</script>";
function run($x) {
    \Ts2Php_Helper::arraySlice($x["y"], 1);
    array_push($x["y"], 1);
}
