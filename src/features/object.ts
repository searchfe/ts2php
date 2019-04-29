/**
 * @file Object
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    EmitHint,
    isPropertyAccessExpression,
    isIdentifier,
    isCallExpression,
    isBinaryExpression,
    SyntaxKind,
    isStringLiteral,
    TypeFlags,
    createCall,
    createIdentifier
} from 'typescript';

import method from '../utilities/method';
import {
    isClassLike,
    isClassInstance
} from '../utilities/nodeTest';

const staticMap = {
    assign: method('array_merge', false),
    keys: method('array_keys', false),
    values: method('array_values', false),
    freeze(node, {emitWithHint}) {
        emitWithHint(EmitHint.Unspecified, node.arguments[0]);
    }
};

export default {

    emit(hint, node, {helpers, typeChecker}) {

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

        if (
            hint === EmitHint.Expression
            && isBinaryExpression(node)
            && node.operatorToken.kind === SyntaxKind.InKeyword
        ) {
            if (isClassInstance(node.right, typeChecker)) {
                return helpers.emitExpression(
                    createCall(
                        createIdentifier('property_exists'),
                        [],
                        [
                            node.right,
                            node.left
                        ]
                    )
                );
            }
            return helpers.emitExpression(
                createCall(
                    createIdentifier('array_key_exists'),
                    [],
                    [
                        node.left,
                        node.right
                    ]
                )
            );
        }


        return false;
    }
};
