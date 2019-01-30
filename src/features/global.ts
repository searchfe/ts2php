/**
 * @file 全局方法
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    EmitHint
} from 'typescript';

import {
    isCallExpression
} from '../utilities/nodeTest';

import method from '../utilities/method';

const map = {
    parseInt: method('intval', false, 1),
    parseFloat: method('floatval', false, 1)
};

export default {

    emit(hint, node, {helpers}) {

        const expNode = node.expression;
        let func;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && (func = map[expNode.escapedText])
        ) {
            return func(node, helpers);
        }

        return false;
    }
};
