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
    createDiagnostic
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
                ? `RegExp.prototype.${funcName} has not supported in ts2php, see https://github.com/searchfe/ts2php`
                : `${node.getFullText()} is not valid.`
            state.errors.push(
                createDiagnostic(
                    node, state.sourceFile,
                    messageText
                )
            );
            return;
        }

        return false;
    }
};
