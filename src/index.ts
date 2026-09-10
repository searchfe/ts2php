/**
 * @file ts2php
 * @author meixuguang
 */

import './byots-compat';
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
    getModulePathCode: (name, _, moduleIt, dirname) => {
        if (moduleIt && moduleIt.path) {
            return JSON.stringify(moduleIt.path);
        }
        const isRelative = isRelativePath(name);
        if (isRelative && _) {
            const { resolvedFileName, extension } = _;
            name = path
                .relative(dirname, resolvedFileName)
                .replace(new RegExp(`${extension}$`, 'i'), '');
            if (name[0] !== '.') {
                name = './' + name;
            }
        }
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
    .map(() => {
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

interface CacheFileInfo {
    sourceFile?: SourceFile;
    contents: string;
}

function printDiagnostic(diagnostic: Diagnostic) {
    const message = flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    if (diagnostic.file && typeof diagnostic.start === 'number') {
        const {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        console.error(`${diagnostic.file.fileName}:${line + 1}:${character + 1} - ${message}`);
        return;
    }
    console.error(message);
}

export class Ts2Php {
    private sourceFileCache: {[fileName: string]: CacheFileInfo};
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
        try {
            finalOptions.modules = options.modules ? JSON.parse(JSON.stringify(options.modules)) : {};
        }
        catch (e) {
            throw Error('Failed to JSON.stringify [options.modules], options.modules must can be copied.');
        }

        const sourceFile = this.getSourceFile(filePath, options.source);
        const program = this.program;
        const typeChecker = program.getTypeChecker();

        let diagnostics = getPreEmitDiagnostics(program);
        if (finalOptions.showDiagnostics) {
            diagnostics = diagnostics.filter(a => a.code !== 2307);
            if (diagnostics.length) {
                diagnostics.forEach(printDiagnostic);
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

        const emitResolver = program.getTypeChecker()
            .getEmitResolver(sourceFile, /* cancellationToken */ undefined);

        if (sourceFile.resolvedModules) {
            let fileName = sourceFile.fileName;
            if (!path.isAbsolute(fileName)) {
                fileName = path.resolve(fileName);
            }
            const dirname = path.dirname(fileName);
            sourceFile.resolvedModules.forEach((item, name) => {
                const resolvedModule = (item as any).resolvedModule || item;
                if (!resolvedModule || !resolvedModule.resolvedFileName) return;
                const moduleIt = state.modules[name] || {} as ModuleInfo;
                state.modules[name] = {
                    name,
                    pathCode: state.getModulePathCode(name, resolvedModule, moduleIt, dirname),
                    namespace: state.getModuleNamespace(name, resolvedModule, moduleIt),
                    ...moduleIt
                };
            });
        }

        const code = emitter.emitFile(sourceFile, state, emitResolver, transformers);

        if (finalOptions.showDiagnostics && state.errors.length > 0) {
            state.errors.forEach(printDiagnostic);
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
