/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Example of Require.js boostrap javascript
 */

 // The UserAgent is used to detect IE11. Only IE11 requires ES5.
(function () {
  
  function _ojIsIE11() {
    var nAgt = navigator.userAgent;
    return nAgt.indexOf('MSIE') !== -1 || !!nAgt.match(/Trident.*rv:11./);
  };
  var _ojNeedsES5 = _ojIsIE11();

  requirejs.config(
    {
      baseUrl: 'js',

      // Path mappings for the logical module names
      paths:
      // injector:mainReleasePaths
      {
        'knockout': 'libs/knockout/knockout-3.5.0.debug',
        'jquery': 'libs/jquery/jquery-3.5.1',
        'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.1',
        'hammerjs': 'libs/hammer/hammer-2.0.8',
        'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.1',
        'ojs': 'libs/oj/v8.3.0/debug' + (_ojNeedsES5 ? '_es5' : ''),
        'ojL10n': 'libs/oj/v8.3.0/ojL10n',
        'ojtranslations': 'libs/oj/v8.3.0/resources',
        'text': 'libs/require/text',
        'signals': 'libs/js-signals/signals',
        'customElements': 'libs/webcomponents/custom-elements.min',
        'proj4': 'libs/proj4js/dist/proj4-src',
        'css': 'libs/require-css/css',
        'touchr': 'libs/touchr/touchr',
        'persist': '@samplesjsloc@/persist/debug',
        'corejs' : 'libs/corejs/shim',
        'regenerator-runtime' : 'libs/regenerator-runtime/runtime'
      }
      // endinjector
    }
  );
}());

require(['jquery','ojs/ojkeyset','ojs/ojmodule-element-utils','ojs/ojcore','text!data/files.json','ojs/ojrouter', 'knockout', 'ojs/ojbootstrap', 'ojs/ojarraytreedataprovider',
    'ojs/ojmodule-element', 'ojs/ojknockout', 'ojs/ojnavigationlist', 'text','jquery', 'ojs/ojoffcanvas', 'ojs/ojbutton', 'ojs/ojmodule', 'ojs/ojdefer','ojs/ojknockouttemplateutils','ojs/ojresponsiveutils'
  ],
  function($,keySet,moduleUtils,oj,files,Router, ko, Bootstrap, ArrayTreeDataProvider) {
  
    // Change default URL adapter
    Router.defaults['urlAdapter'] = new Router.urlParamAdapter();

    // to create router instance
    self.router = Router.rootInstance;
     var routeConfig ={};
       var init = true;
       var jsonData = JSON.parse(files);

// a function to build routing data from given json file
function buildRoutingData(myId){
            if(init){
            routeConfig[myId.attr.id]={label:myId.attr.name,isDefault:true};
            init=false;
            return;
          }
          else{
            if(!myId.children){
            routeConfig[myId.attr.id]={label:myId.attr.name};
            return;
          }
          }
          for(var j in myId.children){
            console.log(myId.children[j].attr.id);
            buildRoutingData(myId.children[j]);
          }
          return;
}

      for(var i in jsonData){
        buildRoutingData(jsonData[i]);
      }
      routeConfig['login']={label:"login"};
      routeConfig['signout']={label:"signout"};
      routeConfig['signup']={label:"signup"};
      console.log(routeConfig);
    self.router.configure(routeConfig);

// navigation expansion based on present router State when page reloads
var toExpand=[];
function buildExpansionData(myId,state,parentId){
      
      if(myId.attr.id==state && parentId){
          toExpand.push(parentId.attr.id);
          return true;
      }
      else if(myId.children){
          for(var j in myId.children){
            var check = buildExpansionData(myId.children[j],state,myId);
            if(check){
              if(parentId){
              toExpand.push(parentId.attr.id);
            }
              return true;
            }
          }
          return false;
      }
      else
        return false;
    }

    function ViewModel() {

      var self = this;
      self.userLoggedIn = ko.observable("N");
      self.userLogin = ko.observable('not yet logged in');
      self.menuItemAction = function (event) {
       var selectedMenuOption = event.path[0].value;
       console.log(selectedMenuOption);
       if(selectedMenuOption=="sign"){
        //console.log("userLoggedIn:",self.userLoggedIn());
        if(self.userLoggedIn()=='Y'){
          self.userLoggedIn("N");
          self.userLogin("not yet logged in");
          router.go('/signout');
        }
        else
          router.go('/login');
       }
     };

      var rState = router.stateId();

      for(var i in jsonData){
      var t = buildExpansionData(jsonData[i],rState);
      if(t)
        break;
        }
        console.log("expand is:",toExpand);
      self.expanded = new keySet.ExpandedKeySet(toExpand);

      // drawer toggle 
        self.drawer =
        {
          displayMode: 'push',
          selector: '#drawer',
          content: '#content',
          autoDismiss: 'none'
        };
  
        self.toggleDrawer = function () {
          return oj.OffcanvasUtils.toggle(self.drawer);
        };

        var routerStates=[]; // to store the present page requested before moving to login page

        // setting path selection from route data
        self.moduleConfig = ko.computed(function () {
          var name;
          var configName = router.stateId();
          //console.log(configName);
          if(configName.includes("chart")) 
            name = "chart";
          else if(configName.includes("treeview"))
            name = "treeview";
          else if(configName.includes("dragDrop"))
            name = "dragDrop";
          else if(configName.includes("home"))
            name = "home";
          else if(configName=="login")
            name = "login";
          else if(configName=="tech"){
             name = "tech";
          }
          else if(configName=="others"){
            name="others";
          }
          else if(configName=="signout")
            name = "signout";
          else if(configName=="signup")
            name = "signup";
          else
            name = "preface";
          // set async to false 
          var value=[name,"not yet logged in"];// default value if the following condition is not taken up
          if(name!="login" && name!="signout" && name!="signup"){
          value = function(){
              var tmp=[];
            $.ajax({
                  async: false,
                  crossOrigin: true,          
                  type: "GET",
                  url: "http://localhost:3000/login",
                  success: function(res) {
                    console.log(res);
                    if(res.login=="yes"){
                    console.log("success");
                    self.userLoggedIn("Y");
                    tmp.push(name);
                    tmp.push(res.userId);
                    
                  }
                  else{
                    routerStates.push(router.stateId());
                    tmp.push("login");
                    tmp.push("not yet logged in");
                    router.go('/login');
                    }
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error: ",jqXHR.status);
                  }
                });
            return tmp;
        }();
        console.log(value);
        self.userLogin(value[1]);
        name = value[0];
      }
        
          var presentRoute=router.stateId();
          var size=routerStates.length;
          if(size>=1 && presentRoute=='login'){
            var lastState = routerStates[size-1];
            routerStates.pop();
          }
          else
            var lastState = "none";
          var viewPath = 'views/' + name + '.html';
          var modelPath = 'viewModels/' + name;
          return moduleUtils.createConfig({ viewPath: viewPath,
          viewModelPath: modelPath, params: {message: routeConfig[presentRoute].label, userId:value[1], goUrl: lastState}});

        });

        // providing navigation list from given json file
       self.navListData = new ArrayTreeDataProvider(JSON.parse(files), {keyAttributes: 'attr.id'});
     }
  
    Bootstrap.whenDocumentReady().then(function() {
      Router.sync().then(function() {
        ko.applyBindings(new ViewModel(), document.getElementById('routing-container'));
      });
    });
  });