<?php
namespace test\case_import;
require_once("../some-utils");
use \Other_Utils as Util;
use \Some_Utils;
use \func;
$tplData = array();
$tplData["src"] = Some_Utils::makeTcLink("url");
$tplData["title"] = Some_Utils::highlight("title");
$tplData["title"] = Util::$sample;
$tplData["title"] = func() . "aa";
