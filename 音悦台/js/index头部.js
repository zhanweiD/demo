(function () {
  //1.取消浏览器默认行为
  document.addEventListener("touchstart",function (event) {
    event.preventDefault()
  })

  //2.选择适配方案
  var styleNode=document.createElement("style")
  console.log(document.documentElement.clientWidth)
  //1rem参照的是HTML的font-size大小，所以设置时注意单位
  styleNode.innerHTML="html{font-size:"+document.documentElement.clientWidth/16+"px}"
  document.head.appendChild(styleNode)

  //3.解决点透事件
  var aAll=document.querySelectorAll("a")
  for (var i=0;i<aAll.length;i++){
    aAll[i].addEventListener("touchstart",function () {
      window.location.href=this.href
    })
  }

  //1.为导航按钮绑定点击事件
  var menu=document.querySelector("#header .header-menu")
  var menuList=menu.querySelector(".header-list")
  var menuFlog=false
  menu.addEventListener("touchstart",function () {
    if (!menuFlog){
      menu.classList.add("active")
      menuList.classList.add("active")
      menuFlog=true
    } else{
      menu.classList.remove("active")
      menuList.classList.remove("active")
      menuFlog=false
    }

  })
})()