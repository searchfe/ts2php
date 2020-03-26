
import * as ts from 'byots';
import {Ts2phpOptions, ErrorInfo} from '../types/index';

export interface CompilerState extends Ts2phpOptions {
    errors: (ErrorInfo | ts.DiagnosticWithLocation)[],
    typeChecker: ts.TypeChecker,
    helpers: any,
    sourceFile?: ts.SourceFile
}
