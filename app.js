const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
const express = require('express')
const bodyParser = require('body-parser')


const secretKey = 'chen' 

const app = express()

// 解析 post 表单数据的中间件
app.use(bodyParser.urlencoded({extended:false}))

// 用来解析 token 的中间件。 只要配置成功了这个中间件，就可以把解析出来的用户信息，挂在到 req.user 属性上
app.use(expressJWT({algorithms:['HS256'],secret:'chen'}).unless({path:[/^\/api\//]}))

// 使用全局错误处理中间件，捕获解析 jwt 失败后产生的错误
app.use((err,req,res,next)=>{
    // token 解析失败导致的错误（过期了）
    if(err.name === 'UnauthorizedError'){
        return res.send({status:401,message:'无效的token'})
    }
    // 其他原因导致的错误
    res.send({status:500,message:'未知错误'})
})
 

app.post('/api/login',function(req,res){

    // 将 req.body 请求体中的数据，转存为 userinfo 常量
    const userinfo = req.body
    console.log(userinfo)

    // 登录失败
    if(userinfo.username !== 'admin' || userinfo.password !== '888888'){
        return res.send({
            status:400,
            message:'登录失败！'
        })
    }

    // 登录成功的话，返回 token
    res.send({
        status:200,
        message:'登录成功',
        token: jwt.sign({username:userinfo.username},secretKey,{expiresIn:'30s'})   // 要发送给客户端的 token，注意不要把密码作为加密的对象
    })
    
})

// 这是一个需要权限的接口
app.get('/admin/getinfo',function(req,res){
    // 使用 req.user 获取解析出来的用户信息
    console.log(req.user)
    res.send({
        status:200,
        message:'获取用户信息成功',
        data:req.user   // 要发送给客户端的用户信息
    })
})



app.listen(5000,()=>{
    console.log('express server running on http://localhost:5000')
})