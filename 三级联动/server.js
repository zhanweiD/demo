let express=require("express")
let app=express()
let db=require("./db/mongodb")
 let sectionModel=require("./model/model").sectionModel
 let cityModel=require("./model/model").cityModel
let provinceModel=require("./model/model").provinceModel
app.use(express.urlencoded({extended:true}))
  db.then(()=>{
    app.get("/province",(request,response)=>{
      console.log("province-get",request.query)
      response.set("Access-Control-Allow-Origin","http://localhost:63342")
      provinceModel.find({},{code:1,name:1,_id:0},(err,data)=>{
        if (!err){
          response.json(data)
        } else{
          console.log(err)
          response.send(new Error("网络丢失了"))
        }
      })
    })
    app.get("/city",(request,response)=>{
      let {id}=request.query
      console.log("city-get",request.query)
      response.set("Access-Control-Allow-Origin","http://localhost:63342")
      cityModel.find({provinceCode:id},{code:1,name:1,_id:0},(err,data)=>{
        if (!err) {
          response.json(data)
        }else{
          console.log(err)
          response.send(new Error("网络丢失了"))
        }
      })
    })
    app.get("/section",(request,response)=>{
      let {id}=request.query
      console.log("section-get",request.query)
      response.set("Access-Control-Allow-Origin","http://localhost:63342")
      sectionModel.find({cityCode:id},{code:1,name:1,_id:0},(err,data)=>{
        if (!err) {
          response.json(data)
        }else{
          console.log(err)
          response.send(new Error("网络丢失了"))
        }
      })
    })
    app.get("/site",(request,response)=>{
      let {id}=request.query
      console.log("site-get",request.query)
      response.set("Access-Control-Allow-Origin","http://localhost:63342")
    })
  }).catch((err)=>{
    console.log(err)
  })
app.listen(3000,(err)=>{
  if (!err) console.log("服务器启动成功")
})
