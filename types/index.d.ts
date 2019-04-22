
import ts from 'typescript';

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

export interface ModuleInfo {

    /** 模块名称 */
    name: string;

    /**
     * 模块引入的 PHP 路径，编译成 require_once("${path}")
     **/
    path: string;

    /**
     * 模块引入的 PHP 路径代码，编译成 require_once(${path})
     * 可直接指定，也可以依赖 [[Ts2phpOptions.getModulePathCode]]
     **/
    pathCode: string;

    /**
     * 模块所用的命名空间
     * 可直接指定，也可以依赖 [[Ts2phpOptions.getModuleNamespace]]
     **/
    namespace: string | false;

    /**
     * 是否已经被引入，如果是 true，不会输出 require_once
     *
     * @default false
     */
    required?: boolean;
}

export interface ErrorInfo {
    code: number;
    msg: string;
}
export interface Ts2phpOptions {

    /**
     * 文件代码内容，真正被编译的代码
     **/
    source?: string;

    /** 引入的外部模块信息 */
    modules?: {
        [name: string]: ModuleInfo
    },

    /** 指定当前文件的命名空间 */
    namespace?: string;

    /** 获取当前文件的命名空间的函数，优先级低于 [[Ts2phpOptions.namespace]] */
    getNamespace?: () => string;

    /**
     * 自定义代码生成插件，可参考 https://github.com/max-team/ts2php/blob/master/src/features/array.ts
     */
    plugins?: {emit: Function}[];

    /**
     * 是否输出文件头部内容：
     *
     * ```php
     * <?php
     * namespace ${namespace};
     * ```
     *
     * @default true
     */
    emitHeader?: boolean;

    /**
     * 是否显示 TypeScript 的编译错误信息
     */
    showDiagnostics?: boolean;

    /**
     * 获取外部模块的 PHP 路径
     * 使用 `import` 的模块都会自动调用
     *
     * @params importPath 模块引入路径
     * @params module 模块相关信息
     * @returns 路径代码
     */
    getModulePathCode?: (importPath: string, module?: ts.ResolvedModuleFull) => string;

    /**
     * 获取外部模块的命名空间
     * 使用 `import` 的模块都会自动调用
     *
     * @params importPath 模块引入路径
     * @params module 模块相关信息
     * @returns 命名空间
     */
    getModuleNamespace?: (name: string, module?: ts.ResolvedModuleFull) => string;

    /**
     * TypeScript 编译配置
     *
     * @see See https://www.typescriptlang.org/docs/handbook/compiler-options.html
     */
    compilerOptions?: object,

    /**
     * 自定义语法转换，在 `emit` 之前执行
     *
     * ```typescript
     * const transformer = context => node => {
     *     return doSomeThingOnNode(node);
     * };
     * ```
     */
    customTransformers?: ts.TransformerFactory<ts.SourceFile | ts.Bundle>[]
}

/**
 * 编译入口
 *
 * @param filePath 文件地址，如果 `options.source` 有值，可以是一个虚拟地址
 * @param options 编译配置项
 */
export function compile(filePath: string, options?: Ts2phpOptions): {

    /** 编译生成的 PHP 代码 */
    phpCode: string;

    /** 错误信息数组 */
    errors: ErrorInfo[]
}
