<?php

use PHPUnit\Framework\TestCase;

final class Ts2Php_DateTest extends TestCase {
    private $time = 1559290432004; // 2019-05-31 08:13:52
    
    public function testGetDate() {
        $date = new Ts2Php_Date($this->time);

        $this->assertEquals(
            $date->getDate(),
            31
        );
    }

    public function testGetDay() {
        $date = new Ts2Php_Date($this->time);

        $this->assertEquals(
            $date->getDay(),
            5
        );
    }

    public function testGetFullYear() {
        $date = new Ts2Php_Date($this->time);

        $this->assertEquals(
            $date->getFullYear(),
            2019
        );
    }

    public function testGetHours() {
        $date = new Ts2Php_Date($this->time);

        $this->assertEquals(
            $date->getHours(),
            16
        );
    }

    public function testGetMinutes() {
        $date = new Ts2Php_Date($this->time);

        $this->assertEquals(
            $date->getMinutes(),
            13
        );
    }

    public function testGetMonth() {
        $date = new Ts2Php_Date($this->time);

        $this->assertEquals(
            $date->getMonth(),
            4
        );
    }

    public function testGetSeconds() {
        $date = new Ts2Php_Date($this->time);

        $this->assertEquals(
            $date->getSeconds(),
            52
        );
    }

    public function testGetTime() {
        $date = new Ts2Php_Date($this->time);

        $this->assertEquals(
            $date->getTime(),
            1559290432000
        );
    }

    public function testNow() {
        $this->assertEquals(
            Ts2Php_Date::now(),
            time() * 1000
        );
    }

    public function testParse() {
        $this->assertEquals(
            Ts2Php_Date::parse('2019-04-11 12:54:03'),
            1554958443000
        );
    }

    public function testSetDate() {
        $date = new Ts2Php_Date($this->time);
        $date->setDate(11);

        $this->assertEquals(
            $date->getDay(),
            6
        );

        $date->setDate(3);

        $this->assertEquals(
            $date->getDay(),
            5
        );
    }

    public function testSetFullYear() {
        $date = new Ts2Php_Date($this->time);
        $date->setFullYear(2005);

        $this->assertEquals(
            $date->getFullYear(),
            2005
        );
        $this->assertEquals(
            $date->getMonth(),
            4
        );

        $date->setFullYear(2001, 7, 8);

        $this->assertEquals(
            $date->getFullYear(),
            2001
        );
        $this->assertEquals(
            $date->getMonth(),
            6
        );
        $this->assertEquals(
            $date->getDate(),
            8
        );
    }

    public function testSetHours() {
        $date = new Ts2Php_Date($this->time);
        $date->setHours(13);

        $this->assertEquals(
            $date->getHours(),
            13
        );
        $this->assertEquals(
            $date->getMinutes(),
            13
        );

        $date->setHours(9);

        $this->assertEquals(
            $date->getHours(),
            9
        );

        $date->setHours(9, 8, 7);
        $this->assertEquals(
            $date->getMinutes(),
            8
        );
        $this->assertEquals(
            $date->getSeconds(),
            7
        );
    }

    public function testSetMinutes() {
        $date = new Ts2Php_Date($this->time);
        $date->setMinutes(26);

        $this->assertEquals(
            $date->getMinutes(),
            26
        );

        $date->setMinutes(7);

        $this->assertEquals(
            $date->getMinutes(),
            7
        );
    }

    public function testSetMonth() {
        $date = new Ts2Php_Date($this->time);
        $date->setMonth(4);

        $this->assertEquals(
            $date->getMonth(),
            4
        );
        $this->assertEquals(
            $date->getDate(),
            31
        );

        $date->setMonth(11);

        $this->assertEquals(
            $date->getMonth(),
            11
        );

        $date->setMonth(3, 9);

        $this->assertEquals(
            $date->getMonth(),
            3
        );
        $this->assertEquals(
            $date->getDate(),
            9
        );
    }

    public function testSetSeconds() {
        $date = new Ts2Php_Date($this->time);
        $date->setSeconds(23);

        $this->assertEquals(
            $date->getSeconds(),
            23
        );

        $date->setSeconds(5);

        $this->assertEquals(
            $date->getSeconds(),
            5
        );
    }

    public function testSetTime() {
        $date = new Ts2Php_Date($this->time);
        $date->setTime(1546434903000);

        $this->assertEquals(
            $date->getSeconds(),
            3
        );
    }

    public function testConstruct() {
        $date = new Ts2Php_Date();

        $this->assertEquals(
            $date->getTime(),
            time() * 1000
        );
    }
}
