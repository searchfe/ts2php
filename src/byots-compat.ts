import ts = require('byots');

const api = ts as any;
const factory = api.factory;

const factoryAliases = {
    createArrayLiteral: 'createArrayLiteralExpression',
    createBinary: 'createBinaryExpression',
    createBlock: 'createBlock',
    createCall: 'createCallExpression',
    createElementAccess: 'createElementAccessExpression',
    createExpressionStatement: 'createExpressionStatement',
    createFalse: 'createFalse',
    createIdentifier: 'createIdentifier',
    createNew: 'createNewExpression',
    createNodeArray: 'createNodeArray',
    createNull: 'createNull',
    createNumericLiteral: 'createNumericLiteral',
    createObjectLiteral: 'createObjectLiteralExpression',
    createPropertyAccess: 'createPropertyAccessExpression',
    createPropertyAssignment: 'createPropertyAssignment',
    createStringLiteral: 'createStringLiteral',
    createTrue: 'createTrue',
    createTempVariable: 'createTempVariable',
    createToken: 'createToken',
    createVariableDeclarationList: 'createVariableDeclarationList',
    createVariableStatement: 'createVariableStatement',
    createVoidZero: 'createVoidZero',
    updateCall: 'updateCallExpression',
    updateSourceFileNode: 'updateSourceFile',
    updateVariableDeclarationList: 'updateVariableDeclarationList',
    getGeneratedNameForNode: 'getGeneratedNameForNode',
    getMutableClone: 'cloneNode'
};

Object.keys(factoryAliases).forEach(name => {
    if (!api[name]) {
        api[name] = factory[factoryAliases[name]].bind(factory);
    }
});

if (!api.updateFunctionDeclaration) {
    api.updateFunctionDeclaration = (...args: any[]) => factory.updateFunctionDeclaration(
        args[0], args[2], args[3], args[4], args[5], args[6], args[7], args[8]
    );
}

if (!api.updateMethod) {
    api.updateMethod = (...args: any[]) => factory.updateMethodDeclaration(
        args[0], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]
    );
}

if (!api.createLiteral) {
    api.createLiteral = (value: string | number | boolean) => {
        if (typeof value === 'string') return factory.createStringLiteral(value);
        if (typeof value === 'number') return factory.createNumericLiteral(String(value));
        return value ? factory.createTrue() : factory.createFalse();
    };
}

if (!api.createConditional) {
    api.createConditional = (condition: any, whenTrue: any, whenFalse: any) => factory.createConditionalExpression(
        condition, undefined, whenTrue, undefined, whenFalse
    );
}

if (!api.createVariableDeclaration) {
    api.createVariableDeclaration = (name: any, type: any, initializer?: any) => {
        const declaration = factory.createVariableDeclaration(name, undefined, type, initializer);
        if (declaration.name) (declaration.name as any).parent = declaration;
        if (declaration.initializer) (declaration.initializer as any).parent = declaration;
        return declaration;
    };
}
