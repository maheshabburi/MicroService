  define(['ojs/ojrouter','ojs/ojarraydataprovider','jquery','ojs/ojknockout-keyset','knockout', 'ojs/ojbootstrap', 'ojs/ojpagingdataproviderview', 'ojs/ojcollectiondataprovider', 'ojs/ojmodel', 'ojs/ojconverter-number', 'ojs/ojknockout', 'ojs/ojlistview', 'ojs/ojgauge', 'ojs/ojbutton', 'ojs/ojcheckboxset', 'ojs/ojselectcombobox', 'ojs/ojpagingcontrol','ojs/ojselectsingle'],
  function (Router,ArrayDataProvider,$,keySet,ko, Bootstrap, PagingDataProviderView, CollectionDataProvider, Model, NumberConverter) {
    self.router = Router.rootInstance;
    function ViewModel(params) {
          var myPrefs={};
          this.currentAuthor = [];
          this.currentSort = ko.observable('default');
          this.dataProvider = ko.observable();
          this.authorDataProvider = ko.observable();
          var stars=[];

          var metaData=function(){
                var temp;
                $.ajax({
                          async:false,
                          crossOrigin: true,          
                          type: "GET",
                          url: "http://localhost:3000/getmetadata/tech",
                          success: function(res) {
                            console.log(res);
                            temp=res;
                          },
                          error: function(jqXHR, textStatus, errorThrown) {
                            console.log("error: ",jqXHR.status);
                          }
              });
                return temp;
            }();
            console.log(metaData);

          var criteriaMap = {};
          for(var i in metaData.sortBy){
            criteriaMap[metaData.sortBy[i].value]={"key":metaData.sortBy[i].key,"direction":metaData.sortBy[i].direction};
          }

          this.sortByDataProvider=new ArrayDataProvider(metaData.sortBy,{keyAttributes:"value"});

          var authorMap = {};
          for(var i in metaData.author){
            authorMap[metaData.author[i].value]={"name":metaData.author[i].label};
          }

          this.authorDataProvider=new ArrayDataProvider(metaData.author,{keyAttributes:"value"});


            // on toggle the class name of the element is changed from fa-star-o to fa-star and vice-versa
            this.toggle = function(event){
            var id = event.currentTarget.id;
            var id1 = '#'+id;
            var clName = event.currentTarget.className;
            if(clName.includes("fa-star-o")){
              $(id1).removeClass("fa-star-o").addClass("fa fa-star");
              stars.push(id);
              myPrefs["stars"]=stars;
              console.log(myPrefs);
              for(var i in allBooks){
                if(allBooks[i].ID==id)
                  allBooks[i].StarValue=1;
              }
              for(var i in data){
                if(data[i].ID==id)
                  data[i].StarValue=1;
              }
              }
            else{
              $(id1).removeClass("fa-star").addClass("fa fa-star-o");
              stars = stars.filter(function( obj ) {
                return obj !== id;
            });
              if(stars[0])
              myPrefs["stars"]=stars;
              else
                myPrefs["stars"]=null;
              for(var i in allBooks){
                if(allBooks[i].ID==id)
                  allBooks[i].StarValue=0;
              }
              for(var i in data){
                if(data[i].ID==id)
                  data[i].StarValue=0;
              }
            }
            };
      
      var currencyOptions =
        {
          style: 'currency',
          currency: 'INR',
          currencyDisplay: 'symbol'
        };
      this.currencyConverter = new NumberConverter.IntlNumberConverter(currencyOptions);
  
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

      var allBooks=function(){
        var tmp;
        $.ajax({
                  async:false,
                  crossOrigin: true,          
                  type: "GET",
                  url: "http://localhost:3000/books/tech",
                  success: function(res) {
                    console.log(res);
                    tmp=res;
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error: ",jqXHR.status);
                  }
      });
        return tmp;
    }();
    console.log(allBooks);

    

    function sortByProperty(property,direction){  
   return function(a,b){  
      if(a[property] > b[property])  
         return (direction=="ascending"?1:-1);  
      else if(a[property] < b[property])  
         return (direction=="ascending"?-1:1);  
  
      return 0;  
   }  
}


    // the following series of operations are for setting up the UI according to User Preferences
    var data = [];
    
    if(userPref.stars){
      console.log("stars");
    stars = userPref.stars;
  }
  else
    stars=[];
    for(var i in allBooks){
      if(stars){
      if(stars.includes(allBooks[i].ID)){
        allBooks[i].StarValue=1;
      }
      else{
        allBooks[i].StarValue=0;
      }
    }
    else{
      allBooks[i].StarValue=0;
    }
      
      data.push(allBooks[i]);
    }


    if(userPref.author){
      var data1=[];
      var authors=[];
      for(var i in userPref.author){
        authors.push(authorMap[userPref.author[i]].name);
      }
      this.currentAuthor = userPref.author;
      console.log(this.currentAuthor);
      for(var i in allBooks){
        console.log(allBooks[i].AUTHOR);
        if(authors.includes(allBooks[i].AUTHOR)){
          data1.push(allBooks[i]);
        }
      }
      data = data1;
    }

    if(userPref.sortBy){
      this.currentSort(userPref.sortBy);
        data.sort(sortByProperty(criteriaMap[userPref.sortBy].key,criteriaMap[userPref.sortBy].direction));
    }
      console.log(data);
  this.dataProvider(new ArrayDataProvider(data,{keyAttributes: 'ID'}));
  console.log(this.dataProvider);
  
  
      this.handleSortCriteriaChanged = function (event, ui) {
        myPrefs["sortBy"]=event.detail.value;
        var criteria = criteriaMap[event.detail.value];
          data.sort(sortByProperty(criteria.key, criteria.direction));
          this.dataProvider(new ArrayDataProvider(data,{keyAttributes: 'ID'}));
          console.log(myPrefs);
        
      }.bind(this);
  
      this.handleAuthorChanged = function(event,ui){
        console.log(event.detail.value);
        if(event.detail.value[0]){
          var currentValue=[];
          for(var i in event.detail.value){
            currentValue.push(authorMap[event.detail.value[i]].name);
          }
        myPrefs["author"]=event.detail.value;
        var newData=[];
        for(var i in allBooks){
          if(currentValue.includes(allBooks[i].AUTHOR)){
            newData.push(allBooks[i]);
          }
        }
      }
      else{
        myPrefs["author"]=null;
        var newData = allBooks;
      }
        
        newData.sort(sortByProperty(criteriaMap[this.currentSort()].key,criteriaMap[this.currentSort()].direction));
        
        console.log(myPrefs);
        data = newData;
        console.log(data);
        this.dataProvider(new ArrayDataProvider(data,{keyAttributes: 'ID'}));
      
      }.bind(this);

      this.savePref = function(){
        console.log(myPrefs);
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
         
  });
