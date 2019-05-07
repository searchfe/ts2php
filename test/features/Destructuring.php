<?php
namespace test\case_Destructuring;
$tplData = array( "a" => 1 );
$difftime = isset($tplData["difftime"]) ? $tplData["difftime"] : 8; $a = $tplData["a"]; $y = isset($tplData["c"]) ? $tplData["c"] : 1;
$c = $tplData["a"];
