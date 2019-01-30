/**
 * @file state
 * @author cxtom(cxtom2008@gmail.com)
 */

import {ErrorInfo} from './types';

let globalState;

export function setState(state) {
    globalState = state;
}

export function error(error: ErrorInfo) {
    globalState.errors.push(error);
}
