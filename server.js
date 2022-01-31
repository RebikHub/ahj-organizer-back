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

let list = fs.readdirSync(uploads);

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
  console.log(uploads);
  console.log(ctx.response);
  console.log(ctx.request);
    ctx.status = 200;
});

router.post('/download', async (ctx) => {
  const name = ctx.request.body;
  list = fs.readdirSync(uploads);
  list.forEach((elem) => {
    console.log(elem === name);
    if (elem === name) {
      ctx.response.body = JSON.stringify(elem);
      // console.log(elem, list[i]);
    }
  });
  ctx.status = 200;
});

router.post('/messages', async (ctx) => {
  const message = JSON.parse(ctx.request.body);
  store.push(message);
  ctx.status = 200;
})

router.post('/uploads', async (ctx) => {
  // const { file } = ctx.request.files;
  const resp = JSON.parse(ctx.request.body);
  store.push(resp);
  console.log(store);
  // const link = await new Promise((resolve, reject) => {
  //   const oldPath = file.path;
  //   const filename = file.name;
  //   console.log(filename);
  //   const newPath = path.join(uploads, filename);

  //   const callback = (error) => reject(error);

  //   const readStream = fs.createReadStream(oldPath);
  //   const writeStream = fs.createWriteStream(newPath);

  //   readStream.on('error', callback);
  //   writeStream.on('error', callback);

  //   readStream.on('close', () => {
  //     console.log('close');
  //     fs.unlink(oldPath, callback);
  //     resolve(filename);
  //   });

  //   readStream.pipe(writeStream);
  // });

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