const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const cors = require('koa2-cors');
const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = new Router();
const app = new Koa();
const store = require('./storage');
const uploads = path.join(__dirname, '/uploads');

app.use(koaStatic(uploads));

app.use(koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
}));

app.use(cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'DELETE']
}));

router.get('/', async (ctx) => {
  // const method = ctx.request.query.method;
  // console.log(method);
  // if (method === 'imgList') {
  //     list = fs.readdirSync(uploads);
  //     ctx.response.body = JSON.stringify(list);
  //     return;
  // }
  console.log(ctx.response);
  console.log(ctx.request);
    ctx.status = 200;
});

router.post('/messages', async (ctx) => {
  // console.log('response:', ctx.response);
  console.log('request:', ctx.request.body);
  store.push(ctx.request.body);
  // console.log(store);
  ctx.status = 200;
})

router.post('/uploads', async (ctx) => {
  console.log(ctx.request);
  // const { file } = ctx.request.files;

  // if (ctx.request.files.file) {
  //     const filename = uuidv4();
  //     const link = await new Promise((resolve) => {
  //       const oldPath = file.path;
  //       const filename = uuidv4();
  //       const newPath = path.join(uploads, filename);
  //       const readStream = fs.createReadStream(oldPath);
  //       const writeStream = fs.createWriteStream(newPath);
  //       readStream.on('close', () => {
  //         fs.unlink(oldPath, (err) => {
  //             if (err) {
  //                 console.log(err);
  //             }
  //         });
  //         resolve(filename);
  //       });
  //       readStream.pipe(writeStream);
  //     });
  // } else {
  //     const url = ctx.request.body.url;
  //     const filename = uuidv4();
  //     https.get(url, (res) => {
  //         const path = `${__dirname}/uploads/${filename}`; 
  //         const filePath = fs.createWriteStream(path);
  //         res.pipe(filePath);
  //         filePath.on('finish',() => {
  //             filePath.close();
  //             console.log('Download Completed'); 
  //         })
  //     })
  // }

  // list = fs.readdirSync(uploads);
  ctx.response.status = 200;
});

router.delete('/', async ctx => {
      const name = ctx.request.query.id;
      fs.unlinkSync(`./uploads/${name}`);
      list = fs.readdirSync(uploads);
      ctx.response.status = 200;
      return
});

// console.log(store);

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3333;
app.listen(port, () => console.log('Server started'));