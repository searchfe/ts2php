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
    createCall,
    createIdentifier
} from 'typescript';

import method from '../utilities/method';
import {isClassInstance} from '../utilities/nodeTest';

const staticMap = {
    assign: method('array_merge', false),
    keys: method('array_keys', false),
    values: method('array_values', false),
    freeze(node, {emitWithHint}) {
        emitWithHint(EmitHint.Unspecified, node.arguments[0]);
    }
};

function emitPropertyExists(objNode, propNode, state) {
    const typeChecker = state.typeChecker
    const emitExpression = state.helpers.emitExpression
    if (isClassInstance(objNode, state)) {
        return emitExpression(
            createCall(createIdentifier('property_exists'), [], [
                objNode,
                propNode
            ])
        );
    }
    return emitExpression(
        createCall(createIdentifier('array_key_exists'), [], [
            propNode,
            objNode
        ])
    );
}

export default {

    emit(hint, node, state) {
        const {helpers, typeChecker, helperNamespace} = state
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
            return func(node, helpers, {helperNamespace});
        }

        if (
            hint === EmitHint.Expression
            && isBinaryExpression(node)
            && node.operatorToken.kind === SyntaxKind.InKeyword
        ) {
            return emitPropertyExists(node.right, node.left, state);
        }

        if (
            isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isIdentifier(expNode.name)
            && helpers.getTextOfNode(expNode.name) === 'hasOwnProperty'
        ) {
            return emitPropertyExists(expNode.expression, node.arguments[0], state);
        }

        return false;
    }
};
