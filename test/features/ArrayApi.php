<?php
namespace test\case_ArrayApi;
$a = count(array(1));
$b = array(1, "a");
$c = count($b);
array_push($b, $c);
array_push($b, 1, 2, 3, 4, 5);
$d = \Ts2Php_Helper::array_pos(1, $b);
$f = array_map(function ($value) {
    return $value;
}, $b);
$h = array_map(function ($value, $index) {
    return array(
        "value" => $value,
        "index" => $index
    );
}, $b, array_keys($b));
$fn1 = function ($value, $index) {
    return $index;
};
$fn2 = function ($value) {
    return $value;
};
array_map($fn1, $b, array_keys($b));
array_map($fn2, $b);
$e = array_walk($b, function ($value, $index) {
    $a = $value;
});
$g = array_filter($b, function ($value, $index) {
    return $value;
});
$w = \Ts2Php_Helper::array_every($b, function ($value, $index) {
    return !!$value;
});
$t = \Ts2Php_Helper::isPlainArray($a);
$x = array( "u" => array() );
$v = count($x["u"]);
echo "<script>console.log(" . json_encode($x) . ");</script>";
function run($x) {
    \Ts2Php_Helper::arraySlice($x["y"], 1);
    array_push($x["y"], 1);
}
$z = \Ts2Php_Helper::array_find(function ($item) {
    return $item === "a";
}, $b);
$zz = \Ts2Php_Helper::array_find_index(function ($item) {
    return $item === "a";
}, $b);
$y = sort($b);
$yy = usort($b, function ($a, $b){
return $a - $b;
});
$u = array_splice($b, 0, 1);
$uu = array_splice($b, 0, 1, array(3, 4));
$cc = array(array( "a" => 1 ), array( "a" => 3 ));
$ccc = array_splice($cc, 1, 0, array(array( "a" => 2 )));