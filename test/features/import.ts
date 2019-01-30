
import Utils from '@baidu/atom-wise-utils';
import {makeTcLink} from '@baidu/atom-wise-utils';
const tplData: {src?: string, title?: string} = {};
tplData.src = makeTcLink('url');
tplData.title = Utils.highlight('title');
