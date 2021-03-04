const pool = require('../../pool.js')

const express=require('express')
const router = express.Router();
const sd = require('silly-datetime');
const bodyParser=require('body-parser')
const jwt = require("jsonwebtoken");

router.use(bodyParser.urlencoded({extended:true}))
// 获取所有店铺
router.post('/storeList',(req,res)=>{
    var sql='select * from sys_admin_store'
    pool.query(sql,(err,response)=>{
        if(err)throw err
        res.send({
            code:200,
            message:'success',
            result:response
        })
    })
})

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
function getMenu(name){
    return new Promise((resolve,reject)=>{
        var sql =`select * from sys_admin_menu where ${name} = 1`
        pool.query(sql,(err,res)=>{
            if(err)throw err;
            resolve(res)
        })
    })
}

module.exports=router