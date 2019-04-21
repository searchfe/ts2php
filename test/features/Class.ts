
import {Base} from '../some-utils';
import {SomeType} from '../some-types';

class Article extends Base {

    public title: string;
    id: number;
    readonly foo: number;

    private _x: number;

    static published = [];

    constructor(options: {title: string}) {
        super(options);
        this.title = options.title;
        this.publish(1);
    }

    private publish(id) {
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
