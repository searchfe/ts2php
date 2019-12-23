import
======

## import

```ts
import {Other_Utils as Util} from './helper/some-utils';
import {Some_Utils, func as func1} from './helper/some-utils';

import {SomeType, SomeAlias} from './helper/some-types';

type TplData = {
    src?: string,
    title?: string
};

const tplData: TplData = {};
tplData.src = Some_Utils.makeTcLink('url');
tplData.title = Some_Utils.highlight('title');
tplData.title = Util.sample;

tplData.title = func1() + 'aa';

const a = {
    test: 'hello'
} as SomeType;

import('./Class');

const c = 'isset';

import('./' + c);

import('./Class').then(function () {
    const y = 1;
});
```

```php
require_once(dirname(__FILE__) . '/' . "./helper/some-utils.php");
use \someModule\Other_Utils as Util;
use \someModule\Some_Utils;
$tplData = array();
$tplData["src"] = Some_Utils::makeTcLink("url");
$tplData["title"] = Some_Utils::highlight("title");
$tplData["title"] = Util::$sample;
$tplData["title"] = \someModule\func() . "aa";
$a = array(
    "test" => "hello"
);
require_once(dirname(__FILE__) . '/' . "./Class.php");
$c = "isset";
require_once(dirname(__FILE__) . '/' . ("./" . $c) . '.php');
require_once(dirname(__FILE__) . '/' . "./Class.php");
$y = 1;;
```