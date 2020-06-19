'use strict';

const controller = require('./controller');

module.exports = function(app) {
   app.get('/books/:id',controller.getBooks);
   app.get('/getuserpref/:id1/:id2',controller.getuserpref);
   app.get('/login',controller.login);
   app.post('/signin',controller.signin);
   app.post('/signup',controller.signup);
   app.get('/signout',controller.signout);
   app.post('/updateuserpref',controller.updateuserpref);
   app.get('/getmetadata/:id',controller.getmetadata);
};