<?php
namespace test\case_Class;
require_once("../some-utils");
use \Base;
class Article extends Base {
    public $title;
    public $id;
    public $foo;
    private $_x;
    public static $published = array();
    function __construct($options) {
        parent::__construct($options);
        $this->title = $options["title"];
        $this->publish(1);
    }
    private function publish($id) {
        array_push(Article::$published, $id);
        parent::dispose();
    }
}
$a = new Article(array( "title" => "a" ));
$b = $a->base;
$a->dispose();
var_dump($b);
