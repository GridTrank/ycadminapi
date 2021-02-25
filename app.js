const express=require('express')
const bodyParser=require('body-parser')
const path=require('path')
const app =express();


app.use(express.static('public'))
app.use(express.static('uploads'))

app.all('*', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization'); 
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    next();
})


// 中间件，处理请求中公用的方法
// 针对rep或者res做一些操作
app.use('/',(req,res,next)=>{
    next()
})
app.use('/role', require('./routers/role'));
app.use('/menu', require('./routers/menu'));
app.use('/product', require('./routers/product'));
app.use('/order', require('./routers/order'));

app.get("/login",(req,res)=>{
    // 获取请求路径，并返回对象格式
    // http://localhost:3000/login?name=111
    //添加true，返回对象
    // console.log(data.query) //{name:111}
    console.log(req.reqData)
    res.send('首页') // 111
})

//设置响应json
app.get('/food',(req,res)=>{
    console.log(req.query.id)
    connection.query('select * from sys_admin_role where roleId = ? ',[req.query.id],(req,resData)=>{
        console.log(resData[0].menuId)
        res.json(resData)
    })
    // let obj={
    //     name:'大盘鸡',
    //     price:100
    // }
    // res.json(obj)
})

// 带有参数的get接口
app.get('/getname',(req,res)=>{
    //接收前端传递过来的参数  req.query
    // http://localhost:3000/getname?name=ms
    let obj={
        'gl':'盖伦',
        'ms':'盲僧',
        'zx':'赵信',
    }
    console.log(req.query)
    if(obj[req.query.name]){
        res.send(obj[req.query.name])
    }else{
        res.send('不存在该英雄')
    }
})



// post传参 需要使用第三方模块

app.use(bodyParser.urlencoded({extended:false}))
app.post('/login',(req,res)=>{
    // 接收传递的用户名和密码
    console.log(req.body.name,req.body.password)
    res.send(req.body)
})

// 注册，传递文件参数
// 传递文件需要用到第三方模块，multer
const multer =require('multer')
const upload = multer({ 
    dest:"uploads"
})


// 上传一张图
app.post('/register', upload.single('usericon'), function (req, res, next) {
    // req.file is the `usericon` file
    // req.body will hold the text fields, if there were any
    // 接收传递的用户名和密码和头像
    // 传递的文件要用res.file接收
    let obj={
        name:req.body.name,
        password:req.body.password,
        usericon:req.file,
    }

    console.log(obj)
    console.log(req.file)
    res.send(obj)
})

// 上传多张
app.post('/upload', upload.array('usericon',4), function (req, res, next) {
    // req.file is the `usericon` file
    // req.body will hold the text fields, if there were any
    // 接收传递的用户名和密码和头像
    // 传递的文件要用res.file接收
    let obj={
        name:req.body.name,
        password:req.body.password,
        usericon:req.files,
    }

    console.log(obj)
    console.log(req.files)
    res.send(obj)
})



// 重定向
// app.use((req,res)=>{
//     res.writeHead('302',{
//         Location:'http://127.0.0.1:3000/index.html'
//     });
//     res.end()
// })



app.listen(3000,()=>{
    console.log('服务器开启')
})






