Class
======

## Class

```ts
import {Base} from './helper/some-utils';
import {SomeType} from './helper/some-types';

export class Article extends Base {

    public title: string;
    id: number;
    readonly foo: number;

    private _x: number;

    static published = [] as number[];

    constructor(options: {title: string}) {
        super(options);
        this.title = options.title;
        this.publish(1);
    }

    private publish(id: number) {
        Article.published.push(id);
        super.dispose();
    }
}

const a = new Article({title: 'a'});
const b = a.base;

const name = 'base';
const d = a[name];

a.dispose();
console.log(b);

class A implements SomeType {
    test: string;
}

abstract class Animal {
    name: string;
    public abstract getName(): string;
}

class Cat extends Animal {
    constructor(a: string) {
        super();
        this.name = a;
    }
    getName() {
        return this.name;
    }
}

const n = 'cat';

const c = new Cat(n);
console.log(c.getName());

abstract class XX { [key:string]: any }
function get(name: string): any {
   return {};
}
const val: XX = get('aaaa');
console.log(val.a);
```

```php
require_once(dirname(__FILE__) . '/' . "./helper/some-utils.php");
use \someModule\Base;
class Article extends Base {
    public $title;
    public $id;
    public $foo;
    private $_x;
    public static $published;
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
Article::$published = (array());
$a = new Article(array( "title" => "a" ));
$b = $a->base;
$name = "base";
$d = $a->$name;
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
    function __construct($a) {
        parent::__construct();
        $this->name = $a;
    }
    function getName() {
        return $this->name;
    }
}
$n = "cat";
$c = new Cat($n);
echo $c->getName();
abstract class XX {
}
function get($name) {
    return array();
}
$val = get("aaaa");
echo $val->a;
```