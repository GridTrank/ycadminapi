const pool = require('../../pool.js')
const express=require('express')
const router = express.Router();
const sd = require('silly-datetime');
const bodyParser=require('body-parser')
const jwt = require("jsonwebtoken");
const md5 =require('md5')
router.use(bodyParser.urlencoded({extended:true}))

// 获取所有店铺
router.post('/storeList',async (req,res)=>{
    var body=req.body
    var page=body.page || 1
    var row=body.row || 20
    var sql=''
    sql='select * from sys_admin_store'
    var queryData=[]
    for (var key in body){
        if( key!='page' && key!='row' ){
            queryData.push(key)
        }
    }
    if(queryData.length>0){
        sql+=' where '
        queryData.forEach((el,ei,arr)=>{
            if(ei<arr.length-1){
                if(body[el][0]=='between'){
                    let time=sd.format(new Date().getTime(),'YYYY-MM-DD HH:mm:ss' ) 
                    sql+=` ${el} ${body[el][0]} '${body[el][1][0]? body[el][1][0]: '2020-01-01 00:00:00' }' and '${body[el][1][1]? body[el][1][1]: time }' and `
                }else{
                    sql += ` ${el} ${body[el][0]} ${body[el][1]} and `
                }
            }else{
                if(body[el][0]=='between' ){
                    let time=sd.format(new Date().getTime(),'YYYY-MM-DD HH:mm:ss' ) 
                    sql+=` ${el} ${body[el][0]} '${body[el][1][0]? body[el][1][0]: '2020-01-01 00:00:00' }' and '${body[el][1][1]? body[el][1][1]: time }' `
                }else{
                    sql += ` ${el} ${body[el][0]} ${body[el][1]}  ` 
                }
            }
        })
    }
    var count=await getCount(sql)
    sql+=` LIMIT ${(page-1)*row},${row} `
    pool.query(sql,[body],(err,response)=>{
        if(err)throw err
        if(response && response.length>0){
            response.forEach(item => {
                let time=new Date(item.create_time).getTime()
                item.create_time=sd.format(time, 'YYYY-MM-DD HH:mm:ss') 
            });
        }
        let result={
            code:200,
            message:'succcess',
            result:{
                storeList:response,
                count:count
            }
        }
        res.send(result)
    })
})

// 登录
router.post('/login',async (req,res)=>{
    let token=jwt.sign(req.body.user_name,'ADMIN')
    let userInfo=await getUserInfo(req)
    if(userInfo && userInfo.length>0){
        let menu=await getMenu(userInfo[0].level_name)
        res.send({
            code:200,
            message:'success',
            result:{
                token:token,
                userInfo:userInfo[0],
                menuList:menu
            }
        })
    }else{
        res.send({
            code:100004,
            message:"用户名或密码错误"
        })
    }
})

// 添加店铺
router.post('/addStore',(req,res)=>{
    var shareKey='SK-'+randomString(8) 
    req.body.post_share_key=shareKey
    req.body.level_name=req.body.role_level==1 ? 'is_super_root':req.body.role_level==2 ? 'is_store' : 'is_store'
    req.body.create_time=sd.format(new Date().getTime(),'YYYY-MM-DD HH:mm:ss' ) 

    var sql='insert into sys_admin_store set ?'
    pool.query(sql,[req.body],(err,result)=>{
        if (err) throw err
        res.send({
            code:200,
            message:'success'
        })
    })
})
// 修改店铺
router.post('/updateStore',(req,res)=>{
    // var shareKey='SK-'+randomString(8) 
    // req.body.post_share_key=shareKey
    req.body.level_name=req.body.role_level==1 ? 'is_super_root':req.body.role_level==2 ? 'is_store' : 'is_store'
    var sql='update sys_admin_store set ? where store_id= ? '
    pool.query(sql,[req.body,req.body.store_id],(err,result)=>{
        if (err) throw err
        res.send({
            code:200,
            message:'success'
        })
    })
})

// 删除店铺
router.post('/delStore',(req,res)=>{
    var sql=`delete from sys_admin_store where store_id in (${req.body.store_id})`
    pool.query(sql,(err,response)=>{
        if(err)throw err
        if(response.affectedRows>0){
            res.send({
                code:200,
                message:'删除成功',
            })
        }else{
            res.send({
                message:'删除失败',
            }) 
        }
    })
})

function getCount(sql){
    return new Promise((res,rej)=>{
        pool.query(sql,(err,result)=>{
            if(err){
                throw err
            }else{
               res(result.length)
            }
        })
    })
}

function randomString(len) {
 　　len = len || 32;
 　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
 　　var maxPos = $chars.length;
 　　var pwd = '';
 　　for (i = 0; i < len; i++) {
 　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
 　　}
 　　return pwd;
 }
 
function getMenu(name){
    return new Promise((resolve,reject)=>{
        var sql =`select * from sys_admin_menu where ${name} = 1`
        pool.query(sql,(err,res)=>{
            if(err)throw err;
            resolve(res)
        })
    })
}

function getUserInfo(req){
    return new Promise((resolve,reject)=>{
        let user_name=req.body.user_name
        let pass_word=req.body.pass_word
        var sql=`select * from sys_admin_store where user_name=? and pass_word=?`
        pool.query(sql,[user_name,pass_word],(err,response)=>{
            if(err)throw err
            resolve(response)
        })
    })
}


module.exports=router