let b = 1;
for (let i = 0; i < 10; i++) {
    b += 10;
}

const a = [1, 2, 3];
for (const iterator of a) {
    console.log(iterator);
}

const d = {a: 1, b: 2};
for (const iterator in d) {
    if (d.hasOwnProperty(iterator)) {
        console.log(iterator);
    }
}