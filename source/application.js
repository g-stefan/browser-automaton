//
// Browser Automaton Extension
//
// Copyright (c) 2017 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

(function() {

	var browserAutomatonExtensionProcess=function(){

		var appId="_900f26b2be9dd71e165c97b8168310eeeb1c7ef878d3cc2fa3d3f177e103ff21";
		var tabId=arguments[0];

		var automatonElement=document.getElementById(appId);
		if(!automatonElement) {
			automatonElement=document.createElement("div");
			automatonElement.id = appId;
			automatonElement.style.display = "none";
			automatonElement.innerHTML = "";
			document.body.appendChild(automatonElement);
		};

		automatonElement.innerHTML = "";

		var automatonScript = document.createElement("script");
		automatonScript.textContent = "document.getElementById(\""+appId+"\").innerHTML=_3dc656c5131d62c8fac57caec67613bb6ccbb05476c8ad39c785cbf5a5af348d();";
		(document.head||document.documentElement).appendChild(automatonScript);
		
		var procesResponse=function() {
			if(automatonElement.innerHTML.length>0) {
				automatonScript.remove();
				chrome.runtime.sendMessage({type:"BrowserAutomaton","automatonSource":automatonElement.innerText,"tabId":tabId});
				return;
			};

			setTimeout(procesResponse,100);
		};

		setTimeout(procesResponse,100);
	};

	chrome.runtime.onMessage.addListener(function(message) {
		if((typeof message ==="object")&&(message!==null)) {
			if(message.type) {
				if(message.type=="BrowserAutomaton") {
					(new Function(atob(message.automatonSource)))(message.tabId);
				};
			};
		};
	});
                                                    
	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
		if (changeInfo.status == "complete") {
			if(tab.url.indexOf("extension=23ab9c0e7b432f42000005202e2cfa11889bd299e36232cc53dbc91bc384f9b3")>=0) {
				chrome.tabs.executeScript(tabId, {
					code: "("+browserAutomatonExtensionProcess+").apply(undefined,"+JSON.stringify([tabId])+");"
				});
			};
		};
	});

})();
