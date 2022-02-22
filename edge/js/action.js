'use strict';

function handleResponse(message) {
	//console.log(message);
	switch (message.response) {
		case "send success":
			break;
		default:
			console.log("Message from the content script: " + request.get);
	}
}

function handleError(error) {
	console.log(error);
}

function sw(e) {
	//console.log(e);
	var sending = chrome.runtime.sendMessage({
		get: "changeState",
		checked: e.target.checked
	});
	if(sending) sending.then(handleResponse, handleError);
}

function option() {
	var optionUrl = "../ui/menu.html";
	//console.log("1:" + ariangUrl);
	chrome.tabs.create({
		url: optionUrl
	});
	window.close();
}

function detail() {
	chrome.storage.local.get("initialize", item => {
		if (!item.initialize || (item.initialize == undefined)) {
			chrome.runtime.openOptionsPage();
				chrome.notifications.create({
				type: 'basic',
				iconUrl: '../imgs/32.png',
				title: chrome.i18n.getMessage("extensionName"),
				message: chrome.i18n.getMessage("error_setConfig")
			});
		} 
		else {
			var rpc = document.querySelector(".s1").value;
			var autoSetNG = false;

			chrome.storage.local.get(Object.assign(config.command.guess), item =>{
				autoSetNG = item.autoSet;
				//console.log("0:" + autoSetNG);
				if(rpc == "1")
				{
					//console.log("1:" + autoSetNG);
					var ariangUrl = "../ui/ariang/index.html";
					if (autoSetNG) {
						ariangUrl += "#!/settings/rpc/set/";
						ariangUrl += (item.protocol + "/" + item.host + "/" + item.port + "/" + 
						item.interf + "/" + btoa(item.token));
					}
					//console.log("1:" + ariangUrl);
					chrome.tabs.create({
						url: ariangUrl
					});
					window.close();
				} 
				else if(rpc == "2") {
					//console.log("2:" + autoSetNG);
					chrome.storage.local.get(config.command.s2, function(item) {
						var ariangUrl = "../ui/ariang/index.html";
						if (autoSetNG) {
							ariangUrl += "#!/settings/rpc/set/";
							ariangUrl += (item.protocol2 + "/" + item.host2 + "/" + item.port2 + "/" + 
							item.interf2 + "/" + btoa(item.token2));
						}
						//console.log("2:" + ariangUrl);
						browser.tabs.create({
							url: ariangUrl
						});
						window.close();
					});
				}
				else if(rpc == "3") {
					chrome.storage.local.get(config.command.s3, function(item) {
						var ariangUrl = "../ui/ariang/index.html";
						if (autoSetNG) {
							ariangUrl += "#!/settings/rpc/set/";
							ariangUrl += (item.protocol3 + "/" + item.host3 + "/" + item.port3 + "/" + 
							item.interf3 + "/" + btoa(item.token3));
						}
						//console.log("3:" + ariangUrl);
						chrome.tabs.create({
							url: ariangUrl
						});
						window.close();
					});
				}
			});
		}
	});	
}

function launch() {
	document.getElementById('switch').addEventListener('change', sw);
	document.getElementById('option').addEventListener('click', option);
	document.getElementById('detail').addEventListener('click', detail);
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = chrome.i18n.getMessage(n.dataset.message);
	});
	chrome.storage.local.get("enabled", function(item) {
		document.getElementById('switch').checked = item.enabled;
	});

	chrome.storage.local.get(Object.assign(config.command.guess), prefs => {
		var stext = document.querySelector(".s1").options[0].text;
		if(prefs.sname == "")
			document.querySelector(".s1").options[0].text = prefs.host  + ":" + prefs.port + " - " + stext;
		else
			document.querySelector(".s1").options[0].text = prefs.sname + " - " + stext;
	});
	chrome.storage.local.get(Object.assign(config.command.s2), prefs => {
		if(prefs.sname2 == "")
			document.querySelector(".s1").options[1].text = prefs.host2 + ":" + prefs.port2;
		else
			document.querySelector(".s1").options[1].text = prefs.sname2;
	});
	chrome.storage.local.get(Object.assign(config.command.s3), prefs => {
		if(prefs.sname3 == "")
			document.querySelector(".s1").options[2].text = prefs.host3 + ":" + prefs.port3;
		else
			document.querySelector(".s1").options[2].text = prefs.sname3;
	});
}
document.addEventListener('DOMContentLoaded', launch);