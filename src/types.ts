
import ts from 'typescript';

interface moduleInfo {
    name: string;
    path: string;
    namespace: string | false;
    required?: boolean;
    fileName?: string;
}

export interface Ts2phpOptions {
    modules?: {
        [name: string]: moduleInfo
    },
    namespace?: string;
    plugins?: {emit: Function}[];
    cacheDirectory?: string;
    emitHeader?: boolean;
    showSemanticDiagnostics?: boolean;
    getNamespace?: () => string;
    getModulePath?: (name: string, module?: ts.ResolvedModuleFull) => string;
    getModuleNamespace?: (name: string, module?: ts.ResolvedModuleFull) => string;
    tsConfig?: object
}

export interface CompilerState extends Ts2phpOptions {
    errors: ErrorInfo[],
    typeChecker: ts.TypeChecker,
    helpers: {},
    sourceFile?: ts.SourceFile
}

export interface ErrorInfo {
    code: number;
    msg: string;
}