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
    SyntaxKind
} from 'typescript';

import {
    isRegularExpressionLiteral,
    isStringLike,
    isPropertyAccessExpression
} from '../utilities/nodeTest';

import method from '../utilities/method';

function replace(node: CallExpression, {getLiteralTextOfNode, emitExpressionList, writePunctuation}) {

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

function split(node: CallExpression, {emitExpressionList, writePunctuation, typeChecker}) {
    const expNode = node.expression as PropertyAccessExpression;
    const pattern = node.arguments[0];
    const method = isStringLike(pattern, typeChecker) ? 'explode' : 'preg_split';
    let nodeList = [node.arguments[0], expNode.expression];
    writePunctuation(method);
    node.arguments = createNodeArray(nodeList);
    emitExpressionList(node, node.arguments, ListFormat.CallExpressionArguments);
}

const map = {
    trim: method('trim'),
    trimRight: method('rtrim'),
    trimLeft: method('ltrim'),
    toUpperCase: method('strtoupper'),
    toLowerCase: method('strtolower'),
    slice: method('Ts2Php_Helper::str_slice', true, 2),
    indexOf: method('strpos', true, 1),
    substr: method('substr', true, 2),
    substring: method('substr', true, 2),
    replace,
    split
};

export default {

    emit(hint, node, helpers) {

        const expNode = node.expression;

        if (hint === EmitHint.Expression && node.kind === SyntaxKind.CallExpression) {
            if (
                isPropertyAccessExpression(expNode)
                && isStringLike(expNode.expression, helpers.typeChecker)
            ) {
                const func = map[helpers.getTextOfNode(expNode.name)];
                if (func) {
                    func(node, helpers);
                }
                return;
            }
        }

        return false;
    }
};
