/**
 * @file ts2php
 * @author meixuguang
 */

import fs from 'fs-extra';
import * as ts from 'typescript';
import hash from 'hash-sum';
import {Project} from 'ts-morph';

import * as emitter from './emitter';
import {Ts2phpOptions, CompilerState} from './types';
import {setState} from './state';
import buildInPlugins from './features/index';
import {transform} from './transformer';

const defaultOptions = {
    showDiagnostics: true,
    emitHeader: true,
    getModulePath: name => name,
    getModuleNamespace: () => '\\',
    modules: {},
    customTransformers: []
};

export function compile(filePath: string, options: Ts2phpOptions = {}) {

    const project = new Project({
        compilerOptions: {
            target: ts.ScriptTarget.ES2016,
            scrict: true,
            transpileOnly: false,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            ...options.tsConfig
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
            || hash(filePath),
        plugins
    });

    setState(state);

    if (state.modules) {
        for (let name of Object.keys(state.modules)) {
            state.modules[name].name = name;
        }
    }

    sourceFile.resolvedModules && sourceFile.resolvedModules.forEach((item, name) => {
        state.modules[name] = {
            name,
            path: state.getModulePath(name, item),
            namespace: state.getModuleNamespace(name, item),
            ...state.modules[name]
        };
    });

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
