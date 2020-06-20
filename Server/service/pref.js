var fs = require("fs");

var pref = {
	find: function(req, res, next) { 
		var part = req.params.id1;
		var userId = req.params.id2; 	
		console.log("userpref:",userId);
		fs.readFile( __dirname + "/" + "pref.json", 'utf8', function (err, data) {
			var userPrefs = JSON.parse( data );
			/*
			If user exists and the partition exists send data, else send empty array
			*/
			if(userPrefs[userId] && userPrefs[userId][part]){
				var sendData = userPrefs[userId][part];
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.json(sendData);
			}
			else{
				var sendData = [];
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.json(sendData);
			}
		});

	},
	update : function(req,res,next){
		var part = req.body.partition;
		var userId = req.body.userId;
		var pref = req.body.prefs;
		console.log("prefs:",pref);
		fs.readFile( __dirname + "/" + "pref.json", 'utf8', function (err, data){
			var userPrefs = JSON.parse(data);

			/* 
			if user exists and partition exists then save them, else create new partition and save, else create new userId and save.
			If the key value is null remove from the set of preferences
			*/
			if(userPrefs[userId]){
				if(userPrefs[userId][part]){
					for(var key in pref){
						if(pref[key]==''){
							if(userPrefs[userId][part][key])
								delete userPrefs[userId][part][key];
						}
						else
							userPrefs[userId][part][key]=pref[key];
					}
				}
				else{
					userPrefs[userId][part]=pref;
				}
			}
			else{
				userPrefs[userId]={};
				userPrefs[userId][part]=pref
			}
			fs.writeFile( __dirname + "/" + "pref.json",JSON.stringify(userPrefs,null,4),function(err){
		      	if(err)
		      		console.log(err);
		      	});
			res.setHeader('Access-Control-Allow-Origin', '*');
	        res.json("Done");
		});
	}
};

module.exports = pref;