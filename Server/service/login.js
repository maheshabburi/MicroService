var fs = require("fs");
var check;
var id="none";
var log = {
   login: function(req, res, next) {
    console.log("inside login");
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log(id);
    if(id!="none")
      check="yes";
    else
      check="no";
    var send = {"login":check,"userId":id};
    res.json(send);
   },

   signin: function(req,res,next){
    console.log("inside signin");
      fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      console.log(req.body);
      var userId = req.body.userId;
      var password = req.body.password;
      
        if(users[userId] && users[userId].password==password){
          check="yes";
          req.session.userId=userId;
          id = userId;
          var send = {"login":check,"userId":userId};
          res.setHeader('Access-Control-Allow-Origin','*');
          res.json(send);
        }
        else{
          var send = {"login":"no"};
          res.setHeader('Access-Control-Allow-Origin','*');
          res.json(send);
        }
    });
   },

   signup: function(req,res,next){
    var uId = req.body.userId;
    var name = req.body.name;
    var pswd = req.body.password;
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data){
      var users = JSON.parse(data);

      users[uId] = {"name":name,"password":pswd};
      id=uId;
      fs.writeFile( __dirname+"/"+"users.json",JSON.stringify(users,null,4),function(err){
        if(err)
          console.log(err);
      });
          var send = {"login":"yes","userId":uId};
          res.setHeader('Access-Control-Allow-Origin','*');
          res.json(send);
    });
   },

   signout: function(req,res,next){
    req.session.userId="";
    id="none";
    console.log("sign out:",id);
    res.setHeader('Access-Control-Allow-Origin','*');
    var send = {"login":"no"};
    res.send(send);
   }

};

module.exports = log;