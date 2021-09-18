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
    isPropertyAccessExpression,
    isCallExpression,
    isRegularExpressionLiteral,
    isElementAccessExpression,
    createCall,
    createIdentifier,
    createStringLiteral,
    SyntaxKind,
    createTrue,
    createFalse,
    createNull,
    isIdentifier,
    isVariableDeclaration
} from 'byots';

import {
    isStringLike, isNumberLike, isFunctionLike, isRegExp,
} from '../utilities/nodeTest';

import method, {formatMethodName} from '../utilities/method';
import {createDiagnostic, getUnSupportedMessage} from '../utilities/error';
import type {CompilerState} from '../types';

function replace(
    node: CallExpression,
    {getLiteralTextOfNode, emitExpressionList, writePunctuation},
    {helperNamespace, typeChecker, errors, sourceFile}: CompilerState
) {

    const expNode = node.expression as PropertyAccessExpression;

    const nodeList = [...node.arguments, expNode.expression];
    let method = '%helper::str_replace_once';

    if (isFunctionLike(node.arguments[1], typeChecker)) {
        errors.push(createDiagnostic(
            node, sourceFile,
            'Function as second param is not supported yet in String.prototype.replace.'
        ));
        return;
    }

    if (isRegularExpressionLiteral(node.arguments[0])) {
        method = 'preg_replace';
        const firstArg = node.arguments[0] as RegularExpressionLiteral;
        if (!/gi?$/.test(getLiteralTextOfNode(firstArg, true))) {
            nodeList.push(createNumericLiteral('1'));
        }
    }

    writePunctuation(formatMethodName(method, helperNamespace));
    const args = createNodeArray(nodeList);
    emitExpressionList(node, args, ListFormat.CallExpressionArguments);
}

function split(node: CallExpression, {emitExpressionList, writePunctuation}, state) {
    const expNode = node.expression as PropertyAccessExpression;
    const pattern = node.arguments[0];
    const isPreg = !isStringLike(pattern, state.typeChecker);
    const method = isPreg ? 'preg_split' : '%helper::strSplit';
    const nodeList = [node.arguments[0], expNode.expression];

    if (isPreg) {
        nodeList.push(createNull(), createIdentifier('PREG_SPLIT_DELIM_CAPTURE'));
    }

    writePunctuation(formatMethodName(method, state.helperNamespace));
    const args = createNodeArray(nodeList);
    emitExpressionList(node, args, ListFormat.CallExpressionArguments);
}

function match(node: CallExpression, {emitExpressionList, writePunctuation}, state: CompilerState) {
    const expNode = node.expression as PropertyAccessExpression;
    const pattern = node.arguments[0];
    const method = '%helper::match';
    const nodeList = [node.arguments[0], expNode.expression];

    if (!isRegExp(pattern, state.typeChecker)) {
        // mark is string
        nodeList.push(createTrue());
    }
    else {
        // mark all match
        let patternDeclaration = pattern;
        while (isIdentifier(patternDeclaration)) {
            const declaration = state.typeChecker.getSymbolAtLocation(patternDeclaration).getDeclarations()[0];
            if (isVariableDeclaration(declaration)) {
                patternDeclaration = declaration.initializer;
            }
        }

        if (!isRegularExpressionLiteral(patternDeclaration)) {
            state.errors.push(createDiagnostic(
                node, state.sourceFile,
                'Regular Expression Literal is not found.'
            ));
            return;
        }

        const isAll = patternDeclaration.getText(state.sourceFile).split('/').pop().indexOf('g') !== -1;
        if (isAll) {
            nodeList.push(createFalse());
            nodeList.push(createTrue());
        }
    }

    writePunctuation(formatMethodName(method, state.helperNamespace));
    const args = createNodeArray(nodeList);
    emitExpressionList(node, args, ListFormat.CallExpressionArguments);
}

const map = {
    trim: method('trim'),
    trimRight: method('rtrim'),
    trimLeft: method('ltrim'),
    toUpperCase: method('strtoupper'),
    toLowerCase: method('strtolower'),
    slice: method('%helper::str_slice', {end: 2}),
    indexOf: method('%helper::str_pos', {end: 2}),
    substring: method('%helper::str_slice', {end: 2}),
    repeat: method('str_repeat',  {end: 1}),
    startsWith: method('%helper::startsWith',{end: 2}),
    endsWith: method('%helper::endsWith',{end: 2}),
    includes: method('%helper::includes',{end: 2}),
    padStart: method('%helper::padStart',{end: 2}),
    replace,
    split,
    match
};

export default {

    emit(hint, node, state: CompilerState) {

        const expNode = node.expression;
        const helpers = state.helpers;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isStringLike(expNode.expression, state.typeChecker)
        ) {
            const funcName = helpers.getTextOfNode(expNode.name);
            const func = map[funcName];
            if (func) {
                return func(node, helpers, state);
            }
            state.errors.push(createDiagnostic(
                node, state.sourceFile,
                getUnSupportedMessage(`String.prototype.${funcName}`)
            ));
            return;
        }

        // String.prototype.length
        if (
            hint === EmitHint.Expression
            && isPropertyAccessExpression(node)
            && isStringLike(expNode, state.typeChecker)
            && helpers.getTextOfNode(node.name) === 'length'
        ) {
            helpers.emitExpression(
                createCall(
                    createIdentifier('mb_strlen'),
                    [],
                    [
                        expNode,
                        createStringLiteral('utf8')
                    ]
                )
            );
            return;
        }


        // str[0]
        if (
            hint === EmitHint.Expression
            && isElementAccessExpression(node)
            && isStringLike(expNode, state.typeChecker)
            && isNumberLike(node.argumentExpression, state.typeChecker)
        ) {
            helpers.emitExpression(
                createCall(
                    createIdentifier('mb_substr'),
                    [],
                    [
                        expNode,
                        node.argumentExpression,
                        createNumericLiteral('1'),
                        createStringLiteral('utf8')
                    ]
                )
            );
            return;
        }

        return false;
    }
};
