(function (win) {
  win.gesture =function (node) {
    var flag=false
    var startLine,startAngle
    var startScale,startRotate
    
    node.addEventListener("touchstart",function (event) {
      var touch=event.touches
      if (touch.length>=2){
        startLine=GetLine(touch[0],touch[1])
        startAngle=GetAngle(touch[0],touch[1])
        startScale=transformCss(node,"scale")
        startRotate=transformCss(node,"rotate")
        flag=true//end是否执行标识
      }
    })
    node.addEventListener("touchmove",function (event) {
      var touch=event.touches
      if (touch.length>=2){
        var moveLine=GetLine(touch[0],touch[1])
        var moveAngle=GetAngle(touch[0],touch[1])
        var moveScale=moveLine/startLine
        var moveRotate=moveAngle-startAngle
        transformCss(node,"scale",startScale*moveScale)
        transformCss(node,"rotate",startRotate+moveRotate)
      }
    })
    node.addEventListener("touchend",function (event) {
      var touch=event.touches
      if (flag){
        if (touch.length<2) {

        }
      }
    })
    
    win.GetLine=function (p1,p2) {
      var X=p1.clientX-p2.clientX
      var Y=p1.clientY-p2.clientY
      var line=Math.sqrt(X*X+Y*Y)
      return line
    }
    win.GetAngle=function (p1,p2) {
      var X=p1.clientX-p2.clientX
      var Y=p1.clientY-p2.clientY
      var deg=Math.atan2(Y, X)
      return deg*180/Math.PI
    }
  }
})(window)