import {makeTcLink, tplData} from './atomWiseUtils';

const b = '123';

const c = `0${b}45'6'"789"`;

tplData.src = makeTcLink(tplData.src);
