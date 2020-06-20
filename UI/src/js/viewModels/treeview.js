define(['knockout', 'ojs/ojbootstrap', 'ojs/ojarraytreedataprovider', 'ojs/ojcontext', 'text!data/treeViewDataDrag.json', 'text!data/treeViewDataDrop.json', 'ojs/ojkeyset', 'ojs/ojknockout', 'ojs/ojtreeview'],
  function (ko, Bootstrap, ArrayTreeDataProvider, Context, json1, json2, KeySet) {
    function TreeViewModel() {
      var jsonData1 = JSON.parse(json1);
      var jsonData2 = JSON.parse(json2);
      this.data1 = ko.observable(new ArrayTreeDataProvider(jsonData1, { keyAttributes: 'id' }));
      this.data2 = ko.observable(new ArrayTreeDataProvider(jsonData2, { keyAttributes: 'id' }));
      this.selected = ko.observable(new KeySet.KeySetImpl());
      this.disableTouchMove = false;

      var deleteItem = function (jsonData, deletedId) {
        for (var i = 0; i < jsonData.length; i++) {
          var itemData = jsonData[i];
          if (itemData.id === deletedId) {
            jsonData.splice(i, 1);
            return itemData;
          } else if (itemData.children) {
            var deletedData = deleteItem(itemData.children, deletedId);
            if (deletedData) { return deletedData; }
          }
        }
        return null;
      };

      var createItem = function (jsonData, createdData, referenceId, position) {
        for (var i = 0; i < jsonData.length; i++) {
          var itemData = jsonData[i];
          if (itemData.id === referenceId) {
            if (position === 'before') { jsonData.splice(i, 0, createdData); } else if (position === 'after') { jsonData.splice(i + 1, 0, createdData); } else {
              if (!itemData.children) { itemData.children = []; }
              if (position === 'inside') { itemData.children.push(createdData); } else if (position === 'first') { itemData.children.unshift(createdData); }
            }
            return true;
          } else if (itemData.children) {
            var isSuccessful = createItem(itemData.children, createdData, referenceId, position);
            if (isSuccessful) { return true; }
          }
        }
        return null;
      };

      this.handleDrop = function (event, context) {
        var dataTransfer = event.dataTransfer;
        var itemData = dataTransfer.getData('application/ojtreeviewitems+json');
        var divData = dataTransfer.getData('dragdiv/text');
        var dropId = context.item.id;
        var dropPosition = context.position;

        var data1;
        if (itemData) {
          itemData = JSON.parse(itemData);
          for (var i = 0; i < itemData.length; i++) {
            data1 = itemData[i];
            createItem(jsonData2, data1, dropId, dropPosition);
          }
        } else if (divData) {
          data1 = {
            id: divData.toLowerCase(),
            title: divData
          };
          createItem(jsonData2, data1, dropId, dropPosition);
        } else { return; }

        this.data2(new ArrayTreeDataProvider(jsonData2, { keyAttributes: 'id' }));
      }.bind(this);

      // eslint-disable-next-line no-unused-vars
      this.handleDragEnd = function (event, context) {
        if (event.dataTransfer.dropEffect !== 'none') {
          var selected = this.selected();
          selected.values().forEach( function (key) {
            deleteItem(jsonData1, key);
          });
          this.data1(new ArrayTreeDataProvider(jsonData1, { keyAttributes: 'id' }));
        }
      }.bind(this);

      this.dragDivStart = function (event) {
        this.disableTouchMove = true;
        event.dataTransfer.setData('dragdiv/text', event.currentTarget.textContent);
        // eslint-disable-next-line no-param-reassign
        event.dataTransfer.effectAllowed = (event.ctrlKey ? 'copy' : 'move');
      };

      this.dragDivEnd = function (event) {
        this.disableTouchMove = false;
        var dropEffect = event.dataTransfer.dropEffect;
        if (dropEffect === 'move') {
          var div = document.getElementById(event.currentTarget.id);
          div.parentNode.removeChild(div);
        }
      };

      this.dragTouchMove = function (event) {
        if (this.disableTouchMove === true) {
          document.body.style.touchAction = 'none';
        } else {
          document.body.style.touchAction = 'auto';
        }
      };

      Context.getPageContext().getBusyContext().whenReady().then(function () {
        for (var i = 1; i <= 3; i++) {
          var div = document.getElementById('dragdiv' + i);
          div.addEventListener('dragstart', this.dragDivStart, false);
          div.addEventListener('dragend', this.dragDivEnd, false);
          div.addEventListener('touchmove', this.dragTouchMove, { passive: false });
        }
      }.bind(this));
    }

    return TreeViewModel();
  }
);