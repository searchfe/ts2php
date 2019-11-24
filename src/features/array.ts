/**
 * @file 字符串相关函数
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    EmitHint,
    isPropertyAccessExpression,
    isCallExpression,
    isIdentifier,
    CallExpression,
    PropertyAccessExpression,
    createNodeArray,
    ListFormat,
    FunctionLike,
    createCall,
    createIdentifier
} from 'typescript';

import method, {formatMethodName} from '../utilities/method';
import ts = require('typescript');

function sort(node: CallExpression, {emitExpressionList, writePunctuation, errors}, {typeChecker}) {
    let expNode = node.expression as PropertyAccessExpression;
    let args = [expNode.expression];
    if (!node.arguments || node.arguments.length <= 0) {
        writePunctuation('sort');
        emitExpressionList(node, createNodeArray(args), ListFormat.CallExpressionArguments);
    }
    else if (
        ts.isArrowFunction(node.arguments[0])
        || ts.isFunctionExpression(node.arguments[0])
    ) {
        writePunctuation('usort');
        emitExpressionList(node, createNodeArray([...args, node.arguments[0]]), ListFormat.CallExpressionArguments);
    }
    else {
        errors.push({
            code: 1,
            msg: `Array.prototype.sort does not support parameters except arrow function or function expression`
        });
    }
}


const map = {
    push: method('array_push', true),
    pop: method('array_pop', true, 0),
    unshift: method('array_unshift', true, 1),
    shift: method('array_shift', true, 0),
    concat: method('array_merge', true),
    reverse: method('array_reverse', true),
    splice: method('array_splice', true),
    map(node: CallExpression, {emitExpressionList, writePunctuation}, {helperNamespace, typeChecker}) {
        let expNode = node.expression as PropertyAccessExpression;
        let postList = [expNode.expression];
        writePunctuation(formatMethodName('array_map', helperNamespace));

        // support index, if arguments[0] is not function like, need to check declaration.
        let argumentFunction = node.arguments[0];
        if (!ts.isFunctionLike(node.arguments[0])) {
            let declarations = typeChecker.getSymbolAtLocation(node.arguments[0]).getDeclarations();
            if (
                declarations[0]
                && declarations[0].kind === ts.SyntaxKind.VariableDeclaration
                && ts.isFunctionLike(declarations[0].initializer)
            ) {
                argumentFunction = declarations[0].initializer;
            }
        }
        if (ts.isFunctionLike(argumentFunction) && (argumentFunction as FunctionLike).parameters.length > 1) {
            postList.push(createCall(
                createIdentifier('array_keys'),
                undefined,
                [expNode.expression]
            ));
        }

        const args = createNodeArray([node.arguments[0], ...postList]);
        emitExpressionList(node, args, ListFormat.CallExpressionArguments);
    },
    forEach: method('array_walk', true, 1),
    every: method('%helper::array_every', true, 1),
    some: method('%helper::array_some', true, 1),
    indexOf: method('%helper::array_pos', false, 1, true),
    join: method('join', false, 1, true),
    filter: method('array_filter', true, 1),
    slice: method('%helper::arraySlice', true, 2),
    find: method('%helper::array_find', false, 1, true),
    findIndex: method('%helper::array_find_index', false, 1, true),
    sort
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
                return func(node, helpers, {helperNamespace, typeChecker});
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
