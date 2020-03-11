(function () {
  function addClass(obj,name){
    obj.className +=" "+name;
  }
  //addClass(div1,"div2");
  //判断是否含有一个属性
  function hasClass(obj,name){
    var rep=new RegExp("\\b"+name+"\\b")
    return rep.test(obj.className);
  }
//			hasClass(div1,"div2")
  //删除一个className属性
  function remove(obj,name){
    var rep=new RegExp("\\b"+name+"\\b");
    obj.className=obj.className.replace(rep,"");
  }
//			remove(div1,"div2");
  //切换函数，有则删，无则加
  function toggleClass(obj,name){
    if(hasClass(obj,name)){
      remove(obj,name);
    }
    else{
      addClass(obj,name);
    }
  }
})()