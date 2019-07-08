
import {Base} from '../some-utils';
import {SomeType} from '../some-types';

class Article extends Base {

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
