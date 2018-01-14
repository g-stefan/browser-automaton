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
		allowedLink: '[]'
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
	if(!automatonElement) {
		automatonElement=document.createElement("div");
		automatonElement.id = elId;
		automatonElement.style.display = "none";
		automatonElement.innerHTML = "";
		document.body.appendChild(automatonElement);
	};

	automatonElement.innerHTML = "";

	var automatonScript = document.createElement("script");
	automatonScript.textContent = "document.getElementById(\""+elId+"\").innerHTML="+fnName+"();";
	(document.head||document.documentElement).appendChild(automatonScript);

	return fnCheck;
};

BrowserAutomaton.procesResponse=function(tabId) {
	chrome.tabs.executeScript(tabId, {
		code: "document.getElementById(\""+BrowserAutomaton.elId+"\").innerHTML;"
	},function(result) {
		if((""+result).length>0) {
			(new Function(atob(""+result)))(tabId);
			return;
		};
		setTimeout(function() {
			BrowserAutomaton.procesResponse(tabId);
		},100);
	});
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

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status=="complete") {
		BrowserAutomaton.procesTab(tabId, tab);
	};
});

//

chrome.tabs.getAllInWindow(null, function(tabs) {
	for(var k=0; k<tabs.length; ++k) {
		BrowserAutomaton.procesTab(tabs[k].id, tabs[k]);
	};
});

