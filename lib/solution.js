var sys = require('sys')
var fs = require('fs');
require('shelljs/global');

var redis = require("redis");
var client = redis.createClient();
var QUEUE_NAME = "solutions:tags:set";

var Solution = function(delayMs) {
	this.delayMs = delayMs;
}

Solution.prototype.init = function() {
	if (fs.existsSync(process.env.DIR)) {
		sys.puts('Repo already exist');
	} else {
		sys.puts('Repo not exist - creating: ');
		sys.puts('cloning: '+'git clone ' + process.env.REPO + ' ' + process.env.DIR);
		sys.puts(exec('git clone ' + process.env.REPO + ' ' + process.env.DIR).code);
		sys.puts('cloned');
	}
};

// file:///Users/RaulGuiuGallardo/Downloads/.DS_Store 

Solution.prototype.run = function(delay) {
	var self = this;
	console.log("qname: " + QUEUE_NAME);
	client.brpop([ QUEUE_NAME, delay], function (listname, item) {
    	// do stuff
    	var tag = item[1];
    	if(tag && self.exist(tag) === false) {
    		console.log("NEW TAG FOUND: " + tag);
    		self.build(tag);
    	} else {
    		console.log("OLD TAG FOUND: " + tag);
    	}
    	self.run(delay);
	});
};

Solution.prototype.exist = function(tag) {
	console.log(fs.existsSync(process.env.SOLUTIONS+"/"+tag));
	console.log(process.env.SOLUTIONS_DIR+"/"+tag);
	return fs.existsSync(process.env.SOLUTIONS_DIR+"/"+tag);
};

Solution.prototype.start =  function() {
	console.log("start: "+this.delayMs);
	this.run(this.delayMs);
};

Solution.prototype.build = function(tag) {
	var opath = pwd();
	console.log("OldDir: ", opath, tag);
	cd(process.env.DIR);
	this.checkout(tag);
	this.pack(tag);
	this.execute(tag);
	cd(opath);
	this.finish(tag);
};

Solution.prototype.checkout = function(tag) {
	var fetchResponse =	exec("git fetch --all").code;
	console.log("fetch",fetchResponse);
	var checkoutResponse =	exec("git checkout "+tag).code;
	console.log("checkoutResponse",checkoutResponse);
};

Solution.prototype.pack = function(tag) {
	var response =	exec(process.env.BUILD).code;
	console.log("Maven buiild", response);
};

Solution.prototype.execute = function(tag) {
	var response =	exec(process.env.EXEC).code;
	console.log("EXEC", response);
};

Solution.prototype.finish = function(tag) {
	if (!fs.existsSync(process.env.SOLUTIONS_DIR)) {
		mkdir(process.env.SOLUTIONS_DIR);
	}
	var dirname = process.env.SOLUTIONS_DIR+"/"+tag;
	mkdir(dirname);
	mv(process.env.DIR + "/" + process.env.RESULT, dirname);
	mv(process.env.DIR + "/" + process.env.SOURCES, dirname);
	mv(process.env.DIR + "/" + process.env.SCORE, dirname);
	console.log("COMPLETED");
};

module.exports = Solution;
