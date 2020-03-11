let mongoose=require("mongoose")
let Schema=mongoose.Schema
let schema=new Schema({
  name:String,
  id:String,
  pid:String,
  deep:String,
  ext_id:String,
  ext_name:String
})
let model=
  { sectionModel:mongoose.model("section",schema),
    cityModel:mongoose.model("citys",schema),
    provinceModel:mongoose.model("provinces",schema)
 }
module.exports=model