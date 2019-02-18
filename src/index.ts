/**
 * @file ts2php
 * @author meixuguang
 */

import fs from 'fs-extra';
import * as path from 'path';
import * as ts from 'typescript';
import * as emitter from './emitter';
import {Ts2phpOptions, CompilerState} from './types';
import {setState} from './state';
import hash from 'hash-sum';
import buildInPlugins from './features/index';

export function compile(filePath: string, options?: Ts2phpOptions) {

    const program = ts.createProgram([filePath], {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS
    });

    const typeChecker = program.getTypeChecker();

    const plugins = (options && options.plugins) ? [...buildInPlugins, ...options.plugins] : buildInPlugins;

    const state: CompilerState = Object.assign({}, options, {
        errors: [],
        typeChecker,
        helpers: {},
        moduleNamedImports: {},
        moduleDefaultImports: {},
        namespace: (options && options.namespace)
            || (options && options.getNamespace && options.getNamespace())
            || hash(filePath),
        plugins
    });

    setState(state);

    for (const sourceFile of program.getSourceFiles()) {
        if (sourceFile.fileName === filePath) {
            return {
                phpCode: emitter.emitFile(sourceFile, state),
                errors: state.errors
            }
        }
    }

    return {
        phpCode: '',
        errors: [{
            code: 501,
            msg: '未找到文件'
        }]
    }
}

export const cacheDirectory = path.resolve('.ts2php');

export function compileCode(code: string, options?: Ts2phpOptions) {

    const fileName = hash(code) + '.ts';
    const filePath = path.resolve(cacheDirectory, fileName);

    if (!fs.existsSync(filePath)) {
        fs.outputFileSync(filePath, code);
    }

    return compile(filePath, options)
}
