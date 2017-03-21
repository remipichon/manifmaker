var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var stream = require('stream');

var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});


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
	var sourceFolder="/Users/remi/sandbox";

// docker.run('assomaker/wkhtmltopdf', [], process.stdout, {
//   'Volumes': {
//     '/root/out': {}
//   },
// }, {
//   'Binds': [sourceFolder+":/root/out"]
// }, function(err, data, container) {
//   console.log(data);//.StatusCode);
// });
// return;

	docker.createContainer({
	  Image: 'assomaker/wkhtmltopdf',
	  AttachStdin: true,
	  AttachStdout: true,
	  AttachStderr: true,
	  Tty: true,
	  OpenStdin: false,
	  StdinOnce: false,
	  "Volumes":{"/root/out": {}}, 
	  Network:"production_default",
	  Env: [
        'IN='+url,
        'OUT=/root/out/'+outputFile
	    ],
	    "Binds":[sourceFolder+":/root/out"]
	}).then(function(container) {
	  return container.start();
	}).then(function(container) {
	   //container.stop();
	   return 1;//container;
	}).then(function(container) {
	  return 1;//container.remove();
	}).then(function(data) {
	  //console.log('container removed');
	  //check that file exists and if so, use websocket to meteor
	}).catch(function(err) {
	  console.log(err);
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
  		console.info("Generate PDF",fileName,"from",url);
		runWkhtmltopdfContainer(fileName,url)
  	});

  	res.send(items.length + " wil be generated");
});

app.listen(3030, function () {
  console.log('Example app listening on port 3030!');
});