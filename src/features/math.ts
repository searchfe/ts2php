/**
 * @file Math 方法
 * @author cxtom(cxtom2008@gmail.com)
 */


import {
    EmitHint,
    SyntaxKind
} from 'typescript';

import {
    isPropertyAccessExpression,
    isIdentifier
} from '../utilities/nodeTest';

import method from '../utilities/method';


let map = {
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
    random: 'rand',
    round: 'round',
    // sign: 'sign',
    sin: 'sin',
    sinh: 'sinh',
    sqrt: 'sqrt',
    tan: 'tan',
    tanh: 'tanh',
};

for (let key in map) {
    if (map.hasOwnProperty(key)) {
        map[key] = method(map[key], false);
    }
}

export default {

    emit(hint, node, helpers) {

        const expNode = node.expression;

        if (hint === EmitHint.Expression && node.kind === SyntaxKind.CallExpression) {
            if (
                isPropertyAccessExpression(expNode)
                && isIdentifier(expNode.expression)
                && expNode.expression.escapedText === 'Math'
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
