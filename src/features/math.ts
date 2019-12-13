/**
 * @file Math 方法
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    EmitHint,
    isPropertyAccessExpression,
    isIdentifier,
    isCallExpression
} from 'typescript';

import method from '../utilities/method';

// think about call_user_func_array before you change this map!
export const map = {
    abs: 'abs',
    acos: 'acos',
    acosh: 'acosh',
    asin: 'asin',
    asinh: 'asinh',
    atan: 'atan',
    atanh: 'atanh',
    atan2: 'atan2',
    cbrt: 'cbrt',
    ceil: 'ceil',
    clz32: 'clz32',
    cos: 'cos',
    cosh: 'cosh',
    exp: 'exp',
    expm1: 'expm1',
    floor: 'floor',
    // fround: 'fround',
    hypot: 'hypot',
    // imul: 'imul',
    log: 'log',
    log1p: 'log1p',
    log10: 'log10',
    // log2: 'log2',
    max: 'max',
    min: 'min',
    pow: 'pow',
    random: '%helper::random',
    round: 'round',
    // sign: 'sign',
    sin: 'sin',
    sinh: 'sinh',
    sqrt: 'sqrt',
    tan: 'tan',
    tanh: 'tanh',
};

const mapFunc = {};
for (let key in map) {
    if (map.hasOwnProperty(key)) {
        mapFunc[key] = method(map[key], false);
    }
}

export default {

    emit(hint, node, {helpers, helperNamespace}) {

        const expNode = node.expression;
        let func;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isIdentifier(expNode.expression)
            && expNode.expression.escapedText === 'Math'
            && (func = mapFunc[helpers.getTextOfNode(expNode.name)])
        ) {
            return func(node, helpers, {helperNamespace});
        }

        return false;
    }
};
