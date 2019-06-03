<?php

use PHPUnit\Framework\TestCase;

final class Ts2Php_DateTest extends TestCase {
    private $time = 1559290432004;
    
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
}
