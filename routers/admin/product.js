const pool = require('../../pool.js')
const express=require('express')
const bodyParser=require('body-parser')
const router = express.Router();
const sd = require('silly-datetime');
const multer =require('multer')
const fs = require("fs");
const path = require("path");
const upload = multer({ 
    dest:"public/uploads"
})

router.use(bodyParser.urlencoded({extended:true}))

//获取商品
let storeId
router.post('/getList',async (req,res)=>{
    var body=req.body
    storeId=Number(req.body.store_id) 
    var page=body.page || 1
    var row=body.row || 20
    var sql=''
    if(storeId===1){
        sql='select * from sys_admin_product '
    }else{
        sql=`select * from sys_admin_product where store_id=${storeId} `
    }
    var queryData=[]
    
    for (var key in body){
        if(key!='store_id' && key!='page' && key!='row' ){
            queryData.push(key)
        }
    }
    if(queryData.length>0){
        if(storeId===1){
            sql+='where'
        }else{
            sql+=' and '
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
    sql+=` LIMIT ${(page-1)*row},${row} `
    console.log(sql)
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
                productList:response,
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


// 添加商品主图
router.post('/productBanner',upload.array('imgSrc',5),(req,res)=>{
    var proObj={
        img_type:req.body.img_type,
        img_src:'',
        url:''
    }
    req.files.forEach((file,index)=>{
        var extname = path.extname(req.files[0].originalname);  
        proObj.img_src= new Date()*(index+1)+extname
        proObj.url='http://120.77.246.130:3000/uploads/'+ new Date()*(index+1)+extname
        fs.rename(file.path,file.destination+'/'+new Date()*(index+1)+extname,function(err){   
            if(err){
                res.send("重命名错误");
            }else{
                res.send(proObj);
            }
        })
    })
})

// 添加商品详情图
router.post('/detailImg',upload.array('imgSrc',6),(req,res)=>{
    var proObj={
        img_type:req.body.img_type,
        img_src:'',
        url:''
    }
    req.files.forEach((file,index)=>{
        var extname = path.extname(req.files[0].originalname);  
        proObj.img_src= new Date()*(index+1)+extname
        proObj.url='http://120.77.246.130:3000/uploads/'+ new Date()*(index+1)+extname
        fs.rename(file.path,file.destination+'/'+new Date()*(index+1)+extname,function(err){   
            if(err){
                res.send("重命名错误");
            }else{
                res.send(proObj);
            }
        })
    })
})

// 添加商品
router.post('/addProduct',(req,res)=>{
    req.body.product_code='YC'+ new Date()*1
    req.body.create_time=sd.format(new Date().getTime(),'YYYY-MM-DD HH:mm:ss' ) 
    var sql='insert into sys_admin_product set ? '
    pool.query(sql,[req.body],(err,response)=>{
        if(err)throw err
        if(response.affectedRows>0){
            res.send({
                code:200,
                message:'添加成功',
            })
        }else{
            res.send({
                // code:200,
                message:'添加失败',
            }) 
        }
    })
})

// 修改商品
router.post('/editProduct',(req,res)=>{
    var sql='update sys_admin_product set ? where pid=? '
    pool.query(sql,[req.body,req.body.pid],(err,response)=>{
        if(err)throw err
        if(response.affectedRows>0){
            res.send({
                code:200,
                message:'修改成功',
            })
        }else{
            res.send({
                message:'删除失败',
            }) 
        }
    })
})

// 删除商品
router.post('/delProduct',(req,res)=>{
    var sql=`delete from sys_admin_product where pid in (${req.body.pid})`
    console.log(sql)
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

// 查询商品
router.post('/detail',(req,res)=>{
    var sql=`select * from sys_admin_product where pid = (${req.body.pid})`
    pool.query(sql,(err,response)=>{
        if(err)throw err
        let data=response[0]
        for (var key in data){
            if(!data[key]){
                delete data[key]
            }
        }
        if(data.banners){
            data.banners=data.banners.split(',')
            data.banners.forEach((el,i,arr)=>{
                arr[i]='http://120.77.246.130:3000/uploads/'+ el
            })
        }
        if(data.detail_imgs){
            data.detail_imgs=data.detail_imgs.split(',')
            data.detail_imgs.forEach((el,i,arr)=>{
                arr[i]='http://120.77.246.130:3000/uploads/'+ el
            })
        }

        data.create_time=sd.format(new Date(data.create_time).getTime(),'YYYY-MM-DD HH:mm:ss' ) 
        res.send({
            code:200,
            message:'success',
            result:data
        })
        
    })
})

// 首页商品图片
router.post('/productIndex',upload.array('imgSrc',2),(req,res)=>{
    var proObj={
        img_src:'',
        url:''
    }
    req.files.forEach((file,index)=>{
        var extname = path.extname(req.files[0].originalname);  
        proObj.img_src= new Date()*(index+1)+extname
        proObj.url='http://120.77.246.130:3000/uploads/'+ new Date()*(index+1)+extname
        fs.rename(file.path,file.destination+'/'+new Date()*(index+1)+extname,function(err){   
            if(err){
                res.send("重命名错误");
            }else{
                res.send(proObj);
            }
        })
    })
})
// 添加首页商品
router.post('/addIndex',(req,res)=>{
    let data =req.body.data
    var updatesql=`update sys_admin_homeconfig set ? where hid = ?`
    var addsql=`insert into sys_admin_homeconfig set ?`
    data.forEach(item=>{
        if(!item.hid){
            pool.query(addsql,[item],(err,result)=>{
                if(err) throw err
            })
        }else{
            pool.query(updatesql,[item,item.hid],(err,result)=>{
                if(err) throw err
                
            })
        }
    })
    res.send({
        code:200
    })

})
// 获取首页商品展示
router.post('/index',(req,res)=>{
    var sql='select * from sys_admin_homeconfig'
    pool.query(sql,(err,result)=>{
        if(err) throw err
        res.send({
            code:200,
            result:result
        })
    })
})

// 删除首页配置
router.post('/delIndex',(req,res)=>{
    var sql=`delete from sys_admin_homeconfig where hid = ${req.body.pid}`
    pool.query(sql,(err,result)=>{
        if(err)throw err
        if(result.affectedRows>0){
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


module.exports=router