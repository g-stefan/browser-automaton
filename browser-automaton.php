<?php

//
// Browser Automaton Extension
//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//
?>
<html>
<head>
	<title>Browser Automaton</title>
	<script>
		function _3dc656c5131d62c8fac57caec67613bb6ccbb05476c8ad39c785cbf5a5af348d(){
			return btoa("var retV=("+fnAutomaton+")();var init=retV.init;var processUrl=retV.processUrl;");
		};

		function fnAutomaton(){

			var protect=function(){
				var el=document.createElement("div");
				el.id="browser-automaton-protect";
				el.style.position = "fixed";
				el.style.top = "0px";
				el.style.left = "0px";
				el.style.width = "100%";
				el.style.height = "100%";
				el.style.backgroundColor = "rgba(255,255,255,0.5)";
				el.style.color = "#000000";
				el.style.zIndex = "100000";
				el.style.marginBottom ="0px";
				el.innerHTML = "<center><div style='font-size:24px;font-weright:bold;top:240px;width:320px;background-color:white;line-height:48px;position:relative;border-radius:8px;'>Protected - ##</div></center>";
			
				var fnCheck=function(){
					if(document.body){
						document.body.appendChild(el);
						return;
					};	
					setTimeout(function(){
						fnCheck();
					},100);
				};

				fnCheck();
			};

			var init=function(){

				var el=document.getElementById("helloworld");
				el.innerHTML="Hello world!";

				return {
					firewall:{
						denyAdd:["www\\.facebook\\.com"]
					},
					protect:{
						urlAdd:["www\\.imdb\\.com"],
						code: "("+protect+")();"
					}
				};

			};

			var processUrl=function(){
				var id=this.id;
				var protectCount=15;
				var protectDisable=function(){
					var el=document.getElementById("browser-automaton-protect");
					if(el){
						if(protectCount>0){
							el.innerHTML = "<center><div style='font-size:24px;font-weright:bold;top:240px;width:320px;background-color:white;line-height:48px;position:relative;border-radius:8px;'>Protected - "+protectCount+"</div></center>";
							--protectCount;
							setTimeout(function(){								
								protectDisable();
							},1000);						
							return;
						};
						document.body.removeChild(el);
						chrome.runtime.sendMessage({
							id:id,
							protect:{
								isProtected: false
							}
						});
					};
				};

				console.log(this.protect.isProtected);
				if(this.protect.isProtected){
					protectDisable();
				};

				if(typeof(this.count)=="undefined"){
					this.count=0;
				};
				++this.count;

				console.log(this.url+":"+this.count);

				return {count: this.count};
			};

			return {
				init: init,
				processUrl: processUrl
			};

		};
	</script>
</head>
<body>
	<br>
	<br>
	<br>
	<center>--- Browser Automaton Example ---</center>
	<br>
	<div id="helloworld" style="text-align:center;"></div>
	<br>
	<br>
</body>
</html>