 define(['ojs/ojrouter','jquery','knockout', 'ojs/ojknockout'], function(Router,$,ko) {
  self.router=Router.rootInstance;
    function viewModel(params){
    console.log("present selection",params.userId);
        $.ajax({
          crossOrigin: true,
          type:"GET",
          url:"http://localhost:3000/signout",
          success: function(res){
            var rootViewModel = ko.dataFor(document.getElementById('routing-container'));
            rootViewModel.userLogin("not yet logged in");
            rootViewModel.userLoggedIn("N");
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log("error: ",jqXHR.status);
            }
        });

        router.go('/login');
     }
     return viewModel;
  });