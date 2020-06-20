  /**
   * Home content module, example of singleton view model object.
   */
  define(['knockout', 'ojs/ojknockout'], function(ko) {

    function viewModel(params){
        var msg = "Welcome to this page !";
        this.title = params.message;
        this.description = msg;
    }
    return viewModel;
  });