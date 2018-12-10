import * as ts from 'typescript';
import {
    Node
} from 'typescript';

/**
 * Gets a custom text range to use when emitting comments.
 */
export function getStartsOnNewLine(node: Node) {
    const emitNode = node.emitNode;
    return emitNode && emitNode.startsOnNewLine;
}