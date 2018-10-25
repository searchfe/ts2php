interface tcLink {
    type: string;
    tcUrl: string;
    sfUrl?: string;
    options?: string;
    log?: string;
}

declare namespace atomWiseUtils {
    function makeTcLink(url: string, options?: any): tcLink;
    let tplData: any;
}

export = atomWiseUtils;