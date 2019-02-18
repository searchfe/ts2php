/**
 * @file Object
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

const staticMap = {
    assign: method('array_merge', false),
    keys: method('array_keys', false),
    values: method('array_values', false),
    freeze(node, {emitWithHint}) {
        emitWithHint(EmitHint.Unspecified, node.arguments[0]);
    }
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
            && expNode.expression.escapedText === 'Object'
            && (func = staticMap[helpers.getTextOfNode(expNode.name)])
        ) {
            return func(node, helpers);
        }

        return false;
    }
};
