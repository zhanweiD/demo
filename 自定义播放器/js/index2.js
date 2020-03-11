(function () {
  //获取视频标签
  var videoEle=document.querySelector("#video")
  //获取底部控制条
  var controlBar=document.querySelector("#controlBar")
  //获取按钮容器
  var btn=document.querySelector("#playBtn")
  //获取播放停止按钮
  var playBtn=btn.querySelector(".play-btn")
  var stopBtn=btn.querySelector(".stop-btn")
  //获取主进度条容器
  var videoProgress=document.querySelector("#progress")
  //获取进度条三兄弟组件
  var videoPro=videoProgress.querySelector(".progress-pro")
  var videoSlide=videoProgress.querySelector(".progress-slide")
  var videoRate=videoProgress.querySelector(".progress-rate")
  //获取控制条右侧容器
  var rightControl=document.querySelector("#right")
  //获取时间显示
  var time=rightControl.querySelector(".time")
  var time1=time.querySelector("span:first-child")
  var time2=time.querySelector("span:last-child")
  //获取全屏按钮
  var full=rightControl.querySelector(".full span")
  //是否全屏
  var isFullScreen=false
  //延时标识
  var clickTimeId
  //获取音量容器
  var volumeCon=rightControl.querySelector(".volume")
  //获取音量log
  var volumeLog=volumeCon.querySelector(".volume-log span")
  //静音标识
  var volumeIndex=false
  //获取音量控制条
  var volumeProgress=volumeCon.querySelector(".volume-progress")
  //获取音量进度条三组件
  var volumePro=volumeProgress.querySelector(".volume-pro")
  var volumeSlide=volumeProgress.querySelector(".volume-slide")
  var volumeRate=volumeProgress.querySelector(".volume-rate")




  //10.静音按钮事件监听
  volumeLog.addEventListener("click",function () {
    if (volumeIndex){
      volumeIndex=false
      videoEle.volume=0
      volumeLog.classList.add("active")
    } else{
      volumeIndex=true
      videoEle.volume=1
      volumeLog.classList.remove("active")
    }

  })

  //9.双击视频切换全半屏
  videoEle.addEventListener("dblclick",isFull)

  //8.绑定全屏半屏切换函数
  full.addEventListener("click",isFull)

  //7.视频时间进度更新
  videoEle.addEventListener("loadedmetadata",function () {
    time2.innerHTML=videoTime(videoEle.duration)
  })

  //6.点击进度条视频跳转
  videoPro.addEventListener("click",function (event) {
    var clickX=event.clientX
    //计算滑块left
    var setleft=clickX-videoProgress.offsetLeft
    slideLeft(setleft)
  })
  //5.拖拽视频进度条设置
   videoSlide.addEventListener("mousedown",function (event) {
     videoSlide.clickX=event.offsetX
     document.addEventListener("mousemove",move)
   })
  document.addEventListener("mouseup",function () {
      document.removeEventListener("mousemove",move)
  })

  //4.timeupdate事件设置
  videoEle.addEventListener("timeupdate",function () {
    var scale=videoEle.currentTime/videoEle.duration
    //设置滑块跟随播放进度而改变
    if (scale ===1){
      playBtn.classList.remove("active")
    } else{
      //滑块可滑动最大距离
      var slideMax=videoProgress.clientWidth-videoSlide.offsetWidth
      videoSlide.style.left=slideMax*scale+"px"
      videoRate.style.width=slideMax*scale+"px"
    }

    //设置视频时间实时更新
    time1.innerHTML=videoTime(videoEle.currentTime)
  })

  //3.绑定点击视频播放暂停
  videoEle.addEventListener("click",oneClick)

  //2.绑定按钮播放停止函数
  playBtn.addEventListener("click",play)
  stopBtn.addEventListener("click",function () {
    videoEle.pause()
    videoEle.currentTime=0
    playBtn.classList.remove("active")
  })

  //1.设置视频大小
  videoEle.width=window.innerWidth
  videoEle.height=window.innerHeight-controlBar.offsetHeight
  //当视口大小改变时，重新设置视频大小
  window.addEventListener("resize",function () {
    videoEle.width=window.innerWidth
    videoEle.height=window.innerHeight-controlBar.offsetHeight
  })

  //封装全半屏切换函数
  function isFull() {
    //取消上次未执行的事件
    clearTimeout(clickTimeId)
    if(isFullScreen) {
      isFullScreen=false
      full.classList.remove("active")
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
      else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
      else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    else {
      isFullScreen=true
      full.classList.add("active")
      var docElm = document.documentElement;
      //W3C
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      }
      //FireFox
      else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      }
      //Chrome等
      else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      }
      //IE11
      else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    }
  }

  //封装单击视频时间
  function oneClick() {
    clearTimeout(clickTimeId)
    clickTimeId=setTimeout(play,300)
  }
  
  //封装时间换算函数
  function videoTime(time) {
    var hour=Math.floor(time/3600)
    time-=hour*3600
    var min=Math.floor(time/60)
    var sec=Math.floor(time-min*60)
    if (hour<10){
      hour="0"+hour
    }
    if (min<10){
      min = "0"+min
    }
    if (sec<10){
      sec="0"+sec
    }
    return hour+":"+min+":"+sec
  }
  
  //封装鼠标移动拖拽函数
  function move(event) {
    //取消浏览器默认行为
    event.preventDefault()
    //计算滑块left值
    var setleft=event.clientX-videoSlide.clickX-videoProgress.offsetLeft
    slideLeft(setleft)
  }
  //封装设置滑块left的函数
  function slideLeft(setleft) {
    //滑块可滑动最大距离
    var slideMax=videoProgress.clientWidth-videoSlide.offsetWidth
    if (setleft<0){
      setleft = 0
    }
    else if (setleft>slideMax){
      setleft=slideMax
    }
    videoSlide.style.left = setleft+"px"
    videoRate.style.width=setleft+"px"
    var scale=setleft/slideMax
    videoEle.currentTime=videoEle.duration*scale
  }

  //封装播放暂停函数
  function play() {
    if (videoEle.paused){
      videoEle.play()
      playBtn.classList.add("active")
    } else{
      videoEle.pause()
      playBtn.classList.remove("active")
    }
  }

})()