/**
 * @file Object
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    EmitHint,
    isPropertyAccessExpression,
    isIdentifier,
    isCallExpression
} from 'typescript';

import method from '../utilities/method';

const staticMap = {
    now: method('microtime', false, 0)
};

// const protoMap = {
//     toFixed: method('round', true, 1)
// };

export default {

    emit(hint, node, {helpers}) {

        const expNode = node.expression;
        let func;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isIdentifier(expNode.expression)
            && expNode.expression.escapedText === 'Date'
        ) {
            if (
                func = staticMap[helpers.getTextOfNode(expNode.name)]
            ) {
                return func(node, helpers);
            }
        }

        return false;
    }
};
