'use strict';
var advl = false;

function handleResponse(message) {
	//console.log(message);
	switch (message.response) {
		case "all":
			document.getElementById('url').value = message.url;
			document.getElementById('fs').textContent = message.fileSize;
			document.getElementById('fn').value = decodeFn(message.fileName);
			document.querySelector(".head").value = message.header;
			document.getElementById('db').focus();
			break;
		case "send success":
			chrome.windows.getCurrent(function(windowInfo){
				chrome.windows.remove(windowInfo.id);
			});
			break;
		case "saveas create":
			break;
		default:
			console.log("Message from the content script: " + request.get);
	}
}

function handleError(error) {
	chrome.notifications.create({
		type: 'basic',
		iconUrl: '/imgs/48.png',
		title: chrome.i18n.getMessage("extensionName"),
		message: error.message || error
	});
}
//////////////////////////////////////////
///////////////////////////////////////
function init() {
	chrome.runtime.sendMessage({get: "all"}, handleResponse);
	document.documentElement.style.transformOrigin = "left top";
	chrome.storage.local.get(config.command.guess, (item) => {
		document.documentElement.style.transform = "scale(" + item.zoom + ")";
	});
	document.getElementById('db').addEventListener('click', download);
	document.getElementById('sb').addEventListener('click', save);
	document.getElementById('sab').addEventListener('click', saveas);
	document.getElementById('advb').addEventListener('click', adv);
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = chrome.i18n.getMessage(n.dataset.message);
	});
	document.body.style = "direction: " + chrome.i18n.getMessage("direction");

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

function saveWinLoc (){
	chrome.storage.local.get(config.command.guess, (item) => {
		if (item.windowLoc) {
			chrome.windows.getCurrent(function(windowInfo){
				chrome.storage.local.set({
					dpTop: windowInfo.top,
					dpLeft: windowInfo.left
				});
			});
		}
	});
}

function download() {
	const url = document.getElementById('url').value;
	const fn = document.getElementById('fn').value;
	const fp = document.getElementById('fp').value;
	const head = document.querySelector(".head").value
	const rpc = document.querySelector(".s1").value
	var e = verifyFileName(fn);
	if (e.length != 0) {
		document.getElementById('fn').style = "border: 1px solid red;box-shadow: red 0px 0px 4px;";
		document.getElementById('fn').onchange = function() {
			document.getElementById('fn').style = "";
			document.getElementById('fn').onchange = null;
		};
	}
	else {
		chrome.runtime.sendMessage({
			get: "download",
			url: url,
			fileName: fn,
			filePath: fp,
			header: head.split(","),
			server: rpc,
		}, handleResponse);
		saveWinLoc();
	}
}

function save() {
	const url = document.getElementById('url').value;
	const fn = document.getElementById('fn').value;
	const fp = document.getElementById('fp').value;
	const head = document.querySelector(".head").value
	var vn = verifyFileName(fn);

	if (vn.length != 0) {
		document.getElementById('fn').style = "border: 1px solid red;box-shadow: red 0px 0px 4px;";
		document.getElementById('fn').onchange = function() {
			document.getElementById('fn').style = "";
			document.getElementById('fn').onchange = null;
		};
	}
	else {
		chrome.windows.getCurrent(function(windowInfo){
			chrome.runtime.sendMessage({
				get: "save",
				url: url,
				fileName: fn,
				filePath: fp,
				header: head.split(","),
				incognito: windowInfo.incognito,
			}, handleResponse);
		});
		saveWinLoc();
	}
}

function saveas() {
	const url = document.getElementById('url').value;
	const fn = document.getElementById('fn').value;
	const fp = document.getElementById('fp').value;
	const head = document.querySelector(".head").value
	var e = verifyFileName(fn);

	if (e.length != 0) {
		document.getElementById('fn').style = "border: 1px solid red;box-shadow: red 0px 0px 4px;";
		document.getElementById('fn').onchange = function() {
			document.getElementById('fn').style = "";
			document.getElementById('fn').onchange = null;
		};
	}
	else {
		chrome.windows.getCurrent(function(windowInfo){
			chrome.runtime.sendMessage({
				get: "saveas",
				url: url,
				fileName: fn,
				filePath: fp,
				header: head.split(","),
				wid: windowInfo.id,
				incognito: windowInfo.incognito,
			}, handleResponse);
		});
		saveWinLoc();
	}
}

function adv() {
	if (advl == false) {
		chrome.windows.getCurrent(function(windowInfo){
			var updating = chrome.windows.update(windowInfo.id, {
				height: windowInfo.height + 75,
			});
			document.querySelector(".head").style = "display:block";
			advl = true;
		});
	}
	else {
		chrome.windows.getCurrent(function(windowInfo){
			var updating = chrome.windows.update(windowInfo.id, {
				height: windowInfo.height - 75,
			});
			document.querySelector(".head").style = "display:none";
			advl = false;
		});
	}
}

function decodeFn(fn) {
	var res = jschardet.detect(fn).encoding;
	if (res != "ascii") {
		var decoder = new TextDecoder(res);
		var charcode = [];
		for(var i = 0, length = fn.length; i < length; i++) {
			var code = fn.charCodeAt(i);
			charcode.push(code);
		}
		var charcodeUint = new Uint8Array();
		charcodeUint = Uint8Array.from(charcode);
		var out = decoder.decode(charcodeUint);
	}
	else {
		var out = fn;
	}
	return out;
}

document.addEventListener('DOMContentLoaded', init);