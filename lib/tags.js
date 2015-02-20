require('shelljs/global');

var sys = require('sys')
var fs = require('fs');

var Persistence = require('./persistence.js')
var Timer = require('./timer.js');

var evaluatedTags = {};

var code = function() {
	var opath = pwd();
	cd(process.env.DIR);
	exec("git fetch --tags").code;
	var tagsRaw = exec("git tag -l").output;
	cd(opath);

	var allTags = tagsRaw.split('\n');
	for (var i = 0; i < allTags.length; i++) {
		var current = allTags[i];
		if(current && current.indexOf(process.env.TAG_PREFIX)===0 && evaluatedTags[current] !== true ) {
			console.log("NEW TAG", current);
			evaluatedTags[current] = true;
			var persist = new Persistence(allTags[i]);
			persist.enqueue();
		} 
	}
};

//console.log(Timer);
var t = new Timer(10000, code);
t.start();


