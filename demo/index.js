/**
 * @file demo
 * @author meixuguang
 */

const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const {ts2php} = require(path.resolve(__dirname, '../dist/index.js'));

const app = new Koa();
const router = new Router();

function writeFile(filename, content) {
    return new Promise((resolve, reject) => {
        const filePath = path.resolve(__dirname, './tmp/', filename + '.ts');
        fs.writeFile(filePath, content, {
            encoding: 'utf-8'
        }, err => {
            if (err) {
                reject();
            }
            else {
                resolve(filePath);
            }
        });
    });
}

router.post('/ts2php', async (ctx, next) => {
    if (!ctx.request.body.source) {
        ctx.body = JSON.stringify({
            status: 1,
            msg: '内容为空'
        });

        return;
    }

    const fileName = Math.random().toString(36).substr(2, 12);

    const filePath = await writeFile(fileName, ctx.request.body.source);

    const res = ts2php(filePath, {
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
    ctx.body = JSON.stringify(res);
    fs.unlink(filePath);
});

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(require('koa-static')(path.resolve(__dirname, './page')));

app.listen(8383);
