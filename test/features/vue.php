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
    }
));
