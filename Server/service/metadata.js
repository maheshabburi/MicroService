fs = require('fs')

var meta={
	getmetadata: function(req,res,next){
		var part = req.params.id;
		console.log(part);
		var name = part+".json";
		fs.readFile( __dirname + "/" + name, 'utf8', function (err, data){
			var sendData = JSON.parse(data);
			res.setHeader('Access-Control-Allow-Origin', '*');
	   		res.json(sendData);
		});
	}
}

module.exports = meta;