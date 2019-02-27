
declare function date(x: string, t?: number): string;

declare function strtotime(x: string): number;

declare function isset(x: any): boolean;

declare function empty(x: any): boolean;

declare function intval(x: any): number;

declare function floatval(x: any): number;

declare function version_compare(a: string, b: string): -1 | 0 | 1;

type UrlInfo = {
    scheme: string
    host: string
    port: string
    user: string
    pass: string
    path: string
    query: string
    fragment: string
};

declare function parse_url(x: string): false | UrlInfo;
