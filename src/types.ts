
import ts from 'typescript';
import {Ts2phpOptions, ErrorInfo} from '../types/index';

export interface CompilerState extends Ts2phpOptions {
    errors: ErrorInfo[],
    typeChecker: ts.TypeChecker,
    helpers: any,
    sourceFile?: ts.SourceFile
}
