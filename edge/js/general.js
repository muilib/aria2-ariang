
'use strict';
function save() {
	const menu = document.getElementById('cm').checked;
	const ua = document.getElementById('ua').checked;
	const shutdown = document.getElementById('shut').checked;
	const windowLoc = document.getElementById('winLoc').checked;
	const auto = document.getElementById('auto').checked;
	const autoSet = document.getElementById('autoSet').checked;
	const badge = document.getElementById('badge').checked;
	const downPanel = document.getElementById('downPanel').checked;
	const cmDownPanel = document.getElementById('cmDownPanel').checked;

	chrome.storage.local.set({
		menu,
		ua,
		shutdown,
		windowLoc,
		auto,
		autoSet,
		badge,
		downPanel,
		cmDownPanel
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
		document.getElementById('cm').checked = prefs.menu;
		document.getElementById('ua').checked = prefs.ua;
		document.getElementById('shut').checked = prefs.shutdown;
		document.getElementById('winLoc').checked = prefs.windowLoc;
		document.getElementById('auto').checked = prefs.auto;
		document.getElementById('autoSet').checked = prefs.autoSet;
		document.getElementById('badge').checked = prefs.badge;
		document.getElementById('cmDownPanel').checked = prefs.cmDownPanel;
		document.getElementById('downPanel').checked = prefs.downPanel;
	});
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = chrome.i18n.getMessage(n.dataset.message);
	});
	document.body.style = "direction: " + chrome.i18n.getMessage("direction");
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);