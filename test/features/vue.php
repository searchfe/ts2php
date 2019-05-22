<?php
namespace test\case_vue;
$Vue["extend"](array(
    "props" => array(
        "b" => String,
        "c" => Object
    ),
    "data" => function () {
        return array(
            "a" => $this->b . 1,
            "d" => join(",", $this->c["names"])
        );
    },
    "created" => function () {
        $e = mb_strlen($this->b, "utf8");
        $g = round($this->f, 2);
    },
    "computed" => array(
        "f" => function () {
            return \Ts2Php_Helper::array_pos("a", $this->c["names"]);
        }
    )
));
