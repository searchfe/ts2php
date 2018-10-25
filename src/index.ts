/**
 * @file ts2php
 * @author meixuguang
 */

import * as ts from 'typescript';
import path from 'path';
import * as emitter from './emitter';

const program = ts.createProgram([path.resolve(__dirname, '../sample/index.ts')], {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});

const typeChecker = program.getTypeChecker();

for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
        ts.forEachChild(sourceFile, (node: ts.Node) => {
            emitter.emitFile(node as ts.SourceFile, typeChecker);
        });
    }
}

