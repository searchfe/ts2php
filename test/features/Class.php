<?php
namespace test\Class;
class Article {
    public $title;
    $id;
    private $_x;
    static $published = array();
    constructor($options) {
        $this->title = $options["title"];
        $this->publish(1);
    }
    private publish($id) {
        array_push(Article::$published, $id);
    }
}
