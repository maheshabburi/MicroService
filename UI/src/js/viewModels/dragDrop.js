  define(['jquery','knockout', 'ojs/ojbootstrap', 'ojs/ojknockout', 'ojs/ojfilepicker', 'ojs/ojinputtext', 'ojs/ojlabel', 'ojs/ojcheckboxset'],
      function ($,ko, Bootstrap) {
  
        function BasicModel() {
          this.multiple = ko.observableArray(['multiple']);
          this.multipleStr = ko.pureComputed(function () {
            return this.multiple()[0] ? 'multiple' : 'single';
          }.bind(this));
  
          this.disabled = ko.observableArray();
          this.isDisabled = ko.pureComputed(function () {
            return this.disabled()[0] === 'disable' ? true : false;
          }.bind(this));
  
          this.invalidMessage = ko.observable('');
  
          this.invalidListener = function(event) {
            this.fileNames([]);
            this.invalidMessage("{severity: '" + event.detail.messages[0].severity + "', summary: '" + event.detail.messages[0].summary + "'}");
            var promise = event.detail.until;
            if (promise) {
              promise.then(function(){
                this.invalidMessage('');
              }.bind(this));
            }
          }.bind(this);
  
          this.acceptStr = ko.observable('image/*');
          this.acceptArr = ko.pureComputed(function () {
            var accept = this.acceptStr();
            return accept ? accept.split(',') : [];
          }.bind(this));
  
          this.fileNames = ko.observableArray([]);
  
          this.selectListener = function (event) {
            this.invalidMessage('');
            var files = event.detail.files;
            for (var i = 0; i < files.length; i++) {
              this.fileNames.push(files[i].name);
            }
          }.bind(this);


        }
        return BasicModel();
      });