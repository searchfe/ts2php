

declare function date(x: string, t?: number): string;

declare function strftime(a: string, b: number | string): string;

declare function strtotime(a: string): number;

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
declare function parse_url(x: string, component: number): false | string;

declare const PHP_URL_SCHEME = 1;
declare const PHP_URL_HOST = 2;
declare const PHP_URL_PORT = 3;
declare const PHP_URL_USER = 4;
declare const PHP_URL_PASS = 5;
declare const PHP_URL_PATH = 6;
declare const PHP_URL_QUERY = 7;
declare const PHP_URL_FRAGMENT = 8;
