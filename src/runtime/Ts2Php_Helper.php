<?php

/**
 * @file class Ts2Php_String_Helper
 * @author cxtom (cxtom@gmail.com)
 */

class Ts2Php_Helper {

    /**
     * 是否索引数组
     * @param $arr mixed
     * @return bool
     */
    private static function isPlainArray(&$arr) {
        if (is_array($arr)) {
            $i = 0;
            foreach ($arr as $k => $v) {
                if ($k !== $i++) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * replace once helper for string.prototype.replace
     * @param $needle {string}
     * @param $replace {string}
     * @param $haystack {string}
     * @return {string}
     */
    static public function str_replace_once($needle, $replace, $haystack) {
        $pos = strpos($haystack, $needle);
        if ($pos === false) {
            return $haystack;
        }
        return substr_replace($haystack, $replace, $pos, strlen($needle));
    }

    /**
     * replace once helper for string.prototype.slice
     * @param $origin {string}
     * @param $start {string}
     * @param $end {string}
     * @return {string}
     */
    static public function str_slice($origin, $start, $end) {
        return substr($origin, $start, $end - $start + 1);
    }

    /**
     * get type of $var
     * @param $origin {*}
     * @return {string}
     */
    static public function typeof($var) {
        if (is_string($var)) {
            return 'string';
        }
        if (is_numeric($var)) {
            return 'number';
        }
        if (is_bool($var)) {
            return 'boolean';
        }
        if (is_null($var)) {
            return 'object';
        }
        if (!isset($var)) {
            return 'undefined';
        }
        if (self::isPlainArray($var)) {
            return 'array';
        }
        if (is_array($var) || is_object($var)) {
            return 'object';
        }
    }

}
