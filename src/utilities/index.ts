export function isRelativePath(path: string) {
    return /^\./.test(path);
}