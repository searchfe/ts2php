/**
 * @file 全局方法
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    EmitHint,
    isCallExpression,
    isPropertyAccessExpression,
    isIdentifier,
    isBinaryExpression,
    SyntaxKind,
    createCall,
    createIdentifier
} from 'typescript';

import method from '../utilities/method';

const map = {
    parseInt: method('intval', false, 1),
    parseFloat: method('floatval', false, 1),
    encodeURIComponent: method('rawurlencode', false, 1),
    decodeURIComponent: method('rawurldecode', false, 1),
    isNaN: method('is_nan', false, 1),
};

const identifierMap = new Map([
    ['___dirname', 'dirname(__FILE__)'],
    ['___filename', '__FILE__']
]);

export default {

    emit(hint, node, {helpers, typeChecker}) {

        const expNode = node.expression;
        let func;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && (func = map[expNode.escapedText])
        ) {
            return func(node, helpers);
        }

        if (
            isPropertyAccessExpression(node)
            && isIdentifier(node.expression)
            && node.expression.escapedText === 'navigator'
        ) {
            if (
                helpers.getTextOfNode(node.name) === 'userAgent'
            ) {
                return helpers.writePunctuation('$_SERVER["HTTP_USER_AGENT"]');
            }
        }

        if (isIdentifier(node)) {
            const text = node.escapedText as string;
            if (identifierMap.has(text)) {
                return helpers.writePunctuation(identifierMap.get(text));
            }
        }

        if (
            isBinaryExpression(node)
            && node.operatorToken.kind === SyntaxKind.EqualsEqualsEqualsToken
            && node.right.originalKeywordKind === SyntaxKind.UndefinedKeyword
        ) {
            helpers.writePunctuation('!');
            return helpers.emitExpression(createCall(createIdentifier('isset'), [], [node.left]));
        }

        if (
            isBinaryExpression(node)
            && node.operatorToken.kind === SyntaxKind.ExclamationEqualsEqualsToken
            && node.right.originalKeywordKind === SyntaxKind.UndefinedKeyword
        ) {
            return helpers.emitExpression(createCall(createIdentifier('isset'), [], [node.left]));
        }

        return false;
    }
};
