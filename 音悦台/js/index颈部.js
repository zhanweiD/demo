(function () {
  //1.取消浏览器默认行为
  document.addEventListener("touchstart",function (event) {
    event.preventDefault()
  })
  var htmlClientWidth=document.documentElement.clientWidth
  //2.选择适配方案
  var styleNode=document.createElement("style")
  //1rem参照的是HTML的font-size大小，所以设置时注意单位
  styleNode.innerHTML="html{font-size:"+htmlClientWidth/16+"px}"
  document.head.appendChild(styleNode)

  //3.解决点透事件
  var aAll=document.querySelectorAll("a")
  for (var i=0;i<aAll.length;i++){
    aAll[i].addEventListener("touchstart",function () {
      window.location.href=this.href
    })
  }

  // 4.轮播图


  // 3.为li绑定点击切换函数
  var navUl=document.querySelector("#nav>.nav-ul")
  var navList=navUl.querySelectorAll("li")
  var listFlog=false

    for (var i = 0; i < navList.length; i++) {
      navList[i].addEventListener("touchstart",function () {
        listFlog=true
        document.addEventListener("touchmove",function () {
          listFlog=false
        })
      })
        navList[i].addEventListener("touchend",function () {
          if (listFlog) {
            for (var j = 0; j < navList.length; j++) {
              navList[j].classList.remove("active")
            }
            this.classList.add("active")
          }
        })

    }

  // 2.导航条事件绑定
  var setX=0
  var startTime=0
  var endTime=0
  var minlateX=0
  navUl.addEventListener("touchstart",function (event) {
    navUl.startlateX=transformCss(navUl,"translateX")
    startTime=new Date().getTime()
    navUl.startX=event.changedTouches[0].clientX

    document.addEventListener("touchmove",moveUl)
  })

  navUl.addEventListener("touchend",function () {
    document.removeEventListener("touchmove",moveUl)
    navUl.endlateX=transformCss(navUl,"translateX")
    endTime=new Date().getTime()
    //计算手指滑动的速度，让其结束后产生一个持续减速效果
    var a=(navUl.endlateX-navUl.startlateX)/(endTime-startTime)*100
    setlataX(setX+a)
  })

  //手指滑动时对应的响应
  function moveUl(event) {
    //让ul跟随手指滑动
    setX=event.changedTouches[0].clientX-navUl.startX+navUl.startlateX
    minlateX=htmlClientWidth - navUl.offsetWidth
    navUl.style.transition="none"
    //橡皮筋效果
    if (setX>0){
      var scale=0.7 - setX/(htmlClientWidth*3)
      setX=setX*scale
    }
    else if (setX<minlateX){
      var scale= 0.7 - (minlateX-setX)/(htmlClientWidth*3)
      setX=minlateX-(minlateX-setX)*scale
    }
    transformCss(navUl,"translateX",setX)
  }

  //松手后，判断setX是否越界，越界回弹到临界值
  function setlataX(setX) {
    navUl.style.transition="0.5s transform ease-out"
    if (setX>=0){
      setX=0
      navUl.style.transition="0.5s transform cubic-bezier(.17,.67,.35,1.74)"
    }
    else if (setX<=minlateX) {
      setX=minlateX
      navUl.style.transition="0.5s transform cubic-bezier(.17,.67,.35,1.74)"
    }
    transformCss(navUl,"translateX",setX)
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