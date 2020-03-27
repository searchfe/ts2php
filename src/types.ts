
import * as ts from 'byots';
import {Ts2phpOptions} from '../types/index';

export interface CompilerState extends Ts2phpOptions {
    errors: ts.DiagnosticWithLocation[],
    typeChecker: ts.TypeChecker,
    helpers: any,
    sourceFile?: ts.SourceFile
}
