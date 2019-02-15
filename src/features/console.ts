/**
 * @file json
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    EmitHint
} from 'typescript';

import {
    isPropertyAccessExpression,
    isIdentifier,
    isCallExpression
} from '../utilities/nodeTest';

import method from '../utilities/method';

const methods = {
    log: method('var_dump', false),
    info: method('var_dump', false),
    error: method('var_dump', false)
};

export default {

    emit(hint, node, {helpers}) {

        const expNode = node.expression;
        let func;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isIdentifier(expNode.expression)
            && expNode.expression.escapedText === 'console'
            && (func = methods[helpers.getTextOfNode(expNode.name)])
        ) {
            return func(node, helpers);
        }

        return false;
    }
};
