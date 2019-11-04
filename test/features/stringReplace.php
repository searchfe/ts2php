<?php
namespace test\case_stringReplace;
$a = "abc";
preg_replace("/ab/i", "", $a, 1);
preg_replace("/ab/i", "", $a);
preg_replace("/ab/i", "", $a);
preg_replace("/ab/", "", $a);
preg_replace("/ab/", "", $a, 1);
