/**
 * @file 字符串相关函数
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    CallExpression,
    ListFormat,
    createNodeArray,
    PropertyAccessExpression,
    EmitHint,
    createCall,
    createLiteral
} from 'typescript';

import {
    isArrayLiteralExpression,
    isPropertyAccessExpression,
    isCallExpression,
    isArrayTypeNode
} from '../utilities/nodeTest';

import method from '../utilities/method';
import { emit } from 'cluster';

function join(node: CallExpression, {emitExpressionList, writePunctuation}) {
    let expNode = node.expression as PropertyAccessExpression;
    while (expNode.expression) {
        expNode = expNode.expression as PropertyAccessExpression;
    }
    writePunctuation('join');
    node.arguments = createNodeArray([node.arguments[0], expNode]);
    emitExpressionList(node, node.arguments, ListFormat.CallExpressionArguments);
}

function indexOf(node: CallExpression, {emitExpressionList, writePunctuation}) {
    let expNode = node.expression as PropertyAccessExpression;
    while (expNode.expression) {
        expNode = expNode.expression as PropertyAccessExpression;
    }
    writePunctuation('array_search');
    node.arguments = createNodeArray([node.arguments[0], expNode]);
    emitExpressionList(node, node.arguments, ListFormat.CallExpressionArguments);
}

const map = {
    push: method('array_push', true, 1),
    pop: method('array_pop', true, 0),
    unshift: method('array_unshift', true, 1),
    shift: method('array_shift', true, 0),
    concat: method('array_merge', true),
    reverse: method('array_reverse', true),
    splice: method('array_splice', true),
    indexOf,
    join
};

export default {

    emit(hint, node, helpers) {

        const expNode = node.expression;

        const {
            getTextOfNode,
            writePunctuation,
            emitArrayLiteralExpression,
            typeChecker,
            emit
        } = helpers;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && typeChecker.isArrayLikeType(typeChecker.getTypeAtLocation(expNode.expression))
        ) {
            const func = map[getTextOfNode(expNode.name)];
            if (func) {
                return func(node, helpers);
            }
        }

        if (
            hint === EmitHint.Expression
            && isPropertyAccessExpression(node)
            && typeChecker.isArrayLikeType(typeChecker.getTypeAtLocation(expNode))
            && getTextOfNode(node.name) === 'length'
        ) {
            writePunctuation('count(');
            if (isArrayLiteralExpression(expNode)) {
                emitArrayLiteralExpression(expNode);
            }
            else {
                emit(expNode);
            }
            writePunctuation(')');
            return;
        }

        return false;
    }
};
