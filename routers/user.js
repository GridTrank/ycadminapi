const pool = require('../pool.js')
const router  = require("./index");


router.get('/getList',(req,res)=>{
    var sql='select * from sys_admin_users'
    pool.query(sql,(request,response)=>{
        let result={
            ...res.data,
            userList:response
        }
        res.send(result)
    })
})

module.exports=router