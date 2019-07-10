
try {
    throw 'error!';
}
catch (e) {
    console.log('error' + e.message);
}

const a = 'hard';

throw `a ${a} error!`

throw a + '!';
