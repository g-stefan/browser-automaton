//
// Browser Automaton Extension
//
// Copyright (c) 2017 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

var BrowserAutomaton= {};

BrowserAutomaton.allowedLink=[];

BrowserAutomaton.getOptions=function(fnNext) {
	chrome.storage.sync.get({
		allowedLink: "[]"
	}, function(items) {
		try {
			BrowserAutomaton.allowedLink=JSON.parse(items.allowedLink);
		} catch(e) {
			BrowserAutomaton.allowedLink=[];
		};
		fnNext();
	});
};

BrowserAutomaton.elId="_900f26b2be9dd71e165c97b8168310eeeb1c7ef878d3cc2fa3d3f177e103ff21";
BrowserAutomaton.fnName="_3dc656c5131d62c8fac57caec67613bb6ccbb05476c8ad39c785cbf5a5af348d";
BrowserAutomaton.fnCheck="44d5333afbc046f0a4a00e86c2b5bbbd35e2fab8d2902d973e8030e419baa591";

BrowserAutomaton.process=function(elId,tabId,fnName,fnCheck) {

	var automatonElement=document.getElementById(elId);
	if(automatonElement) {
		return "";
	};

	automatonElement=document.createElement("div");
	automatonElement.id = elId;
	automatonElement.style.display = "none";
	automatonElement.innerHTML = "";
	document.body.appendChild(automatonElement);

	var automatonScript = document.createElement("script");
	automatonScript.textContent = "(function(){\r\n"+
				      "var counter=0;\r\n"+
				      "var processEvent=function(){\r\n"+
				      "\tvar retV=\"undefined\";\r\n"+
				      "\tif(typeof("+fnName+")===\"undefined\"){\r\n"+
				      "\t\tretV=\"loading\";\r\n"+
				      "\t}else{\r\n"+
				      "\t\tretV="+fnName+"();\r\n"+
				      "\t\t"+fnName+"=function(){return \"undefined\";};\r\n"+
				      "\t};\r\n"+
				      "\tif(retV===\"loading\"){\r\n"+
				      "\t\t++counter;\r\n"+
				      "\t\tif(counter >= 15){\r\n"+
				      "\t\t\tdocument.getElementById(\""+elId+"\").innerHTML=\"undefined\";\r\n"+
				      "\t\t\treturn;\r\n"+
				      "\t\t};\r\n"+
				      "\t\tsetTimeout(function(){\r\n"+
				      "\t\t\tprocessEvent();\r\n"+
				      "\t\t},1000);\r\n"+
				      "\t\treturn;\r\n"+
				      "\t};\r\n"+
				      "\tdocument.getElementById(\""+elId+"\").innerHTML=retV;\r\n"+
				      "};\r\n"+
				      "processEvent();\r\n"+
				      "})();\r\n";

	(document.head||document.documentElement).appendChild(automatonScript);

	return fnCheck;
};

BrowserAutomaton.procesResponse=function(tabId) {
	var counter=0;
	var processEvent=function(){
		chrome.tabs.executeScript(tabId, {
			code: "document.getElementById(\""+BrowserAutomaton.elId+"\").innerHTML;"
		},function(result) {
			if((""+result).length>0) {
				if((""+result)==="undefined"){
					return;
				};
				(new Function(atob(""+result)))(tabId);
				return;
			};
			++counter;
			if(counter>15){
				return;
			};
			setTimeout(function() {
				processEvent();
			},1000);
		});
	};
	processEvent();
};

BrowserAutomaton.procesLink=function(tabId) {
	chrome.tabs.executeScript(tabId, {
		code: "("+BrowserAutomaton.process+").apply(undefined,"+JSON.stringify([
			BrowserAutomaton.elId,
			tabId,
			BrowserAutomaton.fnName,
			BrowserAutomaton.fnCheck
		])+");"
	},function(result) {
		if((""+result)===BrowserAutomaton.fnCheck) {
			BrowserAutomaton.procesResponse(tabId);
		};
	});
};

BrowserAutomaton.procesTab=function(tabId, tab) {
	if(tab.url.indexOf("extension=23ab9c0e7b432f42000005202e2cfa11889bd299e36232cc53dbc91bc384f9b3")>=0) {
		if(tab.url.indexOf("://localhost:14001/")>=0) {
			BrowserAutomaton.procesLink(tabId);
			return;
		};
		BrowserAutomaton.getOptions(function() {
			if(Array.isArray(BrowserAutomaton.allowedLink)) {
				for(k=0; k<BrowserAutomaton.allowedLink.length; ++k) {
					if(BrowserAutomaton.allowedLink[k].length>4) {
						if(tab.url.indexOf("://"+BrowserAutomaton.allowedLink[k])>=0) {
							BrowserAutomaton.procesLink(tabId);
							return;
						};
					};
				};
			};
		});
	};
};

BrowserAutomaton.listenTab=function(tabId,tab) {
	if(typeof(tab.status) === "undefined") {
		setTimeout(function() {
			BrowserAutomaton.listenTab(tabId,tab);
		},1000);
		return;
	};

	if(tab.status === "complete") {
		BrowserAutomaton.procesTab(tabId, tab);
	};
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status === "complete") {
		BrowserAutomaton.procesTab(tabId, tab);
		return;
	};
	if(typeof(changeInfo.status) === "undefined") {
		if(tab.status === "complete") {
			BrowserAutomaton.procesTab(tabId, tab);
			return;
		};
		BrowserAutomaton.listenTab(tabId, tab);
	};
});

chrome.tabs.query({currentWindow:true,status:"complete"},function(tabs) {
	for(var k=0; k<tabs.length; ++k) {
		BrowserAutomaton.procesTab(tabs[k].id, tabs[k]);
	};
});

