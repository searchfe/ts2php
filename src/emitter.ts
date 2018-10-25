/**
 * @file emiter
 * @author meixuguang
 */

import ts = require('typescript');
import * as utilities from './utilities';
import * as os from 'os';


export function emitFile(sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker) {
    const writer = utilities.createTextWriter(os.EOL);
    writer.writeLine();
}