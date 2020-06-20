var fs = require("fs");
var sess;
var books = {
  find: function(req, res, next) {
    console.log(req.params.id);
    var part = req.params.id;
    var name;
    if(part=="tech"){
      name = "books.json";
    }
    else
      name = "Books2.json";
    fs.readFile( __dirname + "/data/" + name, 'utf8', function (err, data) {
      var book = JSON.parse( data );
        
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(book);

    });

  }
};

module.exports = books;