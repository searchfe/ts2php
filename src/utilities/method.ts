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

export default function (method: string, self: boolean = true, end?: number, selfLast?: boolean) {
    return (node: CallExpression, {emitExpressionList, writePunctuation}, {helperClass}) => {
        let expNode = node.expression as PropertyAccessExpression;
        let nodeList = self ? [expNode.expression || expNode] : [];
        let postList = selfLast ? [expNode.expression || expNode] : [];
        writePunctuation(formatMethodName(method, helperClass));
        const args = createNodeArray([...nodeList, ...node.arguments.slice(0, end), ...postList]);
        emitExpressionList(node, args, ListFormat.CallExpressionArguments);
    };
}

export function formatMethodName(name, helperClass) {
    return name.replace(/%helper/g, helperClass)
}
