vue
======

## vue

```ts
import Vue, {PropType} from 'vue';

interface User {
    names: string[];
}

export default Vue.extend({
    props: {
        b: String,
        c: Object as PropType<User>
    },
    data() {
        return {
            a: this.b + 1,
            d: this.c.names.map(a => a.length)
        };
    },
    created() {
        const e = this.b.length;
        const g = this.f.toFixed(2);
    },
    computed: {
        f(): number {
            return this.c.names.indexOf("a");
        }
    }
});
```

```php
$Vue["extend"](array(
    "props" => array(
        "b" => String,
        "c" => Object
    ),
    "data" => function () {
        return array(
            "a" => $this->b . 1,
            "d" => array_map(function ($a){
            return mb_strlen($a, "utf8");
            }, $this->c["names"])
        );
    },
    "created" => function () {
        $e = mb_strlen($this->b, "utf8");
        $g = number_format($this->f, 2, ".", "");
    },
    "computed" => array(
        "f" => function () {
            return \Ts2Php_Helper::array_pos("a", $this->c["names"]);
        }
    )
));
```