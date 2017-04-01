var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var stream = require('stream');

var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

var ouputDir = process.env.OUTPUTDIR
var NetworkMode = process.env.NETWORKMODE
if(!NetworkMode) NetworkMode = "host"


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
 	res.send('You have to POST to /export');
});

/**
 * Get logs from running container
 */
function containerLogs(container) {

  // create a single stream for stdin and stdout
  var logStream = new stream.PassThrough();
  logStream.on('data', function(chunk){
    console.log(chunk);
  });

  container.logs({
    follow: true,
    stdout: true,
    stderr: true
  }, function(err, stream){
    if(err) {
      return logger.error(err.message);
    }
    container.modem.demuxStream(stream, logStream, logStream);
    stream.on('end', function(){
      logStream.end('!stop!');
    });
  });
  return container;
}

function runWkhtmltopdfContainer(outputFile,url){

	docker.createContainer({
	  Image: 'assomaker/wkhtmltopdf',
	  AttachStdin: true,
	  AttachStdout: true,
	  AttachStderr: true,
	  Tty: true,
	  OpenStdin: false,
	  StdinOnce: false,
    "HostConfig": {
      "NetworkMode": NetworkMode,   
      "Binds":[ouputDir+":/root/out"]

    },
    "Labels": {
        "outputFile": outputFile
    },
	  "Volumes":{"/root/out": {}}, 
	  Env: [
        'IN='+url,
        'OUT=/root/out/'+outputFile
	    ],
  },function(err,container){
      console.log("Container to ouput PDF file", outputFile, "created")
      container.start(function (err, data) {
        console.log("Container to ouput PDF file",outputFile, "started")
      });
      container.wait(function (err, data) {
        console.log("Container to ouput PDF file",outputFile, "ended")
        container.remove(function(err,data){
          console.log("Clean container used for",outputFile);
        })
      });
     
  });

}

app.post('/export',function (req, res) {
	if(!req.body){
		res.send("You should post a JSON")
		return;
	}
	if(!req.body.items){
  		res.send("'items' key is needed");
  		return;
  	}
  	var items = req.body.items;
  	if(!Array.isArray(items)){
  		res.send("'items' key should be an array of object with url and fileName key")
  		return;
  	}

  	items.forEach(function(item){
  		var url = item.url;
  		var fileName = item.fileName
  		console.info("Will be generated PDF",fileName,"from",url);
		runWkhtmltopdfContainer(fileName,url)
  	});

  	res.send(items.length + " wil be generated");
});

console.log("About to pull assomaker/wkhtmltopdf")
docker.pull('assomaker/wkhtmltopdf', function (err, stream) {
  // streaming output from pull...
  docker.modem.followProgress(stream, onFinished, onProgress);

  function onFinished(err, output) {
    if(err)
      console.log(err);
    else{
      console.log("assomaker/wkhtmltopdf has been pulled, now starting http server")
      app.listen(3030, function () {
        console.log('Export PDF NodeJs just started on port 3030');
        console.log("OUTPUTDIR="ouputDir)
        console.log("NETWORKMODE="NetworkMode)
      });
    }
  }
  function onProgress(event) {
    console.log("Downloading assomaker/wkhtmltopdf...")
  }
  
});

