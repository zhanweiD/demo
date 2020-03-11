(function () {
  //1.动态创建li
  var content=document.getElementById("content")
  var wrap=document.getElementById("wrap")
  var wrapUl=wrap.querySelector(".wrap-ul")
  var header=document.getElementById("header")
  var headerHeight=header.offsetHeight
  var htmlHeight=document.documentElement.offsetHeight
  var scroll=document.getElementById("scroll")
  var bottom=wrap.querySelector(".bottom")
  var bigImg=document.getElementById("bigImg")
  var imageBig=bigImg.querySelector("img")
  var close=bigImg.querySelector("a")
  var start=0
  var end
  var urlArr=[]
  var isLi=false
  wrap.delay=false
  //模拟请求回的数组
  for (var i = 0; i < 30; i++) {
    urlArr[i]="img/"+(i%18+1)+".jpg"
  }
  //1.创建li
  CreateLi()
  function CreateLi() {
    end=start+12
    if (end>urlArr.length) {
      end = urlArr.length
      bottom.innerHTML="已经加载到底了"
      wrap.delay=true
    }

    for (var i = start; i < end; i++) {
      var liNode=document.createElement("li")
      liNode.isImg=false
      wrapUl.appendChild(liNode)
    }
    start = end

    //判断是否加载img
    LazyLoading()
  }

  //2.创建照片
  function CreateImg(li){
    var imgNode=new Image()
    imgNode.src=li.src
    li.isImg=true
    li.append(imgNode)
    imgNode.onload=function () {
      imgNode.style.opacity="1"
    }
  }
  //3.懒加载效果
  function LazyLoading(){
    var liArr=wrapUl.querySelectorAll("li")
    for (var i = 0; i < liArr.length; i++) {
      liArr[i].src=urlArr[i]
      var liTop=liArr[i].getBoundingClientRect().top
      //懒加载效果，加载img，当img显示在视口区域才去加载img
      if (!liArr[i].isImg&&liTop>headerHeight&&liTop<htmlHeight){
        CreateImg(liArr[i])
        BigImg(liArr[i])
      }
    }
  }

  //4.大图预览
  function BigImg(li){
      li.addEventListener("touchend",function () {
        if (!wrap.isMove){
          var nowX=li.getBoundingClientRect().left
          var nowY=li.getBoundingClientRect().top
          imageBig.src=li.src
          bigImg.style.transformOrigin=nowX+"px "+nowY+"px"
          bigImg.style.transform="scale(1)"
        }
      })
  }
  //5.关闭大图
  closeImg()
  function closeImg(){
    close.addEventListener("touchend",function () {
      if (!wrap.isMove){
        transformCss(imageBig,"scale",1)
        transformCss(imageBig,"rotate",0)
        bigImg.style.transform="scale(0)"
      }
    })
  }

  window.onload=function(){
    var scale
    //2.点击响应
    var callback={
      start:function (event) {

        wrap.isMove=false
        wrap.isX=false
        var minLateY=htmlHeight-headerHeight-wrap.offsetHeight
        var h = transformCss(wrap,'translateY');
        if(Math.abs(h)+2 >= Math.abs(minLateY)){
         isLi=true
        };

      },
      move:function () {
        if (isLi&&!wrap.isX){
          var minLateY=htmlHeight-headerHeight-wrap.offsetHeight
          var nowY=transformCss(wrap,"translateY")
          scale=(minLateY-nowY)/(htmlHeight-headerHeight)
          transformCss(bottom,"scale",scale)
        }
        //移动调用懒加载
        LazyLoading()
      },
      end:function () {
        if (isLi&&!wrap.isX&&scale>0.2){
          if (wrap.startlateY>wrap.endLateY) {
            clearInterval(wrap.Timer)
            CreateLi()

            //更新滚动条
            //获得内容包裹区的高度
            var contentHeight = content.offsetHeight
            //获得滚动区域的高度
            var htmlConHeight = document.documentElement.offsetHeight - header.offsetHeight
            //等比计算滚动条高度
            scroll.style.height = htmlConHeight * htmlConHeight / contentHeight + "px"
          }
          isLi=false
        }
      }
    }

    //3.缩放函数
    window.gesture(imageBig)
    window.slide(content,callback,CreateImg,BigImg)
    }
})()