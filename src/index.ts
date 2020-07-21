/**
 * @file ts2php
 * @author meixuguang
 */

import fs from 'fs-extra';
import path from 'path';
import ts, {
    SourceFile,
    CompilerOptions,
    Program,
    CompilerHost,
    createCompilerHost,
    createProgram,
    getPreEmitDiagnostics,
    flattenDiagnosticMessageText,
    ScriptTarget,
    ModuleKind,
    TransformerFactory,
    isDiagnosticWithLocation,
    Diagnostic,
    DiagnosticWithLocation
} from 'byots';

import diagnosticFormatter from 'ts-diagnostic-formatter';

import {upperFirst} from 'lodash';
import {satisfies} from 'semver';

import * as emitter from './emitter';
import {CompilerState} from './types';
import {setState} from './state';
import buildInPlugins from './features/index';
import {transform} from './transformer';
import {Ts2phpOptions, Ts2phpConstructOptions, Ts2phpCompileOptions, ModuleInfo} from '../types/index';
import { isRelativePath } from './utilities/index';

const defaultOptions = {
    showDiagnostics: true,
    emitHeader: true,
    getModulePathCode: (name, _, moduleIt) => {
        if (moduleIt && moduleIt.path) {
            return JSON.stringify(moduleIt.path);
        }
        const isRelative = isRelativePath(name);
        const outPath = isRelative ? (name + '.php') : name;
        const pathCode = JSON.stringify(outPath);
        return isRelative ? `dirname(__FILE__) . '/' . ${pathCode}` : pathCode;
    },
    getModuleNamespace: () => '\\',
    modules: {},
    helperNamespace: '\\',
    customTransformers: []
};

const s = 'abcdefghijklmnopqrstuvwxyz';
const getRandomString = n => Array(n)
    .join()
    .split(',')
    .map(function() {
        return s.charAt(Math.floor(Math.random() * s.length));
    }).join('');

const defaultCompilerOptions = {
    target: ScriptTarget.ES2016,
    module: ModuleKind.CommonJS,
    skipLibCheck: true,
    scrict: true,
    noImplicitThis: true,
    noImplicitAny: true,
    alwaysStrict: true
};

interface cacheFileInfo {
    sourceFile?: SourceFile;
    contents: string;
}

function printError(e) {
    console.log(e.file + ':');
    console.error(e.message);
}

export class Ts2Php {
    private sourceFileCache: {[fileName: string]: cacheFileInfo};
    private compilerOptions: CompilerOptions;
    private program: Program;
    private compilerHost: CompilerHost;

    constructor ({ compilerOptions }: Ts2phpConstructOptions = {}) {
        this.compilerOptions = {
            ...defaultCompilerOptions,
            ...compilerOptions
        };

        this.sourceFileCache = {};

        this.compilerHost = createCompilerHost(this.compilerOptions);

        const originReadFile = this.compilerHost.readFile;
        this.compilerHost.readFile = (fileName: string) => {
            if (this.sourceFileCache[fileName]) {
                return this.sourceFileCache[fileName].contents;
            }
            return originReadFile(fileName);
        };

        const originFileExists = this.compilerHost.fileExists;
        this.compilerHost.fileExists = (fileName: string) => {
            if (this.sourceFileCache[fileName]) {
                return true;
            }
            return originFileExists(fileName);
        };
    }

    private getSourceFile(filePath: string, contents: string) {
        contents = contents || fs.readFileSync(filePath, 'utf8');

        if (
            this.sourceFileCache[filePath]
            && this.sourceFileCache[filePath].sourceFile
            && contents === this.sourceFileCache[filePath].contents
        ) {
            return this.sourceFileCache[filePath].sourceFile;
        }

        this.sourceFileCache[filePath] = {
            contents
        };

        const program = this.program = createProgram({
            rootNames: [filePath],
            oldProgram: this.program,
            options: this.compilerOptions,
            host: this.compilerHost
        });

        const sourceFile = this.sourceFileCache[filePath].sourceFile = program.getSourceFile(filePath);

        return sourceFile;
    }

    compile (filePath: string, options: Ts2phpCompileOptions = {}) {

        if (options.source) {
            filePath = /\.ts$/.test(filePath) ? filePath : (filePath + '.ts');
        }
        else if (!fs.existsSync(filePath)) {
            return {
                phpCode: '',
                errors: [{
                    code: 501,
                    msg: '未找到文件'
                }]
            };
        }

        const finalOptions = {
            ...defaultOptions,
            ...options
        };

        // avoid change options
        finalOptions.modules = {...options.modules};

        const sourceFile = this.getSourceFile(filePath, options.source);
        const program = this.program;
        const typeChecker = program.getTypeChecker();

        let diagnostics = getPreEmitDiagnostics(program);
        if (finalOptions.showDiagnostics) {
            diagnostics = diagnostics.filter(a => a.code !== 2307);
            if (diagnostics.length) {
                // @ts-ignore
                diagnosticFormatter(diagnostics, 'codeframe').forEach(printError);
                return {
                    phpCode: '',
                    errors: diagnostics
                };
            }
        }

        const plugins = (finalOptions && finalOptions.plugins) ? [...buildInPlugins, ...finalOptions.plugins] : buildInPlugins;

        const state: CompilerState = {...finalOptions, ...{
            errors: [],
            typeChecker,
            helpers: {},
            moduleNamedImports: {},
            moduleDefaultImports: {},
            namespace: (options.namespace)
                || (options.getNamespace && options.getNamespace(filePath))
                || upperFirst(getRandomString(5)),
            plugins
        }};

        setState(state);

        const transformers: TransformerFactory<SourceFile>[] = [
            transform,
            ...(options.customTransformers || [])
        ];

        const emitResolver = program.getDiagnosticsProducingTypeChecker()
            .getEmitResolver(sourceFile, undefined);

        if (sourceFile.resolvedModules) {
            sourceFile.resolvedModules.forEach((item, name) => {
                const moduleIt = state.modules[name] || {} as ModuleInfo;
                state.modules[name] = {
                    name,
                    pathCode: state.getModulePathCode(name, item, moduleIt),
                    namespace: state.getModuleNamespace(name, item, moduleIt),
                    ...moduleIt
                };
            });
        }

        const code = emitter.emitFile(sourceFile, state, emitResolver, transformers);

        if (finalOptions.showDiagnostics && state.errors.length > 0) {
            // @ts-ignore
            diagnosticFormatter(state.errors, 'codeframe').forEach(printError);
        }

        return {
            phpCode: code,
            errors: state.errors,
            sourceFile: state.sourceFile
        };
    }
}

export function compile(filePath: string, options: Ts2phpOptions = {}) {
    const compilerOptions = options.compilerOptions;
    const ts2php = new Ts2Php({ compilerOptions });
    return ts2php.compile(filePath, options);
}
