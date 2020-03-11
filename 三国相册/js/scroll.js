(function (win) {
  //滚动条必须在页面加载完成后才能调用，不然获取的页面高度可能错误
    win.slide=function (content,callback,CreateImg,BigImg) {
      //头部
      var header = document.querySelector("#header")
      //滚动条
      var scroll = content.querySelector("#scroll")
      //滚动区域
      var contentWrap =content.children[0];
      var liArr=contentWrap.querySelectorAll("li")
      var bottom=contentWrap.querySelector(".bottom")
      //var liArr=content.querySelectorAll("li")
      //点击时间和松开时间
      var startTime
      var endTime
      //滚动区域临界值
      var minLateY
      //防抖动标识
      var contentY = true
      var contentLateY = true
      //定时器标识，运动方式，滚动区域和滚动条的目标值
      var type, target, targetScroll

//根据内容高度自动适应滚动条高度
      scroll.style.transition = "0.5s"
      //获得内容包裹区的高度
      var contentHeight = content.offsetHeight
      //获得滚动区域的高度
      var htmlConHeight = document.documentElement.offsetHeight - header.offsetHeight
      //等比计算滚动条高度
      scroll.style.height = htmlConHeight * htmlConHeight / contentHeight + "px"

//为内容包裹区绑定监听
      contentWrap.addEventListener("touchstart", function (event) {
        contentHeight=content.offsetHeight
        bottom.style.transition="0s"
        //获得点击时位置，translateY，以及点击时间，重置参数，清除定时器
        contentWrap.startlateY = transformCss(contentWrap, "translateY")
        contentWrap.startY = event.changedTouches[0].clientY
        contentWrap.startX = event.changedTouches[0].clientX
        //清楚滚动区过渡
        contentWrap.style.transition = "none"
        //显示滚动条
        scroll.style.opacity = "1"
        scroll.style.transition = "none"
        startTime = new Date().getTime()
        //重置防抖动标识
        contentY = true
        contentLateY = true
        //清除定时器
        clearInterval(contentWrap.Timer)

        if(callback && typeof callback['start'] == 'function'){
          callback['start']();
        }
        contentWrap.addEventListener("touchmove", ContentMove)
      })
      contentWrap.addEventListener("touchend", function () {
        contentWrap.removeEventListener("touchmove", ContentMove)
        //获得鼠标松开数据，计算速度
        var endLateY = transformCss(contentWrap, "translateY")
        contentWrap.endLateY=endLateY
        //计算速度，设置目标值
        endTime = new Date().getTime()
        var speed = (endLateY - contentWrap.startlateY) / (endTime - startTime)
        //目标值=鼠标松开位置+速度*n
        target = endLateY + speed * 200
        //更新内容区高度
        contentHeight=content.offsetHeight
        //计算滑块还需的滑动距离
        var scrollScale = -(endLateY + speed * 200) / (contentHeight - htmlConHeight)
        var setScrollTop = scrollScale * (htmlConHeight - scroll.offsetHeight)
        //设置滑块目标值
        targetScroll = setScrollTop
        //默认运动方式
        type = "CubiceaseOut"
        //更新最小临界值
        minLateY=htmlConHeight-contentHeight

        for (var i = 0; i < liArr.length; i++) {
          var liTop=liArr[i].getBoundingClientRect().top+speed * 200
          //懒加载效果，加载img，当img显示在视口区域才去加载img
          if (!liArr[i].isImg&&liTop>header.offsetHeight&&liTop<document.documentElement.offsetHeight){
            CreateImg(liArr[i])
            BigImg(liArr[i])
          }
        }

        //判断是否越界，如果越界，目标设置成临界值，触发回弹
        if (target > 0) {
          target = 0
          targetScroll = 0
          //运动方式设为回弹
          type = "easeOut"
        }
        else if (target < minLateY) {
          target = minLateY
          targetScroll = htmlConHeight - scroll.offsetHeight
          type = "easeOut"
          //console.log(targetScroll)
        }
        //调用函数，传入目标值和移动方式
        endMove(target, targetScroll, type)

        if (contentWrap.delay&&contentWrap.startlateY>contentWrap.endLateY){
          setTimeout(function () {
            bottom.style.transition="1s"
            transformCss(bottom,"scale",0)
            contentHeight=content.offsetHeight
            minLateY=htmlConHeight-contentHeight
            targetScroll = htmlConHeight - scroll.offsetHeight
            contentWrap.style.transition="1s"
            scroll.style.transition="1s"
            transformCss(contentWrap,"translateY",minLateY)
            scroll.style.top = setScrollTop + "px"
          },2000)
        }else{
          bottom.style.transition="0s"
          transformCss(bottom,"scale",0)
        }

        if(callback && typeof callback['end'] == 'function'){
          callback['end']();
        }
      })

      function ContentMove(event) {
        contentWrap.isMove=true
        contentWrap.isX=true
        contentWrap.style.transition="0s"
        scroll.style.transition="0s"
        //防抖动
        if (!contentY) {
          contentWrap.isX=true
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

        //计算要设置的偏移量Y值
        //鼠标位置-点击位置+原本位置
        contentWrap.isX=false
        var setLateY = moveY - contentWrap.startY + contentWrap.startlateY
        //计算最小偏移量Y值
        //滚动区域-内容区域
        var contentHeight=content.offsetHeight
        minLateY = htmlConHeight - contentHeight

        //判断偏移量Y值是否越界，如果越界出现橡皮筋效果
        if (setLateY > 0) {
          //计算出一个越来越小的比例
          setLateY = (1 - setLateY / htmlConHeight) * setLateY

        } else if (setLateY < minLateY) {
          //计算出一个越来越小的比例
          var scale = 1 - (minLateY - setLateY) / htmlConHeight
          setLateY = minLateY + (setLateY - minLateY) * scale

        }
        //设置偏移量Y
        transformCss(contentWrap, "translateY", setLateY)

        //计算滑块的实时位置，内容当前位置/最大偏移距离=滑块当前位置/最大滑动距离
        scroll.style.transition = "none"
        var scrollScale = -setLateY / (contentHeight - htmlConHeight)
        var setScrollTop = scrollScale * (htmlConHeight - scroll.offsetHeight)
        scroll.style.top = setScrollTop + "px"
        //也可设置偏移量
        //transformCss(scroll, "translateY",setScrollTop)
        if(callback && typeof callback['move'] == 'function'){
          callback['move']();
        }
      }

//鼠标抬起调用函数
      function endMove(target, targetScroll, type) {
        //总次数
        var d = 100
        //初始次数
        var t = 0
        //内容结束时的位置
        var endLateY = transformCss(contentWrap, "translateY")
        //滑块结束时的位置
        var endScrollY = scroll.offsetTop
        contentWrap.style.transition="0s"
        scroll.style.transition="0s"
        //定时器
        contentWrap.Timer = setInterval(function () {
          t++
          //如果次数超出，关闭定时器，隐藏滑块，最后的逻辑区域
          if (t > d) {
            clearInterval(contentWrap.Timer)
            scroll.style.transition = "0.5s"
            scroll.style.opacity = "0"
          }
          //target、targetScroll内容区和滑块目标位置
          transformCss(contentWrap, "translateY", Tween[type](t, endLateY, target - endLateY, d))
          scroll.style.top = Tween[type](t, endScrollY, targetScroll - endScrollY, d) + "px"
        }, 10)
      }
//tween算法
      var Tween = {
//      t:当前次数
//      var t =0;
// //		b:元素起始位置
//     var b = transformCss(navList,'translateY');
// //		c元素结束位置与起始位置的距离差
//     var c = target-b;
// //		d:总次数
//     var d = time/0.02;
// //		s:回弹系数，s值越大，回弹效果越远
// //		var s = 5;
        Linear: function (t, b, c, d) {
          return c * t / d + b;
        },
        CubiceaseOut: function(t,b,c,d){
          return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeOut: function (t, b, c, d, s) {
          if (s == undefined) s = 1.70158;
          return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        }
      }
    }

})(window)