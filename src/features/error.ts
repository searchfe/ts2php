/**
 * @file Exception
 * @author cxtom(cxtom2008@gmail.com)
 */

import * as ts from 'byots';

const map = {
    message: 'getMessage',
    lineNumber: 'getLine',
    file: 'getFile',
    stack: 'getTraceAsString'
};

export default {

    emit(hint, node, {helpers, typeChecker}) {

        const {
            getTextOfNode,
            emitExpression,
            writeBase
        } = helpers;

        if (
            ts.isPropertyAccessExpression(node)
            && ts.isIdentifier(node.name)
            && map[getTextOfNode(node.name)]
        ) {
            const symbol = typeChecker.getSymbolAtLocation(node.expression);
            const declaration = symbol && symbol.valueDeclaration;
            if (declaration && ts.isCatchClause(declaration.parent)) {
                emitExpression(node.expression);
                return writeBase(`->${map[getTextOfNode(node.name)]}()`);
            }
        }

        return false;
    }
};
