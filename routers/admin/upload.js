const pool = require('../../pool.js')
const router  = require("../index");
const multer =require('multer')
const fs = require("fs");
const path = require("path");
const upload = multer({ 
    dest:"public/uploads"
})

let imgs=[]
router.post('/productImg',upload.array('imgSrc',5),(req,res)=>{
    var proObj={
        img_type:req.body.img_type,
        img_src:''
    }
    req.files.forEach(file=>{
        var extname = path.extname(req.files[0].originalname);  
        proObj.img_src='uploads/'+new Date()*1+extname
        fs.rename(file.path,file.destination+'/'+new Date()*1+extname,function(err){   
            if(err){
                res.send("重命名错误");
            }else{
                res.send("文件上传成功");
            }
        })
        imgs.push(proObj)
    })
    console.log(imgs)
    // var sql='insert into sys_admin_product set ? '
    // pool.query(sql,[proObj],(err,response)=>{
    //     if(err)throw err
    //     res.send(response)
    // })
})





module.exports=router