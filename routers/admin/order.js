const pool = require('../../pool.js')
const express=require('express')
const bodyParser=require('body-parser')
const router = express.Router();
const sd = require('silly-datetime');
router.use(bodyParser.urlencoded({extended:true}))
// 获取订单列表
let storeId
router.post('/getList',async (req,res)=>{
    var body=req.body
    storeId=Number(req.body.store_id) 
    var page=body.page || 1
    var row=body.row || 20
    var sql=''
    if(storeId===1){
        sql='select * from sys_admin_order '
    }else{
        sql=`select * from sys_admin_order where store_id=${storeId} `
    }
    var queryData=[]
    for (var key in body){
        if(key!='store_id' && key!='page' && key!='row' ){
            queryData.push(key)
        }
    }
    if(queryData.length>0){
        if(storeId===1){
            sql+='where '
        }else{
            sql+=' and'
        }
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

    sql+=`LIMIT ${(page-1)*row},${row} `
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
                orderList:response,
                count:count
            }
        }
        res.send(result)
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



module.exports=router