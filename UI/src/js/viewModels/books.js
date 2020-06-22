 define(['ojs/ojrouter','ojs/ojarraydataprovider','jquery','knockout', 'ojs/ojbootstrap', 'ojs/ojknockout', 'ojs/ojlistview', 'ojs/ojgauge', 'ojs/ojbutton', 'ojs/ojcheckboxset', 'ojs/ojselectcombobox'],
  function (Router,ArrayDataProvider,$,ko, Bootstrap) {
    self.router = Router.rootInstance;
    function ViewModel(params) {
      var myPrefs={};

      this.goTech = function(){
        router.go('/tech');
      };

      this.goOthers = function(){
        router.go('/others');
      }

      this.val=[];

      // to get the User specific preferences from the server
      var userPref=function(){
        var tmp1;
        $.ajax({
          async:false,
          crossOrigin: true,          
          type: "GET",
          url: "http://localhost:3000/getuserpref/"+router.stateId()+'/'+params.userId,
          success: function(res) {
            console.log(res);
            tmp1=res;
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log("error: ",jqXHR.status);
          }
        });
        return tmp1;
      }();
      console.log(userPref);

      if(userPref.interests)
      this.val=userPref.interests;



      this.savePref = function(){
        console.log(myPrefs);
        if(this.val[0])
          myPrefs["interests"]=this.val;
        else
          myPrefs["interests"]=null;
        var formData = {"partition":router.stateId(),"userId":params.userId,"prefs":myPrefs};
        $.ajax({
          crossOrigin: true,          
          type: "POST",
          data: formData,
          url: "http://localhost:3000/updateuserpref",
          success: function(res) {
            console.log(res);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log("error: ",jqXHR.status);
          }
        });
        myPrefs={};
      }.bind(this);

    }
    return ViewModel;
         
  }
);