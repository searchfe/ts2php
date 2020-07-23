/**
 * @file method wrapper
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    CallExpression,
    PropertyAccessExpression,
    createNodeArray,
    ListFormat,
    Expression
} from 'byots';

interface MethodOptions {

    /** Self as args */
    self?: boolean;

    /** Self as args at last */
    selfLast?: boolean;

    /** Use for slice args */
    end?: number;

    /** Add extra args at last, before selfLast */
    extraArgs?: Expression[];
}

export default function (method: string, options?: MethodOptions) {
    const {
        self = true,
        end = undefined,
        selfLast = false,
        extraArgs = []
    } = options || {};
    return (node: CallExpression, {emitExpressionList, writePunctuation}, {helperNamespace}) => {
        const expNode = node.expression as PropertyAccessExpression;
        const nodeList = self ? [expNode.expression || expNode] : [];
        const postList = selfLast ? [expNode.expression || expNode] : [];
        writePunctuation(formatMethodName(method, helperNamespace));
        const args = createNodeArray([...nodeList, ...node.arguments.slice(0, end), ...postList, ...extraArgs]);
        emitExpressionList(node, args, ListFormat.CallExpressionArguments);
    };
}

export function formatMethodName(name, helperNamespace) {
    return name.replace(/%helper/g, helperNamespace + 'Ts2Php_Helper');
}
