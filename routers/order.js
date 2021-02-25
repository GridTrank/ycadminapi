const pool = require('../pool.js')
const router  = require("./index");


router.post('/getOrderList',async (req,res)=>{
    let productList=await getPro()
    let orderList=await getOrder()
    orderList.forEach(item=>{
        productList.forEach(ele=>{
            if(item.pid==ele.pid){
                item.productInfo=ele
            }
        })
    })
    res.send({
        code:200,
        message:'success',
        res:orderList
    })
}) 
function getPro(){
    return new Promise((resolve,reject)=>{
        var psql=`select * from sys_admin_product`
        pool.query(psql,(request,res)=>{
            resolve(res)
        })
    })
}
function getOrder(){
    return new Promise((resolve,reject)=>{
        var psql=`select * from sys_admin_order`
        pool.query(psql,(request,res)=>{
            resolve(res)
        })
    })
}

module.exports=router