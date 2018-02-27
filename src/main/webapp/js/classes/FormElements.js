function FormElements() {
    this.customClassName = "customClassName";
    this.title = "title";
    this.name = "name";
    this.typeForSaving = "typeForSaving";
    this.type = "type";
    this.filesUploaderCount = 0;
    return this;
}

FormElements.prototype.textField = function (data, parentElementId, elementValue) {
    $('#' + parentElementId)
        .append($('<div>', {class: "textField" + " " + data[this.customClassName]}).append($('<span>', {class: "hidden popup"}).html(this.messages["mandatory"])).append($('<label>', {value: data[this.title]}).html(this.messages[data[this.title]])).append($('<input>', {
            class: "form-control " + data[this.name],
            name: data[this.name],
            customType: data[this.typeForSaving] ? data[this.typeForSaving] : "",
            type: 'text',
            value: elementValue != null ? elementValue : "",
            readonly: !Utils.checkFieldEnabled(data)
        })));

    if (data[this.mandatoryCondition] != "") {
        this.mandatoryCondtitions[data[this.name]] = data[this.mandatoryCondition];
    }

}

FormElements.prototype.textArea = function (data, parentElementId, elementValue) {
    $('#' + parentElementId)
        .append($('<div>', {class: "form-group" + " " + data[this.customClassName]}).append($('<span>', {class: "hidden popup"}).html(this.messages["mandatory"])).append($('<label>', {value: data[this.title]}).html(this.messages[data[this.title]])).append($('<textarea>', {
            class: "form-control " + data[this.name],
            name: data[this.name],
            customType: data[this.typeForSaving] ? data[this.typeForSaving] : "",
            type: 'text',
            value: elementValue != null ? elementValue.replace(new RegExp('%', 'g'), '\n') : "",
            readonly: !Utils.checkFieldEnabled(data)
        }).text(elementValue != null ? elementValue.replace(new RegExp('%', 'g'), '\n') : "")));

    if (data[this.mandatoryCondition] != "") {
        this.mandatoryCondtitions[data[this.name]] = data[this.mandatoryCondition];
    }

}


FormElements.prototype.date = function (data, parentElementId, elementValue) {
    $('#' + parentElementId)
        .append($('<div>', {
            class: "input-group date" + " " + data[this.customClassName],
            id: "user-card-" + data[this.name]
        }).append($('<span>', {class: "hidden popup"}).html(this.messages["mandatory"])).append($('<label>', {value: data[this.title]}).html(this.messages[data[this.title]])).append($('<input>', {
            class: "form-control " + data[this.name],
            name: data[this.name],
            customType: data[this.typeForSaving] ? data[this.typeForSaving] : "",
            type: 'text',
            value: elementValue != null ? elementValue : "",
            readonly: !Utils.checkFieldEnabled(data)
        })).append($('<span>', {class: "input-group-addon"}).append($('<span>', {class: "glyphicon glyphicon-calendar"}))));

    $("#user-card-" + data[this.name]).datetimepicker({
        locale: 'uk'
    });

    if (data[this.mandatoryCondition] != "") {
        this.mandatoryCondtitions[data[this.name]] = data[this.mandatoryCondition];
    }

}

FormElements.prototype.multiSelect = function (data, parentElementId, elementValue) {
    var defaultRoles = [{"role": "ADMIN", "selected": false}, {"role": "USER", "selected": false}];

    if (elementValue != null) {
        for (var i in defaultRoles) {
            var name = defaultRoles[i].role;
            if (elementValue.indexOf(name) != -1) {
                defaultRoles[i].selected = true;
            }
        }
    }

    $('#' + parentElementId)
        .append($('<div>', {class: "textField" + " " + data[this.customClassName]}).append($('<span>', {class: "hidden popup"}).html(this.messages["mandatory"])).append($('<label>', {value: data[this.title]}).html(this.messages[data[this.title]])).append($('<select>', {
            class: "multiSelect form-control " + data[this.name],
            customType: data[this.typeForSaving] ? data[this.typeForSaving] : "",
            name: data[this.name],
            multiple: 'multiple',
            value: elementValue != null ? elementValue : "",
            disabled: !Utils.checkFieldEnabled(data)
        })
            .append(
                $.map(defaultRoles, function (element, index) {
                    if (element.selected) {
                        return '<option value="' + element.role + '" selected="' + element.selected + '">' + element.role + '</option>';
                    } else {
                        return '<option value="' + element.role + '">' + element.role + '</option>';
                    }

                }).join()
            )));

    if (data[this.mandatoryCondition] != "") {
        this.mandatoryCondtitions[data[this.name]] = data[this.mandatoryCondition];
    }

}


FormElements.prototype.image = function (data, parentElementId, elementValue) {

    if (this.getSearchParams("mode") != "view") {
        $('#' + parentElementId)
            .append($('<div>', {class: "textField" + " " + data[this.customClassName]}).append($('<span>', {class: "hidden popup"}).html(this.messages["mandatory"])).append($('<label>', {value: data[this.title]}).html(this.messages[data[this.title]]))
                .append($('<input>', {
                    class: "input-ghost",
                    id: this.name,
                    customType: data[this.typeForSaving] ? data[this.typeForSaving] : "",
                    type: "file",
                    fileValue: "",
                    name: data[this.name],
                    style: "visibility:hidden; height:0"
                }).change(function () {
                    $(this).next($(this)).find('input.form-control').val(($(this).val()).split('\\').pop());
                    var reader = new FileReader();
                    reader.readAsDataURL(this.files[0]);
                    reader.idFileelement = this.id;
                    var readerVar = (this, function (e, data) {
                        // $("#"+this.idFileelement).attr('fileValue', reader.result);
                        $("#" + this.idFileelement)[0].fileValue = reader.result;
                    });
                    reader.onload = readerVar;
                }))
                .append($('<div>', {class: "input-group input-file"})
                    .append($('<span>', {class: "input-group-btn"})
                        .append($('<button>', {class: "btn btn-default btn-choose", type: 'button'}).click(function () {
                            $('.input-ghost').click();
                        }).html(this.messages["choose"])))
                    .append($('<input>', {
                        class: "form-control",
                        placeholder: this.messages["chooseFile"],
                        type: 'text'
                    }).css("cursor", "pointer").mousedown(function () {
                        $(this).parents('.input-file').prev().click();
                    }))
                    .append($('<span>', {class: "input-group-btn", style: "float : left;"})
                        .append($('<button>', {class: "btn btn-warning btn-reset", type: 'button'}).click(function () {
                            $('.input-ghost').val(null);
                            $(this).parents(".input-file").find('input').val('');
                        }).html(this.messages["reset"])))));

        if (data[this.mandatoryCondition] != "") {
            this.mandatoryCondtitions[data[this.name]] = data[this.mandatoryCondition];
        }
    } else {
        $('#' + parentElementId).append($('<div>', {class: "textField" + " " + data[this.customClassName]}).append($('<span>', {class: "hidden popup"}).html(data[this.title])).append($('<label>', {value: data[this.title]}).html(this.messages[data[this.title]])).append($('<img>', {src: "data:" + elementValue[0]["data"].replace(" ", "+").replace(/\s/g, '+')})));
    }

}


FormElements.prototype.file = function (data, parentElementId, elementValue, addNew) {

    var scope = this;
    var data = data;
    var parentElementId = parentElementId;
    var elementValue = elementValue;

    var hasEmptyFields = Utils.checkIfHasEmptyFiles(data[this.name]);
    if(!hasEmptyFields) {
        if (this.getSearchParams("mode") != "view") {
            var createdElement = $('<div>', {class: "textField" + " " + data[this.customClassName] + "  " + data[this.name]})
                .append($('<span>', {class: "hidden popup"}).html(this.messages["mandatory"]))
                .append($('<label>', {value: data[this.title]}).html(this.messages[data[this.title]]))
                .append($('<input>', {
                    class: "input-ghost",
                    id: this.name+"_"+scope.filesUploaderCount,
                    customType: data[this.typeForSaving] ? data[this.typeForSaving] : "",
                    type: "file",
                    fileValue: "",
                    name: data[this.name],
                    style: "visibility:hidden; height:0"
                }).on('change', function () {
                    $(this).next($(this)).find('input.form-control').val(($(this).val()).split('\\').pop());
                    var reader = new FileReader();
                    reader.readAsDataURL(this.files[0]);
                    reader.idFileelement = this.id;
                    var readerVar = (this, function (e, data) {
                        $("#" + this.idFileelement)[0].fileValue = reader.result;
                    });
                    reader.onload = readerVar;
                    scope.file(data, parentElementId, elementValue, true);
                }))
                .append($('<div>', {class: "input-group input-file"})
                    .append($('<span>', {class: "input-group-btn"})
                        .append($('<button>', {class: "btn btn-default btn-choose", type: 'button'}).click(function () {
                            $(this).parents(".textField").find('.input-ghost').click();
                        }).html(this.messages["choose"])))
                    .append($('<input>', {
                        class: "form-control",
                        placeholder: this.messages["chooseFile"],
                        type: 'text'
                    }).css("cursor", "pointer").mousedown(function () {
                        $(this).parents('.input-file').prev().click();
                    }))
                    .append($('<span>', {class: "input-group-btn", style: "float : left;"})
                        .append($('<button>', {class: "btn btn-warning btn-reset", type: 'button'}).click(function () {
                            $('.input-ghost').val(null);
                            $(this).parents(".input-file").find('input').val('');
                        }).html(this.messages["reset"]))));

            if (addNew) {
                createdElement.insertAfter($("." + data[this.name] + "").last())
            } else {
                $('#' + parentElementId).append(createdElement);

                if (data[this.mandatoryCondition] != "") {
                    this.mandatoryCondtitions[data[this.name]] = data[this.mandatoryCondition];
                }
            }

        } else {
            $('#' + parentElementId)
                .append($('<div>', {class: "textField" + " " + data[this.customClassName]})
                    .append($('<span>', {class: "hidden popup"}).html(data[this.title]))
                    .append($('<label>', {value: data[this.title]}).html(this.messages[data[this.title]]))
                    .append($('<div>', {class: "fileSaver"})
                        .append($('<a>', {href: elementValue[0]["data"].replace(" ", "+").replace(/\s/g, '+')}).html(elementValue[0]["fileName"]))));
        }
    }

    scope.filesUploaderCount = scope.filesUploaderCount+1;

}

FormElements.prototype.file2 = function (data, parentElementId, elementValue, addNew) {

         var scope = this;
        var divElement = document.createElement('div');
        $(divElement).attr({class: "textField" + " " + data[this.customClassName] + "  " + data[this.name]});

        var span = document.createElement('span');
         $(span).attr({class: "hidden popup", html: this.messages["mandatory"]});
        divElement.appendChild(span);

        var label = document.createElement('label');
         $(label).attr({value: data[this.title], html: this.messages[data[this.title]]});
         span.appendChild(label);


          var input = document.createElement('input');
         $(input).attr({ class: "input-ghost",
             id: this.name+"_"+scope.filesUploaderCount,
             customType: data[this.typeForSaving] ? data[this.typeForSaving] : "",
             type: "file",
             fileValue: "",
             name: data[this.name],
             style: "visibility:hidden; height:0"});
         span.appendChild(input);

    var div1 = document.createElement('label');
    $(div1).attr({class: "input-group input-file"});
    span.appendChild(label);

        $('#' + parentElementId).append(divElement);

        console.log("aaa");



}

FormElements.prototype.testFunc = function (data, parentElementId, elementValue, addNew, firstCreation) {
    console.log("***");
    if(!firstCreation){
        $(this).next($(this)).find('input.form-control').val(($(this).val()).split('\\').pop());
        var reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.idFileelement = this.id;
        var readerVar = (this, function (e, data) {
            $("#" + this.idFileelement)[0].fileValue = reader.result;
        });
        reader.onload = readerVar;
        this.file(data, parentElementId, elementValue, true);
    }

}


FormElements.prototype.userAssoc = function (data, parentElementId, elementValue) {
    var scope = this;
    var resultTable = ["firstName", "lastName"];
    $('#' + parentElementId)
        .append($('<div>', {class: "textField" + " " + data[this.customClassName]}).append($('<span>', {class: "hidden popup"}).html(this.messages["mandatory"])).append($('<label>', {value: data[this.title]}).html(this.messages[data[this.title]])).append($('<input>', {
            class: "form-control " + data[this.name], name: data[this.name],
            placeholder: "search ...",
            customType: data[this.typeForSaving] ? data[this.typeForSaving] : "",
            type: 'text', value: "",
            readonly: !Utils.checkFieldEnabled(data)
        }).keyup(function (event) {
            scope.searchUsers(event, this);
        })).append($('<table>', {class: "added"})).append($('<table>', {class: "searchResult"})));

    if (data[this.mandatoryCondition] != "") {
        this.mandatoryCondtitions[data[this.name]] = data[this.mandatoryCondition];
    }

    if (!Utils.checkFieldEnabled(data)) {
        var addedTable = $('#' + parentElementId).find('table.added')[0];
        for (var index in elementValue) {
            var searchResultElement = elementValue[index];
            $(addedTable).append($('<tr>', {id: searchResultElement._id["$oid"]}).append(
                $.map(resultTable, function (elementName, index) {
                    return '<td>' + searchResultElement[elementName] + '</td>';
                }).join()
            ));
        }
    }
}

FormElements.prototype.searchUsers = function (event, data) {
    var resultTable = ["firstName", "lastName"];
    var table = $(data.parentNode).find('table.searchResult')[0];
    var addedTable = $(data.parentNode).find('table.added')[0];
    table.innerHTML = "";
    var searchValue = data.value;
    var userAssocInput = data;
    var scope = this;
    if (data.value != "") {
        // create headers
        /*
         var headerTR = $(table).append($('<tr>', {class: "header"}).append(
         $.map(resultTable, function (elementName, index) {
         return '<th>' + CUSTOM_MESSAGES["user.card." + elementName] + '</th>';
         }).join()
         ));
         */

        var search = {};
        var searchParams = {};
        searchParams.searchType = "user";
        searchParams.searchData = {};
        for (var index in resultTable) {
            searchParams.searchData[resultTable[index]] = searchValue;
        }
        search.search = searchParams;
        search.draw = 1;
        search.length = 100;
        search.start = 0;

        $.ajax({
            url: '/search-data',
            type: "POST",
            contentType: "application/json",
            data: encodeURI(JSON.stringify(search)),
            dataType: 'json'
        }).done(function (data) {
            if (data.data.length > 0) {
                for (var index in data.data) {
                    var searchResultElement = data.data[index];
                    $(table).append($('<tr>', {id: searchResultElement._id["$oid"]}).append(
                        $.map(resultTable, function (elementName, index) {
                            return '<td>' + searchResultElement[elementName] + '</td>';
                        }).join()
                    ).click(function () {
                        if ($(addedTable).find("#" + this.id).length == 0) {
                            $(addedTable).append($(this.outerHTML).click(function () {
                                this.parentNode.removeChild(this);
                            }));
                            userAssocInput.value = "";
                            scope.searchUsers(event, userAssocInput);
                        }
                    }));
                }
            }
            console.log("done");
        });
    }

    console.log("aaa");
}


FormElements.prototype.getSearchParams = function getSearchParams(k) {
    var p = {};
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (s, k, v) {
        p[k] = v
    })
    return k ? p[k] : p;
}