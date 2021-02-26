const pool = require('../pool.js')
const express=require('express')
const bodyParser=require('body-parser')
const router = express.Router();
const sd = require('silly-datetime');

router.use(bodyParser.urlencoded({extended:true}))

router.post('/getList',(req,res)=>{
    var body=req.body
    var sql='select * from sys_admin_product'
    var queryData=Object.keys(req.body) 
    if(queryData.length>0){
        sql+=' where '
        queryData.forEach((el,ei,arr)=>{
            if(ei<arr.length-1){
                sql += ` ${el} ${body[el][0]} ${body[el][1]} and `
            }else{
                sql += ` ${el} ${body[el][0]} ${body[el][1]}  ` 
            }
        })
    }
    pool.query(sql,[body.product_code,body.product_name],(err,response)=>{
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
                productList:response,
                count:response.length
            }
        }
        res.send(result)
    })
})

module.exports=router