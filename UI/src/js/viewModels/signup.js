define(['ojs/ojrouter','ojs/ojcore', 'knockout', 'jquery','ojs/ojknockout','ojs/ojlabel','ojs/ojinputtext', 'ojs/ojcheckboxset'],
 function(Router,oj, ko, $) {
    self.router=Router.rootInstance;
    function loginViewModel(params) {
      
      var self = this;

      self.username = ko.observable("");
      self.password = ko.observable("");
      self.fullname = ko.observable("");
      self.doSignup = function doSignup(){

       var formData = {"userId":self.username,"name":self.fullname,"password":self.password};
      $.ajax({
              crossOrigin: true,
              type: "POST",
              url: "http://localhost:3000/signup",
              data : formData,
              success: function(res) {
              if(res.login=="yes"){
                console.log("success");
                  router.go(router.defaultStateId);                  
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.log("error: ",jqXHR.status);
            }
              }); 
      }
      
     }

    return loginViewModel;
  }
);