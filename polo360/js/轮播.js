{var ul1=document.getElementById("ul1");
var ul2=document.getElementById("ul2");
var imgArr=ul1.getElementsByTagName("img");
var aArr=ul2.getElementsByTagName("a");
var aimgArr=ul2.getElementsByTagName("img");
var offset=0,index=0,biaoshi;

ul1.style.width=imgArr.length*960+"px";
//ul2.style.left=(940-ul2.offsetWidth)/2+"px";


//				function setA(){
//					for(var j=0;j<aArr.length;j++)
//					{
//						aArr[j].style.background="";
//						}
//					aArr[index].style.background="black";
//				}
//				setA();
//aArr[1].style.background="black";


//获取样式
function getstyle(obj,stylename){
	return window.getComputedStyle(obj,null)[stylename]||obj.currentStyle[stylename];
}
//修改样式
function setstyle(obj,stylename,speed,timer,end,fun){
	//首先判断显示值是否大于目标值end，如果大于则将其增值speed设为负
	if(parseInt(getstyle(obj,stylename))>end){
			speed=-speed;
	}
	//每一次调用前关闭上一次定时，以免嵌套。*****
	clearInterval(obj.time);
	//为每一个调用的对象添加一个time属性，后期便于关闭
	obj.time=setInterval(function(){
		//在原有的显示属性值上进行增减，以达到目标值
		obj.style[stylename]=parseInt(getstyle(obj,stylename))+speed+"px";
		//当speed小于0时，每改变一次显示值，进行一次判断看是否超出或达到目标值，
		//然后将目标值设置给属性
		if(speed<0){
			if(parseInt(getstyle(obj,stylename))<=end){
				obj.style[stylename]=end+"px";
				//设置完毕后切记要关闭定时函数*****，不然会出现各种难以解释的现象
				clearInterval(obj.time);
				//所有设置完成后，调用传进的回调函数
				fun();
			}
		}
		else{
			if(parseInt(getstyle(obj,stylename))>=end){
				obj.style[stylename]=end+"px";	
				clearInterval(obj.time);
				fun();
			}	
		}				
	},timer);
};
//设置自动播放函数
function move(){
	//为自动播放定时函数设置一个标识符，便于后期关闭
	biaoshi=setInterval(function(){
		//计算ul1的偏移量
		index++;
		index%=imgArr.length;
		offset=-960*index
		//调用设置样式函数
		setstyle(ul1,"left",10,10,offset,function(){
			if(index>=imgArr.length-1){
				index=0;
				ul1.style.left=0;
			}
			//初始化a的样式
			for(var j=0;j<aArr.length;j++){
				aimgArr[j].src="img/yuan.png";
			}
			//设置a的样式，通过index与img的显示达成同步，设置之前需要先初始化a
			aimgArr[index].src="img/yuan2.png";
		})
	},3000);
}
//调用自动播放函数
move();
//设置超链接响应
for(var i=0;i<aArr.length;i++){
	//给每一个a节点添加一个nmb属性，用来判断到底点了哪个a，
	aArr[i].nmb=i;
	
	aArr[i].onclick=function(){
		//点击链接后关闭自动播放
		clearInterval(biaoshi);
		//计算点击后，切换图片的偏移量
		offset=-this.nmb*960;
		//index的作用是让a与img达成同步，所以要把点击的哪个a告诉index
		index=this.nmb;
		setstyle(ul1,"left",5,5,offset,function(){
			//切换完成后，开启自动播放
			move();
		});
		//恢复a的默认值，初始化a
		for(var j=0;j<aArr.length;j++)
		{
			aimgArr[j].src="img/yuan.png";
		}
		//设置a点击后的样式，需要先初始化a
		aimgArr[index].src="img/yuan2.png";
	};
}
}