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
import {transform} from './transformer';

function reportErrors(errors: ReadonlyArray<ts.Diagnostic>, host: ts.FormatDiagnosticsHost) {
    ts.sys.write(ts.formatDiagnosticsWithColorAndContext(errors, host) + host.getNewLine());
}

const defaultOptions = {
    showSemanticDiagnostics: true,
    emitHeader: true,
    getModulePath: name => name,
    getModuleNamespace: () => '\\',
    modules: {}
};

export function compile(filePath: string, options: Ts2phpOptions = {}) {

    const program = ts.createProgram([filePath], {
        target: ts.ScriptTarget.ES2015,
        module: ts.ModuleKind.CommonJS,
        scrict: true,
        ...options.tsConfig
    });

    const finalOptions = {
        ...defaultOptions,
        ...options
    };

    if (finalOptions.showSemanticDiagnostics) {

        const sys = ts.sys;

        const sysFormatDiagnosticsHost: ts.FormatDiagnosticsHost = sys ? {
            getCurrentDirectory: () => sys.getCurrentDirectory(),
            getNewLine: () => sys.newLine,
            getCanonicalFileName: sys.useCaseSensitiveFileNames ? name => name : name => name.toLowerCase()
        } : undefined;

        const syntaxDiagnostics = program.getSemanticDiagnostics().filter(a => a.code !== 2307);

        if (syntaxDiagnostics.length) {
            reportErrors(syntaxDiagnostics, sysFormatDiagnosticsHost);
            return {
                phpCode: '',
                errors: syntaxDiagnostics
            };
        }
    }

    const typeChecker = program.getTypeChecker();

    const plugins = (finalOptions && finalOptions.plugins) ? [...buildInPlugins, ...finalOptions.plugins] : buildInPlugins;

    const state: CompilerState = Object.assign({}, finalOptions, {
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

    if (state.modules) {
        for (let name of Object.keys(state.modules)) {
            state.modules[name].name = name;
        }
    }

    for (const sourceFile of program.getSourceFiles()) {
        if (sourceFile.fileName === filePath && !sourceFile.isDeclarationFile) {
            sourceFile.resolvedModules && sourceFile.resolvedModules.forEach((item, name) => {
                state.modules[name] = {
                    name,
                    path: state.getModulePath(name, item),
                    namespace: state.getModuleNamespace(name, item),
                    ...state.modules[name]
                };
            });

            const transformers: ts.TransformerFactory<ts.SourceFile | ts.Bundle>[] = [];
            transformers.push(transform);

            const emitResolver = program.getDiagnosticsProducingTypeChecker()
                .getEmitResolver(sourceFile, undefined);
            return {
                phpCode: emitter.emitFile(sourceFile, state, emitResolver, transformers),
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

const cacheDirectory = path.resolve('.ts2php');

export function compileCode(code: string, options?: Ts2phpOptions) {

    const finalCacheDirectory = (options && options.cacheDirectory) || cacheDirectory;

    const fileName = hash(code) + '.ts';
    const filePath = path.resolve(finalCacheDirectory, fileName);

    if (!fs.existsSync(filePath)) {
        fs.outputFileSync(filePath, code);
    }

    const result = compile(filePath, options);

    return {
        ...result,
        cachePath: filePath
    };
}
