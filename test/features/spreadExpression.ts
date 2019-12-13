function aaa(...aaa: number[]) {
    return Math.max(...aaa);
}
const arr = [6,3,9];
aaa(10, ...arr, 101);
Math.max(10, ...arr, 100);