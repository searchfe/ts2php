

export class Some_Utils {
    static makeTcLink(s: string): string;
    static highlight(s: string): string;
}

export class Other_Utils {
    static sample: string;
    hello(): string;
}

export function func(): string;

export class Base {
    base: string;
    constructor(options: {title: string});
    dispose(): void;
}