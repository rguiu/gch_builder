//var git = require('nodegit');
//
//console.log(git);
//
//git.Repo.open('https://github.com/nodegit/nodegit.git', function(err, repo) {
//  console.log(repo.path())
//});
var nodegit = require("nodegit");

console.log(nodegit.Remotes);

var x = nodegit.Remote.list('https://github.com/nodegit/nodegit.git');

console.log(x);