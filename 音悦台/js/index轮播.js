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
  //document.head.appendChild(styleNode)

  //3.解决点透事件
  var aAll=document.querySelectorAll("a")
  for (var i=0;i<aAll.length;i++){
    aAll[i].addEventListener("touchstart",function () {
      window.location.href=this.href
    })
  }



  // 4.无缝轮播图
  //获取元素
  var carousel=document.querySelector("#carousel")
  var carouselUl=carousel.querySelector(".carousel-ul")
  var carouselList=carouselUl.querySelectorAll("li")
  var carouselImg=carouselUl.querySelectorAll("img")
  var iconContent=carousel.querySelector(".icon")
  var iconAll=iconContent.querySelectorAll("span")
  //获取属性值
  var ulHeight=carouselImg[0].offsetHeight
  var ulWidth=carouselImg[0].offsetWidth*carouselList.length
  var listWidth=1/carouselImg.length*100
  //定义全局变量
  var setImgX=0
  var index=0
  var clearTime=""
  //设置属性值
  styleNode.innerHTML+="#carousel{height:"+ulHeight+"px;} .carousel-ul{width:"+ulWidth+"px; height:"+ulHeight+"px} .carousel-ul>li{width:"+listWidth+"%; height:"+ulHeight+"px}"
  document.head.appendChild(styleNode)
  //绑定点击响应函数
  carouselUl.addEventListener("touchstart",function (event) {
    //清除定时器
    clearInterval(clearTime)

    //获取点击时位置
    carouselUl.startX=event.changedTouches[0].clientX

    //index判断必须绑定给start，如果绑定给move则会在四舍五入时发生bug！！！
    carouselUl.style.transition="none"
    if (index===0){
      index=5
      transformCss(carouselUl,"translateX",-htmlClientWidth*index)
    }
    else if (index===9){
      index=4
      transformCss(carouselUl,"translateX",-htmlClientWidth*index)
    }
    //获取点击时translateX值，必须放到index判断后，因为index可能会更新translateX
    carouselUl.startlateX=transformCss(carouselUl,"translateX")

    document.addEventListener("touchmove",moveImg)
  })

  carouselUl.addEventListener("touchend",function (event) {
    document.removeEventListener("touchmove",moveImg)
    //获取结束位置和结束translateX
    carouselUl.endX=event.changedTouches[0].clientX
    carouselUl.endlateX=transformCss(carouselUl,"translateX")
    //更新index，判断是否过半，过半下一张
    index=Math.round(-carouselUl.endlateX/htmlClientWidth)
    carouselUl.style.transition="0.5s transform"
    transformCss(carouselUl,"translateX",-htmlClientWidth*index)
    iconStyle()
    Time()
  })

  //设置img容器随鼠标移动
  function moveImg(event) {
    setImgX=event.changedTouches[0].clientX-carouselUl.startX+carouselUl.startlateX
    carouselUl.style.transition="none"
    transformCss(carouselUl,"translateX",setImgX)
  }

  //导航圆点样式设置
  function iconStyle() {
    for (var i = 0; i < iconAll.length; i++) {
      iconAll[i].classList.remove("active")
    }
    iconAll[index%5].classList.add("active")
  }

  //4.1 无缝自动轮播
  Time()
  function Time() {
    //每次调用清除上一次定时
    clearInterval(clearTime)
    clearTime=setInterval(function () {
      carouselUl.style.transition="none"
      if (index===0){
        index=5
        transformCss(carouselUl,"translateX",-htmlClientWidth*index)
      }
      else if (index===9){
        index=4
        transformCss(carouselUl,"translateX",-htmlClientWidth*index)
      }
      //为了防止transition的覆盖，必须为过度设置一个延时，否则transition会覆盖掉if中的，导致瞬间跳转动画
      setTimeout(function () {
        index++
        carouselUl.style.transition="1s transform"
        transformCss(carouselUl,"translateX",-htmlClientWidth*index)
        iconStyle()
      },30)
    },2000)
  }

  // 3.为导航li绑定点击切换函数
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
    //橡皮筋效果，越来越难滑
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