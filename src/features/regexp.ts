/**
 * @file regexp
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    isCallExpression,
    isPropertyAccessExpression,
    isRegularExpressionLiteral,
    createDiagnosticForNodeInSourceFile,
    DiagnosticCategory
} from 'byots';

import {
    isRegExp
} from '../utilities/nodeTest';

import {
    createDiagnostic,
    getUnSupportedMessage
} from '../utilities/error';

const unSupportMembers = new Set([
    'compile',
    'test',
    'exec',
    'toString',
    'toSource'
]);

export default {

    emit(hint, node, state) {

        const expNode = node.expression;

        if (
            isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isRegExp(expNode.expression, state.typeChecker)
        ) {
            const funcName = state.helpers.getTextOfNode(expNode.name);
            const messageText = unSupportMembers.has(funcName)
                ? getUnSupportedMessage(`RegExp.prototype.${funcName}`)
                : `${node.getFullText()} is not valid.`
            state.errors.push(
                createDiagnostic(
                    node, state.sourceFile,
                    messageText
                )
            );
        }

        return false;
    }
};
