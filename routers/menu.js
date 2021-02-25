
const pool = require('../pool.js')
const router  = require("./index");



router.get('/getMenu',(req,res)=>{
    let role=req.query.role
    var key=''
    if(role){
        switch(Number(role) ){
            case 1:
                key='is_super_root'
                break;
            case 2:
                key='is_store_manage'
                break;
            case 3:
                key='is_kefu'
                break;
        }
    }else{
        res.send({
            code:403,
            message:'没有权限'
        })
        return
    }
    var sql=`select * from sys_admin_menu where ${key} =1`
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