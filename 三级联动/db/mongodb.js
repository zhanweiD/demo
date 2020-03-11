let mongoose=require("mongoose")
let promise=new Promise((resolve,reject)=>{
  mongoose.connect("mongodb://localhost:27017/Desktop",{useNewUrlParser:true})
  mongoose.connection.on("open",(err)=>{
    if (!err){
      console.log("数据库连接成功")
      resolve()
    } else{
      reject()
    }
  })
})
module.exports=promise

