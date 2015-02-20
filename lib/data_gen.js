var fs = require('fs');
var path = require('path');

var DataGen = function() {
}


var generate = function() {
	console.log("Running...: "+process.env.SOLUTIONS_DIR);
	var solutions = [];
	if (fs.existsSync(process.env.SOLUTIONS_DIR)) {
		console.log("Evaluating solutions");
		var files = fs.readdirSync(process.env.SOLUTIONS_DIR);
		files.forEach(function (file) {
			var currentSolution = {};
			currentSolution.directory = "<a href='file:///"+path.resolve(file) + "/.DS_Store'>dir</a>";
			currentSolution.tag = file;
	      	var fpath = process.env.SOLUTIONS_DIR + "/" + file + "/" +process.env.SCORE;
			if (fs.existsSync(fpath)) {	
				var sc = fs.readFileSync(fpath, "utf8");
				currentSolution.score =  Number(sc.trim());
			} else {
				currentSolution.score = "FAILED or NOT FINISHED";
			}

			var fpathtime = process.env.SOLUTIONS_DIR + "/" + file + "/timetaken.txt";
			if (fs.existsSync(fpathtime)) {	
				var sc = fs.readFileSync(fpathtime, "utf8");
				currentSolution.time =  Number(sc.trim());
			} else {
				currentSolution.time = 0;
			}

			//currentSolution.dir = "file://"++"/.DS_Store" 
   		   	solutions.push(currentSolution);
    	});
		console.log(solutions);
		fs.writeFileSync("web/scores.json", JSON.stringify(solutions));
	}
};

module.exports = DataGen;


var Timer = require('./timer.js');
//console.log(Timer);
var t = new Timer(10000, generate);
t.start();
