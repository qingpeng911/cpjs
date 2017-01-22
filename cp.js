
	// 比较两个子node字符数组的内容，返回含有两个元素的数组，分别记录了不同点的位置
	function CompareChars(v_LeftCharsList, v_RightCharsList) {
		var ResultNewList = new Array;

		var ResultList = new Array;
		var LeftDiffList = new Array;
		var RightDiffList = new Array;

		var LeftIndex = 0;
		var RightIndex = 0;

		var nLeftCharsListLen = v_LeftCharsList.length;
		var nRightCharsListLen = v_RightCharsList.length;

		// 长度相同
		if (nLeftCharsListLen == nRightCharsListLen) {
			for ( var i = 0; i < nLeftCharsListLen; i++) {
				// i位置的字符相同
				if (v_LeftCharsList[i] == v_RightCharsList[i]) {
					// 说明不同之处已经结束
					if (i != LeftIndex) {

						// 加入修改标识 1

						LeftDiffList[LeftDiffList.length] = LeftIndex;
						LeftDiffList[LeftDiffList.length] = i - 1;

						RightDiffList[RightDiffList.length] = RightIndex;
						RightDiffList[RightDiffList.length] = i - 1;
						//alert(1.1 + " : " + LeftIndex + "" + RightIndex);
					}
					// 没有出现不同
					LeftIndex = i + 1;
					RightIndex = i + 1;
				}
			}

			// 不同之处一直到结尾
			if (LeftIndex != nLeftCharsListLen) {

				// 加入修改标识 1

				LeftDiffList[LeftDiffList.length] = LeftIndex;
				LeftDiffList[LeftDiffList.length] = nLeftCharsListLen - 1;

				RightDiffList[RightDiffList.length] = RightIndex;
				RightDiffList[RightDiffList.length] = nLeftCharsListLen - 1;
				//alert(1.2 + " : " + LeftIndex + "" + RightIndex);
			}
			ResultList[0] = LeftDiffList;
			ResultList[1] = RightDiffList;
			return ResultList;
		}

		// 对比双方的长度不相同
		while (LeftIndex < nLeftCharsListLen || RightIndex < nRightCharsListLen) {
			/// left is end
			if (LeftIndex == nLeftCharsListLen) {

				// 加入新增标识 2

				RightDiffList[RightDiffList.length] = RightIndex;
				RightDiffList[RightDiffList.length] = nRightCharsListLen - 1;
				//alert(2 + " : " + RightIndex);
				break;
			}
			/// right is end
			if (RightIndex == nRightCharsListLen) {

				// 加入删除标识 3

				LeftDiffList[LeftDiffList.length] = LeftIndex;
				LeftDiffList[LeftDiffList.length] = nLeftCharsListLen - 1;
				//alert(3 + " : " + LeftIndex);
				break;
			}

			if (v_LeftCharsList[LeftIndex] == v_RightCharsList[RightIndex]) {
				// alert("LeftIndex:"+LeftIndex);
				// alert("RightIndex:"+RightIndex);
				///same
				LeftIndex++;
				RightIndex++;
			} else {
				var i = 0;
				for (i = RightIndex + 1; i < nRightCharsListLen; i++) {
					if (v_LeftCharsList[LeftIndex] == v_RightCharsList[i]) {

						// 加入新增标识 2

						// 右侧新增部分
						RightDiffList[RightDiffList.length] = RightIndex;
						RightDiffList[RightDiffList.length] = i - 1;

						LeftIndex++;
						RightIndex = i + 1;
						break;
					}
				}

				// 右侧已经结束
				if (i == nRightCharsListLen) {///right is over
					i = 0;
					for (i = LeftIndex + 1; i < nLeftCharsListLen; i++) {
						if (v_RightCharsList[RightIndex] == v_LeftCharsList[i]) {

							// 加入删除标识 3

							// 左侧删除部分
							LeftDiffList[LeftDiffList.length] = LeftIndex;
							LeftDiffList[LeftDiffList.length] = i - 1;
							//alert(LeftIndex);
							//alert(i-1);
							RightIndex++;
							LeftIndex = i + 1;
							break;
						}
					}
					// 两侧都结束
					if (i == nLeftCharsListLen) {///left is over, both is diff

						// 加入修改标识 1

						// 两侧完全不同 
						LeftDiffList[LeftDiffList.length] = LeftIndex;
						LeftDiffList[LeftDiffList.length] = LeftIndex;
						RightDiffList[RightDiffList.length] = RightIndex;
						RightDiffList[RightDiffList.length] = RightIndex;
						LeftIndex++;
						RightIndex++;
					}
				}//if (i == nRightCharsListLen)
			}//else
		}//while
		ResultList[0] = LeftDiffList;
		ResultList[1] = RightDiffList;
		return ResultList;
	}

	function getCharList(text) {
		var CharList = new Array;
		for ( var j = 0; j < text.length; j++) {
			CharList[CharList.length] = text.charAt(j);
		}
		return CharList;
	}


	//在页面展示多版本对比结果
   function	showCompareResult(json,resultDom){
	   //添加Version属性
	   json = addVers2json(json);
	   //初始化显示v1版本
	   var content = json[0].DocContent;
	   //将文本内容分割成单个字符组成的数组
	   var arrTextList = new Array;
	   var subLen = 0;
	   arrTextList = getCharList(content);
	   //给每个字符都加上一个span标签
	   for(var i=0;i<arrTextList.length;i++){
		   var node = createElement(arrTextList[i],json[0].Version,"add");
		   resultDom.appendChild(node);
	   }
	   //超过两个版本，进行对比
	   if(json.length >= 2){
		   //迭代显示修改痕迹
		   for(var cpr_index=0;cpr_index < json.length-1;cpr_index++){
		       compareMulti(json[cpr_index],json[cpr_index+1],resultDom,subLen);
		   } 
	   }
	   return resultDom;
   }

   //给json循环添加version属性
   function addVers2json(json){
	   var obj;
       for(var i=0;i<json.length;i++){  
            obj = json[i];
			var n = i+1;
			obj['Version'] = n;
        }
		return json;
   }

   //多版本对比
   function compareMulti(jsonOldV,jsonNewV,resultDom,subLen){
	    //获取两个版本的文本内容
		var content_v1 = jsonOldV.DocContent;
		var content_v2 = jsonNewV.DocContent;
		//var v_nodeLists = ["妄议大管住言行，做方针不是小治上明白人节","妄de议大政方针不是小节22"];
		var v_nodeLists = new Array;
		v_nodeLists.push(content_v1);
		v_nodeLists.push(content_v2);

		//将文本内容分割成单个字符组成的数组
		var arrTextList_v1 = new Array;
		arrTextList_v1 = getCharList(content_v1);
		var arrTextList_v2 = new Array;
		arrTextList_v2 = getCharList(content_v2);
		// v_posLists数组中含有两个元素，分别记录了不同位置的postion位
		var v_posLists = new Array;
		v_posLists = CompareChars(arrTextList_v1, arrTextList_v2); //[[3, 3, 4, 8, 14, 18],[1, 2, 5, 5,12,13]];
		var v1Len = arrTextList_v1.length;
		var v2Len = arrTextList_v2.length;
		//alert("初始删除数组："+v_posLists[0]);
		var sub_list = getSubListBaseV1(v_posLists[0]);
		//alert("合并后的数组："+sub_list);
		var add_list = getAddListBaseV1(v_posLists[1],arrTextList_v2);

		return addNewModify(sub_list,add_list,resultDom,jsonNewV.Version,v1Len,v2Len);
   }

   //得到基于v1长度的V2版本的增量数组
   function getAddListBaseV1(add_list,textList){
	   var rsList = [];
	   var nodeText = "";
	   var part = add_list.length/2;
	   for(var i=0;i<part;i++){
		   nodeText = "";
		   rsList.push(add_list[2*i]);
		   rsList.push(add_list[2*i+1]);
		   //从V2中找出对应的Nodetext
		   for( var n = add_list[2*i]; n <= add_list[2*i+1]; n++) {
				nodeText += textList[n];
			}
		   rsList.push(nodeText);
	   }
	   return rsList;
   }

    //得到基于v1长度的V2版本的删除数组 [0,0,1,1,2,2,3,6]
   function getSubListBaseV1(sub_list){
	   var part = sub_list.length/2;
	   var rsList = [];
	   for(var i=0;i<part;i++){
		   rsList.push(sub_list[2*i]);
		   //下标不连续
		   if(sub_list[2*i+1]+1 != sub_list[2*(i+1)]){
			   rsList.push(sub_list[2*i+1]);
			   continue;
		   }
		   //如果下标连续合并
		   var endIndex = sub_list[2*(i+1)+1];
		   //跳过下一part
		   i+=1;
		   while(i<part){
			   if(sub_list[2*i+1]+1 == sub_list[2*(i+1)]){
				   endIndex = sub_list[2*(i+1)+1];
				   //跳过下一part
			       i+=1;
			   }else{
				   break;
			   }
		   }
		   rsList.push(endIndex);
	   }
	   return rsList;
   }

   //对上一版本添加修改痕迹
   function addNewModify(sub_list,add_list,resultDom,version,v1Len,v2Len){
	   //获取old版本带标签的内容
	   var innerHTML = resultDom.innerHTML;
	   //获取resultDom中所有span标签
	   var nodeChildren = resultDom.getElementsByTagName("SPAN");
	   var realLen = nodeChildren.length;
	   var realIndex = 0;
	   var v1_index = 0;
	   var v2_index = 0;

       //如果该标签不是上个版本删除的，相对下标往前移一位，反之忽略
	   eval("var reg = /^((?!"+version+").*)sub$/;");
	   var i=0;
	   var num = 0;
       while (1)
       {
		   nodeChildren = resultDom.getElementsByTagName("SPAN");
		   if(i == sub_list.length/2){
			  //跳出循环
			  break;
		   }
		   if(realIndex == realLen){
			   v1_index += num;
			   i++;
			   num=0;
			   //跳出循环
			   break;
		   }

		   var begin = sub_list[2*i];
		   var end = sub_list[2*i+1]-sub_list[2*i];
		   if(reg.test(nodeChildren[realIndex].className)){
			   realIndex++;
			   continue;
		   }
		   //
		   if(v1_index == begin){
			   if(nodeChildren[realIndex].className.indexOf("_sub")>0){
				   realIndex++;
				   continue;
			   }else{
				   if(num <= end){
					   nodeChildren = resultDom.getElementsByTagName("SPAN");
				       nodeChildren[realIndex].className = version+"_sub";
					   nodeChildren[realIndex].setAttribute("version", version);
				       nodeChildren[realIndex].setAttribute("method", "sub");
					   realIndex++;
					   num++;
					   continue;
				   }else{
					   v1_index += num;
					   i++;
					   num=0;
				   }
			   }
		   }
		   v1_index++;
		   realIndex++;
       }


	   //添加增加标记
	   var j = 0;
	   realIndex=0;
	   while(1){
		  if(j == add_list.length/3){
			  //跳出循环
			  break;
		  }
		  var begin = add_list[3*j];
		  //匹配以sub结尾的字符串
		  eval("var reg = /^(.*)sub$/;");

		  if(v2_index == begin){
			  var end = add_list[3*j+1];
			  var nodeText = add_list[3*j+2];
			  nodeChildren = resultDom.getElementsByTagName("SPAN");
			  addMethod(nodeText,version,nodeChildren,realIndex);
			  j++;
		  }

		   if(!reg.test(nodeChildren[realIndex].className)){
			   v2_index++;
		   }
		   realIndex++;
	   }
   }

   //更新添加的修改痕迹
   function addMethod(nodeText,version,nodeChildren,begin){
	   	  var textArry = [];
		  textArry = getCharList(nodeText);
		  var nodeStr = "";
		  for(var j=0;j<textArry.length;j++){
			  node = createElement(textArry[j],version,"add");
			  //如果没有上一节点，就在之前插入
			  if(begin==0){
				  var parent = nodeChildren[0].parentNode; 
				  parent.insertBefore(node,nodeChildren[j]);
			  }else{
				  //如果有上一节点，就在之后插入
				  insertAfter(node,nodeChildren[begin-1+j]);
			  }
		  }
   }

   //将指定字符串插入到指定位置
   //EXP:insertIntoStr("ac","qingpeng",0)
   function insertIntoStr(res,des,index){
	   var str = res;
	   eval("var reg = /(.{" + index + "})(.*)/;"); 
       str = str.replace(reg, "$1"+des+"$2");
	   return str;
   }

   //在指定节点后追加兄弟节点
   function insertAfter(newElement, targetElement){    
	   var parent = targetElement.parentNode;    
	   if (parent.lastChild == targetElement) {        
		   // 如果最后的节点是目标元素，则直接添加。因为默认是最后        
		   parent.appendChild(newElement);    
		} else {        
		   parent.insertBefore(newElement, targetElement.nextSibling);        
		   //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面    
		}
	}

   //创建span标签
   function createElement(innerHTML,version,method){
		var node = document.createElement('SPAN');
		node.setAttribute("version", version);
	    node.setAttribute("method", method);
		className=version+"_"+method;
		node.className =className;
	    node.innerHTML = innerHTML;
		return node;
   }
   function createNewElement(innerText,version,method) {
	   var node = document.createElement('SPAN');
	   node.setAttribute("version", version);
	   node.setAttribute("method", method);
	   //设置class用作demo展示修改痕迹，这个可以根据自己的业务需求来做修改
	   node.setAttribute("class","v"+version+"_"+method);
	   node.innerText = innerText;
	   return node;
   } 

	//合并标签
   function merge(resultDom) {
	var nodeChildren = resultDom.getElementsByTagName("SPAN");
	var resultDom = document.createElement('div');
	var text1="";
	for (var i = 0; i < nodeChildren.length; i++) {
		var n = i + 1;
		if (n< nodeChildren.length) {// 数组下标不越界
			// 比较前后两个标签class是否相同，如果相同合并为一个标签
			if (nodeChildren[i].className == nodeChildren[n].className) {
				text1 += nodeChildren[i].innerText;
				method1 = nodeChildren[i].getAttribute("method");
				version1 = nodeChildren[i].getAttribute("version");
				if (i < nodeChildren.length - 1) {
					continue;
				}
			} else {
				text = nodeChildren[i].innerText;
				method = nodeChildren[i].getAttribute("method");
				version = nodeChildren[i].getAttribute("version");
			}
			if (text1 != "") {
				if(i <= nodeChildren.length-2) {
				text1 += nodeChildren[i].innerText;
				}else{
					text1+=nodeChildren[n].innerText;
				}
				resultDom.appendChild(createNewElement(text1,version1,method1));
				text1 = "";
			} else {
				resultDom.appendChild(createNewElement(text,version,method));
			}
		}else{//最后位处理
			var k=i-1;
			if (nodeChildren[i].className == nodeChildren[k].className) {
				text1 += nodeChildren[i].innerText;
				resultDom.appendChild(createNewElement(text1,version1,method1));
			}else{
				text = nodeChildren[i].innerText;
				method = nodeChildren[i].getAttribute("method");
				version = nodeChildren[i].getAttribute("version");
				resultDom.appendChild(createNewElement(text,version,method));
			}
		}
	}
	return resultDom.innerHTML;
}
   //执行比较
   function Compare(json,resultDom) {
	//复位（初始化），清除dom元素中的子内容
	while (resultDom.hasChildNodes()) {
		resultDom.removeChild(resultDom.firstChild);
	}
	var dom = merge(showCompareResult(json,resultDom));
	console.log(dom);
	return dom;
  }

   function parseDom(arg) {

　　 var objE = document.createElement("div");

　　 objE.innerHTML = arg;

　　 return objE.childNodes;

};