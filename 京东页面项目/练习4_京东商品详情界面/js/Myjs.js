$(function () {
  showhide()
  hoverMenu()
  textHelp()
  shareIcon()
  address()
  addressTabs()
  shopCart()
  productTaps()
  commodityImg()
  medianImg()
  maxImg()

  //11当鼠标在中图标上移动时，显示对应的大图的附近部分区域
  function maxImg() {
    //移入移出
    var $mask=$("#mask")
    var $mediumImg=$("#mediumImg")
    var $largeImgContainer=$("#largeImgContainer")
    var $largeImg=$("#largeImg")
    var $loading=$("#loading")
    var maskWidth=$mask.width()
    var maskHeight=$mask.height()
    var mediumImgWidth=$mediumImg.width()
    var mediumImgHeight=$mediumImg.height()

    $("#maskTop").hover(function () {
      //显示小黄块、大图容器、加载图标
      $mask.show()
      $largeImgContainer.show()
      $loading.show()
      //设置大图路径
      var src=$mediumImg.attr("src").replace('-m.', '-l.')
      $largeImg.attr("src" ,src )

      //大图加载完成
      $largeImg.on("load",function () {
        var largeImgWidth=$largeImg.width()
        var largeImgHeight=$largeImg.height()

        //设置大图容器大小
        $largeImgContainer.css({
          width:largeImgWidth/2,
          height:largeImgHeight/2
        })

        //显示大图，关闭加载图标
        $largeImg.show()
        $loading.hide()

        //鼠标移动设置偏移量
        $("#maskTop").mousemove(function (event) {
          var left=event.offsetX-maskWidth/2
          var top=event.offsetY-maskHeight/2
          if (left<0){
            left=0
          }else if (left>$mask.width()) {
            left = $mask.width()
          }
          if (top<0){
            top = 0
          }else if (top>$mask.height()){
            top = $mask.height()
          }
          //小黄块位置
          $mask.css({
            left:left,
            top:top
          })
          //大图显示对应位置
          $("#largeImg").css({
            left:-left*largeImgWidth/mediumImgWidth,
            top:-top*largeImgHeight/mediumImgHeight
          })
        })
       })

      //移除函数
    },function () {
      $mask.hide()
      $largeImgContainer.hide()
      $largeImg.hide()
       }
    )
  }

  //10.当鼠标悬停在某个图片时，上方显示其中图
  function medianImg(){
    $("#icon_list>li").hover(function () {
      var src=$(this).children().attr("src").replace(".jpg","-m.jpg")
      $(this).children().addClass("hoveredThumb")
      $("#mediumImg").attr("src",src)
    },function () {
      $(this).children().removeClass("hoveredThumb")
    })
  }

  //9.点击向右向左，移动当前展示商品的小图片
  function commodityImg() {
    var $a1=$("#preview>h1>a:eq(0)")
    var $a2=$("#preview>h1>a:eq(1)")
    var $icon=$("#icon_list")
    var $liArr=$icon.children()
    var img=62
    var counter=0

    //初始化按钮
    if ($liArr.length>5){
      $a2.attr("class" ,"forward")
    }

    //点击向左按钮响应
    $a1.click(function () {
      if (counter===0){
        return
      }
      counter--
      $a2.attr("class" ,"forward")
      $icon.css("left",-img*counter)
      if (counter===0) {
        $a1.attr("class","backward_disabled")
      }
    })

    //点击向右按钮响应
    $a2.click(function () {
      if (counter===$liArr.length-5){
        return
      }
      counter++
      $a1.attr("class" ,"backward")
      $icon.css('left',-img*counter)
      if (counter===$liArr.length-5) {
        $a2.attr("class","forward_disabled")
      }
    })
  }

  //8.点击切换产品选项
  function productTaps() {
    var $product_detail=$("#product_detail")
    var $productli=$product_detail.children(":first").children()
    var $productdiv=$product_detail.children("div:gt(0)")
    var index=0
    $productli.click(function () {
      var liindex=$(this).index()
      $productli.eq(index).removeClass()
      $(this).addClass("current")
      $productdiv.eq(index).hide()
      $productdiv.eq(liindex).show()
      index = liindex
    })
  }

  //7.鼠标移入移出切换显示迷你购物车
  function shopCart() {
    var $minicart=$("#minicart")
    $minicart.hover(function () {
      $minicart
        .addClass('minicart')
        .children(":last")
        .show()
    },function () {
      $minicart
        .removeClass('minicart')
        .children(":last")
        .hide()
    })
  }

  //6.点击切换地址tab
  function addressTabs() {
    $("#store_tabs>li").click(function () {
      $("#store_tabs>li").each(function () {
        this.className=""
      })
      this.className="hover"
    })
  }

  //5.鼠标移入移出切换地址的显示隐藏
  function address() {
    var $store_content=$("#store_content")
    var $store_close=$("#store_close")
    $("#store_select").hover(function () {
      $store_content.show()
      $store_close
        .show()
        .click(function () {
          $store_content.hide()
          $store_close.hide()
        })
    },function () {
      $store_content.hide()
      $store_close.hide()
    })
  }

  //4.点击显示或者隐藏更多的分享图标
  function shareIcon() {
    var index=false
    $("#shareMore").click(function () {
      if (index){
        $("#dd").css("width",150)
        $(this).prevAll(":lt(2)").hide()
        index=false
      }
      else{
        $("#dd").css("width",200)
        $(this).prevAll(":lt(2)").show()
        index=true
      }
    })
  }
  
  //3.输入搜索关键字，列表显示匹配的结果
  function textHelp() {
    $("#txtSearch")
      .on("focus keyup",function () {
        var text=this.value.trim()
        if (text)
          $('#search_helper').show()
      })
      .blur(function () {
        $("#search_helper").hide()
      })
  }
  
  //2.鼠标移入移除切换二级菜单隐藏显示
  function hoverMenu(){
    $("#category_items>div").hover(function () {
      $(this).children("div").show()
    },function () {
      $(this).children("div").hide()
    })
  }

  //1.鼠标移入显示，移除隐藏
  //目标：手机京东、客户服务、网站导航、我的京东、购物车结算、全部商品
  function showhide() {
    $("[name=show_hide]").hover(function () {
      var id=this.id
      $("#"+id+"_items").show()
    },function () {
      var id=this.id
      $("#"+id+"_items").hide()
    })
  }
})