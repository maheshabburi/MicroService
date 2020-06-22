define(['ojs/ojrouter','ojs/ojarraydataprovider','jquery','knockout', 'ojs/ojbootstrap', 'ojs/ojconverter-number', 'ojs/ojknockout', 'ojs/ojlistview', 'ojs/ojgauge', 'ojs/ojbutton', 'ojs/ojcheckboxset'],
  function (Router,ArrayDataProvider,$,ko, Bootstrap, NumberConverter){
    self.router = Router.rootInstance;
    function ViewModel(params) {
      var myPrefs={};
      this.currentAuthor = [];
      this.currentGenre = [];
      this.currentTimeZone = ko.observable('Default');
      this.currentSort = ko.observable('default');
      this.dataProvider = ko.observable();
      this.authorDataProvider = ko.observable();
      var stars=[];
      var data = []; // this represents the present data being displayed on the page

      var metaData=function(){
        var temp;
        $.ajax({
          async:false,
          crossOrigin: true,          
          type: "GET",
          url: "http://localhost:3000/getmetadata/others",
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

      //the series of following operations provide mappings required
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

      var genreMap = {};
      for(var i in metaData.genre){
        genreMap[metaData.genre[i].value]={"name":metaData.genre[i].label};
      }

      this.genreDataProvider=new ArrayDataProvider(metaData.genre,{keyAttributes:"value"});

      var timeZoneMap = {};
      for(var i in metaData.timeZone){
        timeZoneMap[metaData.timeZone[i].value]={"name":metaData.timeZone[i].country};
      }

      this.timeZoneDataProvider = new ArrayDataProvider(metaData.timeZone,{keyAttributes:"value"});


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

      //to get user specific preferences from server 
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

      // this represents the complete dataset
      var allBooks=function(){
        var tmp;
        $.ajax({
          async:false,
          crossOrigin: true,          
          type: "GET",
          url: "http://localhost:3000/books/others",
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

      //a function to perform operations when there are changes in any filter on UI
      this.performAll=function(){
        data = allBooks;
        if(this.currentAuthor[0]){
          var authors = [];
          for(var i in this.currentAuthor){
            authors.push(authorMap[this.currentAuthor[i]].name);
          }
          var data9=[];
          for(var i in allBooks){
            if(authors.includes(allBooks[i].AUTHOR)){
              data9.push(allBooks[i]);
            }
          }
          data = data9;
        }
        if(this.currentGenre[0]){
          var data10=[];
          var genres=[];
          for(var i in this.currentGenre){
            genres.push(genreMap[this.currentGenre[i]].name);
          }
          for(var i in data){
            if(genres.includes(data[i].GENRE)){
              data10.push(data[i]);
            }
          }
          data=data10;
        }
          

        if(this.currentTimeZone()!='Default'){
          var data7=[];
          for(var j in data){
            if(data[j].ZONE==timeZoneMap[this.currentTimeZone()].name){
              data7.push(data[j]);
            }
          }
          data=data7;
        }
        console.log(myPrefs);
        data.sort(sortByProperty(criteriaMap[this.currentSort()].key,criteriaMap[this.currentSort()].direction));
        this.dataProvider(new ArrayDataProvider(data,{keyAttributes: 'ID'}));
      }.bind(this);



      if(userPref.stars){
        console.log("stars");
        stars = userPref.stars;
      }
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
      }


      if(userPref.author){
      this.currentAuthor = userPref.author;
      console.log(this.currentAuthor);
      }

      if(userPref.genre){
      this.currentGenre = userPref.genre;
      console.log(this.currentGenre);
      }

      if(userPref.timeZone){
      this.currentTimeZone(userPref.timeZone);
      }

      if(userPref.sortBy){
      this.currentSort(userPref.sortBy);
      }
      this.performAll();


      this.handleSortCriteriaChanged = function (event, ui) {
        myPrefs["sortBy"]=event.detail.value;
        var criteria = criteriaMap[event.detail.value];
        data.sort(sortByProperty(criteria.key, criteria.direction));
        this.dataProvider(new ArrayDataProvider(data,{keyAttributes: 'ID'}));
        console.log(myPrefs);
        
      }.bind(this);


      this.handleTimeZoneChanged = function(event,ui){
        myPrefs["timeZone"] = event.detail.value;
        this.performAll();
      }.bind(this);

      this.handleGenreChanged = function(event,ui){
        console.log(event.detail.value);
        var gVal = event.detail.value;
        if(gVal[0]){
          myPrefs["genre"]=event.detail.value;
          this.performAll();
        }
        else{
          myPrefs["genre"]=null;
          this.performAll();
        }
      }.bind(this);

      this.handleAuthorChanged = function(event,ui){
        console.log(event.detail.value);
        var aVal = event.detail.value;
        if(aVal[0]){
          myPrefs["author"]=event.detail.value;
          this.performAll();
        }
        else{
          myPrefs["author"]=null;
          this.performAll();
        }
      }.bind(this);

      this.savePref = function(){
        console.log(router.stateId());
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
