
import ts from 'typescript';

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
    emitHeader: boolean,
    showSemanticDiagnostics: boolean;
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
    },
    sourceFile?: ts.SourceFile
}

export interface ErrorInfo {
    code: number;
    msg: string;
}