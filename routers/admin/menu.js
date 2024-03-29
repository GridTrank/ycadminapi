const pool = require('../../pool.js')
const router  = require("../index");


router.get('/getMenu',(req,res)=>{
    let role=req.query.role
    var key=''
    if(role){
        switch(Number(role) ){
            case 1:
                key='is_super_root'
                break;
            case 2:
                key='is_shop'
                break;
            case 3:
                key='is_store'
                break;
            default :
                res.send({
                    code:100003,
                    message:'没有权限'
                })
                return
        }
    }else{
        res.send({
            code:100003,
            message:'没有权限'
        })
        return
    }
    var sql=`select * from sys_admin_menu where ${key} =1 `
    pool.query(sql,(request,response)=>{
        let result={
            code:200,
            message:'success',
            menuList:response
        }
        res.send(result)
    })
})



module.exports=router