import {ts2php} from '../src/index';
import * as path from 'path';

ts2php(path.resolve(__dirname, '../sample/index.ts'), {
    modules: {
        './atomWiseUtils': {
            path: './path/to/utils.php',
            className: 'Atom_Wise_Utils'
        },
        './tplData': {
            path: '',
            className: ''
        }
    }
});