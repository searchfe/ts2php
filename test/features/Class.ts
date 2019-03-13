

class Article {

    public title: string;
    id: number;

    private _x: number;

    static published = [];

    constructor(options: {title: string}) {
        this.title = options.title;
        this.publish(1);
    }

    private publish(id) {
        Article.published.push(id);
    }
}
