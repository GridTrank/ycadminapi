const express=require('express')
const jwt = require("jsonwebtoken");
const app =express();
app.use(express.static('public'))

let allowORigin=[
    "http://47.112.113.38",
    "http://localhost:8080",
]
app.all('*', function(req, res, next) {
    if (allowORigin.indexOf(req.headers.origin) >= 0){
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST'); 
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization'); 
        res.header("content-Type", "application/json;charset=utf-8");
        res.header("Access-control-Allow-Credentials","true");
    }
    next();
})
// 针对rep或者res做一些操作
app.use('/',(req,res,next)=>{
    next()
})

// 管理后台api
app.use('/role', require('./routers/admin/role'));
app.use('/menu', require('./routers/admin/menu'));
app.use('/product', require('./routers/admin/product'));
app.use('/order', require('./routers/admin/order'));
app.use('/user', require('./routers/admin/user'));
app.use('/upload', require('./routers/admin/upload'));
app.use('/store', require('./routers/admin/store'));


app.listen(3000,()=>{
    console.log('服务器开启')
})






