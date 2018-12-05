import {makeTcLink} from './atomWiseUtils';
import {tplData} from './tplData';

const b = '123';

const c = `0${b}45'6'"789"`;

tplData.src = makeTcLink(tplData.src);
