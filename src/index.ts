/**
 * @file ts2php
 * @author meixuguang
 */

import * as ts from 'typescript';
import * as emitter from './emitter';
import {Ts2phpOptions, CompilerState} from './types';
import {setState} from './state';
import hash from 'hash-sum';

export function ts2php(filePath: string, options?: Ts2phpOptions) {

    const program = ts.createProgram([filePath], {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS
    });

    const typeChecker = program.getTypeChecker();

    const state: CompilerState = Object.assign({}, options, {
        errors: [],
        typeChecker,
        helpers: {},
        moduleNamedImports: {},
        moduleDefaultImports: {},
        namespace: options.namespace || (options.getNamespace ? options.getNamespace() : hash(filePath))
    });

    setState(state);

    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            return {
                phpCode: emitter.emitFile(sourceFile, state),
                errors: state.errors
            }
        }
    }
}


