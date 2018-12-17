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

export default function (method: string, self: boolean = true, end?: number) {
    return (node: CallExpression, {emitExpressionList, writePunctuation}) => {
        const expNode = node.expression as PropertyAccessExpression;
        let nodeList = self ? [expNode.expression] : [];
        writePunctuation(method);
        node.arguments = createNodeArray([...nodeList, ...node.arguments.slice(0, end)]);
        emitExpressionList(node, node.arguments, ListFormat.CallExpressionArguments);
    };
}
