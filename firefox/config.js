'use strict';
var config = {};
config.command = {
	get guess() {
		return {
			sname:"",
			path: "",
			protocol: "ws",
			host: "127.0.0.1",
			port: "6800",
			interf: "jsonrpc",
			token: "",
			zoom: "1",
			sound: "3",
			menu: false,
			shutdown: false,
			aggressive: false,
			windowLoc: false,
			auto: true,
			autoSet: true,
			chgLog: true,
			badge: true,
			cmDownPanel: true,
			downPanel: true,
			ua: false,
			fileSizeLimit: 0,
			typeFilterA: "",
			urlFilterA: "",
			typeFilterB: "",
			urlFilterB: "",
		};
	},
	get s2() {
		return {
			sname2:"",
			path2: "",
			protocol2: "ws",
			host2: "127.0.0.1",
			port2: "6800",
			interf2: "jsonrpc",
			token2: "",
		};
	},
	get s3() {
		return {
			sname3:"",
			path3: "",
			protocol3: "ws",
			host3: "127.0.0.1",
			port3: "6800",
			interf3: "jsonrpc",
			token3: "",
		};
	}
};
