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
    PropertyAccessExpression
} from 'typescript';

import {
    isRegularExpressionLiteral,
    isStringLike
} from '../utilities/nodeTest';

export function replace(node: CallExpression, {getLiteralTextOfNode, emitExpressionList, writePunctuation}) {

    const expNode = node.expression as PropertyAccessExpression;

    let nodeList = [...node.arguments, expNode.expression];
    let method = 'Ts2Php_Helper::str_replace_once';

    if (isRegularExpressionLiteral(node.arguments[0])) {
        method = 'preg_replace';
        const firstArg = node.arguments[0] as RegularExpressionLiteral;
        if (!/g$/.test(getLiteralTextOfNode(firstArg, true))) {
            nodeList.push(createNumericLiteral("1"));
        }
    }

    writePunctuation(method);
    node.arguments = createNodeArray(nodeList);
    emitExpressionList(node, node.arguments, ListFormat.CallExpressionArguments);
}

export function indexOf(node: CallExpression, {emitExpressionList, writePunctuation}) {
    const expNode = node.expression as PropertyAccessExpression;
    let nodeList = [expNode.expression, node.arguments[0]];
    writePunctuation('strpos');
    node.arguments = createNodeArray(nodeList);
    emitExpressionList(node, node.arguments, ListFormat.CallExpressionArguments);
}

export function split(node: CallExpression, {emitExpressionList, writePunctuation, typeChecker}) {
    const expNode = node.expression as PropertyAccessExpression;
    const pattern = node.arguments[0];
    const method = isStringLike(pattern, typeChecker) ? 'split' : 'preg_split';
    let nodeList = [node.arguments[0], expNode.expression];
    writePunctuation(method);
    node.arguments = createNodeArray(nodeList);
    emitExpressionList(node, node.arguments, ListFormat.CallExpressionArguments);
}

const map = {
    trim: 'trim',
    trimRight: 'rtrim',
    trimLeft: 'ltrim',
    toUpperCase: 'strtoupper',
    toLowerCase: 'strtolower'
};

for (let key in map) {
    if (map.hasOwnProperty(key)) {
        exports[key] = (node: CallExpression, {emitExpressionList, writePunctuation}) => {
            const expNode = node.expression as PropertyAccessExpression;
            let nodeList = [expNode.expression];
            let method = map[key];
            writePunctuation(method);
            node.arguments = createNodeArray(nodeList);
            emitExpressionList(node, node.arguments, ListFormat.CallExpressionArguments);
        };
    }
}

