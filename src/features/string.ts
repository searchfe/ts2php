/**
 * @file 字符串相关函数
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    CallExpression,
    ListFormat,
    createNumericLiteral,
    RegularExpressionLiteral,
    createNodeArray,
    PropertyAccessExpression,
    EmitHint,
    isPropertyAccessExpression,
    isCallExpression,
    isRegularExpressionLiteral,
    isElementAccessExpression,
    createCall,
    createIdentifier,
    createStringLiteral
} from 'typescript';

import {
    isStringLike, isNumberLike,
} from '../utilities/nodeTest';

import method from '../utilities/method';
import {CompilerState} from '../types';

function replace(node: CallExpression, {getLiteralTextOfNode, emitExpressionList, writePunctuation}) {

    const expNode = node.expression as PropertyAccessExpression;

    let nodeList = [...node.arguments, expNode.expression];
    let method = '\\Ts2Php_Helper::str_replace_once';

    if (isRegularExpressionLiteral(node.arguments[0])) {
        method = 'preg_replace';
        const firstArg = node.arguments[0] as RegularExpressionLiteral;
        if (!/g$/.test(getLiteralTextOfNode(firstArg, true))) {
            nodeList.push(createNumericLiteral("1"));
        }
    }

    writePunctuation(method);
    const args = createNodeArray(nodeList);
    emitExpressionList(node, args, ListFormat.CallExpressionArguments);
}

function split(node: CallExpression, {emitExpressionList, writePunctuation}, state: CompilerState) {
    const expNode = node.expression as PropertyAccessExpression;
    const pattern = node.arguments[0];
    const method = isStringLike(pattern, state.typeChecker) ? 'explode' : 'preg_split';
    let nodeList = [node.arguments[0], expNode.expression];
    writePunctuation(method);
    const args = createNodeArray(nodeList);
    emitExpressionList(node, args, ListFormat.CallExpressionArguments);
}

const map = {
    trim: method('trim'),
    trimRight: method('rtrim'),
    trimLeft: method('ltrim'),
    toUpperCase: method('strtoupper'),
    toLowerCase: method('strtolower'),
    slice: method('\\Ts2Php_Helper::str_slice', true, 2),
    indexOf: method('\\Ts2Php_Helper::str_pos', true, 1),
    substr: method('substr', true, 2),
    substring: method('\\Ts2Php_Helper::str_slice', true, 2),
    repeat: method('str_repeat', true, 1),
    startsWith: method('\\Ts2Php_Helper::startsWith', true, 2),
    endsWith: method('\\Ts2Php_Helper::endsWith', true, 2),
    includes: method('\\Ts2Php_Helper::includes', true, 2),
    padStart: method('\\Ts2Php_Helper::padStart', true, 2),
    replace,
    split
};

export default {

    emit(hint, node, state) {

        const expNode = node.expression;
        const helpers = state.helpers;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isStringLike(expNode.expression, state.typeChecker)
        ) {
            const func = map[helpers.getTextOfNode(expNode.name)];
            if (func) {
                return func(node, helpers, state);
            }
        }

        // String.prototype.length
        if (
            hint === EmitHint.Expression
            && isPropertyAccessExpression(node)
            && isStringLike(expNode, state.typeChecker)
            && helpers.getTextOfNode(node.name) === 'length'
        ) {
            helpers.emitExpression(
                createCall(
                    createIdentifier('mb_strlen'),
                    [],
                    [
                        expNode,
                        createStringLiteral('utf8')
                    ]
                )
            );
            return;
        }

        if (
            hint === EmitHint.Expression
            && isElementAccessExpression(node)
            && isStringLike(expNode, state.typeChecker)
            && isNumberLike(node.argumentExpression, state.typeChecker)
        ) {
            helpers.emitExpression(
                createCall(
                    createIdentifier('mb_substr'),
                    [],
                    [
                        expNode,
                        node.argumentExpression,
                        createNumericLiteral('1'),
                        createStringLiteral('utf8')
                    ]
                )
            );
            return;
        }

        return false;
    }
};
