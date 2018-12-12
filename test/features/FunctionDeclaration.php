<?php
if (!function_exists('aaa')) {
    function aaa($a, $b, $c) {
        $d = 123;
        $e = $b . 123;
        return "1" . $a . "2" . $e . "3" . $c . "4" . $d;
    }
}
aaa("1", "2", "3");
