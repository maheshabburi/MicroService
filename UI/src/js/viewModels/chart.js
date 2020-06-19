define(['knockout', 'ojs/ojbootstrap', 'text!data/chartdata.json', 
            'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojchart'],
  function(ko, Bootstrap, data, ArrayDataProvider)
  {   
      function ChartModel() {
      
          /* chart data */
          this.dataProvider = new ArrayDataProvider(JSON.parse(data), {keyAttributes: 'id'});
      }
      
      var chartModel = new ChartModel();
      return chartModel;
  });