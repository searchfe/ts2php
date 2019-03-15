/**
 * @file 生成代码前，对 ast 进行转换
 * @author meixuguang 
 */

import ts from 'typescript';

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
        return saveStateAndInvoke(node, visitorWorker);
    }

    /**
     * Visits and possibly transforms any node.
     *
     * @param node The node to visit.
     */
    function visitorWorker(node: ts.Node): ts.VisitResult<ts.Node> {
        if (node.transformFlags & ts.TransformFlags.TypeScript) {
            // This node is explicitly marked as TypeScript, so we should transform the node.
            return visitTypeScript(node);
        }

        return node;
    }

    /**
     * Branching visitor, visits a TypeScript syntax node.
     *
     * @param node The node to visit.
     */
    function visitTypeScript(node: ts.Node): ts.VisitResult<ts.Node> {
        switch (node.kind) {
            case ts.SyntaxKind.EnumDeclaration:
                // TypeScript enum declarations do not exist in ES6 and must be rewritten.
                return visitEnumDeclaration(<ts.EnumDeclaration>node);

            default:
                return node;
        }
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
        return saveStateAndInvoke(node, visitorWorker);
    }

}