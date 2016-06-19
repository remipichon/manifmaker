var sys = require('sys');
var exec = require('child_process').exec;
var _s = require("underscore.string");
var githubhook = require('githubhook');

function puts(error, stdout, stderr) { sys.puts(stdout) }

// configure listener for github changes
var github = githubhook({/* options */
  host: "0.0.0.0",
  port: 2400,
  path: "/pushchanges",
  secret: "2438"
});

// listen to pull request on branch deploy
github.on('pull_request', function (repo, ref, data) {
  if(data.pull_request && data.pull_request.mergeable){
    sys.puts("a mergeable pull request occurs");
    if(data.pull_request.base.ref === "deploy"){
      sys.puts("the pull request is on deploy, TODO : pull merged code ? pull source branch ? pull source and base and merge then run meteor test, get feedback, send POST status back to github (with error log in description");
      
    }
  }
});

// listen to push on github on branch deploy
github.on('push', function (repo, ref, data) {
  var branchName = _s.strRightBack(ref, "/");
  var fullNameRepository = data.repository.full_name;
  var removedFilesArray = data["head_commit"]["removed"];
  var addedFilesArray = data["head_commit"]["added"];
  var modifiedFilesArray = data["head_commit"]["modified"];

  console.info("received a push event on branch "+branchName);
  if(branchName === "deploy"){
    sys.puts("push detected on "+branchName+". Launch deployManifmaker.sh script");

    exec("/home/remip/node-github-hook/deployManiMaker.sh",puts)

  }
});

// listen to github push
github.listen();
console.info("githubhook started");

