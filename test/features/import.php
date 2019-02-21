<?php
namespace test\import;
require_once("/home/work/search/view-ui/atom/plugins/aladdin/Atom_Wise_Utils.php");
$tplData = array();
$tplData["src"] = \Atom_Wise_Utils::makeTcLink("url");
$tplData["title"] = \Atom_Wise_Utils::highlight("title");
