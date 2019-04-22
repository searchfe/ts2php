<?php
namespace test\case_Class;
require_once(realpath(dirname(__FILE__) . '/' . "../some-utils.php"));
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
echo $b;
class A {
    public $test;
}
abstract class Animal {
    public $name;
    public abstract function getName();
}
class Cat extends Animal {
    function getName() {
        return $this->name;
    }
}
$c = new Cat();
echo $c->getName();
