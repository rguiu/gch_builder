var redis = require("redis");

var PREFIX = "solution";
var JOINER = ":";
var STATES = { NEW: "new", RUNNING: "running", FINISHED: "finished"};
var QUEUE_NAME = "solutions:tags:set";

var client = redis.createClient();

var Persistence = function(tag) {
	this.tag = tag;
}

Persistence.prototype.enqueue = function() {
	client.rpush(QUEUE_NAME, this.tag);
};

Persistence.prototype.is_over = function() {
	var key = _buildKey(this.tag, STATES.FINISHED)
	client.get(key,function (err, data) {
		console.log(err);
	});
	return key;
};

function _buildKey(tag, status) {
	return [PREFIX, status, tag].join(JOINER);
}


module.exports = Persistence;