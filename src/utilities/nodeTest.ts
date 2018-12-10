// Simple node tests of the form `node.kind === SyntaxKind.Foo`.

import {
    Node,
    SyntaxKind
} from 'typescript';
import * as ts from 'typescript';


// Literals
export function isNumericLiteral(node: Node): node is ts.NumericLiteral {
    return node.kind === SyntaxKind.NumericLiteral;
}

export function isStringLiteral(node: Node): node is ts.StringLiteral {
    return node.kind === SyntaxKind.StringLiteral;
}

export function isJsxText(node: Node): node is ts.JsxText {
    return node.kind === SyntaxKind.JsxText;
}

export function isRegularExpressionLiteral(node: Node): node is ts.RegularExpressionLiteral {
    return node.kind === SyntaxKind.RegularExpressionLiteral;
}

export function isNoSubstitutionTemplateLiteral(node: Node): node is ts.NoSubstitutionTemplateLiteral {
    return node.kind === SyntaxKind.NoSubstitutionTemplateLiteral;
}

// Pseudo-literals

export function isTemplateHead(node: Node): node is ts.TemplateHead {
    return node.kind === SyntaxKind.TemplateHead;
}

export function isTemplateMiddle(node: Node): node is ts.TemplateMiddle {
    return node.kind === SyntaxKind.TemplateMiddle;
}

export function isTemplateTail(node: Node): node is ts.TemplateTail {
    return node.kind === SyntaxKind.TemplateTail;
}

export function isIdentifier(node: Node): node is ts.Identifier {
    return node.kind === SyntaxKind.Identifier;
}

// Names

export function isQualifiedName(node: Node): node is ts.QualifiedName {
    return node.kind === SyntaxKind.QualifiedName;
}

export function isComputedPropertyName(node: Node): node is ts.ComputedPropertyName {
    return node.kind === SyntaxKind.ComputedPropertyName;
}

// Signature elements

export function isTypeParameterDeclaration(node: Node): node is ts.TypeParameterDeclaration {
    return node.kind === SyntaxKind.TypeParameter;
}

export function isParameter(node: Node): node is ts.ParameterDeclaration {
    return node.kind === SyntaxKind.Parameter;
}

export function isDecorator(node: Node): node is ts.Decorator {
    return node.kind === SyntaxKind.Decorator;
}

// TypeMember

export function isPropertySignature(node: Node): node is ts.PropertySignature {
    return node.kind === SyntaxKind.PropertySignature;
}

export function isPropertyDeclaration(node: Node): node is ts.PropertyDeclaration {
    return node.kind === SyntaxKind.PropertyDeclaration;
}

export function isMethodSignature(node: Node): node is ts.MethodSignature {
    return node.kind === SyntaxKind.MethodSignature;
}

export function isMethodDeclaration(node: Node): node is ts.MethodDeclaration {
    return node.kind === SyntaxKind.MethodDeclaration;
}

export function isConstructorDeclaration(node: Node): node is ts.ConstructorDeclaration {
    return node.kind === SyntaxKind.Constructor;
}

export function isGetAccessorDeclaration(node: Node): node is ts.GetAccessorDeclaration {
    return node.kind === SyntaxKind.GetAccessor;
}

export function isSetAccessorDeclaration(node: Node): node is ts.SetAccessorDeclaration {
    return node.kind === SyntaxKind.SetAccessor;
}

export function isCallSignatureDeclaration(node: Node): node is ts.CallSignatureDeclaration {
    return node.kind === SyntaxKind.CallSignature;
}

export function isConstructSignatureDeclaration(node: Node): node is ts.ConstructSignatureDeclaration {
    return node.kind === SyntaxKind.ConstructSignature;
}

export function isIndexSignatureDeclaration(node: Node): node is ts.IndexSignatureDeclaration {
    return node.kind === SyntaxKind.IndexSignature;
}

/* @internal */
export function isGetOrSetAccessorDeclaration(node: Node): node is ts.AccessorDeclaration {
    return node.kind === SyntaxKind.SetAccessor || node.kind === SyntaxKind.GetAccessor;
}

// Type

export function isTypePredicateNode(node: Node): node is ts.TypePredicateNode {
    return node.kind === SyntaxKind.TypePredicate;
}

export function isTypeReferenceNode(node: Node): node is ts.TypeReferenceNode {
    return node.kind === SyntaxKind.TypeReference;
}

export function isFunctionTypeNode(node: Node): node is ts.FunctionTypeNode {
    return node.kind === SyntaxKind.FunctionType;
}

export function isConstructorTypeNode(node: Node): node is ts.ConstructorTypeNode {
    return node.kind === SyntaxKind.ConstructorType;
}

export function isTypeQueryNode(node: Node): node is ts.TypeQueryNode {
    return node.kind === SyntaxKind.TypeQuery;
}

export function isTypeLiteralNode(node: Node): node is ts.TypeLiteralNode {
    return node.kind === SyntaxKind.TypeLiteral;
}

export function isArrayTypeNode(node: Node): node is ts.ArrayTypeNode {
    return node.kind === SyntaxKind.ArrayType;
}

export function isTupleTypeNode(node: Node): node is ts.TupleTypeNode {
    return node.kind === SyntaxKind.TupleType;
}

export function isUnionTypeNode(node: Node): node is ts.UnionTypeNode {
    return node.kind === SyntaxKind.UnionType;
}

export function isIntersectionTypeNode(node: Node): node is ts.IntersectionTypeNode {
    return node.kind === SyntaxKind.IntersectionType;
}

export function isConditionalTypeNode(node: Node): node is ts.ConditionalTypeNode {
    return node.kind === SyntaxKind.ConditionalType;
}

export function isInferTypeNode(node: Node): node is ts.InferTypeNode {
    return node.kind === SyntaxKind.InferType;
}

export function isParenthesizedTypeNode(node: Node): node is ts.ParenthesizedTypeNode {
    return node.kind === SyntaxKind.ParenthesizedType;
}

export function isThisTypeNode(node: Node): node is ts.ThisTypeNode {
    return node.kind === SyntaxKind.ThisType;
}

export function isTypeOperatorNode(node: Node): node is ts.TypeOperatorNode {
    return node.kind === SyntaxKind.TypeOperator;
}

export function isIndexedAccessTypeNode(node: Node): node is ts.IndexedAccessTypeNode {
    return node.kind === SyntaxKind.IndexedAccessType;
}

export function isMappedTypeNode(node: Node): node is ts.MappedTypeNode {
    return node.kind === SyntaxKind.MappedType;
}

export function isLiteralTypeNode(node: Node): node is ts.LiteralTypeNode {
    return node.kind === SyntaxKind.LiteralType;
}

export function isImportTypeNode(node: Node): node is ts.ImportTypeNode {
    return node.kind === SyntaxKind.ImportType;
}

// Binding patterns

export function isObjectBindingPattern(node: Node): node is ts.ObjectBindingPattern {
    return node.kind === SyntaxKind.ObjectBindingPattern;
}

export function isArrayBindingPattern(node: Node): node is ts.ArrayBindingPattern {
    return node.kind === SyntaxKind.ArrayBindingPattern;
}

export function isBindingElement(node: Node): node is ts.BindingElement {
    return node.kind === SyntaxKind.BindingElement;
}

// Expression

export function isArrayLiteralExpression(node: Node): node is ts.ArrayLiteralExpression {
    return node.kind === SyntaxKind.ArrayLiteralExpression;
}

export function isObjectLiteralExpression(node: Node): node is ts.ObjectLiteralExpression {
    return node.kind === SyntaxKind.ObjectLiteralExpression;
}

export function isPropertyAccessExpression(node: Node): node is ts.PropertyAccessExpression {
    return node.kind === SyntaxKind.PropertyAccessExpression;
}

export function isElementAccessExpression(node: Node): node is ts.ElementAccessExpression {
    return node.kind === SyntaxKind.ElementAccessExpression;
}

export function isCallExpression(node: Node): node is ts.CallExpression {
    return node.kind === SyntaxKind.CallExpression;
}

export function isNewExpression(node: Node): node is ts.NewExpression {
    return node.kind === SyntaxKind.NewExpression;
}

export function isTaggedTemplateExpression(node: Node): node is ts.TaggedTemplateExpression {
    return node.kind === SyntaxKind.TaggedTemplateExpression;
}

export function isTypeAssertion(node: Node): node is ts.TypeAssertion {
    return node.kind === SyntaxKind.TypeAssertionExpression;
}

export function isParenthesizedExpression(node: Node): node is ts.ParenthesizedExpression {
    return node.kind === SyntaxKind.ParenthesizedExpression;
}

export function skipPartiallyEmittedExpressions(node: ts.Expression): ts.Expression;
export function skipPartiallyEmittedExpressions(node: Node): Node;
export function skipPartiallyEmittedExpressions(node: Node) {
    while (node.kind === SyntaxKind.PartiallyEmittedExpression) {
        node = (<ts.PartiallyEmittedExpression>node).expression;
    }

    return node;
}

export function isFunctionExpression(node: Node): node is ts.FunctionExpression {
    return node.kind === SyntaxKind.FunctionExpression;
}

export function isArrowFunction(node: Node): node is ts.ArrowFunction {
    return node.kind === SyntaxKind.ArrowFunction;
}

export function isDeleteExpression(node: Node): node is ts.DeleteExpression {
    return node.kind === SyntaxKind.DeleteExpression;
}

export function isTypeOfExpression(node: Node): node is ts.TypeOfExpression {
    return node.kind === SyntaxKind.TypeOfExpression;
}

export function isVoidExpression(node: Node): node is ts.VoidExpression {
    return node.kind === SyntaxKind.VoidExpression;
}

export function isAwaitExpression(node: Node): node is ts.AwaitExpression {
    return node.kind === SyntaxKind.AwaitExpression;
}

export function isPrefixUnaryExpression(node: Node): node is ts.PrefixUnaryExpression {
    return node.kind === SyntaxKind.PrefixUnaryExpression;
}

export function isPostfixUnaryExpression(node: Node): node is ts.PostfixUnaryExpression {
    return node.kind === SyntaxKind.PostfixUnaryExpression;
}

export function isBinaryExpression(node: Node): node is ts.BinaryExpression {
    return node.kind === SyntaxKind.BinaryExpression;
}

export function isConditionalExpression(node: Node): node is ts.ConditionalExpression {
    return node.kind === SyntaxKind.ConditionalExpression;
}

export function isTemplateExpression(node: Node): node is ts.TemplateExpression {
    return node.kind === SyntaxKind.TemplateExpression;
}

export function isYieldExpression(node: Node): node is ts.YieldExpression {
    return node.kind === SyntaxKind.YieldExpression;
}

export function isSpreadElement(node: Node): node is ts.SpreadElement {
    return node.kind === SyntaxKind.SpreadElement;
}

export function isClassExpression(node: Node): node is ts.ClassExpression {
    return node.kind === SyntaxKind.ClassExpression;
}

export function isOmittedExpression(node: Node): node is ts.OmittedExpression {
    return node.kind === SyntaxKind.OmittedExpression;
}

export function isExpressionWithTypeArguments(node: Node): node is ts.ExpressionWithTypeArguments {
    return node.kind === SyntaxKind.ExpressionWithTypeArguments;
}

export function isAsExpression(node: Node): node is ts.AsExpression {
    return node.kind === SyntaxKind.AsExpression;
}

export function isNonNullExpression(node: Node): node is ts.NonNullExpression {
    return node.kind === SyntaxKind.NonNullExpression;
}

export function isMetaProperty(node: Node): node is ts.MetaProperty {
    return node.kind === SyntaxKind.MetaProperty;
}

// Misc

export function isTemplateSpan(node: Node): node is ts.TemplateSpan {
    return node.kind === SyntaxKind.TemplateSpan;
}

export function isSemicolonClassElement(node: Node): node is ts.SemicolonClassElement {
    return node.kind === SyntaxKind.SemicolonClassElement;
}

// Block

export function isBlock(node: Node): node is ts.Block {
    return node.kind === SyntaxKind.Block;
}

export function isVariableStatement(node: Node): node is ts.VariableStatement {
    return node.kind === SyntaxKind.VariableStatement;
}

export function isEmptyStatement(node: Node): node is ts.EmptyStatement {
    return node.kind === SyntaxKind.EmptyStatement;
}

export function isExpressionStatement(node: Node): node is ts.ExpressionStatement {
    return node.kind === SyntaxKind.ExpressionStatement;
}

export function isIfStatement(node: Node): node is ts.IfStatement {
    return node.kind === SyntaxKind.IfStatement;
}

export function isDoStatement(node: Node): node is ts.DoStatement {
    return node.kind === SyntaxKind.DoStatement;
}

export function isWhileStatement(node: Node): node is ts.WhileStatement {
    return node.kind === SyntaxKind.WhileStatement;
}

export function isForStatement(node: Node): node is ts.ForStatement {
    return node.kind === SyntaxKind.ForStatement;
}

export function isForInStatement(node: Node): node is ts.ForInStatement {
    return node.kind === SyntaxKind.ForInStatement;
}

export function isForOfStatement(node: Node): node is ts.ForOfStatement {
    return node.kind === SyntaxKind.ForOfStatement;
}

export function isContinueStatement(node: Node): node is ts.ContinueStatement {
    return node.kind === SyntaxKind.ContinueStatement;
}

export function isBreakStatement(node: Node): node is ts.BreakStatement {
    return node.kind === SyntaxKind.BreakStatement;
}

export function isBreakOrContinueStatement(node: Node): node is ts.BreakOrContinueStatement {
    return node.kind === SyntaxKind.BreakStatement || node.kind === SyntaxKind.ContinueStatement;
}

export function isReturnStatement(node: Node): node is ts.ReturnStatement {
    return node.kind === SyntaxKind.ReturnStatement;
}

export function isWithStatement(node: Node): node is ts.WithStatement {
    return node.kind === SyntaxKind.WithStatement;
}

export function isSwitchStatement(node: Node): node is ts.SwitchStatement {
    return node.kind === SyntaxKind.SwitchStatement;
}

export function isLabeledStatement(node: Node): node is ts.LabeledStatement {
    return node.kind === SyntaxKind.LabeledStatement;
}

export function isThrowStatement(node: Node): node is ts.ThrowStatement {
    return node.kind === SyntaxKind.ThrowStatement;
}

export function isTryStatement(node: Node): node is ts.TryStatement {
    return node.kind === SyntaxKind.TryStatement;
}

export function isDebuggerStatement(node: Node): node is ts.DebuggerStatement {
    return node.kind === SyntaxKind.DebuggerStatement;
}

export function isVariableDeclaration(node: Node): node is ts.VariableDeclaration {
    return node.kind === SyntaxKind.VariableDeclaration;
}

export function isVariableDeclarationList(node: Node): node is ts.VariableDeclarationList {
    return node.kind === SyntaxKind.VariableDeclarationList;
}

export function isFunctionDeclaration(node: Node): node is ts.FunctionDeclaration {
    return node.kind === SyntaxKind.FunctionDeclaration;
}

export function isClassDeclaration(node: Node): node is ts.ClassDeclaration {
    return node.kind === SyntaxKind.ClassDeclaration;
}

export function isInterfaceDeclaration(node: Node): node is ts.InterfaceDeclaration {
    return node.kind === SyntaxKind.InterfaceDeclaration;
}

export function isTypeAliasDeclaration(node: Node): node is ts.TypeAliasDeclaration {
    return node.kind === SyntaxKind.TypeAliasDeclaration;
}

export function isEnumDeclaration(node: Node): node is ts.EnumDeclaration {
    return node.kind === SyntaxKind.EnumDeclaration;
}

export function isModuleDeclaration(node: Node): node is ts.ModuleDeclaration {
    return node.kind === SyntaxKind.ModuleDeclaration;
}

export function isModuleBlock(node: Node): node is ts.ModuleBlock {
    return node.kind === SyntaxKind.ModuleBlock;
}

export function isCaseBlock(node: Node): node is ts.CaseBlock {
    return node.kind === SyntaxKind.CaseBlock;
}

export function isNamespaceExportDeclaration(node: Node): node is ts.NamespaceExportDeclaration {
    return node.kind === SyntaxKind.NamespaceExportDeclaration;
}

export function isImportEqualsDeclaration(node: Node): node is ts.ImportEqualsDeclaration {
    return node.kind === SyntaxKind.ImportEqualsDeclaration;
}

export function isImportDeclaration(node: Node): node is ts.ImportDeclaration {
    return node.kind === SyntaxKind.ImportDeclaration;
}

export function isImportClause(node: Node): node is ts.ImportClause {
    return node.kind === SyntaxKind.ImportClause;
}

export function isNamespaceImport(node: Node): node is ts.NamespaceImport {
    return node.kind === SyntaxKind.NamespaceImport;
}

export function isNamedImports(node: Node): node is ts.NamedImports {
    return node.kind === SyntaxKind.NamedImports;
}

export function isImportSpecifier(node: Node): node is ts.ImportSpecifier {
    return node.kind === SyntaxKind.ImportSpecifier;
}

export function isExportAssignment(node: Node): node is ts.ExportAssignment {
    return node.kind === SyntaxKind.ExportAssignment;
}

export function isExportDeclaration(node: Node): node is ts.ExportDeclaration {
    return node.kind === SyntaxKind.ExportDeclaration;
}

export function isNamedExports(node: Node): node is ts.NamedExports {
    return node.kind === SyntaxKind.NamedExports;
}

export function isExportSpecifier(node: Node): node is ts.ExportSpecifier {
    return node.kind === SyntaxKind.ExportSpecifier;
}

export function isMissingDeclaration(node: Node): node is ts.MissingDeclaration {
    return node.kind === SyntaxKind.MissingDeclaration;
}

// Module References

export function isExternalModuleReference(node: Node): node is ts.ExternalModuleReference {
    return node.kind === SyntaxKind.ExternalModuleReference;
}

// JSX

export function isJsxElement(node: Node): node is ts.JsxElement {
    return node.kind === SyntaxKind.JsxElement;
}

export function isJsxSelfClosingElement(node: Node): node is ts.JsxSelfClosingElement {
    return node.kind === SyntaxKind.JsxSelfClosingElement;
}

export function isJsxOpeningElement(node: Node): node is ts.JsxOpeningElement {
    return node.kind === SyntaxKind.JsxOpeningElement;
}

export function isJsxClosingElement(node: Node): node is ts.JsxClosingElement {
    return node.kind === SyntaxKind.JsxClosingElement;
}

export function isJsxFragment(node: Node): node is ts.JsxFragment {
    return node.kind === SyntaxKind.JsxFragment;
}

export function isJsxOpeningFragment(node: Node): node is ts.JsxOpeningFragment {
    return node.kind === SyntaxKind.JsxOpeningFragment;
}

export function isJsxClosingFragment(node: Node): node is ts.JsxClosingFragment {
    return node.kind === SyntaxKind.JsxClosingFragment;
}

export function isJsxAttribute(node: Node): node is ts.JsxAttribute {
    return node.kind === SyntaxKind.JsxAttribute;
}

export function isJsxAttributes(node: Node): node is ts.JsxAttributes {
    return node.kind === SyntaxKind.JsxAttributes;
}

export function isJsxSpreadAttribute(node: Node): node is ts.JsxSpreadAttribute {
    return node.kind === SyntaxKind.JsxSpreadAttribute;
}

export function isJsxExpression(node: Node): node is ts.JsxExpression {
    return node.kind === SyntaxKind.JsxExpression;
}

// Clauses

export function isCaseClause(node: Node): node is ts.CaseClause {
    return node.kind === SyntaxKind.CaseClause;
}

export function isDefaultClause(node: Node): node is ts.DefaultClause {
    return node.kind === SyntaxKind.DefaultClause;
}

export function isHeritageClause(node: Node): node is ts.HeritageClause {
    return node.kind === SyntaxKind.HeritageClause;
}

export function isCatchClause(node: Node): node is ts.CatchClause {
    return node.kind === SyntaxKind.CatchClause;
}

// Property assignments

export function isPropertyAssignment(node: Node): node is ts.PropertyAssignment {
    return node.kind === SyntaxKind.PropertyAssignment;
}

export function isShorthandPropertyAssignment(node: Node): node is ts.ShorthandPropertyAssignment {
    return node.kind === SyntaxKind.ShorthandPropertyAssignment;
}

export function isSpreadAssignment(node: Node): node is ts.SpreadAssignment {
    return node.kind === SyntaxKind.SpreadAssignment;
}

// Enum

export function isEnumMember(node: Node): node is ts.EnumMember {
    return node.kind === SyntaxKind.EnumMember;
}

// Top-level nodes
export function isSourceFile(node: Node): node is ts.SourceFile {
    return node.kind === SyntaxKind.SourceFile;
}

export function isBundle(node: Node): node is ts.Bundle {
    return node.kind === SyntaxKind.Bundle;
}

export function isUnparsedSource(node: Node): node is ts.UnparsedSource {
    return node.kind === SyntaxKind.UnparsedSource;
}

// JSDoc

export function isJSDocTypeExpression(node: Node): node is ts.JSDocTypeExpression {
    return node.kind === SyntaxKind.JSDocTypeExpression;
}

export function isJSDocAllType(node: ts.JSDocAllType): node is ts.JSDocAllType {
    return node.kind === SyntaxKind.JSDocAllType;
}

export function isJSDocUnknownType(node: Node): node is ts.JSDocUnknownType {
    return node.kind === SyntaxKind.JSDocUnknownType;
}

export function isJSDocNullableType(node: Node): node is ts.JSDocNullableType {
    return node.kind === SyntaxKind.JSDocNullableType;
}

export function isJSDocNonNullableType(node: Node): node is ts.JSDocNonNullableType {
    return node.kind === SyntaxKind.JSDocNonNullableType;
}

export function isJSDocOptionalType(node: Node): node is ts.JSDocOptionalType {
    return node.kind === SyntaxKind.JSDocOptionalType;
}

export function isJSDocFunctionType(node: Node): node is ts.JSDocFunctionType {
    return node.kind === SyntaxKind.JSDocFunctionType;
}

export function isJSDocVariadicType(node: Node): node is ts.JSDocVariadicType {
    return node.kind === SyntaxKind.JSDocVariadicType;
}

export function isJSDoc(node: Node): node is ts.JSDoc {
    return node.kind === SyntaxKind.JSDocComment;
}

export function isJSDocAugmentsTag(node: Node): node is ts.JSDocAugmentsTag {
    return node.kind === SyntaxKind.JSDocAugmentsTag;
}

export function isJSDocClassTag(node: Node): node is ts.JSDocClassTag {
    return node.kind === SyntaxKind.JSDocClassTag;
}

export function isJSDocEnumTag(node: Node): node is ts.JSDocEnumTag {
    return node.kind === SyntaxKind.JSDocEnumTag;
}

export function isJSDocThisTag(node: Node): node is ts.JSDocThisTag {
    return node.kind === SyntaxKind.JSDocThisTag;
}

export function isJSDocParameterTag(node: Node): node is ts.JSDocParameterTag {
    return node.kind === SyntaxKind.JSDocParameterTag;
}

export function isJSDocReturnTag(node: Node): node is ts.JSDocReturnTag {
    return node.kind === SyntaxKind.JSDocReturnTag;
}

export function isJSDocTypeTag(node: Node): node is ts.JSDocTypeTag {
    return node.kind === SyntaxKind.JSDocTypeTag;
}

export function isJSDocTemplateTag(node: Node): node is ts.JSDocTemplateTag {
    return node.kind === SyntaxKind.JSDocTemplateTag;
}

export function isJSDocTypedefTag(node: Node): node is ts.JSDocTypedefTag {
    return node.kind === SyntaxKind.JSDocTypedefTag;
}

export function isJSDocPropertyTag(node: Node): node is ts.JSDocPropertyTag {
    return node.kind === SyntaxKind.JSDocPropertyTag;
}

export function isJSDocPropertyLikeTag(node: Node): node is ts.JSDocPropertyLikeTag {
    return node.kind === SyntaxKind.JSDocPropertyTag || node.kind === SyntaxKind.JSDocParameterTag;
}

export function isJSDocTypeLiteral(node: Node): node is ts.JSDocTypeLiteral {
    return node.kind === SyntaxKind.JSDocTypeLiteral;
}

export function isJSDocCallbackTag(node: Node): node is ts.JSDocCallbackTag {
    return node.kind === SyntaxKind.JSDocCallbackTag;
}

export function isJSDocSignature(node: Node): node is ts.JSDocSignature {
    return node.kind === SyntaxKind.JSDocSignature;
}


const shouldAddDollerParentList = new Set([
    ts.SyntaxKind.VariableDeclaration,
    ts.SyntaxKind.TemplateSpan,
    ts.SyntaxKind.ElementAccessExpression,
    ts.SyntaxKind.Parameter,
    ts.SyntaxKind.BinaryExpression,
    ts.SyntaxKind.IfStatement
]);
/**
 * 判断输出 identier 时，是否需要加 $ 符号
 * @param node 节点
 */
export function shouldAddDollar(node: Node): boolean {
    // 可以直接通过父元素判断
    if (shouldAddDollerParentList.has(node.parent.kind)) {
        return true;
    }
    
    // PropertyAccessExpression
    if (node.parent.kind === ts.SyntaxKind.PropertyAccessExpression
        && (<ts.PropertyAccessExpression>node.parent).expression === node) {
        return true;
    }

    return false;
}

export function shouldAddDoubleQuote(node: Node): boolean {
    if (node.parent.kind === ts.SyntaxKind.PropertyAssignment
        && (<ts.PropertyAssignment>node.parent).name === node) {
        return true;
    }
    
    return false;
}


const baseArrayBrackets = ["array(", ")"];
const newLineArrayBrackets = ["array(", ")"];
const arrayBracketsMap = {
    [ts.ListFormat.ObjectLiteralExpressionProperties]: baseArrayBrackets,
    [ts.ListFormat.ObjectLiteralExpressionProperties | ts.ListFormat.PreferNewLine]: newLineArrayBrackets
};
/**
 * 判断是否需要转换成 array()
 * @param format list format
 */
export function shouldUseArray(format: ts.ListFormat) {
    return arrayBracketsMap[format] || '';
}

const stringLikeType = new Set([
    ts.TypeFlags.String,
    ts.TypeFlags.StringLiteral
]);
/**
 * 判断是否是 string，用于将 + 改写成 .
 * @param node node
 */
export function isStringLike(node: ts.Node, typeChecker: ts.TypeChecker) {
    if (!node) {
        return false;
    }
    const nodeType = typeChecker.getTypeAtLocation(node);
    return stringLikeType.has(nodeType.getFlags());
}
