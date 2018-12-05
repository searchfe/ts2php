/**
 * @file ts2php
 * @author meixuguang
 */

import * as ts from 'typescript';
import * as emitter from './emitter';
import {Ts2phpOptions, ErrorInfo} from './types';
import {options as globalOptions} from './globals';
import {assign} from 'lodash';

export function ts2php(filePath: string, options?: Ts2phpOptions) {
    const opt = assign({}, globalOptions, options);
    const errors: ErrorInfo[] = [];

    const program = ts.createProgram([filePath], {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS
    });
    
    const typeChecker = program.getTypeChecker();

    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            const res = emitter.emitFile(sourceFile, typeChecker, opt, errors);
            return {
                phpCode: res,
                errors
            }
        }
    }



}


