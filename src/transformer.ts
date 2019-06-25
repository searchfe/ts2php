/**
 * @file 生成代码前，对 ast 进行转换
 * @author meixuguang
 */

import * as ts from 'typescript';

export function transform(context: ts.TransformationContext) {

    const {
        startLexicalEnvironment
    } = context;

    const resolver = context.getEmitResolver();

    // Set new transformation hooks.
    // context.onEmitNode = onEmitNode;
    // context.onSubstituteNode = onSubstituteNode;

    // Enable substitution for property/element access to emit const enum values.
    context.enableSubstitution(ts.SyntaxKind.PropertyAccessExpression);
    context.enableSubstitution(ts.SyntaxKind.ElementAccessExpression);

    // These variables contain state that changes as we descend into the tree.
    let currentNamespaceContainerName: ts.Identifier;
    let currentLexicalScope: ts.SourceFile | ts.Block | ts.ModuleBlock | ts.CaseBlock;
    let currentNameScope: ts.ClassDeclaration | undefined;
    let currentScopeFirstDeclarationsOfName: ts.UnderscoreEscapedMap<ts.Node> | undefined;

    return transformSourceFileOrBundle;

    function transformSourceFileOrBundle(node: ts.SourceFile | ts.Bundle) {
        if (node.kind === ts.SyntaxKind.Bundle) {
            return node;
        }
        return transformSourceFile(node);
    }

    /**
     * Transform TypeScript-specific syntax in a SourceFile.
     *
     * @param node A SourceFile node.
     */
    function transformSourceFile(node: ts.SourceFile) {
        if (node.isDeclarationFile) {
            return node;
        }

        const visited = saveStateAndInvoke(node, visitSourceFile);
        return visited;
    }

    /**
     * Visits a node, saving and restoring state variables on the stack.
     *
     * @param node The node to visit.
     */
    function saveStateAndInvoke<T>(node: ts.Node, f: (node: ts.Node) => T): T {
        // Save state
        const savedCurrentScope = currentLexicalScope;
        const savedCurrentNameScope = currentNameScope;
        const savedCurrentScopeFirstDeclarationsOfName = currentScopeFirstDeclarationsOfName;

        // Handle state changes before visiting a node.
        onBeforeVisitNode(node);

        const visited = f(node);

        // Restore state
        if (currentLexicalScope !== savedCurrentScope) {
            currentScopeFirstDeclarationsOfName = savedCurrentScopeFirstDeclarationsOfName;
        }

        currentLexicalScope = savedCurrentScope;
        currentNameScope = savedCurrentNameScope;
        return visited;
    }

    /**
     * Performs actions that should always occur immediately before visiting a node.
     *
     * @param node The node to visit.
     */
    function onBeforeVisitNode(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.SourceFile:
            case ts.SyntaxKind.CaseBlock:
            case ts.SyntaxKind.ModuleBlock:
            case ts.SyntaxKind.Block:
                currentLexicalScope = <ts.SourceFile | ts.CaseBlock | ts.ModuleBlock | ts.Block>node;
                currentNameScope = undefined;
                currentScopeFirstDeclarationsOfName = undefined;
                break;
        }
    }

    function visitSourceFile(node: ts.SourceFile) {

        return ts.updateSourceFileNode(
            node,
            ts.visitLexicalEnvironment(node.statements, sourceElementVisitor, context, /*start*/ 0, false));
    }

    /**
     * Specialized visitor that visits the immediate children of a SourceFile.
     *
     * @param node The node to visit.
     */
    function sourceElementVisitor(node: ts.Node): ts.VisitResult<ts.Node> {
        return saveStateAndInvoke(node, visitTypeScript);
    }

    /**
     * Branching visitor, visits a TypeScript syntax node.
     *
     * @param node The node to visit.
     */
    function visitTypeScript(node: ts.Node): ts.VisitResult<ts.Node> {

        node = ts.visitEachChild(node, visitTypeScript, context);

        switch (node.kind) {
            case ts.SyntaxKind.EnumDeclaration:
                // TypeScript enum declarations do not exist in ES6 and must be rewritten.
                return visitEnumDeclaration(<ts.EnumDeclaration>node);

            case ts.SyntaxKind.FunctionDeclaration:
                return visitFunctionDeclaration(<ts.FunctionDeclaration>node);

            case ts.SyntaxKind.FunctionExpression:
                return visitFunctionExpression(<ts.FunctionExpression>node);

            case ts.SyntaxKind.MethodDeclaration:
                return visitMethodDeclaration(<ts.MethodDeclaration>node);

            case ts.SyntaxKind.CallExpression:
                return visitCallExpression(<ts.CallExpression>node);

            case ts.SyntaxKind.VariableDeclarationList:
                return visitVariableDeclarationList(<ts.VariableDeclarationList>node);

            case ts.SyntaxKind.ObjectLiteralExpression:
                return visitObjectLiteralExpression(<ts.ObjectLiteralExpression>node);

            case ts.SyntaxKind.ArrayLiteralExpression:
                return visitArrayLiteralExpression(<ts.ArrayLiteralExpression>node);

            default:
                return node;
        }

    }

    function transformSpread(
        nodeList: ts.NodeArray<ts.ObjectLiteralElementLike | ts.Expression>,
        type: 'array' | 'object'
    ) {

        const createNode = children => type === 'object'
            ? ts.createObjectLiteral(children, true)
            : ts.createArrayLiteral(children, true);

        const isSpread = node => type === 'object'
            ? ts.isSpreadAssignment(node)
            : ts.isSpreadElement(node);

        const parameters = [createNode([])];
        let children = [];

        for (const prop of nodeList) {
            if (isSpread(prop)) {
                if (children.length > 0) {
                    parameters.push(createNode(children));
                    children = [];
                }
                // @ts-ignore
                parameters.push(prop.expression);
            }
            else {
                children.push(prop);
            }
        }

        if (children.length > 0) {
            parameters.push(createNode(children));
        }

        return ts.createCall(
            ts.createIdentifier('array_merge'),
            undefined,
            parameters
        );
    }

    function visitArrayLiteralExpression(node: ts.ArrayLiteralExpression) {
        if (!node.elements.some(node => ts.isSpreadElement(node))) {
            return node;
        }
        return transformSpread(node.elements, 'array');
    }

    function visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        if (!node.properties.some(node => ts.isSpreadAssignment(node))) {
            return node;
        }
        return transformSpread(node.properties, 'object');
    }

    function visitVariableDeclarationList(node: ts.VariableDeclarationList) {

        const pendingMap = new Map();

        node.declarations.forEach((declaration, index) => {

            const nameNode = declaration.name;

            if (!ts.isObjectBindingPattern(nameNode) && !ts.isArrayBindingPattern(nameNode)) {
                return;
            }

            const initializer = declaration.initializer;
            const pendingList = [] as ts.VariableDeclaration[];
            const isArray = ts.isArrayBindingPattern(nameNode);

            nameNode.elements.forEach((child, index) => {

                if (!ts.isBindingElement(child)) {
                    return;
                }

                const accessName = child.propertyName || child.name;

                const access = ts.createElementAccess(
                    initializer,
                    isArray ? index : ts.createStringLiteral(accessName.getText())
                );

                const variable = ts.createVariableDeclaration(
                    child.name, undefined,
                    child.initializer
                        ? ts.createConditional(
                            ts.createCall(ts.createIdentifier('isset'), [], [access]),
                            access,
                            child.initializer
                        )
                        : access
                );

                pendingList.push(variable);
            });

            pendingMap.set(index, pendingList);

        });

        if (!pendingMap.size) {
            return node;
        }

        let newDeclarations = [];
        let start = 0

        pendingMap.forEach((declarations, index) => {
            newDeclarations = [
                ...newDeclarations,
                ...node.declarations.slice(start, index - start),
                ...declarations
            ];
            start = index + 1;
        });

        return ts.updateVariableDeclarationList(node, newDeclarations);
    }

    function visitCallExpression(node: ts.CallExpression) {

        const index = node.arguments.findIndex(node => ts.isSpreadElement(node))

        if (index < 0 || !ts.isIdentifier(node.expression)) {
            return node;
        }

        const spread = node.arguments[index] as ts.SpreadElement;
        const spreadName = ts.createIdentifier(spread.expression.getText());

        let argument: ts.CallExpression | ts.Identifier = spreadName;

        if (index > 0) {

            const argus = node.arguments.map(node => node);
            const leadingArgu = ts.createArrayLiteral(argus.slice(0, index));

            const suffix = argus.slice(index + 1);

            let newArgus = [
                leadingArgu,
                spreadName,
            ];

            if (suffix.length) {
                newArgus.push(ts.createArrayLiteral(suffix));
            }

            argument = ts.createCall(
                ts.createIdentifier('array_merge'),
                [],
                newArgus
            );
        }

        const name = node.expression.getText() as string;

        const returnNode = ts.updateCall(
            node,
            ts.createIdentifier('call_user_func_array'),
            [],
            [
                ts.createStringLiteral(name),
                argument
            ]
        );

        if (index > 0) {
            spreadName.parent = argument;
        }
        else {
            spreadName.parent = returnNode;
        }

        return returnNode;
    }

    function visitFunctionDeclaration(node: ts.FunctionDeclaration) {

        if (!node.parameters.some(node => node.dotDotDotToken)) {
            return node;
        }

        const body = transformFunctionBody(node);

        return ts.updateFunctionDeclaration(
            node,
            /*decoraters*/ undefined,
            /*modifiers*/ undefined,
            node.asteriskToken,
            node.name,
            /*typeParameters*/ undefined,
            node.parameters,
            /*type*/ undefined,
            body
        );
    }

    function visitFunctionExpression(node: ts.FunctionExpression) {

        if (!node.parameters.some(node => node.dotDotDotToken)) {
            return node;
        }

        const body = transformFunctionBody(node);

        return ts.updateFunctionExpression(
            node,
            /*modifiers*/ undefined,
            node.asteriskToken,
            node.name,
            /*typeParameters*/ undefined,
            node.parameters,
            /*type*/ undefined,
            body
        );
    }

    function visitMethodDeclaration(node: ts.MethodDeclaration) {

        if (!node.parameters.some(node => node.dotDotDotToken)) {
            return node;
        }

        const body = transformFunctionBody(node);

        return ts.updateMethod(
            node,
            /*decoraters*/ undefined,
            /*modifiers*/ undefined,
            node.asteriskToken,
            node.name,
            node.questionToken,
            /*typeParameters*/ undefined,
            node.parameters,
            /*type*/ undefined,
            body
        );
    }


    function transformFunctionBody(node: ts.FunctionDeclaration | ts.MethodDeclaration | ts.FunctionExpression) {

        const parameterIndex = node.parameters.findIndex(node => !!node.dotDotDotToken);

        if (parameterIndex < 0) {
            return node.body;
        }

        const parameter = node.parameters[parameterIndex];
        const declarationName = parameter.name.kind === ts.SyntaxKind.Identifier
            ? ts.getMutableClone(parameter.name)
            : ts.createTempVariable(/*recordTempVariable*/ undefined);

        const parameters = [...node.parameters];
        node.parameters = ts.createNodeArray([]);

        let variableDeclarationList: ts.VariableDeclarationList;

        if (parameterIndex === 0) {
            variableDeclarationList = ts.createVariableDeclarationList([
                ts.createVariableDeclaration(
                    declarationName,
                    undefined,
                    ts.createCall(
                        ts.createIdentifier('func_get_args'),
                        [],
                        []
                    )
                )
            ]);
        }
        else {
            let list = parameters
                .slice(0, parameters.length - 1)
                .map((parameter, index) =>
                    ts.createVariableDeclaration(
                        parameter.name,
                        undefined,
                        ts.createCall(
                            ts.createIdentifier('func_get_arg'),
                            [],
                            [ts.createNumericLiteral(`${index}`)]
                        )
                    )
                );
            list.push(
                ts.createVariableDeclaration(
                    declarationName,
                    undefined,
                    ts.createCall(
                        ts.createIdentifier('array_slice'),
                        undefined,
                        [
                            ts.createCall(
                                ts.createIdentifier('func_get_args'),
                                undefined,
                                []
                            ),
                            ts.createNumericLiteral(`${parameterIndex}`)
                        ]
                    )
                )
            );
            variableDeclarationList = ts.createVariableDeclarationList(list);
        }

        const statement = ts.createVariableStatement(
            undefined,
            variableDeclarationList
        );

        return ts.createBlock(
            [
                statement,
                ...node.body.statements
            ],
            true
        );
    }

    /**
     * Visits an enum declaration.
     *
     * This function will be called any time a TypeScript enum is encountered.
     *
     * @param node The enum declaration node.
     */
    function visitEnumDeclaration(node: ts.EnumDeclaration): ts.VisitResult<ts.VariableStatement> {
        // `containerName` is the expression used inside of the enum for assignments.
        const containerName = getNamespaceContainerName(node);

        // `exportName` is the expression used within this node's container for any exported references.
        const exportName = ts.getLocalName(node, /*allowComments*/ false, /*allowSourceMaps*/ true);

        const enumStatement = ts.createVariableStatement(
            undefined,
            [ts.createVariableDeclaration(
                exportName,
                undefined,
                transformEnumBody(node, containerName)
            )]
        );

        return enumStatement;
    }

    /**
     * Gets the expression used to refer to a namespace or enum within the body
     * of its declaration.
     */
    function getNamespaceContainerName(node: ts.ModuleDeclaration | ts.EnumDeclaration) {
        return ts.getGeneratedNameForNode(node);
    }

    /**
     * Transforms the body of an enum declaration.
     *
     * @param node The enum declaration node.
     */
    function transformEnumBody(node: ts.EnumDeclaration, localName: ts.Identifier): ts.ObjectLiteralExpression {
        const savedCurrentNamespaceLocalName = currentNamespaceContainerName;
        currentNamespaceContainerName = localName;
        startLexicalEnvironment();
        const members = ts.map(node.members, transformEnumMember);
        currentNamespaceContainerName = savedCurrentNamespaceLocalName;
        return ts.createObjectLiteral(
            members
        );
    }

    /**
     * Transforms an enum member into a statement.
     *
     * @param member The enum member node.
     */
    function transformEnumMember(member: ts.EnumMember): ts.PropertyAssignment {
        // enums don't support computed properties
        // we pass false as 'generateNameForComputedPropertyName' for a backward compatibility purposes
        // old emitter always generate 'expression' part of the name as-is.
        // const name = getExpressionForPropertyName(member, /*generateNameForComputedPropertyName*/ false);
        const valueExpression = transformEnumMemberDeclarationValue(member);
        return ts.createPropertyAssignment(
            member.name,
            valueExpression
        );
    }

    /**
     * Transforms the value of an enum member.
     *
     * @param member The enum member node.
     */
    function transformEnumMemberDeclarationValue(member: ts.EnumMember): ts.Expression {
        const value = resolver.getConstantValue(member);
        if (value !== undefined) {
            return ts.createLiteral(value);
        }
        else {
            if (member.initializer) {
                return ts.visitNode(member.initializer, visitor, ts.isExpression);
            }
            else {
                return ts.createVoidZero();
            }
        }
    }

    /**
     * General-purpose node visitor.
     *
     * @param node The node to visit.
     */
    function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
        return saveStateAndInvoke(node, visitTypeScript);
    }

}


