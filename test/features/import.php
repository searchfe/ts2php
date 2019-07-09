<?php
namespace test\case_import;
require_once(dirname(__FILE__) . '/' . "../some-utils.php");
use \Other_Utils as Util;
use \Some_Utils;
$tplData = array();
$tplData["src"] = Some_Utils::makeTcLink("url");
$tplData["title"] = Some_Utils::highlight("title");
$tplData["title"] = Util::$sample;
$tplData["title"] = \func() . "aa";
$a = array(
    "test" => "hello"
);
require_once(dirname(__FILE__) . '/' . "./Class.php");
$c = "isset";
require_once(dirname(__FILE__) . '/' . ("./" . $c) . '.php');
require_once(dirname(__FILE__) . '/' . "./Class.php");
$y = 1;;
