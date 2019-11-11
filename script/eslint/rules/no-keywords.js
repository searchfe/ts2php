"use strict";
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const utils_1 = require("./utils");
module.exports = utils_1.createRule({
    name: "no-keywords",
    meta: {
        docs: {
            description: `disallows the use of certain TypeScript keywords as variable or parameter names`,
            category: "Stylistic Issues",
            recommended: "error",
        },
        messages: {
            noKeywordsError: `{{ name }} clashes with keyword/type`,
        },
        schema: [{
                properties: {
                    properties: { type: "boolean" },
                    keywords: { type: "boolean" },
                },
                type: "object",
            }],
        type: "suggestion",
    },
    defaultOptions: [],
    create(context) {
        const keywords = [
            "Undefined",
            "undefined",
            "Boolean",
            "boolean",
            "String",
            "string",
            "Number",
            "number",
            "any",
        ];
        const isKeyword = (name) => keywords.includes(name);
        const report = (node) => {
            context.report({ messageId: "noKeywordsError", data: { name: node.name }, node });
        };
        const checkProperties = (node) => {
            node.properties.forEach(property => {
                if (property &&
                    property.type === experimental_utils_1.AST_NODE_TYPES.Property &&
                    property.key.type === experimental_utils_1.AST_NODE_TYPES.Identifier &&
                    isKeyword(property.key.name)) {
                    report(property.key);
                }
            });
        };
        const checkElements = (node) => {
            node.elements.forEach(element => {
                if (element &&
                    element.type === experimental_utils_1.AST_NODE_TYPES.Identifier &&
                    isKeyword(element.name)) {
                    report(element);
                }
            });
        };
        const checkParams = (node) => {
            if (!node || !node.params || !node.params.length) {
                return;
            }
            node.params.forEach(param => {
                if (param &&
                    param.type === experimental_utils_1.AST_NODE_TYPES.Identifier &&
                    isKeyword(param.name)) {
                    report(param);
                }
            });
        };
        return {
            VariableDeclarator(node) {
                if (node.id.type === experimental_utils_1.AST_NODE_TYPES.ObjectPattern) {
                    checkProperties(node.id);
                }
                if (node.id.type === experimental_utils_1.AST_NODE_TYPES.ArrayPattern) {
                    checkElements(node.id);
                }
                if (node.id.type === experimental_utils_1.AST_NODE_TYPES.Identifier &&
                    isKeyword(node.id.name)) {
                    report(node.id);
                }
            },
            ArrowFunctionExpression: checkParams,
            FunctionDeclaration: checkParams,
            FunctionExpression: checkParams,
            TSMethodSignature: checkParams,
            TSFunctionType: checkParams,
        };
    },
});
