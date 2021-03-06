function SearchDataComponent(tableDivId, data,messages, userData) {
    this.tableDivId = tableDivId;
    var dataStr = data.replace(new RegExp('&quot;', 'g'),'"');
    this.searchersArray = JSON.parse(dataStr);
    this.searchParams = this.searchersArray.searchParams ? this.searchersArray.searchParams : "";
    this.mode = this.searchersArray.mode ? this.searchersArray.mode : "view";
    this.customClassName = "customClassName";
    this.title = "title";
    this.name = "name";
    this.messages = JSON.parse(messages.replace(new RegExp('&quot;', 'g'),'"'));
    this.userData = JSON.parse(userData.replace(new RegExp('&quot;', 'g'),'"'));
    this.type = "type";
    this.mandatoryCondition = "mandatoryCondition";


    this.searchData = function () {
        this.createSearchers();
        this.createSearchButtons();

        var searchColumns = this.searchersArray.searchColumns.split(",");
        for (var i in searchColumns){
            searchColumns[i] = this.messages["constants."+searchColumns[i]]!=undefined ?
                this.messages["constants."+searchColumns[i]] : searchColumns[i];
        }

        var test = $("#"+tableDivId).append($('<thead>').append($('<tr>').append(
            $.map(searchColumns, function (elementName, index) {
                return '<td>' + elementName + '</td>';
            }).join()
            )
        ));

        if(!this.searchParams.searchData) this.searchParams.searchData = {};
        var searchParams = {};
        searchParams["searchType"] = this.searchParams.searchType;
        searchParams["searchData"] = this.searchParams.searchData;

        if(this.searchParams.searchMyTasks){
            this.searchParams.searchData = searchParams["searchData"] = { currentExecutor : this.userData._id["$oid"]};
        }

        this.createSearchTable(searchParams, this);
        var currentSearchType = this.searchParams.searchType;
        var openMode = this.mode;

        $("#"+tableDivId).on('click', 'tbody tr', function () {
            currentSearchType = this.elementType? this.elementType : currentSearchType;
            window.open("/get-element?type="+currentSearchType+"&mode="+openMode+"&id="+this.id, "_blank");
        });
    }

    this.createSearchers = function () {
        var searchersId = "search-attributes";
        var subArray = this.searchersArray["searchers"];
        for (var j in subArray){
            var attribute = subArray[j];
            var elementType = attribute[this.type];
            this[elementType](attribute, searchersId);
        }
    }

    this.text = function (data, parentElementId) {
        var messages = '[[#{'+data[this.title]+'}]]';
            $('#'+parentElementId)
           .append($('<div>', {class: "textField"+" "+data[this.customClassName]}).
            append($('<span>', {class: "hidden popup"}).html(data[this.title])).
            append($('<label>').html(this.messages[data[this.title]]!= undefined ? this.messages[data[this.title]] : data[this.title])).
            append($('<input>', {class: "form-control "+data[this.name], name:data[this.name], type: 'text', value : ''})));


    }


    this.createSearchButtons = function(){
        var scope = this;
        var searchButtonsDiv = "search-buttons";
        // search button
        $('#'+searchButtonsDiv).append($('<button>', {class: "searchButton btn btn-primary", value: "Search"}).html(this.messages["buttons.search"]).
        click(this, function(e) {
            e.data.searchDataEv();
        }));

        // search button
        $('#'+searchButtonsDiv).append($('<button>', {class: "clearButton btn btn-primary", value: "Clear"}).html(this.messages["buttons.clear"]).
        click(this, function(e) {
            e.data.clearDataEv();
        }));
    }

    this.searchDataEv = function(e,data){
        var searchParams = {};
        searchParams.searchType = this.searchParams.searchType;
        var defaultSearchParams = this.searchParams.searchData;
        var copy = Object.assign({}, this.searchParams.searchData);
        searchParams.searchData = copy;
        var searchAttrsDiv = "search-attributes";
        $('#'+searchAttrsDiv+' input:not([name=""])').each(function() {
            if(this.value!=""){
                searchParams.searchData[this.name] = this.value;
            }else if(searchParams.searchData[this.name]!=undefined && defaultSearchParams[this.name]!=undefined){
                 searchParams.searchData[this.name] = defaultSearchParams[this.name]
            }else if(searchParams.searchData[this.name]!=undefined){
                delete searchParams.searchData[this.name];
            }
        });
        this.searchData = searchParams;
        this.table.ajax.reload();
        console.log("search");
    }

    this.clearDataEv = function(e,data){
        console.log("clearData");
        var searchAttrsDiv = "search-attributes";
        $('#'+searchAttrsDiv+' input:not([name=""])').each(function() {
            this.value = "";
        });
    }


    this.createSearchTable = function (data, scope) {
        scope.searchData = data;
        var searchColumns = this.searchersArray.searchColumns.split(",");
        var resultColumns = [];
        var messages = this.messages;
        for (var i in searchColumns){
            resultColumns.push({ "data": searchColumns[i],
                "createdCell": function (td, cellData, rowData, row, col) {
                if(searchColumns[col] == "auditData"){
                    var div = document.createElement('div');
                    for(var index in cellData){
                        var span = document.createElement('span');
                        var label = messages["constants."+cellData[index].name]!=undefined ? messages["constants."+cellData[index].name] : cellData[index].name;
                        span.innerHTML = label +" = "+cellData[index].data;
                        div.appendChild(span);
                        div.appendChild(document.createElement('br'));
                    }
                    td.innerHTML = div.innerHTML;
                }
            }});
        }

        $(document).ready(function(){
            scope.table = $("#"+tableDivId).DataTable( {
                "language": {
                    "lengthMenu": scope.messages["datatable.showingRecords"],
                    "info": scope.messages["datatable.showingPages"],
                    "infoEmpty": scope.messages["datatable.zeroRecords"],
                    "infoFiltered": "(filtered from _MAX_ total records)",
                    "processing":     scope.messages["datatable.processing"],
                    "search":         "Search:",
                    "zeroRecords":    scope.messages["datatable.zeroRecords"],
                    "paginate": {
                        "first":      "First",
                        "last":       "Last",
                        "next":       scope.messages["datatable.next"],
                        "previous":   scope.messages["datatable.previous"]
                    },
                },
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "/search-data",
                    "type": "POST",
                    "contentType": "application/json",
                    data:function(d){
                            d.search =  scope.searchData;
                        return encodeURI(JSON.stringify(d));
                    },
                    "dataType": 'json'
                },
                "createdRow": function ( row, data, index ) {
                    if(data.auditElementId){
                        row.elementType = data["type"];
                        row.id = data["auditElementId"]["$oid"];
                    } else {
                        row.id = data["_id"]["$oid"];
                    }

                },

                "columns": resultColumns
            });
        });

    }



    return this;
};
