<?php
if (!function_exists('aaa')) {
    function aaa($a, $b, $c) {
        $d = 123;
        return "1" . $a . "2";
    }
}
aaa("1", "2", "3");
