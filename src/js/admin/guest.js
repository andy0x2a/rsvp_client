/**
 * Created by andyn on 2/20/2015.
 */
var getListOnSuccess = function (data) {

    allData = data;
    $(".adminConsole").show();

    $(".tbdy").remove();
    var body = $('<tbody class="tbdy"></tbody>');

    $.each(data, function (i, item) {


        var plusOneInfoName = '';
        var plusOneInfoMeal = '';
        if (!!item.plusOneInfo) {
            plusOneInfoName = item.plusOneInfo.name;
            plusOneInfoMeal = getMealName(item.plusOneInfo.mealChoiceId);
        }
        var rowStr = '<tr>' +

            '<td>' + item.id + '</td>' +
            '<td>' + item.firstName + '</td>' +
            '<td>' + item.lastName + '</td>' +
            '<td>' + item.phoneNumber + '</td>' +
            '<td>' + item.email + '</td>' +
            '<td>' + item.statusId + '</td>' +
            '<td>' + getMealName(item.mealId) + '</td>' +
            '<td>' + item.address + '</td>' +
            '<td>' + item.association + '</td>' +
            '<td>' + item.notes + '</td>' +
            '<td>' + plusOneInfoName + '</td>' +
            '<td>' + plusOneInfoMeal + '</td>' +
            '<td> <a href="#" class="editIcon" id="edit_icon_' + item.id + '" ><img src="src/img/edit.png"/> </a></td>' +
            '</row>';


        var row = $(rowStr);
        body.append(row);


    });
    $("#tbl").append(body);
    $(".editIcon").on('click', function (event) {
        event.preventDefault();
        var elem = $(event.target);
        console.log(elem);

        var id = $(event.target).parent('a').attr('id').substring(10);
        showDataFor(id);

        $("#submitEdit").on('click', submitEditedGuest);

    });
};
var submitEditedGuest = function () {


    $('.error').hide();
    var id = $('#id').val().trim();
    var firstName = $('#firstName').val().trim();
    var lastName = $('#lastName').val().trim();
    var email = $('#email').val().trim();
    var contact = $('#contact').val().trim();
    var address = $('#address').val().trim();
    var attending = attendingStatus;
    var menu = $('#menuSel option:selected').attr('id');


    var plusOneStatus = true;


    var isValid = true;

    isValid = firstName && lastName && email && contact && address && menu;


    var obj = {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'phoneNumber': contact,
        'address': address,
        'statusId': attending ? '1' : '0',
        'mealId': menu,
        'notes': '',
        'association': association,
        'id': id
    };


    if (plusOneStatus) {
        var plusOneName = $('#plusOneName').val().trim();
        var meal = $('#menuSelPlusOne option:selected').attr('id');
        var plusOneInfo = {
            'name': plusOneName,
            'mealChoiceId': meal,
            'id': plusOneId
        }
        obj.plusOneInfo = plusOneInfo;
    }

    verb = "PUT";

    var onComplete = function (a, b, c) {
        console.log('success');
        $('.adminEditSingle').hide();

    }

    var onError = function (a, b, c) {
        console.log('failed');
    }
    if (isValid) {
        console.log('submitting');
        var verb = "POST";
        var url = serverURL + "admin/guest/" + obj.id;
        if (isEdit) {

        }
        callAjax(url, verb, obj, onComplete, onError);

    } else {
        $('.error').show();
    }
    console.log(JSON.stringify(obj));


};

var showDataFor = function (id) {

    var foundElem;
    $.each(allData, function (i, item) {
        if (item.id == id) {
            foundElem = item;
            return;
        }
    });
    if (foundElem) {
        $(".adminEditSingle").show();


        console.log('need to fill out variables here');

        $('#id').val(foundElem.id);
        $('#firstName').val(foundElem.firstName);
        $('#lastName').val(foundElem.lastName);
        $('#email').val(foundElem.email);
        $('#contact').val(foundElem.phoneNumber);
        $('#address').val(foundElem.address);
        if (foundElem.statusId == 1) {
            $("#yes").click();
        } else {
            $("#no").click();
        }
        if (foundElem.association === "bride") {
            $('#brideAssoc').click();
        } else if (foundElem.association === "groom") {
            $('#groomAssoc').click();
        } else {
            $('#bothAssoc').click();
        }

        $('#menuSel').val(foundElem.mealId);

        if (foundElem.plusOneInfo) {
            $('#plusYes').click();
            plusOneId = foundElem.plusOneInfo.id;
            $('#menuSelPlusOne').val(foundElem.plusOneInfo.mealChoiceId);
            $('#plusOneName').val(foundElem.plusOneInfo.name);
            $('#plusOneId').val(foundElem.plusOneInfo.id);
        }


    }
};
var getList = function () {
    adminCallAjax(serverURL + "admin/guests", "GET", null, getListOnSuccess, getListOnError);
};