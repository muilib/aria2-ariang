'use strict';

function save() {
	const fileSizeLimit = document.getElementById('fileSizeLimit').value;
	const typeFilterA = document.getElementById('typeFilterA').value;
	const typeFilterB = document.getElementById('typeFilterB').value;
	const urlFilterA = document.getElementById('urlFilterA').value;
	const urlFilterB = document.getElementById('urlFilterB').value;
	chrome.storage.local.set({
		fileSizeLimit,
		typeFilterA,
		typeFilterB,
		urlFilterA,
		urlFilterB,
	}, () => {
		const status = document.getElementById('status');
		status.textContent = chrome.i18n.getMessage("OP_saveComplete");
		setTimeout(() => {
			status.textContent = '';
		}, 750);
		chrome.runtime.sendMessage({
			get: "loadSettings",
		});
	});
}

function restore() {
	chrome.storage.local.get(Object.assign(config.command.guess), prefs => {
		document.getElementById('fileSizeLimit').value = prefs.fileSizeLimit;
		document.getElementById('typeFilterA').value = prefs.typeFilterA;
		document.getElementById('typeFilterB').value = prefs.typeFilterB
		document.getElementById('urlFilterA').value = prefs.urlFilterA;
		document.getElementById('urlFilterB').value = prefs.urlFilterB;
	});
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = chrome.i18n.getMessage(n.dataset.message);
	});
	document.body.style = "direction: " + chrome.i18n.getMessage("direction");
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);