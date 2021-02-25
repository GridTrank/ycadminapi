
const pool = require('../pool.js')
const router  = require("./index");


router.get('/getRole',(req,res)=>{
    var sql='select * from sys_admin_role'
    pool.query(sql,(request,response)=>{
        let result={
            ...res.data,
            roleList:response
        }
        res.send(result)
    })
})

router.post('/addRole',(req,res)=>{
    console.log(req.body)
    var sql=`insert into sys_admin_role (role_level,role_name,user_name) VALUES
     ('${req.body.level}','${req.body.roleName}','${req.body.userName}')`;
    pool.query(sql,(request,response)=>{
        res.send(response)
    })

})



module.exports=router





