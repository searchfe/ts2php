/**
 * @file 字符串相关函数
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    EmitHint,
    isPropertyAccessExpression,
    isCallExpression,
    isIdentifier
} from 'typescript';

import method from '../utilities/method';

const map = {
    push: method('array_push', true, 1),
    pop: method('array_pop', true, 0),
    unshift: method('array_unshift', true, 1),
    shift: method('array_shift', true, 0),
    concat: method('array_merge', true),
    reverse: method('array_reverse', true),
    splice: method('array_splice', true),
    map: method('array_map', false, 1, true),
    forEach: method('array_walk', true, 1),
    every: method('%helper::array_every', true, 1),
    some: method('%helper::array_some', true, 1),
    indexOf: method('%helper::array_pos', false, 1, true),
    join: method('join', false, 1, true),
    filter: method('array_filter', true, 1),
    slice: method('%helper::arraySlice', true, 2)
};

const api = {
    isArray: method('%helper::isPlainArray', false, 1)
};

export default {

    emit(hint, node, {helpers, typeChecker, helperNamespace}) {

        const expNode = node.expression;

        const {
            getTextOfNode,
            writePunctuation,
            emitExpression
        } = helpers;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && typeChecker.isArrayLikeType(typeChecker.getTypeAtLocation(expNode.expression))
        ) {
            const func = map[getTextOfNode(expNode.name)];
            if (func) {
                return func(node, helpers, {helperNamespace});
            }
        }

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isIdentifier(expNode.expression)
            && expNode.expression.escapedText === 'Array'
        ) {
            const func = api[getTextOfNode(expNode.name)];
            if (func) {
                return func(node, helpers, {helperNamespace});
            }
        }

        // Array.prototype.length
        if (
            hint === EmitHint.Expression
            && isPropertyAccessExpression(node)
            && typeChecker.isArrayLikeType(typeChecker.getTypeAtLocation(expNode))
            && getTextOfNode(node.name) === 'length'
        ) {
            writePunctuation('count(');
            emitExpression(expNode);
            writePunctuation(')');
            return;
        }

        return false;
    }
};
