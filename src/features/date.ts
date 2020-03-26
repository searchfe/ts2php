/**
 * @file Object
 * @author cxtom(cxtom2008@gmail.com)
 */

import * as ts from 'byots';

export default {

    emit(hint, node, {helpers, typeChecker, sourceFile, helperNamespace}) {

        if (ts.isIdentifier(node) && node.getText(sourceFile) === 'Date') {
            const nodeType = typeChecker.getTypeAtLocation(node);
            const symbol = nodeType.getSymbol();
            if (symbol && symbol.escapedName === 'DateConstructor') {
                return helpers.writePunctuation(helperNamespace + 'Ts2Php_Date');
            }
        }

        return false;
    }
};
