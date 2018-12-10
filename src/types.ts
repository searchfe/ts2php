export interface Ts2phpOptions {
    modules: {
        [moduleName: string]: {
            path: string;
            className: string;
        }
    }
}

export interface ErrorInfo {
    code: number;
    msg: string;
}