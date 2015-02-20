var sys = require('sys')
var fs = require('fs');
var process = require('process');

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

Solution.prototype.run = function(delay) {
	var self = this;
	client.brpop([ QUEUE_NAME, delay], function (listname, item) {
    	// do stuff
    	var tag = item[1];
    	if(tag && self.exist(tag) === false) {
    		console.log("NEW TAG FOUND: " + tag);
    		self.build(tag);
    	} 
    	self.run(delay);
	});
};

Solution.prototype.exist = function(tag) {
	return fs.existsSync(process.env.SOLUTIONS_DIR+"/"+tag);
};

Solution.prototype.start =  function() {
	console.log("start: "+this.delayMs);
	this.run(this.delayMs);
};

Solution.prototype.build = function(tag) {
	var opath = pwd();
	cd(process.env.DIR);
	this.checkout(tag);
	this.pack(tag);
	var ttime = this.execute(tag);
	cd(opath);
	this.finish(tag, ttime);
};

Solution.prototype.checkout = function(tag) {
	var fetchResponse =	exec("git fetch --all").code;
	var checkoutResponse =	exec("git checkout "+tag).code;
	console.log("checkoutResponse",checkoutResponse);
};

Solution.prototype.pack = function(tag) {
	var response =	exec(process.env.BUILD).code;
};

Solution.prototype.execute = function(tag) {
	var start = process.hrtime();
	var response =	exec(process.env.EXEC).code;
	console.log("Exec", response);
	var stop = process.hrtime(start);
	var ttime = (stop[0]*1e9 + stop[1])/1e6;

	console.log("Time taken "+ ttime + "ms.");
//	var dirname = process.env.SOLUTIONS_DIR+"/"+tag;
//    response = exec('mkdir -p ' + dirname).code
//    console.log("Created dir", response);
//	mkdir(dirname);
//	fs.writeFileSync(dirname + "/timetaken.txt", time);
	return ttime;
};

Solution.prototype.finish = function(tag, ttime) {
	if (!fs.existsSync(process.env.SOLUTIONS_DIR)) {
		mkdir(process.env.SOLUTIONS_DIR);
	}
	var dirname = process.env.SOLUTIONS_DIR+"/"+tag;
	mkdir(dirname);
	mv(process.env.DIR + "/" + process.env.BUILD_DIR + "/" + process.env.RESULT, dirname);
	mv(process.env.DIR + "/" + process.env.BUILD_DIR + "/" + process.env.SOURCES, dirname);
	mv(process.env.DIR + "/" + process.env.BUILD_DIR + "/" + process.env.SCORE, dirname);
	fs.writeFileSync(dirname + "/timetaken.txt", ttime);
};

module.exports = Solution;

var s = new Solution(150000);
s.init();

s.start();

