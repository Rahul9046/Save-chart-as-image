//arguments for connect_and_render are as follows:server_name,user_name,password,database_name,table_name

var connect_and_render=(function(){
	var xmlhttp = new XMLHttpRequest(),db;
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
				var db_object=this.responseText;
				render(db_object);
            }
        };
        xmlhttp.open("GET", "scripts/fetch_data.php?server="+arguments[0]+"&username="+arguments[1]+"&password="+arguments[2]+"&database="+arguments[3]+"&table="+arguments[4], true);
        xmlhttp.send();

});
function sendSVG(type) 
{
    var canvas=document.createElement("canvas");
    canvas.setAttribute("id","canvas");
    canvas.setAttribute("width",1030);
    canvas.setAttribute("height",1030);
            var ctx = canvas.getContext('2d');
            var data=document.getElementById("render").querySelector("svg").parentNode.innerHTML;
            var DOMURL = window.URL || window.webkitURL || window;
            var img = new Image();
            var svg = new Blob([data], {type: 'image/svg+xml'});
            var url = DOMURL.createObjectURL(svg);
            img.onload = function() {
            ctx.drawImage(img, -150, 0,1030,1030,-750,100,2000,2000);
            DOMURL.revokeObjectURL(url);
            downloadCanvas(canvas,type);
            }
            img.src = url;
            
            
}
function downloadCanvas(canvas,type){
     var link=document.createElement("A");
     link.innerHTML="DOwnload";
     var dataURL=canvas.toDataURL('image/png').replace("image/png","image/octet-stream");
    link.setAttribute("href",dataURL);
    link.download="statistic_chart."+type;
    link.click();
}

var render=(function(obj){
	obj=JSON.parse(obj);
        var paper=Logan("render",1000,1000),context_menu_mutex=1;
        paper.click(function(e){
           console.log(e.clientX+" , "+e.clientY);
        });
	var pallete=['red','green','blue','yellow','orange','turquoise','violet','indigo','grey','chocolate','pink','aqua','darkgoldenrod','darkgreen']
	var main_heading=paper.text(290,25,"Stack Overflow Developer's survey 2016").attr({"font-size":25,"font-family":"Candara"});
        main_heading.castShadow(true);
        var bg=paper.path("M270,50 L800,50 L800,450 L200,450 L200,120 z").attr({"fill":["grey",0.3]});
        var fold=paper.path("M200,120 A100,100 0 0,1 270,100 A100,100 0 0,1 270,50 z").attr({"fill":["315-grey:40-white-grey"],"stroke":["none"]});
        bg.castShadow(true,10,10);
	var total=0;
	for(var i=0;i<obj.length;i++){
		total+=Number(obj[i].percentage);
	}
         var bg_arc=paper.path("M 625,250 A125,125 0 1,0 625,251").attr({"stroke":["none"]}),
            inner_arc=paper.path("M 530,250 A30,30 0 1,0 530,251").attr({"stroke":["none"]}),
            outer_arc=paper.path("M 655,250 A155,155 0 1,0 655,251").attr({"stroke":["none"]}),
            segments=[],path=[],start_point={"x":625,"y":250},end_point={},
	    bg_arc_length=bg_arc.getTotalLength(),
            inner_arc_length=inner_arc.getTotalLength(),
            outer_arc_length=outer_arc.getTotalLength(),
            incr=0,x_div=500,y_div=250,label_point=[],new_point,outer_point,label_line=[];
	for(var i=0;i<obj.length;i++){
		if(i!==obj.length-1){
          end_point=bg_arc.getPointAtLength((Number(obj[i].percentage)+incr)/total*bg_arc_length);
		  segments[i]=paper.path("M500,250 L"+start_point.x+","+start_point.y).attr({"fill":[pallete[i]],"stroke":["none"]});
                  segments[i].setAttribute("data-out",0);
		  path[i]="M500,250 L"+start_point.x+","+start_point.y+" A125,125 0 0,0 "+end_point.x+","+end_point.y+" z";
		  start_point=end_point;
		}
		else{
			segments[i]=paper.path("M500,250 L"+start_point.x+","+start_point.y).attr({"fill":[pallete[i]],"stroke":["none"]});
			path[i]="M500,250 L"+start_point.x+","+start_point.y+" A125,125 0 0,0 625,250 z";
                        segments[i].setAttribute("data-out",0);
		}
		  label_point[i]=bg_arc.getPointAtLength((Number(obj[i].percentage)/2+incr)/total*bg_arc_length);
                  new_point=inner_arc.getPointAtLength((Number(obj[i].percentage)/2+incr)/total*inner_arc_length);
                  outer_point=outer_arc.getPointAtLength((Number(obj[i].percentage)/2+incr)/total*outer_arc_length);
		  if(label_point[i].x>=x_div){
			  if(label_point[i].y<=y_div){
			      label_line[i]=paper.path("M"+label_point[i].x+","+label_point[i].y+" L"+(label_point[i].x+20)+","+(label_point[i].y-50)+" L"+(label_point[i].x+60)+","+(label_point[i].y-50)).attr({"stroke":["black",1.5]});
			      var label=paper.text(label_point[i].x+60,label_point[i].y-50,obj[i].technology).attr({"text-anchor":"start","font-family":"Comic Sans MS"});
			  }
		     else{
			      label_line[i]=paper.path("M"+label_point[i].x+","+label_point[i].y+" L"+(label_point[i].x+20)+","+(label_point[i].y+50)+" L"+(label_point[i].x+60)+","+(label_point[i].y+50)).attr({"stroke":["black",1.5]});
			      var label=paper.text(label_point[i].x+60,label_point[i].y+50,obj[i].technology).attr({"text-anchor":"start","font-family":"Comic Sans MS"});
			 }
		  }
		  else{
			  if(label_point[i].y<=y_div){
			      label_line[i]=paper.path("M"+label_point[i].x+","+label_point[i].y+" L"+(label_point[i].x-20)+","+(label_point[i].y-50)+" L"+(label_point[i].x-60)+","+(label_point[i].y-50)).attr({"stroke":["black",1.5]});
			      var label=paper.text(label_point[i].x-60,label_point[i].y-50,obj[i].technology).attr({"text-anchor":"end","font-family":"Comic Sans MS"});
			  }
		     else{
			      label_line[i]=paper.path("M"+label_point[i].x+","+label_point[i].y+" L"+(label_point[i].x-20)+","+(label_point[i].y+50)+" L"+(label_point[i].x-60)+","+(label_point[i].y+50)).attr({"stroke":["black",1.5]});
			      var label=paper.text(label_point[i].x-60,label_point[i].y+50,obj[i].technology).attr({"text-anchor":"end","font-family":"Comic Sans MS"});
			 }
		  }
		  incr+=Number(obj[i].percentage);
                  
 
                 
		 var assign_animations=(function(j,new_point,outer_point){	
			  var animation=paper.animation({"path":path[j]},15*(j+1)+1,1,15*j+1);
			  segments[j].animateIt(animation);
			  var tool_tip,tool_text;
                            
                            segments[j].click(function(){ 
                                
                                if(this.dataset.out==0){
                                  if(label_point[j].x>=x_div){
			            if(label_point[j].y<=y_div){
			              var animatePath=paper.animation({"path":"M"+outer_point.x+","+outer_point.y+" L"+(label_point[j].x+30)+","+(label_point[j].y-50)+" L"+(label_point[j].x+60)+","+(label_point[j].y-50)},600,1,"indefinite");
			              label_line[j].animateIt(animatePath);
                                   }
		                   else{
			              var animatePath=paper.animation({"path":"M"+outer_point.x+","+outer_point.y+" L"+(label_point[j].x+30)+","+(label_point[j].y+50)+" L"+(label_point[j].x+60)+","+(label_point[j].y+50)},600,1,"indefinite");
			              label_line[j].animateIt(animatePath);
                                      
			             }
		                   }
		                  else{
			            if(label_point[j].y<=y_div){
			              var animatePath=paper.animation({"path":"M"+outer_point.x+","+outer_point.y+" L"+(label_point[j].x-30)+","+(label_point[j].y-50)+" L"+(label_point[j].x-60)+","+(label_point[j].y-50)},600,1,"indefinite");
			              label_line[j].animateIt(animatePath);
			               }
		                    else{
			              var animatePath=paper.animation({"path":"M"+outer_point.x+","+outer_point.y+" L"+(label_point[j].x-30)+","+(label_point[j].y+50)+" L"+(label_point[j].x-60)+","+(label_point[j].y+50)},600,1,"indefinite");
			              label_line[j].animateIt(animatePath);
			         }
		                }

                                 var animMotion=paper.animateMotion({path:"M0,0 l"+(new_point.x-500)+","+(new_point.y-250)},600,1,"indefinite");  
                                 this.dataset.out=1;
                                }
                                
                                else{                               
                                 if(label_point[j].x>=x_div){
			            if(label_point[j].y<=y_div){
			              var animatePath=paper.animation({"path":"M"+label_point[j].x+","+label_point[j].y+" L"+(label_point[j].x+20)+","+(label_point[j].y-50)+" L"+(label_point[j].x+60)+","+(label_point[j].y-50)},600,1,"indefinite");
			              label_line[j].animateIt(animatePath);
                                   }
		                   else{
			              var animatePath=paper.animation({"path":"M"+label_point[j].x+","+label_point[j].y+" L"+(label_point[j].x+20)+","+(label_point[j].y+50)+" L"+(label_point[j].x+60)+","+(label_point[j].y+50)},600,1,"indefinite");
			              label_line[j].animateIt(animatePath);
                                      
			             }
		                   }
		                  else{
			            if(label_point[j].y<=y_div){
			              var animatePath=paper.animation({"path":"M"+label_point[j].x+","+label_point[j].y+" L"+(label_point[j].x-20)+","+(label_point[j].y-50)+" L"+(label_point[j].x-60)+","+(label_point[j].y-50)},600,1,"indefinite");
			              label_line[j].animateIt(animatePath);
			               }
		                    else{
			              var animatePath=paper.animation({"path":"M"+label_point[j].x+","+label_point[j].y+" L"+(label_point[j].x-20)+","+(label_point[j].y+50)+" L"+(label_point[j].x-60)+","+(label_point[j].y+50)},600,1,"indefinite");
			              label_line[j].animateIt(animatePath);
			          }
		                  }
                                
                                var animMotion=paper.animateMotion({path:"M"+(new_point.x-500)+","+(new_point.y-250)+" L0,0"},600,1,"indefinite");
                                this.dataset.out=0;
                                }
                                this.animateIt(animMotion);
                                animMotion.beginElement();
                                animatePath.beginElement();
                            });

			  segments[j].mouseover(function(e){
				  this.attr({"fill":[pallete[j],0.4]});
				  tool_tip=paper.rect(e.clientX,e.clientY,130,20).attr({"fill":["white",0.5]});
				  tool_text=paper.text(e.clientX+65,e.clientY+15,obj[j].technology+"-"+obj[j].percentage+"%").attr({"text-anchor":"middle"});
			  });
			  segments[j].mousemove(function(e){
				  tool_tip.setAttribute("x",e.clientX);
				  tool_tip.setAttribute("y",e.clientY);
				  tool_text.setAttribute("x",e.clientX+65);
				  tool_text.setAttribute("y",e.clientY+15);
			  });
			  segments[j].mouseout(function(e){
				  this.attr({"fill":[pallete[j],1]});
				  tool_tip.remove();
				  tool_text.remove();
			  });
		    })(i,new_point,outer_point);
		
	}

   bg.contextmenu(function(e){
     e.preventDefault();
     if(context_menu_mutex){
     context_menu_mutex=0;
     var exp_as_jpg_btn=paper.rect(e.clientX,e.clientY,150,30).attr({"fill":["lightgrey"],"stroke":["black",0.3]});
     var exp_as_jpg_txt=paper.text(e.clientX+75,e.clientY+20,"Export as JPEG").attr({"text-anchor":"middle","font-family":"BrowalliaUPC","font-size":20});
     var exp_as_png_btn=paper.rect(e.clientX,e.clientY+30,150,30).attr({"fill":["lightgrey"],"stroke":["black",0.3]});
     var exp_as_png_txt=paper.text(e.clientX+75,e.clientY+50,"Export as PNG").attr({"text-anchor":"middle","font-family":"BrowalliaUPC","font-size":20});
     var exp_as_bmp_btn=paper.rect(e.clientX,e.clientY+60,150,30).attr({"fill":["lightgrey"],"stroke":["black",0.3]});
     var exp_as_bmp_txt=paper.text(e.clientX+75,e.clientY+80,"Export as BMP").attr({"text-anchor":"middle","font-family":"BrowalliaUPC","font-size":20});
     var exit_btn=paper.rect(e.clientX,e.clientY+90,150,30).attr({"fill":["lightgrey"],"stroke":["black",0.3]});
     var exit_txt=paper.text(e.clientX+75,e.clientY+110,"Exit").attr({"text-anchor":"middle","font-family":"BrowalliaUPC","font-size":20});
     var removeAll=function(){
        exp_as_jpg_btn.remove();
        exp_as_jpg_txt.remove();
        exp_as_png_btn.remove();
        exp_as_png_txt.remove();
        exp_as_bmp_btn.remove();
        exp_as_bmp_txt.remove();
        exit_txt.remove();
        exit_btn.remove(); 
        context_menu_mutex=1;
     }
     exit_btn.click(removeAll);
     exit_txt.click(removeAll);
     exp_as_jpg_btn.click(function(){removeAll();sendSVG("jpg");});
     exp_as_jpg_txt.click(function(){removeAll();sendSVG("jpg");});
     exp_as_png_btn.click(function(){removeAll();sendSVG("png");});
     exp_as_png_txt.click(function(){removeAll();sendSVG("png");});
     exp_as_bmp_btn.click(function(){removeAll();sendSVG("bmp");});
     exp_as_bmp_txt.click(function(){removeAll();sendSVG("bmp");}); 
     paper.click(removeAll);
 }
   });
  bg_arc.remove();
  inner_arc.remove();
  outer_arc.remove();
       
});