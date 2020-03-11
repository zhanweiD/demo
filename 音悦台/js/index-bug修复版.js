(function () {
  //1.取消浏览器默认行为
  document.addEventListener("touchstart",function (event) {
    event.preventDefault()
  })

  //2.选择适配方案
  var htmlClientWidth=document.documentElement.clientWidth
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


    //6.自定义滚动条
  window.onload=function () {
    var content = document.querySelector("#content")
    var header = document.querySelector("#header")
    var scroll = content.querySelector(".scroll")
    var contentWrap = content.querySelector(".content-wrap")
    var startTime
    var endTime
    var minLateY
    var contentY = true
    var contentLateY = true
    var Timer, type, target, targetScroll
    scroll.style.transition = "0.5s"
    var contentHeight = content.offsetHeight
    var htmlConHeight = document.documentElement.offsetHeight - header.offsetHeight
    scroll.style.height = htmlConHeight * htmlConHeight / contentHeight + "px"
    contentWrap.addEventListener("touchstart", function (event) {
      contentWrap.startlateY = transformCss(contentWrap, "translateY")
      contentWrap.startY = event.changedTouches[0].clientY
      contentWrap.startX = event.changedTouches[0].clientX
      contentWrap.style.transition = "none"
      scroll.style.opacity = "1"
      scroll.style.transition = "none"
      startTime = new Date().getTime()
      contentY = true
      contentLateY = true
      clearInterval(Timer)

      contentWrap.addEventListener("touchmove", ContentMove)
    })
    contentWrap.addEventListener("touchend", function () {

      contentWrap.removeEventListener("touchmove", ContentMove)
      var endLateY = transformCss(contentWrap, "translateY")
      //计算速度
      endTime = new Date().getTime()
      var speed = (endLateY - contentWrap.startlateY) / (endTime - startTime)
      target = endLateY + speed * 100

      var scrollScale = -(endLateY + speed * 100) / (contentHeight - htmlConHeight)
      var setScrollTop = scrollScale * (htmlConHeight - scroll.offsetHeight)
      targetScroll = setScrollTop
      type = "Linear"
      if (endLateY > 0) {
        target = 0
        targetScroll = 0
        type = "easeOut"
      } else if (endLateY < minLateY) {
        target = minLateY
        targetScroll = htmlConHeight - scroll.offsetHeight
        type = "easeOut"
      }
      endMove(target, targetScroll, type)
    })

    function ContentMove(event) {
      //防抖动
      if (!contentY) {
        return
      }
      var moveY = event.changedTouches[0].clientY
      var moveX = event.changedTouches[0].clientX

      if (contentLateY) {
        contentLateY = false
        if (Math.abs(moveY - contentWrap.startY) < Math.abs(moveX - contentWrap.startX)) {
          contentY = false
          return
        }
      }
      //防抖动结束
      var setLateY = moveY - contentWrap.startY + contentWrap.startlateY

      minLateY = htmlConHeight - contentHeight
      if (setLateY > 0) {
        setLateY = (1 - setLateY / htmlConHeight) * setLateY
      } else if (setLateY < minLateY) {
        var scale = 1 - (minLateY - setLateY) / htmlConHeight
        setLateY = minLateY + (setLateY - minLateY) * scale
      }
      transformCss(contentWrap, "translateY", setLateY)

      scroll.style.transition = "none"
      var scrollScale = -setLateY / (contentHeight - htmlConHeight)
      var setScrollTop = scrollScale * (htmlConHeight - scroll.offsetHeight)
      scroll.style.top = setScrollTop + "px"
      //transformCss(scroll, "translateY",setScrollTop)
    }

    function endMove(target, targetScroll, type) {
      var d = 50
      var t = 0
      var endLateY = transformCss(contentWrap, "translateY")
      var endScrollY = scroll.offsetTop
      Timer = setInterval(function () {
        t++
        if (t > d) {
          clearInterval(Timer)
          scroll.style.transition = "0.5s"
          scroll.style.opacity = "0"
        }
        transformCss(contentWrap, "translateY", Tween[type](t, endLateY, target - endLateY, d))
        scroll.style.top = Tween[type](t, endScrollY, targetScroll - endScrollY, d) + "px"
      }, 20)
    }

    var Tween = {
      Linear: function (t, b, c, d) {
        return c * t / d + b;
      },
      easeOut: function (t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      }
    }


    // 5.tab切换
    var main = document.querySelector("#main")
    var videoWrap = main.querySelectorAll(".video-wrap")
    var videoUlAll = main.querySelectorAll(".main-video")
    var translateX = -htmlClientWidth

    for (var i = 0; i < videoUlAll.length; i++) {
      VideoUlMove(videoUlAll[i], videoWrap[i])
    }

    function VideoUlMove(videoUl) {
      var tabAll = videoWrap[i].querySelectorAll(".main-nav>a")
      var underline = videoWrap[i].querySelector(".main-nav>span")
      var tabLoading = videoWrap[i].querySelectorAll(".tabLoading")
      var loadFlog = false
      var indexLoad = 0
      var tabFirst = true
      var tabY = true
      videoUl.style.transition = "none"
      transformCss(videoUl, "translateX", translateX)
      videoUl.addEventListener("touchstart", function (event) {
        tabFirst = true
        tabY = true

        videoUl.startX = event.changedTouches[0].clientX
        videoUl.startY = event.changedTouches[0].clientY
        videoUl.startlateX = transformCss(videoUl, "translateX")

        videoUl.addEventListener("touchmove", VideoMove)
      })
      videoUl.addEventListener("touchend", function (event) {
        videoUl.endLateX = transformCss(videoUl, "translateX")
        var changeX = videoUl.endLateX - videoUl.startlateX
        videoUl.style.transition = "0.5s"
        VideoEnd(changeX)
      })

      function VideoEnd(changeX) {
        if (Math.abs(changeX / htmlClientWidth) > 0.5) {
          tabLoading[0].style.opacity = 1
          tabLoading[1].style.opacity = 1
          underline.style.transition = "0.5s"
          if (changeX > 0) {
            indexLoad -= 1
            if (indexLoad < 0) {
              indexLoad = tabAll.length - 1
            }
            underline.style.left = tabAll[indexLoad].offsetLeft + "px"
            transformCss(videoUl, "translateX", 0)
          } else {
            indexLoad += 1
            if (indexLoad > tabAll.length - 1) {
              indexLoad = 0
            }
            underline.style.left = tabAll[indexLoad].offsetLeft + "px"
            transformCss(videoUl, "translateX", 2 * translateX)
          }
          loadFlog = true
          setTimeout(function () {
            videoUl.style.transition = "none"
            transformCss(videoUl, "translateX", translateX)
            tabLoading[0].style.opacity = "0"
            tabLoading[1].style.opacity = "0"
            loadFlog = false
          }, 1000)
        } else {
          transformCss(videoUl, "translateX", videoUl.startlateX)
        }
      }

      function VideoMove(event) {
        //防抖动
        if (!tabY) {
          return
        }
        var moveY = event.changedTouches[0].clientY
        var moveX = event.changedTouches[0].clientX
        if (tabFirst) {
          tabFirst = false
          if (Math.abs(moveY - videoUl.startY) > Math.abs(moveX - videoUl.startX)) {
            tabY = false
            return;
          }
        }
        //防抖动结束
        if (loadFlog) {
          return
        }

        var setLateX = event.changedTouches[0].clientX - videoUl.startX + videoUl.startlateX
        videoUl.style.transition = "none"
        transformCss(videoUl, "translateX", setLateX)
      }
    }
  }

    // 4.无缝轮播图
    //获取元素
    var carousel = document.querySelector("#carousel")
    var carouselUl = carousel.querySelector(".carousel-ul")
    var carouselList = carouselUl.querySelectorAll("li")
    var carouselImg = carouselUl.querySelectorAll("img")
    var iconContent = carousel.querySelector(".icon")
    var iconAll = iconContent.querySelectorAll("span")
    //获取属性值
    var ulHeight = carouselImg[0].offsetHeight
    var ulWidth = carouselImg[0].offsetWidth * carouselList.length
    var listWidth = 1 / carouselImg.length * 100
    //定义全局变量
    var setImgX = 0
    var index = 0
    var clearTime = ""
    var imgFirst = true
    var imgShake = true
    //设置属性值
    styleNode.innerHTML += "#carousel{height:" + ulHeight + "px;} .carousel-ul{width:" + ulWidth + "px; height:" + ulHeight + "px} .carousel-ul>li{width:" + listWidth + "%; height:" + ulHeight + "px}"
    document.head.appendChild(styleNode)
    //绑定点击响应函数
    carouselUl.addEventListener("touchstart", function (event) {
      //清除定时器
      clearInterval(clearTime)

      imgFirst = true
      imgShake = true

      //获取点击时位置
      carouselUl.startX = event.changedTouches[0].clientX
      carouselUl.startY = event.changedTouches[0].clientY

      //index判断必须绑定给start，如果绑定给move则会在四舍五入时发生bug！！！
      carouselUl.style.transition = "none"
      if (index === 0) {
        index = 5
        transformCss(carouselUl, "translateX", -htmlClientWidth * index)
      } else if (index === 9) {
        index = 4
        transformCss(carouselUl, "translateX", -htmlClientWidth * index)
      }
      //获取点击时translateX值，必须放到index判断后，因为index可能会更新translateX
      carouselUl.startlateX = transformCss(carouselUl, "translateX")

      document.addEventListener("touchmove", moveImg)
    })

    carouselUl.addEventListener("touchend", function (event) {
      document.removeEventListener("touchmove", moveImg)
      //获取结束位置和结束translateX
      carouselUl.endX = event.changedTouches[0].clientX
      carouselUl.endlateX = transformCss(carouselUl, "translateX")
      //更新index，判断是否过半，过半下一张
      index = Math.round(-carouselUl.endlateX / htmlClientWidth)
      carouselUl.style.transition = "0.5s transform"
      transformCss(carouselUl, "translateX", -htmlClientWidth * index)
      iconStyle()
      Time()
    })

    //设置img容器随鼠标移动
    function moveImg(event) {
      //防抖动设置
      if (!imgShake) {
        return
      }
      var moveX = event.changedTouches[0].clientX
      var moveY = event.changedTouches[0].clientY
      if (imgFirst) {
        imgFirst = false
        if (Math.abs(moveX - carouselUl.startX) < Math.abs(moveY - carouselUl.startY)) {
          imgShake = false
          return;
        }
      }
      //防抖动结束
      setImgX = moveX - carouselUl.startX
      carouselUl.style.transition = "none"
      transformCss(carouselUl, "translateX", setImgX + carouselUl.startlateX)
    }

    //导航圆点样式设置
    function iconStyle() {
      for (var i = 0; i < iconAll.length; i++) {
        iconAll[i].classList.remove("active")
      }
      iconAll[index % 5].classList.add("active")
    }

    //4.1 无缝自动轮播
    Time()

    function Time() {
      //每次调用清除上一次定时
      clearInterval(clearTime)
      clearTime = setInterval(function () {
        carouselUl.style.transition = "none"
        if (index === 0) {
          index = 5
          transformCss(carouselUl, "translateX", -htmlClientWidth * index)
        } else if (index === 9) {
          index = 4
          transformCss(carouselUl, "translateX", -htmlClientWidth * index)
        }
        //为了防止transition的覆盖，必须为过度设置一个延时，否则transition会覆盖掉if中的，导致瞬间跳转动画
        setTimeout(function () {
          index++
          carouselUl.style.transition = "1s transform"
          transformCss(carouselUl, "translateX", -htmlClientWidth * index)
          iconStyle()
        }, 30)
      }, 2000)
    }


    // 3.为导航li绑定点击切换函数
    var navUl = document.querySelector("#nav>.nav-ul")
    var navList = navUl.querySelectorAll("li")
    var listFlog = false

    for (var i = 0; i < navList.length; i++) {
      navList[i].addEventListener("touchstart", function () {
        listFlog = true
        document.addEventListener("touchmove", function () {
          listFlog = false
        })
      })
      navList[i].addEventListener("touchend", function () {
        if (listFlog) {
          for (var j = 0; j < navList.length; j++) {
            navList[j].classList.remove("active")
          }
          this.classList.add("active")
        }
      })
    }


    // 2.导航条事件绑定
    var setX = 0
    var startTime = 0
    var endTime = 0
    var minlateX = 0
    var navX = true
    var navLateX = true
    navUl.addEventListener("touchstart", function (event) {
      navUl.startlateX = transformCss(navUl, "translateX")
      startTime = new Date().getTime()
      navUl.startX = event.changedTouches[0].clientX
      navUl.startY = event.changedTouches[0].clientY

      navX = true
      navFirst = true

      document.addEventListener("touchmove", moveUl)
    })

    navUl.addEventListener("touchend", function () {
      document.removeEventListener("touchmove", moveUl)
      navUl.endlateX = transformCss(navUl, "translateX")
      endTime = new Date().getTime()
      //计算手指滑动的速度，让其结束后产生一个持续减速效果
      var a = (navUl.endlateX - navUl.startlateX) / (endTime - startTime) * 100
      setlataX(setX + a)
    })

    //手指滑动时对应的响应
    function moveUl(event) {
      //防抖动
      if (!navX) {
        return
      }
      var moveX = event.changedTouches[0].clientX
      var moveY = event.changedTouches[0].clientY
      if (navFirst) {
        navFirst = false
        if (Math.abs(moveX - navUl.startX) < Math.abs(moveY - navUl.startY)) {
          navX = false
          return
        }
      }

      //让ul跟随手指滑动
      setX = moveX - navUl.startX + navUl.startlateX
      minlateX = htmlClientWidth - navUl.offsetWidth
      navUl.style.transition = "none"
      //橡皮筋效果，越来越难滑
      if (setX > 0) {
        var scale = 0.7 - setX / (htmlClientWidth * 3)
        setX = setX * scale
      } else if (setX < minlateX) {
        var scale = 0.7 - (minlateX - setX) / (htmlClientWidth * 3)
        setX = minlateX - (minlateX - setX) * scale
      }
      transformCss(navUl, "translateX", setX)
    }

    //松手后，判断setX是否越界，越界回弹到临界值
    function setlataX(setX) {
      navUl.style.transition = "0.5s transform ease-out"
      if (setX >= 0) {
        setX = 0
        navUl.style.transition = "0.5s transform cubic-bezier(.17,.67,.35,1.74)"
      } else if (setX <= minlateX) {
        setX = minlateX
        navUl.style.transition = "0.5s transform cubic-bezier(.17,.67,.35,1.74)"
      }
      transformCss(navUl, "translateX", setX)
    }


    //1.为导航按钮绑定点击事件
    var menu = document.querySelector("#header .header-menu")
    var menuList = menu.querySelector(".header-list")
    var menuFlog = false
    menu.addEventListener("touchstart", function (event) {
      window.event?window.event.cancelBubble=true:event.stopPropagation();
      if (!menuFlog) {
        menu.classList.add("active")
        menuList.classList.add("active")
        menuFlog = true
      } else {
        menu.classList.remove("active")
        menuList.classList.remove("active")
        menuFlog = false
      }
    })
    menuList.addEventListener("touchstart",function (event) {
      window.event?window.event.cancelBubble=true:event.stopPropagation();
    })
    document.addEventListener("touchstart",function () {
      menu.classList.remove("active")
      menuList.classList.remove("active")
      menuFlog = false
    })
})()