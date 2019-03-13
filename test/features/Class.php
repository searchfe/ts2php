<?php
namespace test\Class;
require_once("../some-utils");
use \Base;
class Article extends Base {
    public $title;
    $id;
    private $_x;
    static $published = array();
    __construct($options) {
        parent::__construct($options);
        $this->title = $options["title"];
        $this->publish(1);
    }
    private publish($id) {
        array_push(Article::$published, $id);
        parent::dispose();
    }
}
