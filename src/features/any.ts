/**
 * @file json
 * @author cxtom(cxtom2008@gmail.com)
 */

import * as ts from 'byots';
import {CompilerState} from '../types';
import {createDiagnostic} from '../utilities/error';

export default {

    emit(hint, node, {typeChecker, errors, sourceFile}: CompilerState) {

        const expNode = node.expression;

        if (
            ts.isCallExpression(node)
            && ts.isPropertyAccessExpression(expNode)
        ) {
            let nodeType = typeChecker.getTypeAtLocation(expNode);
            if (nodeType.getFlags() & ts.TypeFlags.AnyOrUnknown) {
                errors.push(createDiagnostic(expNode, sourceFile, `${expNode.getText(sourceFile)} is any type and can cause fatal in php.`))
            }
        }

        return false;
    }
};
