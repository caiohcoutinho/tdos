var http = require('http');
var fs = require('fs');
var port = 8080;

http.createServer(function (req, res) {
	console.log("Received request for "+req.url);
	if(req.url == '/phaser.min.js'){
		var script = fs.readFileSync('phaser.min.js');
		res.write(script);
		res.end();
	} else if(req.url == '/underscore-min.map'){
		var script = fs.readFileSync('underscore-min.map');
		res.write(script);
		res.end();
	} else if(req.url == '/underscore-min.js'){
		var script = fs.readFileSync('underscore-min.js');
		res.write(script);
		res.end();
	} else if(req.url == '/tdos.js'){
		var script = fs.readFileSync('tdos.js');
		res.write(script);
		res.end();
	} else if(req.url == '/styles.css'){
		var script = fs.readFileSync('styles.css');
		res.write(script);
		res.end();
	} else if(req.url == '/favicon.ico'){
		var fileStream = fs.createReadStream("./favicon.ico");
      	return fileStream.pipe(res);
	} else if(req.url.endsWith(".png")){;
		try{
			var page = fs.readFileSync(req.url.substr(1));
			res.write(page);
		} catch(e){
			console.log("req.url = "+req.url);
			console.log(e);
		}
		res.end();
	} else{
		var page = fs.readFileSync('tdos.html');
		res.write(page);
		res.end();
	}
	res.end();
}).listen(port);


console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nListening on "+port);