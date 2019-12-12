/**
 * @file ts2php
 * @author meixuguang
 */

import fs from 'fs-extra';
import path from 'path';
import {Project, ts, CompilerOptions} from 'ts-morph';
import {upperFirst} from 'lodash';
import {satisfies} from 'semver';

import * as emitter from './emitter';
import {CompilerState} from './types';
import {setState} from './state';
import buildInPlugins from './features/index';
import {transform} from './transformer';
import {Ts2phpOptions, Ts2phpConstructOptions, Ts2phpCompileOptions, ModuleInfo} from '../types/index';

const defaultOptions = {
    showDiagnostics: true,
    emitHeader: true,
    getModulePathCode: (name, _, moduleIt) => {
        if (moduleIt && moduleIt.path) {
            return JSON.stringify(moduleIt.path);
        }
        const isRelative = /^\./.test(name);
        const ext = path.extname(name);
        const outPath = ext ? (name.replace(new RegExp(ext + '$'), '') + '.php') : (isRelative ? (name + '.php') : name);
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

export class Ts2Php {
    private project: Project;

    constructor ({ compilerOptions }: Ts2phpConstructOptions = {}) {
        if (!satisfies(ts.version, '~3.4.0')) {
            throw new TypeError('[ts2php] TypeScript version ' + ts.version + ' is not valid! Please install typescript@~3.4.0!');
        }

        this.project = new Project({
            compilerOptions: {
                target: ts.ScriptTarget.ES2016,
                scrict: true,
                module: ts.ModuleKind.CommonJS,
                noImplicitThis: true,
                noImplicitAny: true,
                alwaysStrict: true,
                ...compilerOptions
            },
            addFilesFromTsConfig: false,
            skipFileDependencyResolution: true
        });
    }

    compile (filePath: string, options: Ts2phpCompileOptions = {}) {
        let sourceFile;

        if (!options.source && fs.existsSync(filePath)) {
            sourceFile = this.project.addExistingSourceFile(filePath);
        }
        else if (options.source) {
            filePath = /\.ts$/.test(filePath) ? filePath : (filePath + '.ts');
            sourceFile = this.project.createSourceFile(filePath, options.source, {overwrite: true});
        }
        else {
            return {
                phpCode: '',
                errors: [{
                    code: 501,
                    msg: '未找到文件'
                }]
            };
        }

        this.project.resolveSourceFileDependencies();
        const program = this.project.getProgram().compilerObject;

        const finalOptions = {
            ...defaultOptions,
            ...options
        };
        // avoid change options
        finalOptions.modules = {...options.modules};

        const typeChecker = program.getTypeChecker();

        let diagnostics = this.project.getPreEmitDiagnostics();
        if (finalOptions.showDiagnostics) {
            diagnostics = diagnostics.filter(a => a.compilerObject.code !== 2307);
            const diags = diagnostics.map(a => a.compilerObject);
            if (diags.length) {
                console.log(this.project.formatDiagnosticsWithColorAndContext(diagnostics));
                return {
                    phpCode: '',
                    errors: diags
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

        const transformers: ts.TransformerFactory<ts.SourceFile | ts.Bundle>[] = [
            transform,
            ...(options.customTransformers || [])
        ];

        const sourceFileNode = sourceFile.compilerNode;

        const emitResolver = program.getDiagnosticsProducingTypeChecker()
            .getEmitResolver(sourceFileNode, undefined);

        if (sourceFileNode.resolvedModules) {
            sourceFileNode.resolvedModules.forEach((item, name) => {
                const moduleIt = state.modules[name] || {} as ModuleInfo;
                state.modules[name] = {
                    name,
                    pathCode: state.getModulePathCode(name, item, moduleIt),
                    namespace: state.getModuleNamespace(name, item, moduleIt),
                    ...moduleIt
                };
            });
        }

        const code = emitter.emitFile(sourceFileNode, state, emitResolver, transformers);

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
