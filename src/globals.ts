import {Ts2phpOptions, ErrorInfo} from './types';

export let options: Ts2phpOptions = {
    modules: {
    }
}

export let errors: ErrorInfo[] = [];

export function clear() {
    options = {
        modules: {
        }
    };

    errors = [];
}