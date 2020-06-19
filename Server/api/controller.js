'use strict';

var books = require('../service/books');

var pref = require('../service/pref');

var log = require('../service/login');

var meta = require('../service/metadata');

var controllers = {
  getmetadata: function(req, res) {
           meta.getmetadata(req, res, function(err, ntng) {
               if (err)
                   res.send(err);
               res.json(ntng);
           });
       },
  updateuserpref: function(req, res) {
           pref.update(req, res, function(err, dist) {
               if (err)
                   res.send(err);
               res.json(dist);
           });
       },
   getBooks: function(req, res) {
           books.find(req, res, function(err, books) {
               if (err)
                   res.send(err);
               res.json(books);
           });
       },
    getuserpref: function(req,res){
          pref.find(req,res,function(err,pref){
            if(err)
              res.send(err);
            res.json(pref);
          });
    },
    login: function(req,res){
          log.login(req,res,function(err,ntng){
            if(err)
              res.send(err);
            res.json(ntng);
          });
    },
    signin: function(req,res){
          log.signin(req,res,function(err,ntng){
            if(err)
              res.send(err);
            res.json(ntng);
          });
    },
    signup: function(req,res){
          log.signup(req,res,function(err,ntng){
            if(err)
              res.send(err);
            res.json(ntng);
          });
    },
    signout: function(req,res){
          log.signout(req,res,function(err,ntng){
            if(err)
              res.send(err);
            res.json(ntng);
          });
    }
};

module.exports = controllers;