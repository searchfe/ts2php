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
        $e = strlen($this->b);
        $g = round($this->f, 2);
    },
    "computed" => array(
        "f" => function () {
            return array_search("a", $this->c["names"]);
        }
    )
));
