(function () {
  //1.取消浏览器默认行为
  document.addEventListener("touchstart",function (event) {
    event.preventDefault()
  })

  //2.选择适配方案
  var htmlClientWidth=document.documentElement.clientWidth
  var styleNode=document.createElement("style")
  //1rem参照的是HTML的font-size大小，所以设置时注意单位
  styleNode.innerHTML="html{font-size:"+htmlClientWidth/16+"px !important;}"
  document.head.appendChild(styleNode)

  //3.解决点透事件
  var aAll=document.querySelectorAll("a")
  for (var i=0;i<aAll.length;i++){
    aAll[i].addEventListener("touchstart",function () {
      window.location.href=this.href
    })
  }
})()