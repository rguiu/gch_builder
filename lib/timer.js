/** class Timer **/
var Timer = function(delayMs, callbackFunc) {
    this.delayMs = delayMs;
    this.callbackFunc = callbackFunc;
    this.timerState = 'new';
    this.count = 0;
}

Timer.prototype.start = function() {
    if( this.tmr ) return;
    var self = this;
    this.timerState = 'running';
    console.log("Start");
    this.tmr = setTimeout(function() { self._handleTmr(); }, this.delayMs);
}

Timer.prototype.cancel = function() {
    if( ! this.tmr ) return;

    clearTimeout(this.tmr);
    this.tmr = null;
    this.timerState = 'canceled';
}

Timer.prototype._handleTmr = function() {
    this.count += 1;
    console.log("Executing", this.timerState, this.count, this.delayMs);
    var self = this;
	if (this.timerState !== 'canceled') {
    	this.tmr = setTimeout(function() { self._handleTmr(); }, this.delayMs);
    	this.callbackFunc();		
	} else {
		this.tmr = null;
		this.timerState = 'completed';		
	}
}

module.exports = Timer;