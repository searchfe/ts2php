

import {Other_Utils as Util} from '../some-utils';
import {Some_Utils, func} from '../some-utils';

import {SomeType, SomeAlias} from '../some-types';

type TplData = {
    src?: string,
    title?: string
};

const tplData: TplData = {};
tplData.src = Some_Utils.makeTcLink('url');
tplData.title = Some_Utils.highlight('title');
tplData.title = Util.sample;

tplData.title = func() + 'aa';

const a = {
    test: 'hello'
} as SomeType;
