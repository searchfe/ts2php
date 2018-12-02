/**
 * @file ts2php
 * @author meixuguang
 */

import * as ts from 'typescript';
import * as path from 'path';
import * as emitter from './emitter';
import {Ts2phpOptions} from './types';
import {options as globalOptions} from './globals';
import {assign} from 'lodash';

function ts2php(filePath: string, options?: Ts2phpOptions) {
    assign(globalOptions, options);

    const program = ts.createProgram([filePath], {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS
    });
    
    const typeChecker = program.getTypeChecker();
    
    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            const a = emitter.emitFile(sourceFile, typeChecker);
            console.log(a);
        }
    }
}

ts2php(path.resolve(__dirname, '../sample/index.ts'), {
    modules: {
        './atomWiseUtils': {
            path: './path/to/utils.php',
            className: 'Atom_Wise_Utils'
        }
    }
});


