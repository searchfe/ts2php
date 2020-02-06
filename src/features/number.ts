/**
 * @file Object
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    EmitHint,
    isPropertyAccessExpression,
    isIdentifier,
    isCallExpression,
    createStringLiteral
} from 'typescript';

import {
    isNumberLike
} from '../utilities/nodeTest';

import method, { formatMethodName } from '../utilities/method';

const staticMap = {
    isInteger: method('is_int', {self: false})
};

const protoMap = {
    toFixed: method('number_format', {
        end: 1,
        extraArgs: [createStringLiteral('.'), createStringLiteral('')]
    })
};

export default {

    emit(hint, node, {helpers, typeChecker, helperNamespace}) {

        const expNode = node.expression;
        let func;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
        ) {

            if (
                isIdentifier(expNode.expression)
                && expNode.expression.escapedText === 'Number'
                && (func = staticMap[helpers.getTextOfNode(expNode.name)])
            ) {
                return func(node, helpers, {helperNamespace});
            }

            if (
                isNumberLike(expNode.expression, typeChecker)
                && (func = protoMap[helpers.getTextOfNode(expNode.name)])
            ) {
                return func(node, helpers, {helperNamespace});
            }
        }

        return false;
    }
};
