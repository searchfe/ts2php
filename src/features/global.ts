/**
 * @file 全局方法
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    EmitHint,
    isCallExpression,
    isPropertyAccessExpression,
    isIdentifier
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

        return false;
    }
};
