define(['ojs/ojarraydataprovider','ojs/ojkeyset','ojs/ojrouter','ojs/ojcore', 'knockout', 'jquery','ojs/ojknockout','ojs/ojlabel','ojs/ojinputtext', 'ojs/ojcheckboxset','ojs/ojselectsingle'],
 function(ArrayDataProvider,keySet,Router,oj, ko, $) {
    self.router=Router.rootInstance;
    function loginViewModel(params) {
      
      var self = this;
      
      //console.log(params.goUrl);
      self.username = ko.observable("");
      self.password = ko.observable("");
      self.wrong = ko.observable(false);
      self.signup = function(){
        router.go('/signup');
      }

      // This variable gets the reference to a specific div tag so the observables associated can be modified
      var rootViewModel = ko.dataFor(document.getElementById('routing-container'));
      

      self.doLogin = function doLogin(){
       var formData = {"userId":self.username,"password":self.password};
      $.ajax({
              crossOrigin: true,
              type: "POST",
              url: "http://localhost:3000/signin",
              data : formData,
              success: function(res) {
              if(res.login=="yes"){
                console.log("uid:",res.userId);
                
                rootViewModel.userLogin(res.userId);
                rootViewModel.userLoggedIn("Y");
                console.log("success");
                if(params.goUrl=="none"){
                  rootViewModel.expanded = new keySet.ExpandedKeySet([]);
                  router.go(router.defaultStateId);
                }
                
                else
                  router.go(params.goUrl);
                                  
              }
              else{
                console.log("false");
                self.wrong(true);
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