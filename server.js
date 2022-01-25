const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const Router = require('koa-router');
const router = new Router();
const app = new Koa();
const store = require('./storage');

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
    allowMethods: ['GET']
}));

router.get('/', async (ctx) => {
  console.log(ctx.response);
  console.log(ctx.request);
    ctx.status = 200;
});

router.post('/', async (ctx) => {
  // console.log('response:', ctx.response);
  console.log('request:', ctx.request.body);
  console.log(store);
  store.push(ctx.request.body)
  ctx.status = 200;
});

console.log(store);

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3333;
app.listen(port, () => console.log('Server started'));