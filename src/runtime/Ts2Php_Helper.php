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
    public static function isPlainArray($arr) {
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
     * slice helper for string.prototype.slice
     * @param $origin {string}
     * @param $start {number}
     * @param $end {number}
     * @return {string}
     */
    static public function str_slice($origin, $start, $end = null) {
        $end = isset($end) ? $end : mb_strlen($origin, 'utf8');
        return substr($origin, $start, $end - $start);
    }

    /**
     * string.prototype.startsWidth
     * @param $haystack {string}
     * @param $needle {string}
     * @param $postion {number}
     * @return {boolean}
     */
    static public function startsWith($origin, $substr, $position = 0){
        if ($position !== 0) {
            $origin = substr($origin, $position);
        }
        return strncmp($substr, $origin, strlen($substr)) === 0;
    }

    /**
     * string.prototype.endsWith
     * @param $haystack {string}
     * @param $needle {string}
     * @param $postion {number}
     * @return {boolean}
     */
    static public function endsWith($haystack, $needle, $postion = null){
        $left = isset($postion) ? strlen($haystack) - $postion : 0;
        $postion = $left + (strlen($needle));

        return $needle === '' || substr_compare($haystack, $needle, -$postion) === $left;
    }

    /**
     * string.prototype.includes
     * @param $haystack {string}
     * @param $needle {string}
     * @param $postion {number}
     * @return {boolean}
     */
    static public function includes($haystack, $needle, $postion = 0){
        $pos = strpos($haystack, $needle);
        return $pos !== false && $pos >= $postion;
    }

    /**
     * string.prototype.match
     * @param $patten {string}
     * @param $subject {string}
     * @param $isStr {boolean}
     */
    static public function match($patten, $subject, $isStr = false, $isAll = false) {
        $matches = array();

        if ($isStr) {
            $patten = '/' . preg_quote($patten, '/') . '/';
        }
        else if ($isAll) {
            preg_match_all($patten, $subject, $matches);
            if (empty($matches[0])) {
                return null;
            }
            return $matches[0];
        }


        $res = preg_match($patten, $subject, $matches);
        if ($res === 0) {
            return null;
        }

        // support group
        $group = array();
        foreach($matches as $x=>$x_val) {
            if (!is_numeric($x)) {
                $group[$x] = $x_val;
                unset($matches[$x]);
            }
        }
        if (!empty($group)) {
            $matches['group'] = $group;
        }

        // index, input
        $matches['index'] = strpos($subject, $matches[0]);
        $matches['input'] = $subject;

        return $matches;
    }

    /**
     * string.prototype.indexOf
     * @param $haystack {string}
     * @param $needle {string}
     * @return {number}
     */
    static public function str_pos($haystack, $needle){
        $pos = strpos($haystack, $needle);
        return $pos === false ? -1 : $pos;
    }

    /**
     * string.prototype.padStart
     * @param $input {string}
     * @param $pad_length {number}
     * @param $pad_string {string}
     * @return {string}
     */
    static public function padStart($input, $pad_length, $pad_string = " "){
        return str_pad($input, $pad_length, $pad_string, STR_PAD_LEFT);
    }

    /**
     * replace once helper for Array.prototype.slice
     * @param $origin {string}
     * @param $start {string}
     * @param $end {string}
     * @return {string}
     */
    static public function arraySlice($origin, $start, $end = null) {
        $end = isset($end) ? $end : count($origin);
        return array_slice($origin, $start, $end - $start);
    }

    /**
     * Array.prototype.indexOf
     * @param $haystack {string}
     * @param $needle {string}
     * @return {number}
     */
    static public function array_pos($needle, $haystack) {
        $pos = array_search($needle, $haystack);
        return $pos === false ? -1 : $pos;
    }

    /**
     * Array.prototype.some
     *
     * @param $array {array}
     * @param $fn {callable}
     * @return {boolean}
     */
    static function array_some(array $array, callable $fn) {
        foreach ($array as $index => $value) {
            if($fn($value, $index)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Array.prototype.every
     *
     * @param $array {array}
     * @param $fn {callable}
     * @return {boolean}
     */
    static function array_every(array $array, callable $fn) {
        foreach ($array as $index => $value) {
            if(!$fn($value, $index)) {
                return false;
            }
        }
        return true;
    }

    /**
     * encodeURI
     * @param $uri {string}
     * @return {string}
     */
    static public function encodeURI($uri) {

        // http://php.net/manual/en/function.rawurlencode.php
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/encodeURI
        $unescaped = array(
            '%2D' => '-',
            '%5F' => '_',
            '%2E' => '.',
            '%21' => '!',
            '%7E' => '~',
            '%2A' => '*',
            '%27' => "'",
            '%28' => '(',
            '%29' => ')',
            '%3B' => ';',
            '%2C' => ',',
            '%2F' => '/',
            '%3F' => '?',
            '%3A' => ':',
            '%40' => '@',
            '%26' => '&',
            '%3D' => '=',
            '%2B' => '+',
            '%24' => '$',
            '%23' => '#',
        );

        return strtr(rawurlencode($uri), $unescaped);

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

    /**
     * get type of $var
     * @return {float}
     */
    static public function random() {
        return (float)rand() / (float)getrandmax();
    }

}

/**
 * from https://github.com/utopszkij/ts2php/blob/master/ts2php_core/tsphpx.php#L41
 *
 * @class Ts2Php_Date
 */
class Ts2Php_Date implements \JsonSerializable {
    private $value = 0;
    function __construct($v = -1) {
        if ($v == -1) {
            $v = time() * 1000;
        }
        $this->value = intval($v / 1000);
    }
    public function jsonSerialize () {
      return $this->toISOString();
    }
    // Returns the day of the month (from 1-31)
    public function getDate() {
        $result = 0 + date('d', $this->value);
        return $result;
    }
    //Returns the day of the week (from 0-6)
    public function getDay() {
        $result = 0 + date('w', $this->value);
        return $result;
    }
    // Returns the year
    public function getFullYear() {
        $result = 0 + date('Y', $this->value);
        return $result;
    }
    // Returns the hour (from 0-23)
    public function getHours() {
        $result = 0 + date('H', $this->value);
        return $result;
    }
    // Returns the minutes (from 0-59)
    public function getMinutes() {
        $result = 0 + date('i', $this->value);
        return $result;
    }
    // Returns the month (from 0-11)
    public function getMonth() {
        $result = 0 + date('m', $this->value) - 1;
        return $result;
    }
    // Returns the seconds (from 0-59)
    public function getSeconds() {
        $result = 0 + date('s', $this->value);
        return $result;
    }
    // Returns the number of milliseconds since midnight Jan 1 1970, and a specified date
    public function getTime() {
        return $this->value * 1000;
    }
    // Returns the number of milliseconds since midnight Jan 1, 1970
    public static function now() {
        return time() * 1000;
    }
    // Parses a date string and returns the number of milliseconds since January 1, 1970
    public static function parse($s) {
        return strtotime($s) * 1000;
    }
    // Sets the day of the month of a date object
    public function setDate($x) {
        $x = $this->padTime($x);
        $s = date('Y-m-d H:i:s', $this->value);
        $s = substr($s,0,8).$x.substr($s,10,9);
        $this->value = strtotime($s);
    }
    // Sets the year of a date object
    public function setFullYear($x, $y = null, $z = null) {
        $x = ''.$x;
        $y = $this->padTime($y);
        $z = $this->padTime($z);

        $s = date('Y-m-d H:i:s', $this->value);
        if (isset($y) && isset($z)) {
            $s = $x . '-' . $y . '-' . $z . substr($s,10,9);
        }
        else if (isset($y)) {
            $s = $x . '-' . $y . substr($s,7,12);
        }
        else {
            $s = $x . substr($s,4,15);
        }
        $this->value = strtotime($s);
    }
    // Sets the hour of a date object
    public function setHours($x, $y = null, $z = null) {
        $x = $this->padTime($x);
        $y = $this->padTime($y);
        $z = $this->padTime($z);

        $s = date('Y-m-d H:i:s', $this->value);

        if (isset($y) && isset($z)) {
            $s = substr($s,0,11).$x.':'.$y.':'.$z;
        }
        else if (isset($y)) {
            $s = substr($s,0,11).$x.':'.$y.substr($s,15,3);
        }
        else {
            $s = substr($s,0,11).$x.substr($s,13,6);
        }
        $this->value = strtotime($s);
    }
    // Set the minutes of a date object
    public function setMinutes($x) {
        $x = $this->padTime($x);
        $s = date('Y-m-d H:i:s', $this->value);
        $s = substr($s,0,14).$x.substr($s,16,3);
        $this->value = strtotime($s);
    }
    // Sets the month of a date object
    public function setMonth($x, $y = null) {
        $x += 1;
        $x = $this->padTime($x);
        $y = $this->padTime($y);

        $s = date('Y-m-d H:i:s', $this->value);

        if (isset($y)) {
            $s = substr($s,0,5).$x.'-'.$y.substr($s,10,9);
        }
        else {
            $s = substr($s,0,5).$x.substr($s,7,12);
        }
        $this->value = strtotime($s);
    }
    // Sets the seconds of a date object
    public function setSeconds($x) {
        if ($x < 10) {
            $x = '0'.$x;
        }
        else {
            $x = ''.$x;
        }
        $s = date('Y-m-d H:i:s', $this->value);
        $s = substr($s,0,17).$x;
        $this->value = strtotime($s);
    }
    // Sets a date to a specified number of milliseconds after/before January 1, 1970
    public function setTime($x) {
        $this->value = round($x / 1000);
    }
    // Returns the date portion of a Date object as a string, using locale conventions
    public function toLocaleDateString() {
        return date('Y-m-d',$this->value);
    }
    // Returns the time portion of a Date object as a string, using locale conventions
    public function toLocaleTimeString() {
        return date('H:i:s',$this->value);
    }
    // Converts a Date object to a string, using locale conventions
    public function toLocaleString() {
        return date('Y-m-d H:i:s',$this->value);
    }
    // Converts a Date object to ISO 8601 Extended Format
    public function toISOString () {
      return date('Y-m-d\TH:i:s.000\Z',$this->value);
    }

    private function padTime($time) {
        if (!is_numeric($time)) {
            return $time;
        }
        if ($time < 10) {
            return '0' . $time;
        }
        return '' . $time;
    }
}
