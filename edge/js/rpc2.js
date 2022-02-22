'use strict';

function save() {
	const sname2 = document.getElementById('sname').value;
	const path2 = document.getElementById('path').value;
	const protocol2 = document.getElementById('protocol').value;
	const host2 = document.getElementById('host').value;
	const port2 = document.getElementById('port').value;
	const interf2 = document.getElementById('interf').value;
	const token2 = document.getElementById('token').value;
	chrome.storage.local.set({
		sname2,
		path2,
		protocol2,
		host2,
		port2,
		interf2,
		token2,
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
	chrome.storage.local.get(Object.assign(config.command.s2), prefs => {
		document.getElementById('sname').value = prefs.sname2;
		document.getElementById('path').value = prefs.path2;
		document.getElementById('protocol').value = prefs.protocol2;
		document.getElementById('host').value = prefs.host2;
		document.getElementById('port').value = prefs.port2;
		document.getElementById('interf').value = prefs.interf2;
		document.getElementById('token').value = prefs.token2;
	});
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = chrome.i18n.getMessage(n.dataset.message);
	});
	document.body.style = "direction: " + chrome.i18n.getMessage("direction");
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
document.getElementById('test').addEventListener('click', test);