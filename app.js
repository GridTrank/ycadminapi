const express=require('express')
const jwt = require("jsonwebtoken");
const app =express();
app.use(express.static('public'))

app.all('*', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization'); 
    res.setHeader("Content-Type", "application/json;charset=utf-8");
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






