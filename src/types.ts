
import ts from 'typescript';
import { cacheDirectory } from '.';

export interface Ts2phpOptions {
    modules: {
        [moduleName: string]: {
            path: string;
            className: string;
            required?: boolean;
        }
    },
    getNamespace: () => string,
    namespace: string,
    plugins: {emit: Function}[],
    cacheDirectory: string,
    emitHeader: boolean
}

export interface CompilerState extends Ts2phpOptions {
    errors: ErrorInfo[],
    typeChecker: ts.TypeChecker,
    helpers: {},
    moduleNamedImports: {
        [name: string]: {
            className: string;
            moduleName: string;
        }
    },
    moduleDefaultImports: {
        [name: string]: {
            className: string;
            moduleName: string;
        }
    }
}

export interface ErrorInfo {
    code: number;
    msg: string;
}