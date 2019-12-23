EnumDeclaration
======

## EnumDeclaration

```ts
enum aaa {
    a = 1,
    b,
    c
}

enum bbb {
    a,
    b,
    c
}

enum ccc {
    a = 'a',
    b = 'b',
    c = 'c'
}

const str = '123';

enum ddd {
    a = str.length,
    b = str.length + 1
}
```

```php
$aaa = array( "a" => 1, "b" => 2, "c" => 3 );
$bbb = array( "a" => 0, "b" => 1, "c" => 2 );
$ccc = array( "a" => "a", "b" => "b", "c" => "c" );
$str = "123";
$ddd = array( "a" => mb_strlen($str, "utf8"), "b" => mb_strlen($str, "utf8") + 1 );
```