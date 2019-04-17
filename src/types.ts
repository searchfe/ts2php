
import ts from 'typescript';
import {Ts2phpOptions, ErrorInfo} from '../types/index';

interface moduleInfo {
    name: string;
    path: string;
    namespace: string | false;
    required?: boolean;
    fileName?: string;
}


export interface CompilerState extends Ts2phpOptions {
    errors: ErrorInfo[],
    typeChecker: ts.TypeChecker,
    helpers: {},
    sourceFile?: ts.SourceFile
}
