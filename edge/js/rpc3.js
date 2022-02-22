'use strict';

function save() {
	const sname3 = document.getElementById('sname').value;
	const path3 = document.getElementById('path').value;
	const protocol3 = document.getElementById('protocol').value;
	const host3 = document.getElementById('host').value;
	const port3 = document.getElementById('port').value;
	const interf3 = document.getElementById('interf').value;
	const token3 = document.getElementById('token').value;
	chrome.storage.local.set({
		sname3,
		path3,
		protocol3,
		host3,
		port3,
		interf3,
		token3,
	}, () => {
		const status = document.getElementById('status');
		status.textContent = chrome.i18n.getMessage("OP_saveComplete");
		setTimeout(() => {
			status.textContent = '';
		}, 750);
	});
}

function test() {
	const protocol = document.getElementById('protocol').value;
	const host = document.getElementById('host').value;
	const port = document.getElementById('port').value;
	const interf = document.getElementById('interf').value;
	const token = document.getElementById('token').value;

	var sec = false;
	if (protocol.toLowerCase() == "https" || protocol.toLowerCase() == "wss") {
		sec = true;
	}
	var options = {
		host: host,
		port: port,
		secure: sec,
		secret: token,
		path: "/" + interf
	};

	var aria2 = new Aria2(options);
	aria2.getVersion().then(
		function (res) {
			console.log(res);
			document.getElementById("status").textContent = 'version ' + res.version + ' detected';
		},
		function (err) {
			console.log(err);
			document.getElementById("status").textContent = err;
		}
	);
}

function restore() {
	chrome.storage.local.get(Object.assign(config.command.s3), prefs => {
		document.getElementById('sname').value = prefs.sname3;
		document.getElementById('path').value = prefs.path3;
		document.getElementById('protocol').value = prefs.protocol3;
		document.getElementById('host').value = prefs.host3;
		document.getElementById('port').value = prefs.port3;
		document.getElementById('interf').value = prefs.interf3;
		document.getElementById('token').value = prefs.token3;
	});
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = chrome.i18n.getMessage(n.dataset.message);
	});
	document.body.style = "direction: " + chrome.i18n.getMessage("direction");
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
document.getElementById('test').addEventListener('click', test);