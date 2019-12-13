/**
 * @file method wrapper
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    CallExpression,
    PropertyAccessExpression,
    createNodeArray,
    ListFormat
} from 'typescript';

export default function (method: string, self = true, end?: number, selfLast?: boolean) {
    return (node: CallExpression, {emitExpressionList, writePunctuation}, {helperNamespace}) => {
        const expNode = node.expression as PropertyAccessExpression;
        const nodeList = self ? [expNode.expression || expNode] : [];
        const postList = selfLast ? [expNode.expression || expNode] : [];
        writePunctuation(formatMethodName(method, helperNamespace));
        const args = createNodeArray([...nodeList, ...node.arguments.slice(0, end), ...postList]);
        emitExpressionList(node, args, ListFormat.CallExpressionArguments);
    };
}

export function formatMethodName(name, helperNamespace) {
    return name.replace(/%helper/g, helperNamespace + 'Ts2Php_Helper');
}
