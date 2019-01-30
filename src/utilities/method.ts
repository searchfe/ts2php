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
    return (node: CallExpression, {emitExpressionList, writePunctuation}) => {
        let expNode = node.expression as PropertyAccessExpression;
        while (expNode.expression) {
            expNode = expNode.expression as PropertyAccessExpression;
        }
        let nodeList = self ? [expNode] : [];
        let postList = selfLast ? [expNode] : [];
        writePunctuation(method);
        const args = createNodeArray([...nodeList, ...node.arguments.slice(0, end), ...postList]);
        emitExpressionList(node, args, ListFormat.CallExpressionArguments);
    };
}
