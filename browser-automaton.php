<?php

//
// Browser Automaton Extension
//
// Copyright (c) 2017 Grigore Stefan, <g_stefan@yahoo.com>
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
			return btoa("return ("+fnHelloWorld+").apply(this,arguments);");
		};

		function fnHelloWorld(tabId){
			chrome.tabs.executeScript(tabId, {
				code: "alert(\"Hello World!\");"
			});
		};
	</script>
</head>
<body>
	<br>
	<br>
	<br>
	<center>--- Browser Automaton Example ---</center>
	<br>
	<br>
	<br>
</body>
</html>