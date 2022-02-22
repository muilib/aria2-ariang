
'use strict';


function verifyFileName(name) {
	var tmp = [];
	if (name.match(/[<>:"\/\\|?*\x00-\x1F]/g) != null) {
		tmp = name.match(/[<>:"\/\\|?*\x00-\x1F]/g);
	}

	if (name.search(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i) != -1)
		tmp = tmp.concat(name);
	if (name[name.length - 1] == ' ' || name[name.length - 1] == '.')
		tmp = tmp.concat("Filenames cannot end in a space or dot.");

	console.log(tmp);
	return tmp;
}

function correctFileName(name) {
	return new Promise(resolve =>{
		var tmp = name;
		chrome.runtime.getPlatformInfo(function(e){
			tmp = tmp.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '_');
			if (e.os == "win") {
				if (tmp.search(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i) != -1)
					tmp = '_' + tmp;
				if (tmp[tmp.length - 1] == ' ' || tmp[tmp.length - 1] == '.')
					tmp = tmp.slice(0, tmp.length - 1);
			}
			console.log(tmp);
			resolve(tmp);
		});
	});
}

function monitor(options, gid) {
	if (mon == undefined) {
		mon = new Worker("/js/lib/worker.js");
		mon.onmessage = function(e) {
			console.log(e.data);
			chrome.storage.local.get(config.command.guess, function(item) {
				if (e.data[0] == "complete") {
					notify(chrome.i18n.getMessage("download_complete", e.data[1] ));
					if (item.sound != "0") {
						var audio = new Audio('/sound/complete' + item.sound + '.wav');
						audio.play();
					}
				}
				else if (e.data[0] == "badge" && item.badge){
					if(e.data[1] == 0){
						chrome.browserAction.setBadgeText({text: ""});
						mon = null;
					}
					else {
						chrome.browserAction.setBadgeText({text: e.data[1].toString()});
					}
				}
				else if (e.data[0] == "error"){
					notify(chrome.i18n.getMessage("download_error", e.data[1] ));
				}
			});
		}
	}
	mon.postMessage([options, gid]);
}

function notify(message) {
	chrome.notifications.create({
		type: 'basic',
		iconUrl: '/imgs/48.png',
		title: chrome.i18n.getMessage("extensionName"),
		message: message.message || message
	}, function(id){ 
		setTimeout(function(){
			chrome.notifications.clear(id.toString());
		}, 2000);
	});
}

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

function isRunning(item, aria2) {
	//check whether aria2 is runnning
	var xhttp = new XMLHttpRequest();
	var url = "aria2://start/"
	if (item.shutdown)
		url = "aria2://stop-with-process";
	if (item.protocol.toLowerCase() == "ws" || item.protocol.toLowerCase() == "wss") {
		aria2.open().then(
			function (res) {
				aria2.close();
			},
			function (err) {
				if (item.auto) {
					chrome.windows.create({
						url: url,
						type: "popup",
						width: 50,
						height: 50,
					}, function(windowInfo){
						chrome.windows.remove(windowInfo.id);
					});
				}
			}
		);
	}
	else {
		aria2.getVersion().then(
			function (res) {
				console.log('result', res);
			},
			function (err) {
				if (item.auto) {
					chrome.windows.create({
						url: url,
						type: "popup",
						width: 50,
						height: 50,
					}, function(windowInfo){
						chrome.windows.remove(windowInfo.id);
					});
				}
			}
		);
	}
}

function downloadPanel(d) {
	globalD.push(d);
	//get incognito
	chrome.windows.getCurrent(function(windowInfo){
		chrome.storage.local.get(['dpTop', 'dpLeft', 'dpWidth', 'dpHeight'], item1 => {
			chrome.windows.create({
				top: item1.dpTop,
				left: item1.dpLeft,
				url: "ui/download.html",
				type: "popup",
				width: 412 + parseInt((screen.width / 5000) * parseInt(item1.dpWidth || 0)),
				height: 270 + parseInt(33 * window.devicePixelRatio + (screen.height / 5000) * parseInt(item1.dpHeight || 0)) ,
				incognito: windowInfo.incognito,
				//titlePreface: "Aria2",
				//state: "fullscreen",
			},function(wInfo){
				function handleZoomed(zoomChangeInfo){
					chrome.storage.local.get(config.command.guess, (item) => {
						if (zoomChangeInfo.tabId == wInfo.tabs[0].id) {
							var updating = chrome.windows.update(wInfo.id, {
								focused: true,
								top: item1.dpTop,
								left: item1.dpLeft,
								width: parseInt(412 * zoomChangeInfo.newZoomFactor * item.zoom 
													+ (screen.width / 5000) * parseInt(item1.dpWidth || 0)),
								height: parseInt(270 * zoomChangeInfo.newZoomFactor * item.zoom
													+ 33 * window.devicePixelRatio 
													+ (screen.height / 5000) * parseInt(item1.dpHeight || 0)),
							});
							chrome.tabs.onZoomChange.removeListener(handleZoomed);
						}
					});
				}
				chrome.tabs.onZoomChange.addListener(handleZoomed);
			});
		});
	});
}