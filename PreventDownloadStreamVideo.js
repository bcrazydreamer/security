const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'public')));

//only allow localhost you can add your domain regax or ip reg
var allowedUrl = /^((http|https)\:\/\/)?(localhost|127\.0\.0\.1)(\:[0-9]+)[/]?$/;

app.get('/', function(req, res) {
	  //your frontend file
          res.sendFile(path.join(__dirname + '/index.htm'))
})

//secure video stream
app.get('/video/:filename', function(req, res) {
	  var file_name = req.params.filename;
          if(!file_name){return res.send("Fuck no filename found, now how I know which file to be served.")}
	  if(allowedUrl.test(req.headers.referer)){
		console.log("Valid",file_name);
	  }else{
		console.log("Invalid",file_name);
		res.send("Fuck its secure so don't try this hack...");
		return;
	  }
	  //any path where is file
	  const path = 'assets/'+file_name;
	  const stat = fs.statSync(path)
	  const size = stat.size;
	  const head = {
	      'Content-Length': size,
	      'Content-Type': 'video/mp4',
	  };
	  res.writeHead(200, head);
	  fs.createReadStream(path).pipe(res);
})


app.listen(3000, function () {
  console.log('Listening on 3000')
})
