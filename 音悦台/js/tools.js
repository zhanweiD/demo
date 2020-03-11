(function(w){
	w.addClass=function (node,className){
		var reg=new RegExp("\\b"+className+"\\b");
		if(!reg.test(node.className)){
			node.className +=(" "+className); 
		}
	}
	
	w.removeClass=function (node,className){
		if(node.className){
			var reg=new RegExp("\\b"+className+"\\b");
			var classes = node.className;
			node.className=classes.replace(reg,"");
			
		}
	}
})(window)