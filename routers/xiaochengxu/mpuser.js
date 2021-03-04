const pool = require('../../pool.js')
const router  = require("../index");
const jwt = require("jsonwebtoken");
const bodyParser=require('body-parser')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))



router.post("/get_openid", async (req, res) => {
    console.log(req.body)
    let code = req.body.code; //获取小程序传来的code
    // let encryptedData = params.encryptedData;//获取小程序传来的encryptedData
    // let iv = params.iv;//获取小程序传来的iv（ iv 是加密算法的初始向量）  uni.getUserInfo获取
    let appid = "wx8aaa7733adaf6b38"; //自己小程序后台管理的appid，可登录小程序后台查看
    let secret = "c1c9ba1c953c95001b355efa7cd52210"; //小程序后台管理的secret，可登录小程序后台查看
    let grant_type = "authorization_code"; // 授权（必填）默认值
    let url =
      "https://api.weixin.qq.com/sns/jscode2session?grant_type=" +
      grant_type +
      "&appid=" +
      appid +
      "&secret=" +
      secret +
      "&js_code=" +
      code;
    let openid, sessionKey;
    let https = require("https");
    https.get(url, (res1) => {
      res1
        .on("data", (d) => {
          console.log("返回的信息: ", JSON.parse(d));
          openid = JSON.parse(d).openid; //得到openid
          sessionKey = JSON.parse(d).session_key; //得到session_key
          let data = {
            openid: openid,
            sessionKey: sessionKey,
          };
          //返回前端
          res.send(data);
        })
        .on("error", (e) => {
          console.error(e);
        });
    });
});

router.post('/getToken',(req,res)=>{
    let token=jwt.sign(req.body.user_name,'ADMIN')

})







module.exports=router