import * as ts from 'typescript';

let nextNodeId = 1;

export function getNodeId(node: ts.Node): number {
    if (!node.id) {
        node.id = nextNodeId;
        nextNodeId++;
    }
    return node.id;
}