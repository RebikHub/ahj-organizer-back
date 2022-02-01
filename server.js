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
const https = require('https');

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

router.get('/store', async (ctx) => {
  // const method = ctx.request.query.method;
  // console.log(method);
  // if (method === 'imgList') {
  //     list = fs.readdirSync(uploads);
  //     ctx.response.body = JSON.stringify(list);
  //     return;
  // }
  ctx.response.body = JSON.stringify(store);
  ctx.status = 200;
});

router.post('/download', async (ctx) => {
  const name = ctx.request.body;
  list = fs.readdirSync(uploads);
  list.forEach((elem) => {
    console.log(elem === name);
    if (elem === name) {
      fs.readFile(`./uploads/${name}`, (err, content) => {
        if(err){
          res.statusCode = 500;
          res.end("Server error");
      }else{
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.end(content);
      }
      })
      // ctx.response.body = `http://loacalhost:3333/uploads/${name}`;
  //       const dFile = fs.createWriteStream(`${name}`);
  // const request = http.get(`http://loacalhost:3333/uploads/${name}`, (response) => {
  // response.pipe(dFile);
// });
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
  // const resp = JSON.parse(ctx.request.body);
  // store.push(resp);
  // console.log(store);


  const { file } = ctx.request.files;
  let name = null;
  const link = await new Promise((resolve, reject) => {
    const oldPath = file.path;
    const filename = uuidv4();
    name = filename;
    console.log(filename);
    const newPath = path.join(uploads, filename);

    const callback = (error) => reject(error);

    const readStream = fs.createReadStream(oldPath);
    const writeStream = fs.createWriteStream(newPath);

    readStream.on('error', callback);
    writeStream.on('error', callback);

    readStream.on('close', () => {
      console.log('close');
      fs.unlink(oldPath, callback);
      resolve(filename);
    });

    readStream.pipe(writeStream);
  });

  list = fs.readdirSync(uploads);
  ctx.response.body = name;
  ctx.response.status = 200;
});

// router.post('/uploads', async ctx => {
//   const { file } = ctx.request.files;

//   if (ctx.request.files.file) {
//       const filename = uuidv4();
//       const link = await new Promise((resolve) => {
//         const oldPath = file.path;
//         const filename = uuidv4();
//         const newPath = path.join(uploads, filename);
//         const readStream = fs.createReadStream(oldPath);
//         const writeStream = fs.createWriteStream(newPath);
//         readStream.on('close', () => {
//           fs.unlink(oldPath, (err) => {
//               if (err) {
//                   console.log(err);
//               }
//           });
//           resolve(filename);
//         });
//         readStream.pipe(writeStream);
//       });
//   } else {
//       const url = ctx.request.body.url;
//       const filename = uuidv4();
//       console.log('http');
//       https.get(url, (res) => {
//           const path = `${__dirname}/uploads/${filename}`; 
//           const filePath = fs.createWriteStream(path);
//           res.pipe(filePath);
//           filePath.on('finish',() => {
//               filePath.close();
//               console.log('Download Completed'); 
//           })
//       })
//   }

//   list = fs.readdirSync(uploads);
//   ctx.response.status = 200;
// })

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