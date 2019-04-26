/**
 * @file ts2php
 * @author meixuguang
 */

import fs from 'fs-extra';
import path from 'path';
import * as ts from 'typescript';
import {Project} from 'ts-morph';
import {upperFirst} from 'lodash';

import * as emitter from './emitter';
import {CompilerState} from './types';
import {setState} from './state';
import buildInPlugins from './features/index';
import {transform} from './transformer';
import {Ts2phpOptions, ModuleInfo} from '../types/index';

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
        return isRelative ? `realpath(dirname(__FILE__) . '/' . ${pathCode})` : pathCode;
    },
    getModuleNamespace: () => '\\',
    modules: {},
    customTransformers: []
};

const getRandomString = n => Array(n)
    .join()
    .split(',')
    .map(function() {
        return s.charAt(Math.floor(Math.random() * s.length));
    }).join('');


export function compile(filePath: string, options: Ts2phpOptions = {}) {

    const project = new Project({
        compilerOptions: {
            target: ts.ScriptTarget.ES2016,
            scrict: true,
            transpileOnly: false,
            module: ts.ModuleKind.CommonJS,
            noImplicitThis: true,
            noImplicitAny: true,
            ...options.compilerOptions
        }
    });

    let sourceFile;

    if (!options.source && fs.existsSync(filePath)) {
        sourceFile = project.addExistingSourceFile(filePath).compilerNode;
    }
    else if (options.source) {
        filePath = /\.ts$/.test(filePath) ? filePath : (filePath + '.ts');
        sourceFile = project.createSourceFile(filePath, options.source, {overwrite: true}).compilerNode;
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

    const program = project.getProgram().compilerObject;

    const finalOptions = {
        ...defaultOptions,
        ...options
    };

    let diagnostics = project.getPreEmitDiagnostics();
    if (finalOptions.showDiagnostics) {
        diagnostics = diagnostics.filter(a => a.compilerObject.code !== 2307)
        let diags = diagnostics.map(a => a.compilerObject);
        if (diags.length) {
            console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));
            return {
                phpCode: '',
                errors: diags
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
            || upperFirst(getRandomString(5)),
        plugins
    });

    setState(state);

    if (state.modules) {
        for (let name of Object.keys(state.modules)) {
            state.modules[name].name = name;
        }
    }

    if (sourceFile.resolvedModules) {
        sourceFile.resolvedModules.forEach((item, name) => {
            let moduleIt = state.modules[name] || {} as ModuleInfo;
            state.modules[name] = {
                name,
                pathCode: state.getModulePathCode(name, item, moduleIt),
                namespace: state.getModuleNamespace(name, item, moduleIt),
                ...moduleIt
            };
        });
    }

    const transformers: ts.TransformerFactory<ts.SourceFile | ts.Bundle>[] = [
        transform,
        ...(options.customTransformers || [])
    ];

    const emitResolver = program.getDiagnosticsProducingTypeChecker()
        .getEmitResolver(sourceFile, undefined);

    return {
        phpCode: emitter.emitFile(sourceFile, state, emitResolver, transformers),
        errors: state.errors
    }
}
