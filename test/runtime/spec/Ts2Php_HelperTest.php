<?php

use PHPUnit\Framework\TestCase;

final class Ts2Php_HelperTest extends TestCase {
    public function testIsPlainArray() {
        $arr = array(
            "aaa" => 123,
            "bbb" => 456
        );
        $plainArr = array(
            "0" => "aa",
            "1" => "bb"
        );

        $this->assertFalse(
            Ts2Php_Helper::isPlainArray($arr)
        );

        $this->assertTrue(
            Ts2Php_Helper::isPlainArray($plainArr)
        );

        $this->assertFalse(
            Ts2Php_Helper::isPlainArray('123123')
        );
    }

    public function testStr_replace_once() {
        $this->assertEquals(
            Ts2Php_Helper::str_replace_once('def', 'mmm', 'abcdefghi'),
            'abcmmmghi'
        );
        $this->assertEquals(
            Ts2Php_Helper::str_replace_once('defaaa', 'mmm', 'abcdefghi'),
            'abcdefghi'
        );
    }

    public function testStr_slice() {
        $this->assertEquals(
            Ts2Php_Helper::str_slice('abcdefghi', 5, 8),
            'fgh'
        );

        $this->assertEquals(
            Ts2Php_Helper::str_slice('abcdefghi', 5),
            'fghi'
        );
    }

    public function testStartsWith() {
        $this->assertTrue(
            Ts2Php_Helper::startsWith('abcdef', 'cde', 2)
        );
    }

    public function testEndsWith() {
        $this->assertTrue(
            Ts2Php_Helper::endsWith('abcdef', 'de', 5)
        );

        $this->assertTrue(
            Ts2Php_Helper::endsWith('abcdef', 'def')
        );

        $this->assertTrue(
            Ts2Php_Helper::endsWith('Cats are the best!', 'best', 17)
        );
    }

    public function testIncludes() {
        $this->assertTrue(
            Ts2Php_Helper::includes('abcdef', 'def')
        );

        $this->assertFalse(
            Ts2Php_Helper::includes('abcdef', 'def', 5)
        );
    }

    public function testStr_pos() {
        $this->assertEquals(
            Ts2Php_Helper::str_pos('abcdef', 'def'),
            3
        );

        $this->assertEquals(
            Ts2Php_Helper::str_pos('abcdef', 'aaa'),
            -1
        );
    }

    public function testPadStart() {
        $this->assertEquals(
            Ts2Php_Helper::padStart('abc', 10),
            '       abc'
        );

        $this->assertEquals(
            Ts2Php_Helper::padStart('abc', 10, 'foo'),
            'foofoofabc'
        );

        $this->assertEquals(
            Ts2Php_Helper::padStart('abc', 6, '123465'),
            '123abc'
        );

        $this->assertEquals(
            Ts2Php_Helper::padStart('abc', 8, '0'),
            '00000abc'
        );

        $this->assertEquals(
            Ts2Php_Helper::padStart('abc', 1),
            'abc'
        );
    }

    public function testArraySlice() {
        $this->assertEquals(
            Ts2Php_Helper::arraySlice(array(1,2,3,4,5), 0, 3),
            array(1,2,3)
        );

        $this->assertEquals(
            Ts2Php_Helper::arraySlice(array(1,2,3,4,5), 3),
            array(4,5)
        );

        $this->assertEquals(
            Ts2Php_Helper::arraySlice(array(1,2,3,4,5), -2),
            array(4,5)
        );
    }

    public function testArray_pos() {
        $this->assertEquals(
            Ts2Php_Helper::array_pos(3, array(1,2,3,4,5)),
            2
        );

        $this->assertEquals(
            Ts2Php_Helper::array_pos(100, array(1,2,3,4,5)),
            -1
        );
    }

    public function testencodeURI() {

        $this->assertEquals(
            Ts2Php_Helper::encodeURI('https://mozilla.org/?x=шеллы'),
            'https://mozilla.org/?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B'
        );

        $set1 = ";,/?:@&=+$#";  // Reserved Characters
        $set2 = "-_.!~*'()";   // Unreserved Marks
        $set3 = "ABC abc 123"; // Alphanumeric Characters + Space

        $this->assertEquals(
            Ts2Php_Helper::encodeURI($set1),
            ';,/?:@&=+$#'
        );

        $this->assertEquals(
            Ts2Php_Helper::encodeURI($set2),
            '-_.!~*\'()'
        );

        $this->assertEquals(
            Ts2Php_Helper::encodeURI($set3),
            'ABC%20abc%20123'
        );

    }

    public function testTypeof() {
        $this->assertEquals(
            Ts2Php_Helper::typeof('123123'),
            'string'
        );
        $this->assertEquals(
            Ts2Php_Helper::typeof(123123),
            'number'
        );
        $this->assertEquals(
            Ts2Php_Helper::typeof(true),
            'boolean'
        );
        $this->assertEquals(
            Ts2Php_Helper::typeof(null),
            'object'
        );

        $this->assertEquals(
            Ts2Php_Helper::typeof(array(1,2,3,4)),
            'array'
        );
        $this->assertEquals(
            Ts2Php_Helper::typeof(array('aaa' => 123)),
            'object'
        );
    }

    public function testEverySome() {
        $array = array(0, 1, 2, 3, 4);
        $this->assertTrue(
            \Ts2Php_Helper::array_every($array, function ($item, $index) {
                return $item === $index;
            })
        );
        $this->assertTrue(
            \Ts2Php_Helper::array_some($array, function ($item, $index) {
                echo $index;
                return $item === $index;
            })
        );
        $this->assertFalse(
            \Ts2Php_Helper::array_every($array, function ($item, $index) {
                return $item < 3;
            })
        );
        $this->assertTrue(
            \Ts2Php_Helper::array_some($array, function ($item, $index) {
                return $item > 3;
            })
        );
        $this->assertFalse(
            \Ts2Php_Helper::array_some($array, function ($item, $index) {
                return $item > 4;
            })
        );
    }

    public function testRandom() {
        $result = \Ts2Php_Helper::random();
        $this->assertTrue($result > 0);
        $this->assertTrue($result < 1);
    }

    public function testMatch() {
        $this->assertEquals(
            \Ts2Php_Helper::match("/a/", "aaa"),
            array(
                "0" => "a",
                "index" => 0,
                "input" => "aaa"
            )
        );

        $this->assertEquals(
            \Ts2Php_Helper::match("a", "aaa", true),
            array(
                "0" => "a",
                "index" => 0,
                "input" => "aaa"
            )
        );

        $this->assertEquals(
            \Ts2Php_Helper::match("/a/ig", "aaa"),
            array(
                "a",
                "a",
                "a"
            )
        );

        $this->assertEquals(
            \Ts2Php_Helper::match("/a(bc)/", "abcdef"),
            array(
                "0" => "abc",
                "1" => "bc",
                "index" => 0,
                "input" => "abcdef"
            )
        );

        $this->assertEquals(
            \Ts2Php_Helper::match("/a(?<name>bc)/", "abcdef"),
            array(
                "0" => "abc",
                "1" => "bc",
                "index" => 0,
                "input" => "abcdef",
                "group" => array(
                    "name" => "bc"
                )
            )
        );
    }
}
