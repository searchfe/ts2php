/**
 * @file state
 * @author cxtom(cxtom2008@gmail.com)
 */

import {DiagnosticWithLocation} from 'byots';
import {CompilerState} from './types';

let globalState: CompilerState;

export function setState(state) {
    globalState = state;
}

export function error(error: DiagnosticWithLocation) {
    globalState.errors.push(error);
}
